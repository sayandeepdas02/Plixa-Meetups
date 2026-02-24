// src/components/chat/ChatMessageList.jsx
import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
import ChatMessage from './ChatMessage.jsx';

/**
 * Scrollable message list with:
 *   - Auto-scroll when user is near bottom
 *   - "New messages" pill when user has scrolled up
 *
 * Props:
 *   messages  — Array<MessageObject>
 *   socketId  — string (current user's socket.id, to determine isOwn)
 */
const ChatMessageList = memo(function ChatMessageList({ messages, socketId }) {
    const scrollRef = useRef(null);
    const [showNewPill, setShowNewPill] = useState(false);
    const isNearBottomRef = useRef(true);

    // Track scroll position to know whether user is near bottom
    function handleScroll() {
        const el = scrollRef.current;
        if (!el) return;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        isNearBottomRef.current = distanceFromBottom < 100;
        if (isNearBottomRef.current) {
            setShowNewPill(false);
        }
    }

    // On new messages: scroll if near bottom, else show pill
    useEffect(() => {
        if (messages.length === 0) return;
        if (isNearBottomRef.current) {
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
            setShowNewPill(false);
        } else {
            setShowNewPill(true);
        }
    }, [messages.length]);

    const scrollToBottom = useCallback(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
        setShowNewPill(false);
        isNearBottomRef.current = true;
    }, []);

    return (
        <div className="relative flex-1 overflow-hidden">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="h-full overflow-y-auto px-3 py-3 flex flex-col gap-3 scroll-smooth"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-3 text-text-muted">
                        <div className="w-12 h-12 rounded-full bg-bg-light flex items-center justify-center">
                            <IconChat className="w-6 h-6 text-text-muted/50" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-navy">No messages yet</p>
                            <p className="text-xs mt-1">Be the first to say something!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <ChatMessage
                            key={msg.id}
                            msg={msg}
                            isOwn={msg.senderId === socketId}
                        />
                    ))
                )}
            </div>

            {/* New messages pill */}
            {showNewPill && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-semibold shadow-premium animate-bounce"
                >
                    <IconArrowDown className="w-3.5 h-3.5" />
                    New messages
                </button>
            )}
        </div>
    );
});

export default ChatMessageList;

function IconChat({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    );
}

function IconArrowDown({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
    );
}
