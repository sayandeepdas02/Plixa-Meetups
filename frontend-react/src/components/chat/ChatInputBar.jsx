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
        <div className="flex items-end gap-2 p-3 border-t border-border bg-white">
            <textarea
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                placeholder={disabled ? 'Connecting...' : 'Message the room...'}
                maxLength={2000}
                rows={1}
                className="flex-1 resize-none text-sm bg-bg-light border border-border rounded-xl px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-text-main placeholder:text-text-muted leading-relaxed max-h-28 overflow-y-auto disabled:opacity-50"
                style={{ minHeight: '40px' }}
                onInput={(e) => {
                    // Auto-grow textarea up to max-h-28
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`;
                }}
            />
            <button
                onClick={handleSend}
                disabled={!value.trim() || disabled}
                className="flex-none w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white transition-all hover:bg-primary-hover active:scale-90 disabled:opacity-40 disabled:pointer-events-none"
                title="Send (Enter)"
            >
                <IconSend className="w-4 h-4" />
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
