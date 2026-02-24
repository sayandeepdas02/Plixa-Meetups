// backend/socket/chatHandlers.js
// All chat-related Socket.IO events isolated here.
// Events: chat:send → chat:message (broadcast), chat:typing (relay)
// These are FULLY SEPARATE from whiteboard events.

// Simple unique ID generator (no external dependency)
function uid(prefix = 'msg') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Strip HTML tags and encode dangerous characters to prevent XSS
function sanitizeMessage(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
}

// Format a Date into HH:mm (24h)
function formatTimestamp(date) {
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
}

/**
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 * @param {Object} chatHistory  - shared in-memory store { [boardId]: message[] }
 */
function registerChatHandlers(socket, io, chatHistory) {

    // --- chat:send ---
    // Client sends: { message: string, senderName: string }
    // Server stores + broadcasts: full message object to entire room
    socket.on('chat:send', ({ message, senderName }) => {
        const boardId = socket.data.boardId;

        // Guard: must have joined a board first
        if (!boardId) {
            console.warn(`[chat] chat:send from ${socket.id} who has no boardId — ignoring`);
            return;
        }

        // Validate senderName
        if (!senderName || typeof senderName !== 'string' || !senderName.trim()) {
            console.warn(`[chat] Invalid senderName from ${socket.id}`);
            return;
        }

        // Validate message presence
        if (!message || typeof message !== 'string') {
            return;
        }

        // Sanitize
        const sanitized = sanitizeMessage(message);

        // Validate length after sanitize
        if (sanitized.length === 0 || sanitized.length > 2000) {
            console.warn(`[chat] Message from ${socket.id} rejected: length ${sanitized.length}`);
            return;
        }

        // Build message object
        const now = new Date();
        const msgObj = {
            id: uid('msg'),
            senderId: socket.id,
            senderName: sanitizeMessage(senderName).slice(0, 60), // cap name length
            message: sanitized,
            timestamp: now.toISOString(),
            timestampDisplay: formatTimestamp(now),
        };

        // Lazy-init board chat history
        if (!chatHistory[boardId]) {
            chatHistory[boardId] = [];
        }
        chatHistory[boardId].push(msgObj);

        console.log(`[chat] [${boardId}] ${msgObj.senderName}: ${sanitized.slice(0, 60)}`);

        // Broadcast to entire room including sender
        io.to(boardId).emit('chat:message', msgObj);
    });


    // --- chat:typing ---
    // Client sends: { senderName: string }
    // Server relays to all OTHER users in the room (not sender)
    socket.on('chat:typing', ({ senderName }) => {
        const boardId = socket.data.boardId;
        if (!boardId || !senderName) return;

        socket.to(boardId).emit('chat:typing', {
            senderId: socket.id,
            senderName: typeof senderName === 'string' ? senderName.slice(0, 60) : 'Someone',
        });
    });
}

module.exports = { registerChatHandlers };
