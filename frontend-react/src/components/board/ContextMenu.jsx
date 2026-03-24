import React, { useEffect, useRef, useState } from "react";

export default function ContextMenu({
  isOpen,
  position,
  onClose,
  onSelectAction,
  fileInputRef
}) {
  const menuRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    { id: "text", label: "Text", icon: <IconText />, shortcut: "T" },
    { id: "sticky", label: "Sticky Note", icon: <IconSticky />, shortcut: "S" },
    { id: "rect", label: "Rectangle", icon: <IconSquare />, shortcut: "R" },
    { id: "circle", label: "Circle", icon: <IconCircle />, shortcut: "O" },
    { id: "image", label: "Upload Image", icon: <IconImage />, shortcut: "⇧I" },
  ];

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % actions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + actions.length) % actions.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(actions[selectedIndex].id);
      } else if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, actions, onClose]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleSelect = (id) => {
    if (id === "image" && fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      onSelectAction(id);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-[100] w-56 bg-white/90 backdrop-blur-3xl border border-border/80 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.12)] rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      style={{ left: position.x, top: position.y }}
    >
      <div className="px-3 py-2 border-b border-border/50 bg-slate-50/50 flex items-center gap-2">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Quick Actions</span>
        <span className="px-1.5 rounded bg-white border border-border/50 text-[9px] font-mono text-slate-400">/</span>
      </div>
      
      <div className="p-1 flex flex-col max-h-[300px] overflow-y-auto">
        {actions.map((action, index) => {
          const isSelected = selectedIndex === index;
          return (
            <button
              key={action.id}
              onClick={() => handleSelect(action.id)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`flex items-center justify-between w-full px-2 py-2 rounded-lg transition-colors outline-none ${
                isSelected ? "bg-primary text-white" : "text-navy hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-5 h-5 flex items-center justify-center opacity-80 ${isSelected ? "text-white" : "text-text-muted"}`}>
                  {action.icon}
                </span>
                <span className="text-sm font-medium">{action.label}</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isSelected ? "bg-white/20 text-white/90" : "text-slate-400 bg-slate-100/50"
              }`}>
                {action.shortcut}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Icons
const IconText = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7V4h16v3M9 20h6M12 4v16" /></svg>;
const IconSticky = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3v12.01h12.01V3H3zm0 12.01H12v6H3v-6zm9 6l6-6v6h-6z" /></svg>;
const IconSquare = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect width="18" height="18" x="3" y="3" rx="2" /></svg>;
const IconCircle = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10" /></svg>;
const IconImage = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 15-3.086-3.086a2 2 0 00-2.828 0L6 21" /></svg>;
