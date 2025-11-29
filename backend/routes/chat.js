const express = require('express');
const jwt = require('jsonwebtoken');
const { getChatMessages, createChatMessage } = require('../db/queries');

const router = express.Router();

// Middleware to verify JWT
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// All routes require authentication
router.use(authenticateToken);

// GET /api/chat/messages - Get chat history
router.get('/messages', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const messages = await getChatMessages(limit);

    res.json(messages);
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/chat/send - Send message
router.post('/send', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const chatMessage = await createChatMessage(req.user.id, message);

    // Broadcast to all clients
    if (req.app.io) {
      req.app.io.emit('chat:message', {
        ...chatMessage,
        username: req.user.username
      });
    }

    res.json(chatMessage);
  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
