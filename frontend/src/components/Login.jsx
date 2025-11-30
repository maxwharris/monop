import { useState } from 'react';
import useGameStore from '../store/gameStore';

// Backend API URL - use environment variable or default to local IP
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://192.168.1.165:3001';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser, setToken, connectSocket } = useGameStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        // Connect to WebSocket after successful login
        setTimeout(() => connectSocket(), 100);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="fade-in">
      <div style={styles.loginCard} className="card">
        <div style={styles.header}>
          <h1 style={styles.title}>MONOPOLY</h1>
          <p style={styles.subtitle}>Capitalism always wins.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div style={styles.error} className="slide-in">
              <span style={styles.errorIcon}>⚠</span>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.loginButton}>
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Logging in...
              </>
            ) : (
              'Enter Game'
            )}
          </button>
        </form>

        <div style={styles.accountsSection}>
          <div style={styles.accountsHeader}>
            <span style={styles.accountsIcon}>👥</span>
            <h3 style={styles.accountsTitle}>Test Accounts</h3>
          </div>
          <div style={styles.accountsList}>
            {['player1', 'player2', 'player3', 'player4', 'player5'].map((player, i) => (
              <div key={player} style={styles.accountItem} className="slide-in">
                <span style={styles.tokenIcon}>{['🚗', '🎩', '🐕', '🚢', '🎲'][i]}</span>
                <span style={styles.accountText}>
                  <strong>{player}</strong> / password{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  loginCard: {
    width: '100%',
    maxWidth: '480px',
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
    fontSize: '1.1rem',
    fontStyle: 'italic',
  },
  form: {
    marginBottom: '2rem',
  },
  inputGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  error: {
    background: 'linear-gradient(135deg, rgba(227, 30, 36, 0.2) 0%, rgba(183, 28, 28, 0.2) 100%)',
    border: '2px solid var(--monopoly-red)',
    borderRadius: 'var(--radius-md)',
    padding: '0.75rem 1rem',
    marginBottom: '1rem',
    color: '#FFB3B3',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
  },
  errorIcon: {
    fontSize: '1.2rem',
  },
  loginButton: {
    width: '100%',
    marginTop: '0.5rem',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    marginRight: '0.5rem',
  },
  accountsSection: {
    marginTop: '2rem',
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  accountsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  accountsIcon: {
    fontSize: '1.5rem',
  },
  accountsTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: 'var(--monopoly-gold)',
    margin: 0,
  },
  accountsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  accountItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  tokenIcon: {
    fontSize: '1.5rem',
  },
  accountText: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
};

export default Login;
