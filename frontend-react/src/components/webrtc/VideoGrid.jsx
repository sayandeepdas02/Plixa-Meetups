// src/components/webrtc/VideoGrid.jsx
import React, { memo, useRef, useState, useCallback } from 'react';
import VideoTile from './VideoTile.jsx';
import CallControls from './CallControls.jsx';

/**
 * Floating draggable video grid panel.
 * Docked top-right by default; user can drag it anywhere.
 *
 * Props:
 *   localStream    — MediaStream | null
 *   remoteStreams  — Map<socketId, MediaStream>
 *   isMicOn        — boolean
 *   isCamOn        — boolean
 *   onMic          — () => void
 *   onCam          — () => void
 *   onLeave        — () => void
 *   userName       — string  (local user display name)
 */
const VideoGrid = memo(function VideoGrid({
    localStream, remoteStreams,
    isMicOn, isCamOn,
    onMic, onCam, onLeave,
    userName = 'You'
}) {
    // Draggable position state
    const [pos, setPos] = useState(null); // null = CSS default (top-right)
    const dragRef = useRef(null);

    const handlePointerDown = useCallback((e) => {
        if (e.target.closest('button')) return; // don't drag when clicking controls
        const startX = e.clientX - (pos?.x ?? 0);
        const startY = e.clientY - (pos?.y ?? 0);

        const onMove = (ev) => {
            setPos({ x: ev.clientX - startX, y: ev.clientY - startY });
        };
        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    }, [pos]);

    // Build tiles list: local first, then remotes
    const remotePeers = Array.from(remoteStreams.entries()); // [[socketId, stream], ...]
    const totalCount = 1 + remotePeers.length;

    // Grid sizing
    const cols = totalCount === 1 ? 1 : totalCount <= 4 ? 2 : 3;
    const tileW = cols === 1 ? 180 : cols === 2 ? 160 : 140;

    // Panel position: use dragged pos, or default top-right offset
    const panelStyle = pos
        ? { left: pos.x, top: pos.y }
        : { top: 72, right: 12 };

    return (
        <div
            ref={dragRef}
            onPointerDown={handlePointerDown}
            style={{ ...panelStyle, width: cols * tileW + (cols - 1) * 8 + 24, touchAction: 'none' }}
            className="absolute z-50 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl p-3 cursor-grab active:cursor-grabbing select-none"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 px-0.5">
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">Live</span>
                </div>
                <span className="text-[11px] text-white/50">{totalCount} in call</span>
            </div>

            {/* Tile grid */}
            <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${cols}, ${tileW}px)` }}
            >
                {/* Local video */}
                <VideoTile
                    stream={localStream}
                    isLocal
                    isMicOn={isMicOn}
                    isCamOn={isCamOn}
                    name={userName}
                />

                {/* Remote videos */}
                {remotePeers.map(([socketId, stream]) => (
                    <VideoTile
                        key={socketId}
                        stream={stream}
                        isLocal={false}
                        isMicOn={true}   // We can't know remote mic state in v1; future: relay via socket
                        isCamOn={true}
                        name={`User ${socketId.slice(0, 4)}`}
                    />
                ))}
            </div>

            {/* Controls */}
            <CallControls
                isMicOn={isMicOn}
                isCamOn={isCamOn}
                onMic={onMic}
                onCam={onCam}
                onLeave={onLeave}
            />
        </div>
    );
});

export default VideoGrid;
