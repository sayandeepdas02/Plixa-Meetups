// src/components/chat/ChatMessage.jsx
import React, { memo } from 'react';

/**
 * A single chat message bubble.
 * Props:
 *   msg        — { id, senderId, senderName, message, timestampDisplay }
 *   isOwn      — boolean, whether this message was sent by the current user
 */
const ChatMessage = memo(function ChatMessage({ msg, isOwn }) {
    return (
        <div className={`flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
            {/* Sender name — only for others */}
            {!isOwn && (
                <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wide px-1">
                    {msg.senderName}
                </span>
            )}

            {/* Bubble */}
            <div
                className={`max-w-[240px] px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${isOwn
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-bg-light text-text-main border border-border rounded-bl-sm'
                    }`}
            >
                {msg.message}
            </div>

            {/* Timestamp */}
            <span className="text-[10px] text-text-muted px-1">
                {msg.timestampDisplay}
            </span>
        </div>
    );
});

export default ChatMessage;
