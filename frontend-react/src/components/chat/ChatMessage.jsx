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
        <div className={`flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
            {/* Sender name — only for others */}
            {!isOwn && (
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                    {msg.senderName}
                </span>
            )}

            {/* Bubble */}
            <div
                className={`max-w-[85%] px-4 py-2.5 rounded-xl text-sm leading-relaxed break-words transition-all duration-200 ${isOwn
                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                        : 'bg-muted text-foreground border border-border/50 rounded-tl-none'
                    }`}
            >
                {msg.message}
            </div>

            {/* Timestamp */}
            <span className="text-[9px] font-medium text-muted-foreground px-1 uppercase tracking-wider">
                {msg.timestampDisplay}
            </span>
        </div>
    );
});

export default ChatMessage;
