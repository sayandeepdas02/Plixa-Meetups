import React, { memo, useRef, useState, useCallback } from 'react';
import VideoTile from './VideoTile.jsx';
import CallControls from './CallControls.jsx';

/**
 * Floating draggable video grid panel with collapse support.
 */
const VideoGrid = memo(function VideoGrid({
    localStream, remoteStreams,
    isMicOn, isCamOn,
    onMic, onCam, onLeave,
    userName = 'You'
}) {
    const [pos, setPos] = useState(null); 
    const [isCollapsed, setIsCollapsed] = useState(false);
    const dragRef = useRef(null);

    const handlePointerDown = useCallback((e) => {
        if (e.target.closest('button')) return; 
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

    const remotePeers = Array.from(remoteStreams.entries());
    const totalCount = 1 + remotePeers.length;

    const cols = totalCount === 1 ? 1 : totalCount <= 4 ? 2 : 3;
    const tileW = cols === 1 ? 180 : cols === 2 ? 160 : 140;

    const panelStyle = pos
        ? { left: pos.x, top: pos.y }
        : { top: 72, right: 12 };

    return (
        <div
            ref={dragRef}
            onPointerDown={handlePointerDown}
            style={{ 
              ...panelStyle, 
              width: isCollapsed ? 220 : cols * tileW + (cols - 1) * 8 + 24, 
              touchAction: 'none' 
            }}
            className="absolute z-50 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.3)] p-3 cursor-grab active:cursor-grabbing select-none transition-[width] duration-300 overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
                    <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider">Voice Connected</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-medium text-white/50">{totalCount} users</span>
                  <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
                    title={isCollapsed ? "Expand Video" : "Collapse Video"}
                  >
                    {isCollapsed ? <IconExpand className="w-3.5 h-3.5" /> : <IconCollapse className="w-3.5 h-3.5" />}
                  </button>
                </div>
            </div>

            {/* Tile grid */}
            {!isCollapsed && (
              <div
                  className="grid gap-2 mb-3 animate-in fade-in duration-300"
                  style={{ gridTemplateColumns: `repeat(${cols}, ${tileW}px)` }}
              >
                  <VideoTile stream={localStream} isLocal isMicOn={isMicOn} isCamOn={isCamOn} name={userName} />
                  {remotePeers.map(([socketId, stream]) => (
                      <VideoTile key={socketId} stream={stream} isLocal={false} isMicOn={true} isCamOn={true} name={`User ${socketId.slice(0, 4)}`} />
                  ))}
              </div>
            )}

            {/* Controls */}
            <div className={`flex items-center justify-center gap-2 ${isCollapsed ? "mt-3" : ""}`}>
              <CallControls isMicOn={isMicOn} isCamOn={isCamOn} onMic={onMic} onCam={onCam} onLeave={onLeave} />
            </div>
        </div>
    );
});

export default VideoGrid;

function IconCollapse({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>;
}
function IconExpand({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>;
}
