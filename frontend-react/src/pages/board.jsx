import React, { useRef, useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useWebRTC } from "../hooks/useWebRTC.js";

// Layout & UI Components
import Navbar from "../components/board/Navbar";
import Toolbar from "../components/board/Toolbar";
import ContextToolbar from "../components/board/ContextToolbar";
import ZoomControls from "../components/board/ZoomControls";
import RightPanel from "../components/board/RightPanel";
import ContextMenu from "../components/board/ContextMenu";
import VideoGrid from "../components/webrtc/VideoGrid.jsx";

const BACKEND = import.meta.env.VITE_BACKEND || "http://127.0.0.1:8080";

const TOOLS = {
  CURSOR: "cursor",
  HAND: "hand",
  PENCIL: "pencil",
  ERASER: "eraser",
  RECT: "rect",
  SQUARE: "square",
  CIRCLE: "circle",
  LINE: "line",
  ARROW: "arrow",
  TEXT: "text",
  STICKY: "sticky",
};

function uid(prefix = "el") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function Board() {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!roomId) {
      const newId = uid("board");
      navigate(`/board/${newId}`, { replace: true });
    }
  }, [roomId, navigate]);

  const drawingRef = useRef(false);
  const startPosRef = useRef(null);
  const pathBufferRef = useRef([]);
  const elementsRef = useRef([]); // Store elements for redrawing
  
  // Selection & Drag Refs
  const selectedElementIdRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const originalElementStateRef = useRef(null);

  // --- Board UI State ---
  const [boardName, setBoardName] = useState("Untitled Board");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [tool, setTool] = useState(TOOLS.CURSOR);
  const [color, setColor] = useState("#2563eb");
  const [thickness, setThickness] = useState(4);
  const [eraserSize, setEraserSize] = useState(24);
  
  // Viewport state (Infinite canvas)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  
  // Right Panel & Chat
  const [chatOpen, setChatOpen] = useState(() => window.innerWidth >= 768);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Network State
  const [socketId, setSocketId] = useState("");
  const [participants, setParticipants] = useState([]);
  const [remoteCursors, setRemoteCursors] = useState({});

  // Command Menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const webrtc = useWebRTC(socketRef, roomId);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input/textarea
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      if (e.key === " ") setIsSpacePressed(true);

      // Tool shortcuts
      if (e.key === "/") {
        e.preventDefault();
        // Position menu in center if opened via keyboard only
        setMenuPos({ x: window.innerWidth / 2 - 100, y: window.innerHeight / 2 - 100 });
        setMenuOpen(true);
      }
      if (e.key.toLowerCase() === "v") setTool(TOOLS.CURSOR);
      if (e.key.toLowerCase() === "h") setTool(TOOLS.HAND);
      if (e.key.toLowerCase() === "p") setTool(TOOLS.PENCIL);
      if (e.key.toLowerCase() === "e") setTool(TOOLS.ERASER);
      if (e.key.toLowerCase() === "r") setTool(TOOLS.RECT);
      if (e.key.toLowerCase() === "o") setTool(TOOLS.CIRCLE);
      if (e.key.toLowerCase() === "a") setTool(TOOLS.ARROW);
      if (e.key.toLowerCase() === "l") setTool(TOOLS.LINE);
      if (e.key.toLowerCase() === "t") setTool(TOOLS.TEXT);
      if (e.key.toLowerCase() === "s") setTool(TOOLS.STICKY);
      
      // Zoom shortcuts
      if (e.shiftKey && e.key === "1") fitToScreen();
      if (e.shiftKey && e.key === "0") centerCanvas();
    };

    const handleKeyUp = (e) => {
      if (e.key === " ") {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Use Spacebar OR Hand tool to pan
  const currentMode = isSpacePressed ? TOOLS.HAND : tool;
  const cursorStyle = currentMode === TOOLS.HAND 
    ? (isPanning ? "cursor-grabbing" : "cursor-grab") 
    : (currentMode === TOOLS.CURSOR ? "cursor-default" : "cursor-crosshair");

  // --- Socket setup ---
  useEffect(() => {
    const s = io(BACKEND, { transports: ["websocket", "polling"] });
    socketRef.current = s;

    s.on("connect", () => {
      setSocketId(s.id || "");
      if (roomId) s.emit("join", { boardId: roomId });
    });

    s.on("whiteboard-state", (elements) => {
      elementsRef.current = elements || [];
      redrawCanvas();
    });

    s.on("element:created", ({ element }) => {
      if (!element) return;
      const exists = elementsRef.current.some(e => e.id === element.id);
      if (!exists) elementsRef.current.push(element);
      redrawCanvas();
    });

    s.on("element:update", ({ element }) => {
      if (!element) return;
      const index = elementsRef.current.findIndex(e => e.id === element.id);
      if (index !== -1) {
        elementsRef.current[index] = element;
      } else {
        elementsRef.current.push(element);
      }
      redrawCanvas();
    });

    s.on("clear", () => {
      elementsRef.current = [];
      redrawCanvas();
    });

    s.on("presence", ({ id, action, members }) => {
      if (members) setParticipants(members);
      else {
        setParticipants((prev) => {
          if (action === "joined") return [...new Set([...prev, id])];
          if (action === "left") return prev.filter((p) => p !== id);
          return prev;
        });
      }
    });

    // Cursor tracking
    s.on("cursor:move", ({ id, x, y }) => {
      setRemoteCursors(prev => ({ ...prev, [id]: { x, y } }));
    });
    s.on("cursor:leave", ({ id }) => {
      setRemoteCursors(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    });

    // Chat events
    s.on("chat:history", (history) => setMessages(Array.isArray(history) ? history : []));
    s.on("chat:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setChatOpen((currentlyOpen) => {
        if (!currentlyOpen) setUnreadCount((c) => c + 1);
        return currentlyOpen;
      });
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  // --- Canvas setup ---
  const getCtx = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!ctx || !canvas) return;

    ctx.save();
    // Use devicePixelRatio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply pan and zoom
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw grid
    drawGrid(ctx, canvas, pan, zoom);

    // Draw elements
    elementsRef.current.forEach((el) => {
      ctx.save();
      renderElement(ctx, el);
      ctx.restore();
    });
    
    // Draw current active preview line (if drawing)
    if (drawingRef.current && (tool === TOOLS.PENCIL || tool === TOOLS.ERASER) && pathBufferRef.current.length > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pathBufferRef.current[0].x, pathBufferRef.current[0].y);
      for (let i = 1; i < pathBufferRef.current.length; i++) {
        ctx.lineTo(pathBufferRef.current[i].x, pathBufferRef.current[i].y);
      }
      if (tool === TOOLS.ERASER) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = eraserSize;
        ctx.strokeStyle = "rgba(0,0,0,1)";
      } else {
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw Selection Bounding Box
    if (selectedElementIdRef.current) {
      const selectedEl = elementsRef.current.find(e => e.id === selectedElementIdRef.current);
      if (selectedEl) {
        const bounds = getElementBounds(selectedEl);
        ctx.save();
        ctx.strokeStyle = "#2563eb"; // primary blue
        ctx.lineWidth = 1.5 / zoom;
        ctx.setLineDash([5 / zoom, 5 / zoom]);
        const pad = 4;
        ctx.strokeRect(bounds.minX - pad, bounds.minY - pad, (bounds.maxX - bounds.minX) + pad*2, (bounds.maxY - bounds.minY) + pad*2);
        
        // Corner handles
        ctx.setLineDash([]);
        ctx.fillStyle = "#fff";
        const handleSize = 6 / zoom;
        const drawHandle = (hx, hy) => {
            ctx.strokeRect(hx - handleSize/2, hy - handleSize/2, handleSize, handleSize);
            ctx.fillRect(hx - handleSize/2, hy - handleSize/2, handleSize, handleSize);
        };
        drawHandle(bounds.minX - pad, bounds.minY - pad);
        drawHandle(bounds.maxX + pad, bounds.minY - pad);
        drawHandle(bounds.minX - pad, bounds.maxY + pad);
        drawHandle(bounds.maxX + pad, bounds.maxY + pad);
        
        ctx.restore();
      }
    }
    
    ctx.restore();
  }, [pan, zoom, tool, color, thickness, eraserSize, getCtx]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas, pan, zoom]);

  useEffect(() => {
    if (tool !== TOOLS.CURSOR) {
        selectedElementIdRef.current = null;
        isDraggingRef.current = false;
        redrawCanvas();
    }
  }, [tool, redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;
    
    const resizeRow = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width = `${container.clientWidth}px`;
      canvas.style.height = `${container.clientHeight}px`;
      redrawCanvas();
    });
    resizeRow.observe(container);
    return () => resizeRow.disconnect();
  }, [redrawCanvas]);

  const drawGrid = (ctx, canvas, pan, zoom) => {
    // Subtle infinite dotted grid
    const gridSize = 30; // base grid size
    const dotRadius = 1 / zoom; // keep dots small even when zoomed
    
    // Calculate visible area in world coordinates
    const left = -pan.x / zoom;
    const top = -pan.y / zoom;
    const width = (canvas.width / (window.devicePixelRatio || 1)) / zoom;
    const height = (canvas.height / (window.devicePixelRatio || 1)) / zoom;
    
    const startX = Math.floor(left / gridSize) * gridSize;
    const startY = Math.floor(top / gridSize) * gridSize;

    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    for (let x = startX; x < left + width; x += gridSize) {
      for (let y = startY; y < top + height; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const renderElement = (ctx, el) => {
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
        const x2 = el.x + el.w, y2 = el.y + el.h, angle = Math.atan2(y2 - el.y, x2 - el.x), len = 12;
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
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      }
    } else if (el.type === "text") {
      ctx.fillStyle = el.fill || "#000";
      ctx.font = `${el.fontSize || 20}px "Inter", sans-serif`;
      ctx.textBaseline = "top";
      ctx.fillText(el.text || "", el.x, el.y);
    } else if (el.type === "sticky") {
      ctx.fillStyle = el.fill || "#fae27a"; // Sticky yellow
      ctx.shadowColor = "rgba(0,0,0,0.1)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.fillRect(el.x, el.y, el.w, el.h);
      ctx.shadowColor = "transparent";
      
      ctx.fillStyle = "#333";
      ctx.font = `16px "Inter", sans-serif`;
      ctx.textBaseline = "top";
      
      // Simple word wrap
      const words = (el.text || "").split(' ');
      let line = '';
      let y = el.y + 16;
      for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        if (metrics.width > el.w - 32 && n > 0) {
          ctx.fillText(line, el.x + 16, y);
          line = words[n] + ' ';
          y += 24;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, el.x + 16, y);
    } else if (el.type === "image" && el.src) {
      // Draw cached image or load it
      if (!el._img) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => { el._img = img; redrawCanvas(); };
        img.src = el.src;
      } else {
        ctx.drawImage(el._img, el.x, el.y, el.w, el.h);
      }
    }
  };

  // Convert screen coordinates to world coordinates
  const getPosFromEvent = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    return { x, y };
  };

  const getElementBounds = (el) => {
    if (["rect", "image", "sticky", "text", "ellipse", "line", "arrow"].includes(el.type)) {
      const minX = Math.min(el.x, el.x + (el.w || 0));
      const maxX = Math.max(el.x, el.x + (el.w || 0));
      const minY = Math.min(el.y, el.y + (el.h || 0));
      const maxY = Math.max(el.y, el.y + (el.h || 0));
      if (el.type === "text") {
        const estW = (el.text || "").length * ((el.fontSize || 20) * 0.6);
        return { minX: el.x, maxX: el.x + estW, minY: el.y, maxY: el.y + (el.fontSize || 20) };
      }
      return { minX, maxX, minY, maxY };
    } else if (el.type === "pencil" || el.type === "eraser") {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      if (el.path && el.path.length > 0) {
        el.path.forEach(p => {
          if (p.x < minX) minX = p.x;
          if (p.x > maxX) maxX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.y > maxY) maxY = p.y;
        });
        return { minX, maxX, minY, maxY };
      }
    }
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  };

  const hitTest = (x, y, el) => {
    const bounds = getElementBounds(el);
    const padding = 10;
    return (
      x >= bounds.minX - padding &&
      x <= bounds.maxX + padding &&
      y >= bounds.minY - padding &&
      y <= bounds.maxY + padding
    );
  };

  // --- Handlers ---
  const handlePointerDown = (e) => {
    if (e.button === 2) return; // ignore right click
    
    // Close context menu if open
    if (menuOpen) setMenuOpen(false);

    if (currentMode === TOOLS.HAND) {
      setIsPanning(true);
      startPosRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
      return;
    }
    
    const pos = getPosFromEvent(e);
    startPosRef.current = pos;

    if (currentMode === TOOLS.CURSOR) {
        let hitElement = null;
        // Reverse iterate to click top-most items first
        for (let i = elementsRef.current.length - 1; i >= 0; i--) {
            const el = elementsRef.current[i];
            if (hitTest(pos.x, pos.y, el)) {
                hitElement = el;
                break;
            }
        }

        if (hitElement) {
            selectedElementIdRef.current = hitElement.id;
            isDraggingRef.current = true;
            originalElementStateRef.current = JSON.parse(JSON.stringify(hitElement));
            dragOffsetRef.current = { x: pos.x, y: pos.y };
        } else {
            selectedElementIdRef.current = null;
            isDraggingRef.current = false;
        }
        redrawCanvas();
        return;
    }

    drawingRef.current = true;
    
    if (tool === TOOLS.PENCIL || tool === TOOLS.ERASER) {
      pathBufferRef.current = [pos];
    } else if (tool === TOOLS.TEXT || tool === TOOLS.STICKY) {
      const text = window.prompt("Enter text:");
      if (text?.trim()) {
        const el = { 
          id: uid(tool), 
          type: tool, 
          x: pos.x, 
          y: pos.y, 
          w: tool === TOOLS.STICKY ? 200 : undefined,
          h: tool === TOOLS.STICKY ? 200 : undefined,
          text, 
          fill: tool === TOOLS.STICKY ? "#fae27a" : color, 
          fontSize: 20 
        };
        elementsRef.current.push(el);
        redrawCanvas();
        socketRef.current?.emit("element:create", { element: el });
      }
      drawingRef.current = false;
    }
  };

  const handlePointerMove = (e) => {
    // Throttle cursor emit
    if (e.buttons === 0 && socketRef.current?.connected) {
        const pos = getPosFromEvent(e);
        socketRef.current.emit("cursor", pos); // assuming backend supports Relay
    }

    if (isPanning && startPosRef.current) {
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      setPan({ x: startPosRef.current.panX + dx, y: startPosRef.current.panY + dy });
      return;
    }

    const pos = getPosFromEvent(e);

    if (currentMode === TOOLS.CURSOR) {
        if (isDraggingRef.current && selectedElementIdRef.current) {
            const dx = pos.x - dragOffsetRef.current.x;
            const dy = pos.y - dragOffsetRef.current.y;
            
            const elIndex = elementsRef.current.findIndex(el => el.id === selectedElementIdRef.current);
            if (elIndex !== -1) {
                const el = elementsRef.current[elIndex];
                const original = originalElementStateRef.current;
                
                if (el.type === "pencil" || el.type === "eraser") {
                    if (original.path) {
                        el.path = original.path.map(p => ({ x: p.x + dx, y: p.y + dy }));
                    }
                } else {
                    el.x = original.x + dx;
                    el.y = original.y + dy;
                }
                redrawCanvas();
            }
        }
        return;
    }

    if (!drawingRef.current) return;
    
    if (tool === TOOLS.PENCIL || tool === TOOLS.ERASER) {
      pathBufferRef.current.push(pos);
      redrawCanvas();
    } else {
      // Shape preview drawing
      redrawCanvas();
      const ctx = getCtx();
      ctx.save();
      ctx.setTransform(window.devicePixelRatio||1, 0, 0, window.devicePixelRatio||1, 0, 0);
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);
      
      const el = shapeElementFromPoints(tool, startPosRef.current, pos, color, thickness);
      if (el) renderElement(ctx, el);
      ctx.restore();
    }
  };

  const handlePointerUp = (e) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }
    
    if (currentMode === TOOLS.CURSOR) {
        if (isDraggingRef.current && selectedElementIdRef.current) {
            isDraggingRef.current = false;
            const el = elementsRef.current.find(e => e.id === selectedElementIdRef.current);
            if (el) {
                setSaveStatus("Saving...");
                socketRef.current?.emit("element:update", { element: el });
                setTimeout(() => setSaveStatus("Saved"), 500);
            }
        }
        return;
    }

    if (!drawingRef.current) return;
    drawingRef.current = false;

    const pos = getPosFromEvent(e);
    let el = null;

    if (tool === TOOLS.PENCIL || tool === TOOLS.ERASER) {
      el = {
        id: uid(tool),
        type: tool,
        path: pathBufferRef.current.slice(),
        stroke: color,
        strokeWidth: tool === TOOLS.ERASER ? eraserSize : thickness,
      };
    } else {
      el = shapeElementFromPoints(tool, startPosRef.current, pos, color, thickness);
    }

    if (el) {
      elementsRef.current.push(el);
      setSaveStatus("Saving...");
      socketRef.current?.emit("element:create", { element: el });
      setTimeout(() => setSaveStatus("Saved"), 500);
    }
    
    pathBufferRef.current = [];
    redrawCanvas();
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      e.preventDefault();
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      const newZoom = Math.max(0.1, Math.min(5, zoom * (1 + delta)));
      
      // Zoom towards mouse
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomPointX = (mouseX - pan.x) / zoom;
      const zoomPointY = (mouseY - pan.y) / zoom;
      
      setPan({
        x: mouseX - zoomPointX * newZoom,
        y: mouseY - zoomPointY * newZoom
      });
      setZoom(newZoom);
    } else {
      // Pan
      e.preventDefault();
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  };

  function shapeElementFromPoints(toolName, a, b, colorVal, widthVal) {
    if (!a || !b) return null;
    const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
    const w = Math.abs(b.x - a.x), h = Math.abs(b.y - a.y);
    if (toolName === TOOLS.RECT) return { id: uid("rect"), type: "rect", x, y, w, h, stroke: colorVal, strokeWidth: widthVal };
    if (toolName === TOOLS.CIRCLE) return { id: uid("circle"), type: "ellipse", x: a.x <= b.x ? a.x : a.x - Math.max(w,h), y: a.y <= b.y ? a.y : a.y - Math.max(w,h), w: Math.max(w,h), h: Math.max(w,h), stroke: colorVal, strokeWidth: widthVal };
    if (toolName === TOOLS.LINE || toolName === TOOLS.ARROW) return { id: uid(toolName), type: toolName, x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y, stroke: colorVal, strokeWidth: widthVal };
    return null;
  }

  // --- Actions ---
  const handleClear = () => {
    if (!window.confirm("Clear entire whiteboard? This action cannot be undone.")) return;
    elementsRef.current = [];
    socketRef.current?.emit("clear");
    redrawCanvas();
  };

  const handleUploadChange = (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const w = Math.min(img.width, 400);
        const h = (img.height / img.width) * w;
        // place center screen
        const rect = canvasRef.current.getBoundingClientRect();
        const ctrX = ((rect.width/2) - pan.x)/zoom;
        const ctrY = ((rect.height/2) - pan.y)/zoom;
        
        const el = { id: uid("img"), type: "image", x: ctrX - w/2, y: ctrY - h/2, w, h, src: reader.result };
        elementsRef.current.push(el);
        redrawCanvas();
        socketRef.current?.emit("element:create", { element: el });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const centerCanvas = () => { setPan({x:0, y:0}); setZoom(1); };
  const fitToScreen = () => {
    // Basic fit for now
    centerCanvas();
  };

  // Chat send
  const handleChatSend = useCallback((message) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit("chat:send", { message, senderName: user?.name || "Anonymous" });
  }, [user]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-light font-sans text-text-main relative select-none">
      
      <Navbar 
        boardName={boardName}
        onBoardNameChange={(n) => { setBoardName(n); setSaveStatus("Saving..."); setTimeout(()=>setSaveStatus("Saved"), 500); }}
        saveStatus={saveStatus}
        participants={participants}
        socketId={socketId}
        onShare={() => { navigator.clipboard.writeText(window.location.href); alert("Copied to clipboard!"); }}
        webrtc={webrtc}
        chatOpen={chatOpen}
        unreadCount={unreadCount}
        onChatToggle={() => setChatOpen(!chatOpen)}
        onExport={() => {}}
      />

      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 relative overflow-hidden bg-background">
          
          <Toolbar 
            tool={currentMode} 
            setTool={setTool} 
            onClear={handleClear} 
            fileInputRef={fileInputRef} 
            onUploadChange={handleUploadChange} 
          />
          
          <ContextToolbar 
            tool={currentMode}
            color={color}
            setColor={setColor}
            thickness={thickness}
            setThickness={setThickness}
            eraserSize={eraserSize}
            setEraserSize={setEraserSize}
          />

          <ZoomControls 
            zoom={zoom}
            setZoom={setZoom}
            onFit={fitToScreen}
            onCenter={centerCanvas}
          />

          {/* Canvas Wrapper */}
          <div ref={canvasContainerRef} className="absolute inset-0 z-0 overflow-hidden" 
               onContextMenu={(e) => { e.preventDefault(); setMenuPos({x: e.clientX, y: e.clientY}); setMenuOpen(true); }}>
            
            <canvas
              ref={canvasRef}
              className={`w-full h-full block touch-none ${cursorStyle}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onWheel={handleWheel}
            />

            {/* Remote Cursors Overlay */}
            {Object.entries(remoteCursors).map(([id, pos]) => (
                <div key={id} className="absolute pointer-events-none z-10 transition-transform duration-100 ease-linear"
                     style={{ transform: `translate(${pos.x * zoom + pan.x}px, ${pos.y * zoom + pan.y}px)` }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444" stroke="white" strokeWidth="2" strokeLinejoin="round">
                        <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 01.35-.15h6.87a.5.5 0 00.35-.85L6.35 2.85a.5.5 0 00-.85.35z"/>
                    </svg>
                    <span className="ml-4 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white shadow-sm whitespace-nowrap">
                        User {id.slice(0,4)}
                    </span>
                </div>
            ))}
            
            {/* Empty State Overlay */}
            {elementsRef.current.length === 0 && !drawingRef.current && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none opacity-50">
                    <p className="text-xl font-bold text-slate-400 mb-2">Infinite Whiteboard</p>
                    <p className="text-sm font-medium text-slate-400">Press <kbd className="font-mono bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-200 text-slate-500">/</kbd> to open quick actions</p>
                </div>
            )}
          </div>
        </main>

        <RightPanel 
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          messages={messages}
          socketId={socketId}
          connected={!!socketId}
          onSend={handleChatSend}
          participants={participants}
        />
      </div>

      <ContextMenu 
        isOpen={menuOpen}
        position={menuPos}
        onClose={() => setMenuOpen(false)}
        onSelectAction={(id) => setTool(id)}
        fileInputRef={fileInputRef}
      />

      {webrtc.isInCall && (
        <VideoGrid
          localStream={webrtc.localStream}
          remoteStreams={webrtc.remoteStreams}
          isMicOn={webrtc.isMicOn}
          isCamOn={webrtc.isCamOn}
          onMic={webrtc.toggleMic}
          onCam={webrtc.toggleCam}
          onLeave={webrtc.leaveCall}
          userName={user?.name || 'You'}
        />
      )}
    </div>
  );
}
