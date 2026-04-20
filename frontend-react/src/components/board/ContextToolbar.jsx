import React from "react";

export default function ContextToolbar({
  tool,
  color,
  setColor,
  thickness,
  setThickness,
  eraserSize,
  setEraserSize
}) {
  const TOOLS = {
    CURSOR: "cursor",
    HAND: "hand",
    PENCIL: "pencil",
    ERASER: "eraser",
    RECT: "rect",
    CIRCLE: "circle",
    ARROW: "arrow",
    LINE: "line",
    TEXT: "text",
    STICKY: "sticky",
  };

  // Only show properties strictly appropriate to the tool
  const showProperties = [
    TOOLS.PENCIL, TOOLS.ERASER, TOOLS.RECT, 
    TOOLS.CIRCLE, TOOLS.ARROW, TOOLS.LINE, TOOLS.TEXT, TOOLS.STICKY
  ].includes(tool);

  if (!showProperties) return null;

  const presetColors = [
    "#000000", // Black
    "#2563eb", // Primary Blue
    "#dc2626", // Red
    "#16a34a", // Green
    "#f59e0b", // Amber
    "#8b5cf6", // Violet
    "#ec4899", // Pink
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="glass-card px-5 py-2.5 flex items-center gap-6 shadow-premium border-border/60 backdrop-blur-2xl rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Color Palette */}
        {tool !== TOOLS.ERASER && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Color</span>
            <div className="flex items-center gap-1.5">
              {presetColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                    color === c ? "border-foreground ring-1 ring-offset-1 ring-foreground scale-110 shadow-sm" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <div className="w-px h-4 bg-border/50 mx-1"></div>
              <label className="relative cursor-pointer hover:scale-110 transition-transform w-5 h-5 rounded-full overflow-hidden shadow-sm" title="Custom color">
                <div 
                  className="absolute inset-0 rounded-full rainbow-bg border-2 border-transparent"
                  style={{ 
                    // a simple CSS conic gradient for a custom color picker icon
                    background: color && !presetColors.includes(color) ? color : 'conic-gradient(from 180deg at 50% 50%, #ff0f0f 0deg, #ff8f0f 51.43deg, #ffdf0f 102.86deg, #0fff3f 154.29deg, #0fffff 205.71deg, #0f3fff 257.14deg, #df0fff 308.57deg, #ff0f0f 360deg)'
                  }} 
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-0 h-0 opacity-0 absolute"
                />
              </label>
            </div>
          </div>
        )}

        {/* Separator */}
        {tool !== TOOLS.ERASER && <div className="h-6 w-px bg-border/60"></div>}

        {/* Thickness / Width */}
        {tool !== TOOLS.TEXT && tool !== TOOLS.STICKY && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {tool === TOOLS.ERASER ? "Size" : "Width"}
            </span>
            <div className="flex items-center gap-1.5 bg-secondary p-1 rounded-lg">
              {tool === TOOLS.ERASER ? (
                <>
                  <WidthBtn size={16} current={eraserSize} onClick={() => setEraserSize(16)} />
                  <WidthBtn size={32} current={eraserSize} onClick={() => setEraserSize(32)} />
                  <WidthBtn size={64} current={eraserSize} onClick={() => setEraserSize(64)} />
                </>
              ) : (
                <>
                  <WidthBtn size={2} current={thickness} onClick={() => setThickness(2)} />
                  <WidthBtn size={4} current={thickness} onClick={() => setThickness(4)} />
                  <WidthBtn size={8} current={thickness} onClick={() => setThickness(8)} />
                  <WidthBtn size={12} current={thickness} onClick={() => setThickness(12)} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for thickness dots
function WidthBtn({ size, current, onClick }) {
  const isActive = size === current;
  // Visual scaling down just for the UI dot, not actual thickness
  const dotSize = size > 16 ? size / 4 : size; 
  const clampedSize = Math.max(4, Math.min(16, dotSize));

  return (
    <button
      onClick={onClick}
      className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors ${
        isActive ? "bg-background shadow-sm" : "hover:bg-muted"
      }`}
      title={`${size}px`}
    >
      <div 
        className={`rounded-full ${isActive ? "bg-foreground" : "bg-muted-foreground"}`} 
        style={{ width: clampedSize, height: clampedSize }} 
      />
    </button>
  );
}
