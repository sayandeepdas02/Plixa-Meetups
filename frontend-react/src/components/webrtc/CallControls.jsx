// src/components/webrtc/CallControls.jsx
import React, { memo } from 'react';

/**
 * Mic / Camera / Leave button bar shown below the video grid while in call.
 *
 * Props:
 *   isMicOn   — boolean
 *   isCamOn   — boolean
 *   onMic     — () => void
 *   onCam     — () => void
 *   onLeave   — () => void
 */
const CallControls = memo(function CallControls({ isMicOn, isCamOn, onMic, onCam, onLeave }) {
    return (
        <div className="flex items-center justify-center gap-2 pt-2">
            {/* Mic Toggle */}
            <ControlBtn
                onClick={onMic}
                active={isMicOn}
                activeTitle="Mute mic"
                inactiveTitle="Unmute mic"
                activeIcon={<IconMic />}
                inactiveIcon={<IconMicOff />}
            />

            {/* Camera Toggle */}
            <ControlBtn
                onClick={onCam}
                active={isCamOn}
                activeTitle="Turn off camera"
                inactiveTitle="Turn on camera"
                activeIcon={<IconCam />}
                inactiveIcon={<IconCamOff />}
            />

            {/* Leave Call — always red */}
            <button
                onClick={onLeave}
                title="Leave call"
                className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all active:scale-90 shadow-lg"
            >
                <IconPhone className="w-4 h-4" />
            </button>
        </div>
    );
});

export default CallControls;

function ControlBtn({ onClick, active, activeTitle, inactiveTitle, activeIcon, inactiveIcon }) {
    return (
        <button
            onClick={onClick}
            title={active ? activeTitle : inactiveTitle}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-md ${active
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
        >
            {active ? activeIcon : inactiveIcon}
        </button>
    );
}

const IconMic = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
    </svg>
);

const IconMicOff = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <line x1="1" y1="1" x2="23" y2="23" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16.95A7 7 0 015 12v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
);

const IconCam = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14" />
        <rect x="1" y="8" width="14" height="10" rx="2" ry="2" />
    </svg>
);

const IconCamOff = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2v-4a2 2 0 00-2-2H3z" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const IconPhone = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);
