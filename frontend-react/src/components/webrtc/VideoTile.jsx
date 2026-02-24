// src/components/webrtc/VideoTile.jsx
import React, { memo, useRef, useEffect } from 'react';

/**
 * A single participant video tile.
 *
 * Props:
 *   stream   — MediaStream | null
 *   isLocal  — boolean (mirrors video, shows "You" label)
 *   isMicOn  — boolean (show mic-off icon)
 *   isCamOn  — boolean (show avatar fallback when false)
 *   name     — string (participant display name)
 *   size     — 'sm' | 'md' (tile size hint for grid)
 */
const VideoTile = memo(function VideoTile({ stream, isLocal, isMicOn = true, isCamOn = true, name = 'User' }) {
    const videoRef = useRef(null);

    // Attach MediaStream to the <video> element reactively
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (stream) {
            video.srcObject = stream;
        } else {
            video.srcObject = null;
        }
    }, [stream]);

    const showVideo = stream && isCamOn;
    const initial = (name || 'U').charAt(0).toUpperCase();

    return (
        <div className="relative rounded-xl overflow-hidden bg-slate-800 aspect-video flex items-center justify-center group">
            {/* Video element — always in DOM, avoids flicker on cam toggle */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal} // Always mute self to avoid echo
                className={`w-full h-full object-cover ${isLocal ? '-scale-x-100' : ''} ${showVideo ? 'block' : 'hidden'}`}
            />

            {/* Avatar fallback when camera is off */}
            {!showVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <div className="w-14 h-14 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{initial}</span>
                    </div>
                </div>
            )}

            {/* Bottom overlay: name + mic indicator */}
            <div className="absolute bottom-0 inset-x-0 px-2.5 py-1.5 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between">
                <span className="text-white text-[11px] font-semibold truncate">
                    {isLocal ? 'You' : name}
                </span>
                <div className="flex items-center gap-1">
                    {!isCamOn && <IconCamOff className="w-3 h-3 text-red-400" />}
                    {!isMicOn && <IconMicOff className="w-3 h-3 text-red-400" />}
                </div>
            </div>

            {/* Speaking indicator ring (future: add speaking detection) */}
        </div>
    );
});

export default VideoTile;

function IconMicOff({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
    );
}

function IconCamOff({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2v-4a2 2 0 00-2-2H3z" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    );
}
