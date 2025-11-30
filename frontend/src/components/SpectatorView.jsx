import { useEffect } from 'react';
import useGameStore from '../store/gameStore';
import Game from './Game';

const SpectatorView = () => {
  const { game, players, logout, refreshGameState } = useGameStore();

  useEffect(() => {
    // Refresh game state when component mounts
    refreshGameState();
  }, [refreshGameState]);

  const handleLogout = () => {
    logout();
  };

  // If game is in progress, show the game board
  if (game?.status === 'in_progress') {
    return <Game />;
  }

  // If game is in lobby or no game, show waiting screen
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>MONOPOLY</h1>
          <h2 style={styles.subtitle}>Spectator Mode</h2>
        </div>

        <div style={styles.content}>
          <div style={styles.waitingSection}>
            <span style={styles.waitingIcon}>👁</span>
            <h3 style={styles.waitingTitle}>Waiting for Game</h3>
            <p style={styles.waitingText}>
              {game?.status === 'lobby'
                ? 'Players are in the lobby. The game will start soon...'
                : 'No active game. Waiting for players to join...'}
            </p>
          </div>

          {players.length > 0 && (
            <div style={styles.playersSection}>
              <h3 style={styles.sectionTitle}>Players in Lobby ({players.length})</h3>
              <div style={styles.playersList}>
                {players.map(player => (
                  <div key={player.id} style={styles.playerCard}>
                    <span style={styles.playerName}>{player.username}</span>
                    <div style={styles.playerInfo}>
                      <span style={styles.playerToken}>{getTokenEmoji(player.token_type)}</span>
                      {player.ready_to_start && (
                        <span style={styles.readyBadge}>✓ Ready</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleLogout} style={styles.exitButton}>
            Exit Spectator Mode
          </button>
        </div>
      </div>
    </div>
  );
};

const getTokenEmoji = (tokenType) => {
  const tokens = {
    car: '🚗',
    hat: '🎩',
    dog: '🐕',
    ship: '🚢',
    thimble: '✂️',
    shoe: '👞',
    spectator: '👁'
  };
  return tokens[tokenType] || '🎲';
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-lg)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    padding: '2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, var(--monopoly-gold) 0%, var(--monopoly-dark-gold) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1.3rem',
    fontWeight: '600',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  waitingSection: {
    textAlign: 'center',
    padding: '2rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--radius-md)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
  },
  waitingIcon: {
    fontSize: '4rem',
    display: 'block',
    marginBottom: '1rem',
  },
  waitingTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  waitingText: {
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  playersSection: {
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  playersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  playerCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.875rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  playerName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  playerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  playerToken: {
    fontSize: '1.5rem',
  },
  readyBadge: {
    padding: '0.25rem 0.75rem',
    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(56, 142, 60, 0.3) 100%)',
    border: '1px solid rgba(76, 175, 80, 0.5)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#A5D6A7',
  },
  exitButton: {
    width: '100%',
    padding: '0.875rem',
    background: 'linear-gradient(135deg, rgba(227, 30, 36, 0.3) 0%, rgba(183, 28, 28, 0.3) 100%)',
    border: '2px solid var(--monopoly-red)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

export default SpectatorView;
