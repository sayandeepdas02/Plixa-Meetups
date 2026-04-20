import React from "react";

export default function ZoomControls({
  zoom, // Assume zoom is a float where 1.0 is 100%
  setZoom,
  onFit,
  onCenter
}) {
  const percentage = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-6 right-6 z-40 flex flex-col gap-2 items-end">
      {/* Optional: Navigation map dot or fit controls */}
      <div className="glass-card flex items-center p-1 border-border/60 shadow-soft backdrop-blur-xl rounded-xl">
        <button 
          onClick={onFit}
          className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors uppercase tracking-wider"
          title="Fit to screen (Shift+1)"
        >
          Fit
        </button>
        <div className="w-px h-3 bg-border/60 mx-1"></div>
        <button 
          onClick={onCenter}
          className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors uppercase tracking-wider"
          title="Zoom to 100% (Shift+0)"
        >
          100%
        </button>
      </div>

      {/* Main zoom controls */}
      <div className="glass-card flex items-center p-1 border-border/60 shadow-soft backdrop-blur-xl rounded-xl">
        <button 
          onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
          className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors"
          title="Zoom Out (-)"
        >
          <IconMinus className="w-4 h-4" />
        </button>
        
        <button 
          onClick={onCenter}
          className="px-3 text-[11px] font-mono font-semibold text-foreground w-14 text-center hover:bg-secondary py-1 rounded transition-colors"
          title="Reset Zoom"
        >
          {percentage}%
        </button>
        
        <button 
          onClick={() => setZoom(Math.min(5, zoom + 0.1))}
          className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground rounded transition-colors"
          title="Zoom In (+)"
        >
          <IconPlus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

const IconPlus = ({ className }) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const IconMinus = ({ className }) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>;
