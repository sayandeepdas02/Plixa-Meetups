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
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 z-40 shadow-sm flex-none w-full">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Logo" className="h-7 w-auto" />
          <span className="font-bold text-foreground hidden sm:block">Plixa</span>
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
              className="text-sm font-semibold text-foreground bg-secondary border border-primary/20 rounded px-2 py-1 outline-none ring-2 ring-primary/20 transition-all w-[150px]"
            />
          ) : (
            <span
              onClick={() => setIsEditingName(true)}
              className="text-sm font-semibold text-foreground truncate max-w-[150px] cursor-text hover:bg-secondary px-2 py-1 rounded transition-colors -ml-2"
              title="Click to rename"
            >
              {localName}
            </span>
          )}

          <div className="flex items-center gap-1.5 opacity-80">
            {saveStatus === "Saving..." ? (
              <div className="w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-green-500">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
            <span className="text-[10px] font-medium text-muted-foreground hidden sm:block">{saveStatus}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Participants Avatars */}
        <div className="hidden md:flex items-center -space-x-2">
          {displayParticipants.map((pid, i) => (
            <div
              key={pid}
              className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-border shadow-sm transform hover:-translate-y-1 hover:z-10 transition-all cursor-default"
              title={pid === socketId ? "You" : `User ${pid.slice(0, 4)}`}
            >
              {pid === socketId ? "You" : pid.slice(0, 2).toUpperCase()}
            </div>
          ))}
          {extraParticipantsCount > 0 && (
            <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground ring-1 ring-border shadow-sm">
              +{extraParticipantsCount}
            </div>
          )}
          {participants.length === 0 && (
            <div className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary ring-1 ring-border shadow-sm">
              You
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-border hidden sm:block"></div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center gap-1.5 sm:gap-2">
            <button
            onClick={onShare}
            className="hidden sm:flex btn-secondary py-1.5 px-3 sm:px-4 text-[11px] sm:text-xs font-semibold h-8"
            >
            Share
            </button>

            <button
            onClick={webrtc.isInCall ? webrtc.leaveCall : webrtc.joinCall}
            className={`flex items-center justify-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all shadow-sm active:scale-95 ${
                webrtc.isInCall
                ? "bg-red-500 hover:bg-red-600 text-white border border-red-600"
                : "bg-primary hover:bg-primary-hover text-white border border-primary"
            }`}
            title={webrtc.isInCall ? "Leave call" : "Join voice & video call"}
            >
            <IconCallBtn className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{webrtc.isInCall ? "Leave" : "Join Call"}</span>
            </button>

            <div className="h-4 w-px bg-border hidden sm:block"></div>

            <button
            onClick={onChatToggle}
            className={`relative p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                chatOpen
                ? "bg-primary/10 text-primary"
                : "hover:bg-secondary text-muted-foreground hover:text-foreground"
            }`}
            title={chatOpen ? "Close panel" : "Open collaboration panel"}
            >
            <IconChat className="w-4 h-4" />
            {!chatOpen && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {unreadCount > 9 ? "9+" : unreadCount}
                </span>
            )}
            </button>
        </div>
      </div>
    </header>
  );
}
