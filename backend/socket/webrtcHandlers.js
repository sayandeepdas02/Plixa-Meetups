// backend/socket/webrtcHandlers.js
// Pure signaling relay — the server NEVER processes or touches media.
// All events are prefixed webrtc: to avoid any collision with whiteboard or chat.

/**
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
function registerWebRTCHandlers(socket, io) {

    // User clicks "Join Call"
    // Notify ALL OTHER peers in the room so they can each create an offer to this user.
    socket.on('webrtc:join-call', () => {
        const boardId = socket.data.boardId;
        if (!boardId) {
            console.warn(`[webrtc] webrtc:join-call from ${socket.id} with no boardId — ignored`);
            return;
        }

        // Check participant limit (max 6 peers in a single room)
        const clients = io.sockets.adapter.rooms.get(boardId);
        if (clients && clients.size > 6) {
            socket.emit('webrtc:error', { code: 'CALL_FULL', message: 'Call is full (max 6 participants).' });
            return;
        }

        console.log(`[webrtc] ${socket.id} joined call in room ${boardId}`);
        // Tell everyone else in the room that a new caller has arrived
        socket.to(boardId).emit('webrtc:user-joined', { from: socket.id });
    });

    // Relay SDP offer from one peer to another (targeted)
    socket.on('webrtc:offer', ({ sdp, to }) => {
        const boardId = socket.data.boardId;
        if (!boardId || !sdp || !to) return;
        console.log(`[webrtc] offer relay ${socket.id} → ${to}`);
        io.to(to).emit('webrtc:offer', { sdp, from: socket.id });
    });

    // Relay SDP answer from one peer to another (targeted)
    socket.on('webrtc:answer', ({ sdp, to }) => {
        const boardId = socket.data.boardId;
        if (!boardId || !sdp || !to) return;
        console.log(`[webrtc] answer relay ${socket.id} → ${to}`);
        io.to(to).emit('webrtc:answer', { sdp, from: socket.id });
    });

    // Relay ICE candidate (targeted)
    socket.on('webrtc:ice-candidate', ({ candidate, to }) => {
        const boardId = socket.data.boardId;
        if (!boardId || !candidate || !to) return;
        io.to(to).emit('webrtc:ice-candidate', { candidate, from: socket.id });
    });

    // User clicks "Leave Call" (intentional leave)
    socket.on('webrtc:leave-call', () => {
        const boardId = socket.data.boardId;
        if (!boardId) return;
        console.log(`[webrtc] ${socket.id} left call in room ${boardId}`);
        socket.to(boardId).emit('webrtc:user-left', { from: socket.id });
    });

    // Unintentional disconnect — still notify peers so they clean up
    socket.on('disconnect', () => {
        const boardId = socket.data.boardId;
        if (boardId) {
            socket.to(boardId).emit('webrtc:user-left', { from: socket.id });
        }
    });
}

module.exports = { registerWebRTCHandlers };
