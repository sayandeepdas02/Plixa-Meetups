// src/pages/Board.jsx
import React, { useRef, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Link, useParams, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const BACKEND = import.meta.env.VITE_BACKEND || "http://127.0.0.1:8080";
const SAMPLE_IMAGE_PATH = import.meta.env.VITE_SAMPLE || "/sample.png";

const TOOLS = {
  PENCIL: "pencil",
  ERASER: "eraser",
  RECT: "rect",
  SQUARE: "square",
  CIRCLE: "circle",
  LINE: "line",
  ARROW: "arrow",
  TEXT: "text",
};

function uid(prefix = "el") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function Board() {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roomId) {
      const newId = uid("board");
      navigate(`/board/${newId}`, { replace: true });
    }
  }, [roomId, navigate]);

  const drawingRef = useRef(false);
  const startPosRef = useRef(null);
  const pathBufferRef = useRef([]);
  const baseImageRef = useRef(null);
  const baseImageSizeRef = useRef({ w: 0, h: 0 });

  const [tool, setTool] = useState(TOOLS.PENCIL);
  const [color, setColor] = useState("#2563eb");
  const [thickness, setThickness] = useState(4);
  const [eraserSize, setEraserSize] = useState(24);
  const [zoomLabel, setZoomLabel] = useState("100%");
  const [socketId, setSocketId] = useState("");
  const [participants, setParticipants] = useState([]);
  const [showProperties, setShowProperties] = useState(true);

  const getCtx = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d", { willReadFrequently: true });
  };

  useEffect(() => {
    const s = io(BACKEND, { transports: ['websocket', 'polling'] });
    socketRef.current = s;

    s.on("connect", () => {
      setSocketId(s.id || "");
      if (roomId) s.emit("join", { boardId: roomId });
    });

    s.on("whiteboard-state", (elements) => {
      elements.forEach((el) => drawElement(el));
      try { saveBaseImage(); } catch (err) { }
    });

    // remote draw simple points (backwards-compatible)
    s.on("ondown", ({ x, y, color, thickness, tool }) => {
      const ctx = getCtx();
      if (!ctx) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineWidth = thickness;
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (tool === "eraser") ctx.globalCompositeOperation = "destination-out";
    });

    s.on("ondraw", ({ x, y }) => {
      const ctx = getCtx();
      if (!ctx) return;
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    s.on("element:created", ({ element }) => {
      if (!element) return;
      drawElement(element);
      try { saveBaseImage(); } catch (err) { }
    });

    s.on("clear", () => {
      const ctx = getCtx();
      if (!ctx || !canvasRef.current) return;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      baseImageRef.current = null;
    });

    s.on("presence", ({ id, action, members }) => {
      if (members) {
        setParticipants(members);
      } else {
        // Fallback for older backend
        setParticipants(prev => {
          if (action === 'joined') return [...new Set([...prev, id])];
          if (action === 'left') return prev.filter(p => p !== id);
          return prev;
        });
      }
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = getCtx();
    if (!ctx) return;

    const ratio = window.devicePixelRatio || 1;

    const resize = () => {
      try {
        const wCss = window.innerWidth;
        const hCss = window.innerHeight;

        const tmp = document.createElement("canvas");
        tmp.width = canvas.width;
        tmp.height = canvas.height;
        const tmpCtx = tmp.getContext("2d");
        tmpCtx.drawImage(canvas, 0, 0);

        canvas.style.width = `${wCss}px`;
        canvas.style.height = `${hCss}px`;
        canvas.width = Math.round(wCss * ratio);
        canvas.height = Math.round(hCss * ratio);
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        if (tmp.width && tmp.height) {
          ctx.drawImage(tmp, 0, 0, tmp.width / ratio, tmp.height / ratio);
        }
        setZoomLabel("100%");
      } catch (err) { }
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.style.touchAction = "none";
    try { saveBaseImage(); } catch (err) { }

    return () => window.removeEventListener("resize", resize);
  }, []);

  function saveBaseImage() {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    try {
      baseImageRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      baseImageSizeRef.current = { w: canvas.width, h: canvas.height };
    } catch (err) { }
  }

  function restoreBaseImage() {
    const ctx = getCtx();
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    try {
      if (baseImageRef.current && baseImageSizeRef.current.w === canvas.width && baseImageSizeRef.current.h === canvas.height) {
        ctx.putImageData(baseImageRef.current, 0, 0);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    } catch (err) { ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }

  function drawElement(el) {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.save();
    ctx.lineWidth = el.strokeWidth || 2;
    ctx.strokeStyle = el.stroke || "#000";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = el.fill || "transparent";

    if (el.type === "rect") {
      ctx.strokeRect(el.x, el.y, el.w, el.h);
    } else if (el.type === "ellipse") {
      ctx.beginPath();
      ctx.ellipse(el.x + el.w / 2, el.y + el.h / 2, Math.abs(el.w / 2), Math.abs(el.h / 2), 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (el.type === "line" || el.type === "arrow") {
      ctx.beginPath();
      ctx.moveTo(el.x, el.y);
      ctx.lineTo(el.x + el.w, el.y + el.h);
      ctx.stroke();
      if (el.type === "arrow") {
        const x2 = el.x + el.w, y2 = el.y + el.h;
        const angle = Math.atan2(y2 - el.y, x2 - el.x);
        const len = 12;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - len * Math.cos(angle - Math.PI / 6), y2 - len * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(x2 - len * Math.cos(angle + Math.PI / 6), y2 - len * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = el.stroke || "#000";
        ctx.fill();
      }
    } else if (el.type === "pencil" || el.type === "eraser") {
      if (el.path && el.path.length) {
        if (el.type === "eraser") ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.moveTo(el.path[0].x, el.path[0].y);
        for (let i = 1; i < el.path.length; i++) ctx.lineTo(el.path[i].x, el.path[i].y);
        ctx.lineWidth = el.strokeWidth || 4;
        ctx.strokeStyle = el.stroke || "#000";
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      }
    } else if (el.type === "text") {
      ctx.fillStyle = el.fill || "#000";
      ctx.font = `${el.fontSize || 18}px sans-serif`;
      ctx.fillText(el.text || "", el.x, el.y);
    } else if (el.type === "image") {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => ctx.drawImage(img, el.x, el.y, el.w, el.h);
      img.src = el.src;
    }
    ctx.restore();
  }

  function shapeElementFromPoints(toolName, a, b, colorVal, widthVal) {
    if (!a || !b) return null;
    const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    const w = Math.abs(b.x - a.x), h = Math.abs(b.y - a.y);
    if (toolName === TOOLS.RECT) return { id: uid("rect"), type: "rect", x, y, w, h, stroke: colorVal, strokeWidth: widthVal };
    if (toolName === TOOLS.SQUARE) {
      const size = Math.max(w, h);
      return { id: uid("square"), type: "rect", x: a.x <= b.x ? a.x : a.x - size, y: a.y <= b.y ? a.y : a.y - size, w: size, h: size, stroke: colorVal, strokeWidth: widthVal };
    }
    if (toolName === TOOLS.CIRCLE) {
      const size = Math.max(w, h);
      return { id: uid("circle"), type: "ellipse", x: a.x <= b.x ? a.x : a.x - size, y: a.y <= b.y ? a.y : a.y - size, w: size, h: size, stroke: colorVal, strokeWidth: widthVal };
    }
    if (toolName === TOOLS.LINE || toolName === TOOLS.ARROW) {
      return { id: uid(toolName), type: toolName, x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y, stroke: colorVal, strokeWidth: widthVal };
    }
    return null;
  }

  function getPosFromEvent(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function pointerDown(e) {
    const pos = getPosFromEvent(e);
    startPosRef.current = pos;
    drawingRef.current = true;
    const ctx = getCtx();
    if (!ctx) return;

    if (tool === TOOLS.PENCIL) {
      pathBufferRef.current = [pos];
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineWidth = thickness;
      ctx.strokeStyle = color;
      socketRef.current?.emit("down", { ...pos, color, thickness, tool: "pencil" });
    } else if (tool === TOOLS.ERASER) {
      pathBufferRef.current = [pos];
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineWidth = eraserSize;
      ctx.globalCompositeOperation = "destination-out";
      socketRef.current?.emit("down", { ...pos, color: "transparent", thickness: eraserSize, tool: "eraser" });
    } else if (tool === TOOLS.TEXT) {
      const text = window.prompt("Enter text:");
      if (text?.trim()) {
        const el = { id: uid("text"), type: "text", x: pos.x, y: pos.y, text, fill: color, fontSize: 18 };
        drawElement(el);
        socketRef.current?.emit("element:create", { element: el });
        saveBaseImage();
      }
      drawingRef.current = false;
    } else {
      saveBaseImage();
    }
  }

  function pointerMove(e) {
    if (!drawingRef.current) return;
    const pos = getPosFromEvent(e);
    const ctx = getCtx();
    if (!ctx) return;

    if (tool === TOOLS.PENCIL || tool === TOOLS.ERASER) {
      pathBufferRef.current.push(pos);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      socketRef.current?.emit("draw", pos);
    } else {
      restoreBaseImage();
      const preview = shapeElementFromPoints(tool, startPosRef.current, pos, color, thickness);
      if (preview) drawElement(preview);
    }
  }

  function pointerUp(e) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const pos = getPosFromEvent(e);
    const ctx = getCtx();
    if (!ctx) return;

    if (tool === TOOLS.PENCIL) {
      const el = { id: uid("pencil"), type: "pencil", path: pathBufferRef.current.slice(), stroke: color, strokeWidth: thickness };
      socketRef.current?.emit("element:create", { element: el });
    } else if (tool === TOOLS.ERASER) {
      ctx.globalCompositeOperation = "source-over";
      const el = { id: uid("eraser"), type: "eraser", path: pathBufferRef.current.slice(), strokeWidth: eraserSize };
      socketRef.current?.emit("element:create", { element: el });
    } else {
      const el = shapeElementFromPoints(tool, startPosRef.current, pos, color, thickness);
      if (el) {
        drawElement(el);
        socketRef.current?.emit("element:create", { element: el });
        saveBaseImage();
      }
    }
    pathBufferRef.current = [];
  }

  function handleClear() {
    if (!window.confirm("Clear entire board?")) return;
    getCtx()?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socketRef.current?.emit("clear");
    baseImageRef.current = null;
  }

  function handleSave() {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `plixa-board-${Date.now()}.png`;
      a.click();
    });
  }

  function handleUploadChange(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const w = Math.min(img.width, canvas.width * 0.4);
        const h = (img.height / img.width) * w;
        const el = { id: uid("img"), type: "image", x: 100, y: 100, w, h, src: reader.result };
        drawElement(el);
        socketRef.current?.emit("element:create", { element: el });
        saveBaseImage();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-light font-sans text-text-main">
      {/* Top Header */}
      <header className="h-14 border-b border-border bg-white flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Logo" className="h-7 w-auto" />
            <span className="font-bold text-navy hidden sm:block">Plixa</span>
          </Link>
          <div className="h-4 w-px bg-border mx-2"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-navy truncate max-w-[150px]">Untitled Board</span>
            <span className="px-1.5 py-0.5 rounded bg-bg-light text-[10px] font-bold text-text-muted border border-border">DRAFT</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center -space-x-2">
            {participants.map((pid, i) => (
              <div key={pid} className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-border" title={pid}>
                {pid === socketId ? "You" : `U${i + 1}`}
              </div>
            ))}
            {participants.length === 0 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-border">
                You
              </div>
            )}
          </div>
          <div className="h-4 w-px bg-border mx-1"></div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
            className="btn-primary py-1.5 px-4 text-xs"
          >
            Share
          </button>
          <button onClick={handleSave} className="p-2 hover:bg-bg-light rounded-lg transition-colors" title="Export as PNG">
            <IconDownload className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        {/* Left Floating Toolbar */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
          <div className="glass-card p-1.5 flex flex-col gap-1 shadow-premium border-border">
            <ToolBtn active={tool === TOOLS.PENCIL} onClick={() => setTool(TOOLS.PENCIL)} icon={<IconPencil />} title="Pencil (P)" />
            <ToolBtn active={tool === TOOLS.ERASER} onClick={() => setTool(TOOLS.ERASER)} icon={<IconEraser />} title="Eraser (E)" />
            <div className="h-px bg-border my-1 mx-2"></div>
            <ToolBtn active={tool === TOOLS.RECT} onClick={() => setTool(TOOLS.RECT)} icon={<IconSquare />} title="Rectangle (R)" />
            <ToolBtn active={tool === TOOLS.CIRCLE} onClick={() => setTool(TOOLS.CIRCLE)} icon={<IconCircle />} title="Circle (O)" />
            <ToolBtn active={tool === TOOLS.ARROW} onClick={() => setTool(TOOLS.ARROW)} icon={<IconArrow />} title="Arrow (A)" />
            <ToolBtn active={tool === TOOLS.LINE} onClick={() => setTool(TOOLS.LINE)} icon={<IconLine />} title="Line (L)" />
            <div className="h-px bg-border my-1 mx-2"></div>
            <ToolBtn active={tool === TOOLS.TEXT} onClick={() => setTool(TOOLS.TEXT)} icon={<IconText />} title="Text (T)" />
            <label className="p-2 hover:bg-primary/5 rounded-lg cursor-pointer transition-colors group">
              <IconImage className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUploadChange} className="hidden" />
            </label>
          </div>

          <button onClick={handleClear} className="glass-card p-2 hover:bg-red-50 text-red-500 border-red-100 transition-colors" title="Clear Canvas">
            <IconTrash className="w-5 h-5" />
          </button>
        </div>

        {/* Property Bar (Bottom Center) */}
        {showProperties && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
            <div className="glass-card px-4 py-2 flex items-center gap-6 shadow-premium border-border animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Stroke</span>
                <div className="flex items-center gap-1.5">
                  {['#000000', '#2563eb', '#dc2626', '#16a34a', '#f59e0b'].map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-navy ring-1 ring-offset-1 ring-navy' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-5 h-5 rounded-full border-0 p-0 overflow-hidden cursor-pointer" />
                </div>
              </div>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Width</span>
                <select value={thickness} onChange={(e) => setThickness(Number(e.target.value))} className="bg-transparent text-sm font-medium outline-none cursor-pointer hover:text-primary transition-colors">
                  <option value={2}>Thin</option>
                  <option value={4}>Regular</option>
                  <option value={8}>Bold</option>
                  <option value={12}>Heavy</option>
                </select>
              </div>
              {tool === TOOLS.ERASER && (
                <>
                  <div className="h-6 w-px bg-border"></div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Size</span>
                    <select value={eraserSize} onChange={(e) => setEraserSize(Number(e.target.value))} className="bg-transparent text-sm font-medium outline-none cursor-pointer">
                      <option value={16}>Small</option>
                      <option value={32}>Medium</option>
                      <option value={64}>Large</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Zoom & Helper (Bottom Right) */}
        <div className="absolute bottom-6 right-6 z-40 flex items-center gap-2">
          <div className="glass-card flex items-center p-1 border-border shadow-soft">
            <button className="p-1.5 hover:bg-bg-light rounded transition-colors"><IconMinus className="w-3.5 h-3.5" /></button>
            <span className="px-2 text-[10px] font-bold text-text-muted w-12 text-center">{zoomLabel}</span>
            <button className="p-1.5 hover:bg-bg-light rounded transition-colors"><IconPlus className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="absolute inset-0 z-0 bg-white group">
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-crosshair"
            onPointerDown={pointerDown}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
            onPointerLeave={pointerUp}
          />
        </div>
      </main>

      {/* Connection Status Footnote */}
      <footer className="h-6 bg-white border-t border-border flex items-center justify-between px-3 text-[10px] text-text-muted z-40 font-medium">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${socketId ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
          {socketId ? `Connected as ${socketId}` : 'Connecting...'}
        </div>
        <div>
          Press <kbd className="font-sans px-1 rounded bg-bg-light border border-border">V</kbd> for Select • <kbd className="font-sans px-1 rounded bg-bg-light border border-border">P</kbd> for Pencil
        </div>
      </footer>
    </div>
  );
}

// Sub-components
function ToolBtn({ active, onClick, icon, title }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all transform active:scale-90 ${active ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:bg-primary/5 hover:text-primary'}`}
      title={title}
    >
      {React.cloneElement(icon, { className: `w-5 h-5 ${active ? 'text-white' : ''}` })}
    </button>
  );
}

// Icons
const IconPencil = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
const IconEraser = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-9 2 2-9 9-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M18 19h4M3 13a4 4 0 014-4h.172a2 2 0 011.414.586l10.828 10.828a2 2 0 010 2.828l-3 3a2 2 0 01-2.828 0L3.586 16.414A2 2 0 013 15V13z" /></svg>;
const IconSquare = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /></svg>;
const IconCircle = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>;
const IconArrow = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>;
const IconLine = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 19L19 5" /></svg>;
const IconText = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 7V4h16v3M9 20h6M12 4v16" /></svg>;
const IconImage = () => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /><circle cx="9" cy="9" r="2" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 15-3.086-3.086a2 2 0 00-2.828 0L6 21" /></svg>;
const IconDownload = ({ className }) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const IconTrash = ({ className }) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconPlus = ({ className }) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const IconMinus = ({ className }) => <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>;
