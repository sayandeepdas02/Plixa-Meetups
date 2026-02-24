// src/components/chat/ChatPanel.jsx
import React, { memo } from 'react';
import ChatMessageList from './ChatMessageList.jsx';
import ChatInputBar from './ChatInputBar.jsx';

/**
 * The full chat panel — collapsible sidebar.
 *
 * Props:
 *   open        — boolean
 *   onClose     — () => void
 *   messages    — Array<MessageObject>
 *   socketId    — string
 *   connected   — boolean
 *   onSend      — (message: string) => void
 *   unreadCount — number (badge when panel is closed, managed by parent)
 */
const ChatPanel = memo(function ChatPanel({ open, onClose, messages, socketId, connected, onSend }) {
    return (
        <>
            {/* Desktop: sidebar that pushes canvas */}
            <div
                className={`hidden md:flex flex-col border-l border-border bg-white transition-all duration-300 ease-in-out overflow-hidden flex-none ${open ? 'w-80' : 'w-0'
                    }`}
                style={{ willChange: 'width' }}
            >
                {open && <PanelContent messages={messages} socketId={socketId} connected={connected} onSend={onSend} onClose={onClose} />}
            </div>

            {/* Mobile: absolute overlay over canvas */}
            {open && (
                <div className="md:hidden absolute inset-0 z-30 flex flex-col bg-white">
                    <PanelContent messages={messages} socketId={socketId} connected={connected} onSend={onSend} onClose={onClose} />
                </div>
            )}
        </>
    );
});

function PanelContent({ messages, socketId, connected, onSend, onClose }) {
    return (
        <div className="flex flex-col h-full">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-border bg-white flex-none">
                <div className="flex items-center gap-2">
                    <IconChat className="w-4 h-4 text-primary" />
                    <span className="font-bold text-navy text-sm">Room Chat</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-text-muted hover:bg-bg-light hover:text-navy transition-colors"
                    title="Close chat"
                >
                    <IconX className="w-4 h-4" />
                </button>
            </div>

            {/* Message List */}
            <ChatMessageList messages={messages} socketId={socketId} />

            {/* Input */}
            <ChatInputBar onSend={onSend} disabled={!connected} />
        </div>
    );
}

export default ChatPanel;

function IconChat({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    );
}

function IconX({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}
