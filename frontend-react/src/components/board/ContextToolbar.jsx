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
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="rounded-xl border border-border bg-background/80 backdrop-blur-md shadow-lg px-6 py-2.5 flex items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Color Palette */}
        {tool !== TOOLS.ERASER && (
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Color</span>
            <div className="flex items-center gap-2">
              {presetColors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-4.5 h-4.5 rounded-full border border-border/50 transition-all hover:scale-110 active:scale-95 ${
                    color === c ? "ring-2 ring-offset-2 ring-foreground scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <div className="w-px h-4 bg-border/60 mx-1"></div>
              <label className="relative cursor-pointer hover:scale-110 transition-all w-4.5 h-4.5 rounded-full overflow-hidden border border-border/50" title="Custom color">
                <div 
                  className="absolute inset-0 rounded-full rainbow-bg"
                  style={{ 
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
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              {tool === TOOLS.ERASER ? "Size" : "Width"}
            </span>
            <div className="flex items-center gap-1.5 p-1 rounded-lg border border-border/40 bg-muted/30">
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
      className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
        isActive ? "bg-background shadow-sm ring-1 ring-border" : "hover:bg-muted"
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
