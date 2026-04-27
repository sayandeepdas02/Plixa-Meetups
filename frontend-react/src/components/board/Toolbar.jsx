import React from "react";

export function ToolBtn({ active, onClick, icon, title, isColor }) {
  return (
    <button
      onClick={onClick}
      className={`relative group p-2.5 rounded-lg transition-all duration-200 outline-none ${
        active 
          ? "bg-foreground text-background shadow-sm" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      aria-label={title}
    >
      {isColor ? (
         icon
      ) : (
         React.cloneElement(icon, { className: `w-4.5 h-4.5 transition-colors` })
      )}
      
      {/* Tooltip */}
      <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-md translate-x-1 group-hover:translate-x-0">
        {title}
      </span>
    </button>
  );
}

export default function Toolbar({ tool, setTool, onClear, fileInputRef, onUploadChange }) {
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

  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40 select-none">
      <div className="rounded-xl border border-border bg-background/80 backdrop-blur-md shadow-lg p-1 flex flex-col gap-1">
        <ToolBtn active={tool === TOOLS.CURSOR} onClick={() => setTool(TOOLS.CURSOR)} icon={<IconCursor />} title="Select (V)" />
        <ToolBtn active={tool === TOOLS.HAND} onClick={() => setTool(TOOLS.HAND)} icon={<IconHand />} title="Pan (H)" />
        
        <div className="h-px bg-border/60 my-0.5 mx-2"></div>
        
        <ToolBtn active={tool === TOOLS.PENCIL} onClick={() => setTool(TOOLS.PENCIL)} icon={<IconPencil />} title="Pencil (P)" />
        <ToolBtn active={tool === TOOLS.ERASER} onClick={() => setTool(TOOLS.ERASER)} icon={<IconEraser />} title="Eraser (E)" />
        <ToolBtn active={tool === TOOLS.TEXT} onClick={() => setTool(TOOLS.TEXT)} icon={<IconText />} title="Text (T)" />
        <ToolBtn active={tool === TOOLS.STICKY} onClick={() => setTool(TOOLS.STICKY)} icon={<IconSticky />} title="Sticky Note (S)" />
        
        <div className="h-px bg-border/60 my-0.5 mx-2"></div>
        
        <ToolBtn active={tool === TOOLS.RECT} onClick={() => setTool(TOOLS.RECT)} icon={<IconSquare />} title="Rectangle (R)" />
        <ToolBtn active={tool === TOOLS.CIRCLE} onClick={() => setTool(TOOLS.CIRCLE)} icon={<IconCircle />} title="Circle (O)" />
        <ToolBtn active={tool === TOOLS.ARROW} onClick={() => setTool(TOOLS.ARROW)} icon={<IconArrow />} title="Arrow (A)" />
        <ToolBtn active={tool === TOOLS.LINE} onClick={() => setTool(TOOLS.LINE)} icon={<IconLine />} title="Line (L)" />
        
        <div className="h-px bg-border/60 my-0.5 mx-2"></div>
        
        <label className="relative group p-2.5 rounded-lg cursor-pointer hover:bg-muted transition-all text-muted-foreground hover:text-foreground">
          <IconImage className="w-4.5 h-4.5" />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={onUploadChange} className="hidden" />
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 shadow-md translate-x-1 group-hover:translate-x-0">
            Image
          </span>
        </label>
      </div>

      <button
        onClick={onClear}
        className="p-2.5 bg-background/80 backdrop-blur-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border transition-all shadow-md rounded-xl outline-none group"
        title="Clear Canvas"
      >
        <IconTrash className="w-4.5 h-4.5 mx-auto group-hover:scale-110 transition-transform duration-200" />
      </button>
    </div>
  );
}

// Additional specific icons
const IconCursor = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 13l6 6" /></svg>;
const IconHand = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5a5.5 5.5 0 015.5-5.5h7a5.5 5.5 0 015.5 5.5v5A5.5 5.5 0 0115.5 24h-7A5.5 5.5 0 013 18.5v-5z" /></svg>;
const IconSticky = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v12.01h12.01V3H3zm0 12.01H12v6H3v-6zm9 6l6-6v6h-6z" /></svg>;

// Original Icons
const IconPencil = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const IconEraser = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-9 2 2-9 9-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18 19h4M3 13a4 4 0 014-4h.172a2 2 0 011.414.586l10.828 10.828a2 2 0 010 2.828l-3 3a2 2 0 01-2.828 0L3.586 16.414A2 2 0 013 15V13z" /></svg>;
const IconSquare = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /></svg>;
const IconCircle = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>;
const IconArrow = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>;
const IconLine = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 19L19 5" /></svg>;
const IconText = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7V4h16v3M9 20h6M12 4v16" /></svg>;
const IconImage = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 15-3.086-3.086a2 2 0 00-2.828 0L6 21" /></svg>;
const IconTrash = ({ className }) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
