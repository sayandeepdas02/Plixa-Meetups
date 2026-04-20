// backend/index.js
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const UserModel = require('./models');
const { registerWhiteboardHandlers } = require('./socket/whiteboardHandlers');
const { registerChatHandlers } = require('./socket/chatHandlers');
const { registerWebRTCHandlers } = require('./socket/webrtcHandlers');

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const app = express();
const httpServer = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(cors());
app.use(express.json());

// --- JWT Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// --- Authentication Routes ---

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const existingUser = UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = UserModel.create({ name, email, password: hashedPassword, dateOfBirth });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: UserModel.sanitize(user) });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: UserModel.sanitize(user) });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    // Validate access token with Google
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!response.ok) {
        return res.status(401).json({ error: 'Invalid Google token' });
    }
    
    const googleUser = await response.json();
    const { email, name, sub: googleId, picture } = googleUser;

    if (!email) {
        return res.status(400).json({ error: 'Google account has no email' });
    }

    let user = UserModel.findByEmail(email);
    if (!user) {
        user = UserModel.create({
            name: name || email.split('@')[0],
            email,
            password: '', // Handled by Google
            googleId,
            picture
        });
    } else if (!user.googleId) {
        user.googleId = googleId;
        user.picture = user.picture || picture;
    }

    const jwtToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: UserModel.sanitize(user) });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = UserModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user: UserModel.sanitize(user) });
});

app.get('/api/test', (req, res) => {
  res.json({ msg: 'Backend is running!' });
});

// --- In-memory stores (separate — never merged) ---
const boardHistory = {}; // { boardId: element[] }
const chatHistory = {};  // { boardId: message[] }

// --- Socket.IO: register modular handlers ---
io.on('connection', (socket) => {
  console.log(`[socket] ${socket.id} connected`);

  // All whiteboard events (join, down, draw, element:create, clear, disconnect, presence)
  registerWhiteboardHandlers(socket, io, boardHistory, chatHistory);

  // All chat events (chat:send, chat:typing)
  registerChatHandlers(socket, io, chatHistory);

  // All WebRTC signaling events (offer, answer, ice-candidate, join/leave call)
  registerWebRTCHandlers(socket, io);
});

// --- Static frontend (production) ---
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Server (API + Socket.IO) started on port ${PORT}`));
