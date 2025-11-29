import { create } from 'zustand';
import socketService from '../services/socket';

const useGameStore = create((set, get) => ({
  // Authentication
  user: null,
  token: null,

  // Game state
  game: null,
  players: [],
  properties: [],
  myPlayer: null,
  isMyTurn: false,
  currentDiceRoll: null,
  canRollAgain: true, // Track if player can roll again (resets on turn start)

  // UI state
  isConnected: false,
  chatMessages: [],
  gameLog: [],
  landedSpace: null, // Track the space a player just landed on
  purchasedProperty: null, // Track when a property is purchased

  // Actions
  setUser: (user) => set({ user }),

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  logout: () => {
    socketService.disconnect();
    localStorage.removeItem('token');
    set({ user: null, token: null, isConnected: false });
  },

  // Connect to WebSocket and set up listeners
  connectSocket: () => {
    const { user, token, isConnected } = get();
    if (!user || !token) return;

    // Prevent duplicate connections
    if (isConnected || socketService.socket?.connected) {
      console.log('Socket already connected, skipping...');
      return;
    }

    const socket = socketService.connect(user, token);

    // Clean up any existing listeners before setting up new ones
    socket.off('game:state');
    socket.off('game:dice_rolled');
    socket.off('game:property_purchased');
    socket.off('game:turn_change');
    socket.off('chat:message');
    socket.off('player:connected');
    socket.off('player:disconnected');
    socket.off('player:joined');

    socket.on('game:state', (gameState) => {
      set({
        game: gameState.game,
        players: gameState.players,
        properties: gameState.properties,
        currentDiceRoll: gameState.currentDiceRoll,
        isConnected: true
      });

      // Update myPlayer and isMyTurn
      get().updateMyTurnStatus();
    });

    socket.on('game:dice_rolled', (result) => {
      set({
        currentDiceRoll: result.roll,
        // Set canRollAgain based on backend response (for the player who rolled)
        canRollAgain: result.user_id === get().user?.id ? result.canRollAgain : get().canRollAgain
      });
      get().addToGameLog(`Rolled ${result.roll.die1} and ${result.roll.die2} (Total: ${result.roll.total})`);

      // Set landed space after refreshing game state - only for the player who rolled
      setTimeout(async () => {
        await get().refreshGameState();
        const { myPlayer, properties, user } = get();
        // Only show landing popup if the dice roller is the current user
        if (myPlayer && result.user_id === user.id) {
          // Find the property or special space at the player's position
          const property = properties.find(p => p.position_on_board === myPlayer.position);
          set({ landedSpace: { position: myPlayer.position, property } });
        }
      }, 100);
    });

    socket.on('game:property_purchased', (result) => {
      get().addToGameLog(`${result.property.name} purchased by ${result.player.username}!`);

      // Clear first to ensure useEffect triggers
      set({ purchasedProperty: null });

      // Set purchased property to show popup (small delay to ensure state change is detected)
      setTimeout(() => {
        set({ purchasedProperty: result });
        get().refreshGameState();
      }, 10);
    });

    socket.on('game:turn_change', (result) => {
      if (result.gameOver) {
        get().addToGameLog(`Game Over! Winner: ${result.winner?.username || 'None'}`);
      } else {
        get().addToGameLog(`Turn changed to next player`);
      }
      // Reset canRollAgain for the new turn
      set({ canRollAgain: true });
      get().refreshGameState();
    });

    socket.on('chat:message', (message) => {
      set(state => ({
        chatMessages: [...state.chatMessages, message]
      }));
    });

    socket.on('player:connected', (player) => {
      // Don't log socket connection - wait for player:joined which is more meaningful
    });

    socket.on('player:disconnected', (player) => {
      get().addToGameLog(`${player.username} disconnected`);
    });

    socket.on('player:joined', (data) => {
      get().addToGameLog(`${data.player.username} joined the game`);
      get().refreshGameState();
    });

    socket.on('lobby:player_ready', (data) => {
      set({ players: data.players });
    });

    socket.on('game:started', () => {
      get().addToGameLog('Game has started!');
      get().refreshGameState();
    });
  },

  updateMyTurnStatus: () => {
    const { user, game, players } = get();
    if (!user || !game || !players.length) return;

    const myPlayer = players.find(p => p.user_id === user.id);
    const isMyTurn = game.current_turn_user_id === user.id;

    set({ myPlayer, isMyTurn });
  },

  refreshGameState: async () => {
    const { token } = get();
    try {
      const response = await fetch('http://localhost:3001/api/game', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const gameState = await response.json();
      set({
        game: gameState.game,
        players: gameState.players,
        properties: gameState.properties,
        currentDiceRoll: gameState.currentDiceRoll
      });
      get().updateMyTurnStatus();
    } catch (error) {
      console.error('Failed to refresh game state:', error);
    }
  },

  addToGameLog: (message) => {
    set(state => ({
      gameLog: [...state.gameLog.slice(-50), {
        message,
        timestamp: new Date()
      }]
    }));
  },

  // Game actions (API calls)
  joinGame: async () => {
    const { token } = get();
    try {
      const response = await fetch('http://localhost:3001/api/game/join', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      // Don't add log here - backend will emit player:joined event which logs it
      await get().refreshGameState();
      return data;
    } catch (error) {
      console.error('Join game error:', error);
      throw error;
    }
  },

  rollDice: async () => {
    const { token } = get();
    try {
      const response = await fetch('http://localhost:3001/api/game/roll', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('Roll dice error:', error);
      throw error;
    }
  },

  buyProperty: async (propertyId) => {
    const { token } = get();
    try {
      const response = await fetch('http://localhost:3001/api/game/buy-property', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ propertyId })
      });
      return await response.json();
    } catch (error) {
      console.error('Buy property error:', error);
      throw error;
    }
  },

  endTurn: async () => {
    const { token } = get();
    try {
      const response = await fetch('http://localhost:3001/api/game/end-turn', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return await response.json();
    } catch (error) {
      console.error('End turn error:', error);
      throw error;
    }
  },

  toggleReady: async () => {
    const { token } = get();
    try {
      const response = await fetch('http://localhost:3001/api/game/ready', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to toggle ready');
      return await response.json();
    } catch (error) {
      console.error('Toggle ready error:', error);
      throw error;
    }
  },

  startGame: async () => {
    const { token } = get();
    try {
      const response = await fetch('http://localhost:3001/api/game/start', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to start game');
      }
      return await response.json();
    } catch (error) {
      console.error('Start game error:', error);
      throw error;
    }
  },

  sendChatMessage: async (message) => {
    const { token } = get();
    try {
      await fetch('http://localhost:3001/api/chat/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });
    } catch (error) {
      console.error('Send message error:', error);
    }
  },

  fetchChatMessages: async () => {
    const { token } = get();
    try {
      const response = await fetch('http://localhost:3001/api/chat/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const messages = await response.json();
      set({ chatMessages: messages });
    } catch (error) {
      console.error('Fetch chat messages error:', error);
    }
  },

  // Initialize from localStorage
  initialize: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:3001/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          set({ user: data.user, token });
          get().connectSocket();
          await get().fetchChatMessages();
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    }
  },
}));

export default useGameStore;
