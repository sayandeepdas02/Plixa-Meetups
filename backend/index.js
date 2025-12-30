// backend/index.js
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const cors = require('cors');
const UserModel = require('./models');

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const app = express();
const httpServer = http.createServer(app);

// Allow socket.io to accept cross-origin connections in dev/prod as needed
const { Server } = require('socket.io');
const io = new Server(httpServer, {
  cors: {
    origin: '*', // change to your frontend origin in production
    methods: ['GET', 'POST']
  }
});

// Middlewares for API
app.use(cors());            // enable CORS for API calls (restrict origin in prod)
app.use(express.json());    // parse JSON bodies

// --- JWT Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

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

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = UserModel.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    res.status(201).json({
      token,
      user: UserModel.sanitize(user)
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signin endpoint
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user without password
    res.json({
      token,
      user: UserModel.sanitize(user)
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user (protected route)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = UserModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user: UserModel.sanitize(user) });
});

// Example API route namespace
app.get('/api/test', (req, res) => {
  res.json({ msg: 'Backend is running!' });
});

// --- Socket.IO: room-based logic and element relays ---
const boardHistory = {}; // boardId -> [element1, element2, ...]

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);

  // Join a board room: client should emit 'join' with the boardId after connecting
  socket.on('join', ({ boardId }) => {
    if (!boardId) return;
    socket.join(boardId);
    socket.data.boardId = boardId;
    console.log(`${socket.id} joined room ${boardId}`);

    // Track active members in the room
    const clients = io.sockets.adapter.rooms.get(boardId);
    const members = clients ? Array.from(clients) : [];

    // Notify room of full member list
    io.to(boardId).emit('presence', { id: socket.id, action: 'joined', members });

    // Send existing history to the new user
    const existingElements = boardHistory[boardId] || [];
    if (existingElements.length > 0) {
      socket.emit('whiteboard-state', existingElements);
    }
  });

  // Relay pointer down/draw to other clients in the same room
  socket.on('down', (data) => {
    const boardId = socket.data.boardId;
    if (boardId) {
      socket.to(boardId).emit('ondown', data);
    }
  });

  socket.on('draw', (data) => {
    const boardId = socket.data.boardId;
    if (boardId) {
      socket.to(boardId).emit('ondraw', data);
    }
  });

  // Relay finished elements & store in history
  socket.on('element:create', (payload) => {
    const boardId = socket.data.boardId;
    if (boardId) {
      if (!boardHistory[boardId]) boardHistory[boardId] = [];
      boardHistory[boardId].push(payload.element);
      socket.to(boardId).emit('element:created', { element: payload.element });
    }
  });

  // Relay clear command & clear history
  socket.on('clear', () => {
    const boardId = socket.data.boardId;
    if (boardId) {
      boardHistory[boardId] = [];
      socket.to(boardId).emit('clear');
    }
  });

  // Handle disconnect & notify room members
  socket.on('disconnect', (reason) => {
    console.log(`${socket.id} disconnected: ${reason}`);
    const boardId = socket.data.boardId;
    if (boardId) {
      const clients = io.sockets.adapter.rooms.get(boardId);
      const members = clients ? Array.from(clients) : [];
      socket.to(boardId).emit('presence', { id: socket.id, action: 'left', members });
    }
  });
});
// --- end socket logic ---

// Serve static built frontend only if `public` exists in backend folder.
// (Useful for single-host production where you copy frontend build into backend/public)
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  // SPA fallback (if using client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

// Port
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Server (API + Socket.IO) started on port ${PORT}`));
