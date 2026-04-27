import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { IconDownload, IconCallBtn, IconChat } from "./icons"; // We will create this icons file or keep them here

export default function Navbar({
  boardName = "Untitled Board",
  onBoardNameChange,
  saveStatus = "Saved", // "Saved" | "Saving..."
  participants = [],
  socketId,
  onShare,
  onExport,
  webrtc,
  chatOpen,
  unreadCount,
  onChatToggle,
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [localName, setLocalName] = useState(boardName);
  const nameInputRef = useRef(null);

  useEffect(() => {
    setLocalName(boardName);
  }, [boardName]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameSave = () => {
    setIsEditingName(false);
    if (localName.trim() !== boardName && onBoardNameChange) {
      onBoardNameChange(localName.trim() || "Untitled Board");
    } else {
      setLocalName(boardName);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleNameSave();
    if (e.key === "Escape") {
      setLocalName(boardName);
      setIsEditingName(false);
    }
  };

  // Up to 5 avatars
  const displayParticipants = participants.slice(0, 5);
  const extraParticipantsCount = Math.max(0, participants.length - 5);

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 z-40 flex-none w-full shadow-sm relative">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-all group">
          <div className="w-7 h-7 bg-foreground rounded flex items-center justify-center group-hover:scale-105 transition-transform">
             <img src={logo} alt="P" className="w-4 h-auto invert dark:invert-0" />
          </div>
          <span className="font-bold tracking-tight text-foreground hidden sm:block">Plixa</span>
        </Link>

        <div className="h-4 w-px bg-border mx-2 hidden md:block"></div>

        <div className="flex items-center gap-3">
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleNameSave}
              onKeyDown={handleKeyDown}
              className="text-sm font-semibold text-foreground bg-background border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary/20 transition-all w-[220px]"
            />
          ) : (
            <span
              onClick={() => setIsEditingName(true)}
              className="text-sm font-semibold text-foreground truncate max-w-[220px] cursor-text hover:bg-muted px-2.5 py-1.5 rounded-lg transition-colors -ml-2"
              title="Click to rename"
            >
              {localName}
            </span>
          )}

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/50 border border-border/40">
            {saveStatus === "Saving..." ? (
              <div className="w-3 h-3 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hidden sm:block">{saveStatus}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Participants Avatars */}
        <div className="hidden lg:flex items-center -space-x-2.5">
          {displayParticipants.map((pid, i) => (
            <div
              key={pid}
              className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-foreground ring-1 ring-border shadow-sm transform hover:-translate-y-1 hover:z-10 transition-all cursor-default"
              title={pid === socketId ? "You" : `User ${pid.slice(0, 4)}`}
            >
              {pid === socketId ? "Y" : pid.slice(0, 1).toUpperCase()}
            </div>
          ))}
          {extraParticipantsCount > 0 && (
            <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground ring-1 ring-border shadow-sm">
              +{extraParticipantsCount}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-border hidden sm:block"></div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center gap-2">
            <button
              onClick={onShare}
              className="hidden sm:flex btn-outline h-9 px-4 text-xs font-semibold"
            >
              Share
            </button>

            <button
              onClick={webrtc.isInCall ? webrtc.leaveCall : webrtc.joinCall}
              className={`flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 ${
                webrtc.isInCall
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-brand-blue text-white hover:bg-brand-blue-hover"
              }`}
            >
              <IconCallBtn className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{webrtc.isInCall ? "Leave" : "Join Call"}</span>
            </button>

            <div className="h-4 w-px bg-border hidden sm:block"></div>

            <button
              onClick={onChatToggle}
              className={`relative p-2.5 rounded-lg transition-all focus:outline-none ${
                chatOpen
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              title={chatOpen ? "Close panel" : "Open collaboration panel"}
            >
              <IconChat className="w-4 h-4" />
              {!chatOpen && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-blue text-white text-[9px] font-bold flex items-center justify-center border-2 border-background shadow-sm">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
        </div>
      </div>
    </header>
  );
}
