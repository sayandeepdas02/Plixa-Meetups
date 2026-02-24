// backend/socket/whiteboardHandlers.js
// All whiteboard-related Socket.IO events isolated here.
// Event names: join, down, draw, element:create, clear
// These names must NEVER change — frontend depends on them.

/**
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 * @param {Object} boardHistory  - shared in-memory store { [boardId]: element[] }
 * @param {Object} chatHistory   - shared in-memory store (read-only here, passed so join can send chat:history)
 */
function registerWhiteboardHandlers(socket, io, boardHistory, chatHistory) {
  // Join a board room
  socket.on('join', ({ boardId }) => {
    if (!boardId) return;
    socket.join(boardId);
    socket.data.boardId = boardId;
    console.log(`[whiteboard] ${socket.id} joined room ${boardId}`);

    // Track active members
    const clients = io.sockets.adapter.rooms.get(boardId);
    const members = clients ? Array.from(clients) : [];

    // Notify room of membership update
    io.to(boardId).emit('presence', { id: socket.id, action: 'joined', members });

    // Replay whiteboard history to the new joiner
    const existingElements = boardHistory[boardId] || [];
    if (existingElements.length > 0) {
      socket.emit('whiteboard-state', existingElements);
    }

    // Replay chat history to the new joiner (cross-concern: safe read-only access)
    const existingChat = chatHistory[boardId] || [];
    socket.emit('chat:history', existingChat);
  });

  // Relay pointer-down event (live freehand)
  socket.on('down', (data) => {
    const boardId = socket.data.boardId;
    if (boardId) {
      socket.to(boardId).emit('ondown', data);
    }
  });

  // Relay pointer-move event (live freehand)
  socket.on('draw', (data) => {
    const boardId = socket.data.boardId;
    if (boardId) {
      socket.to(boardId).emit('ondraw', data);
    }
  });

  // A finished element — store + broadcast
  socket.on('element:create', (payload) => {
    const boardId = socket.data.boardId;
    if (boardId) {
      if (!boardHistory[boardId]) boardHistory[boardId] = [];
      boardHistory[boardId].push(payload.element);
      socket.to(boardId).emit('element:created', { element: payload.element });
    }
  });

  // Clear board — reset history + broadcast
  socket.on('clear', () => {
    const boardId = socket.data.boardId;
    if (boardId) {
      boardHistory[boardId] = [];
      // NOTE: chatHistory is deliberately NOT cleared here
      socket.to(boardId).emit('clear');
    }
  });

  // Disconnect — notify room
  socket.on('disconnect', (reason) => {
    console.log(`[whiteboard] ${socket.id} disconnected: ${reason}`);
    const boardId = socket.data.boardId;
    if (boardId) {
      const clients = io.sockets.adapter.rooms.get(boardId);
      const members = clients ? Array.from(clients) : [];
      socket.to(boardId).emit('presence', { id: socket.id, action: 'left', members });
    }
  });
}

module.exports = { registerWhiteboardHandlers };
