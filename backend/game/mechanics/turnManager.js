/**
 * Turn management for Monopoly
 */

const { getAllPlayers, updateGame, getGame, logGameAction } = require('../../db/queries');

class TurnManager {
  constructor() {
    this.turnTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }

  async startTurn(userId) {
    const deadline = new Date(Date.now() + this.turnTimeout);

    await updateGame({
      currentTurnUserId: userId,
      turnDeadline: deadline
    });

    await logGameAction(null, 'turn_start', { userId, deadline });

    return { userId, deadline };
  }

  async endTurn() {
    const game = await getGame();
    const players = await getAllPlayers();

    // Filter out bankrupt players
    const activePlayers = players.filter(p => !p.is_bankrupt);

    if (activePlayers.length === 1) {
      // Game over! Only one player remaining
      await updateGame({
        status: 'completed',
        currentTurnUserId: null,
        completedAt: new Date()
      });

      return {
        gameOver: true,
        winner: activePlayers[0]
      };
    }

    if (activePlayers.length === 0) {
      // No active players (shouldn't happen, but handle gracefully)
      await updateGame({
        status: 'completed',
        currentTurnUserId: null
      });

      return {
        gameOver: true,
        winner: null
      };
    }

    // Find current player index
    const currentIndex = activePlayers.findIndex(
      p => p.user_id === game.current_turn_user_id
    );

    // Move to next player (circular)
    const nextIndex = (currentIndex + 1) % activePlayers.length;
    const nextPlayer = activePlayers[nextIndex];

    await this.startTurn(nextPlayer.user_id);

    return {
      gameOver: false,
      nextPlayerId: nextPlayer.user_id,
      nextPlayer: nextPlayer
    };
  }

  async handleTimeout(userId) {
    // Auto-end turn when player times out
    await logGameAction(null, 'turn_timeout', { userId });
    return await this.endTurn();
  }

  async getCurrentTurn() {
    const game = await getGame();
    return {
      currentPlayerId: game.current_turn_user_id,
      deadline: game.turn_deadline
    };
  }
}

module.exports = new TurnManager();
