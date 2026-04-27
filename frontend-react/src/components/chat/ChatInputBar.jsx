// src/components/chat/ChatInputBar.jsx
import React, { useState, useRef } from 'react';

/**
 * Chat input bar — local state only, no messages state here
 * so typing does NOT re-render the message list.
 *
 * Props:
 *   onSend      — (message: string) => void
 *   disabled    — boolean (when socket not connected)
 */
export default function ChatInputBar({ onSend, disabled }) {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);

    function handleSend() {
        const trimmed = value.trim();
        if (!trimmed || trimmed.length > 2000 || disabled) return;
        onSend(trimmed);
        setValue('');
        inputRef.current?.focus();
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex items-end gap-3 p-4 border-t border-border bg-background shadow-premium">
            <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder={disabled ? 'Connecting...' : 'Message the room...'}
                maxLength={2000}
                rows={1}
                className="flex-1 resize-none text-sm bg-muted border border-border/60 rounded-lg px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground/50 leading-relaxed max-h-28 overflow-y-auto disabled:opacity-50"
                style={{ minHeight: '42px' }}
                onInput={(e) => {
                    // Auto-grow textarea up to max-h-28
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`;
                }}
            />
            <button
                onClick={handleSend}
                disabled={!value.trim() || disabled}
                className="flex-none w-[42px] h-[42px] rounded-lg bg-foreground text-background transition-all hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-sm flex items-center justify-center"
                title="Send (Enter)"
            >
                <IconSend className="w-4.5 h-4.5" />
            </button>
        </div>
    );
}

function IconSend({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
        </svg>
    );
}
