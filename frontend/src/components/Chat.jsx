import { useState, useEffect, useRef } from 'react';
import useGameStore from '../store/gameStore';

const Chat = () => {
  const { chatMessages, sendChatMessage, user } = useGameStore();
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendChatMessage(message);
      setMessage('');
    }
  };

  return (
    <div style={isMinimized ? styles.containerMinimized : styles.container} className="fade-in">
      <div style={styles.header} onClick={() => setIsMinimized(!isMinimized)}>
        <div style={styles.headerLeft}>
          <span style={styles.chatIcon}>💬</span>
          <span style={styles.headerTitle}>Chat</span>
          {chatMessages.length > 0 && (
            <span style={styles.messageBadge}>{chatMessages.length}</span>
          )}
        </div>
        <button
          type="button"
          style={styles.minimizeButton}
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(!isMinimized);
          }}
        >
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>

      {!isMinimized && (
        <>
          <div style={styles.messages}>
            {chatMessages.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={styles.emptyIcon}>💭</span>
                <p style={styles.emptyText}>No messages yet. Start chatting!</p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.messageWrapper,
                    ...(msg.username === user?.username ? styles.messageWrapperOwn : {})
                  }}
                  className="slide-in"
                >
                  <div
                    style={{
                      ...styles.messageBubble,
                      ...(msg.username === user?.username ? styles.messageBubbleOwn : {})
                    }}
                  >
                    <div style={styles.messageAuthor}>{msg.username}</div>
                    <div style={styles.messageText}>{msg.message}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={styles.input}
            />
            <button
              type="submit"
              disabled={!message.trim()}
              style={styles.sendButton}
              className="secondary"
            >
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '380px',
    height: '500px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    border: '2px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
  },
  containerMinimized: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '250px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    border: '2px solid var(--border-color)',
    zIndex: 1000,
  },
  header: {
    background: 'linear-gradient(135deg, var(--monopoly-gold) 0%, var(--monopoly-dark-gold) 100%)',
    padding: '1rem 1.5rem',
    borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  chatIcon: {
    fontSize: '1.5rem',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#1a1a1a',
    fontSize: '1.1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  messageBadge: {
    background: 'var(--monopoly-red)',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  minimizeButton: {
    background: 'rgba(0,0,0,0.2)',
    border: 'none',
    color: '#1a1a1a',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: '700',
    transition: 'all 0.2s ease',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: 0.3,
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  messageWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  messageWrapperOwn: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '70%',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  messageBubbleOwn: {
    background: 'linear-gradient(135deg, var(--monopoly-green) 0%, var(--monopoly-dark-green) 100%)',
    border: '1px solid var(--monopoly-green)',
  },
  messageAuthor: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--monopoly-gold)',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  messageText: {
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4',
  },
  form: {
    padding: '1rem',
    borderTop: '2px solid var(--border-color)',
    display: 'flex',
    gap: '0.75rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '0.9rem',
    border: '2px solid var(--border-color)',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'var(--text-primary)',
    transition: 'all 0.3s ease',
  },
  sendButton: {
    padding: '0.75rem 1.5rem',
    whiteSpace: 'nowrap',
  },
};

export default Chat;
