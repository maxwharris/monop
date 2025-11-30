import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnecting = false;
  }

  connect(user, token) {
    // If already connected, return existing socket
    if (this.socket?.connected) {
      console.log('Reusing existing socket connection');
      return this.socket;
    }

    // If currently connecting, wait and return
    if (this.isConnecting) {
      console.log('Connection already in progress');
      return this.socket;
    }

    this.isConnecting = true;

    // Disconnect old socket if it exists but isn't connected
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }

    // Use environment variable or fallback to localhost
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://192.168.1.165:3001';

    this.socket = io(backendUrl, {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.isConnecting = false;
      this.socket.emit('user:authenticate', {
        userId: user.id,
        username: user.username
      });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.isConnecting = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();
