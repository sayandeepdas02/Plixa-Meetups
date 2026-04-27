import React, { memo, useState } from "react";
import ChatMessageList from "../chat/ChatMessageList.jsx";
import ChatInputBar from "../chat/ChatInputBar.jsx";

const RightPanel = memo(function RightPanel({
  open,
  onClose,
  messages,
  socketId,
  connected,
  onSend,
  participants,
}) {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className={`hidden md:flex flex-col border-l border-border/60 bg-background shadow-soft transition-all duration-300 ease-in-out overflow-hidden flex-none z-30 ${
          open ? "w-80" : "w-0"
        }`}
        style={{ willChange: "width" }}
      >
        {open && (
          <PanelContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            messages={messages}
            socketId={socketId}
            connected={connected}
            onSend={onSend}
            onClose={onClose}
            participants={participants}
          />
        )}
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden absolute inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-right-full duration-300">
          <PanelContent
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            messages={messages}
            socketId={socketId}
            connected={connected}
            onSend={onSend}
            onClose={onClose}
            participants={participants}
          />
        </div>
      )}
    </>
  );
});

function PanelContent({
  activeTab,
  setActiveTab,
  messages,
  socketId,
  connected,
  onSend,
  onClose,
  participants,
}) {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-border bg-background flex-none w-full">
        <span className="font-bold tracking-tight text-foreground text-[11px] uppercase tracking-[0.2em]">Collaboration</span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          title="Close panel"
        >
          <IconX className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 border-b border-border bg-muted/30">
        <TabBtn label="Chat" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
        <TabBtn label="Active" badge={participants.length} active={activeTab === "participants"} onClick={() => setActiveTab("participants")} />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative w-full bg-background">
        {activeTab === "chat" && (
          <div className="absolute inset-0 flex flex-col w-full h-full">
            <ChatMessageList messages={messages} socketId={socketId} />
            <ChatInputBar onSend={onSend} disabled={!connected} />
          </div>
        )}

        {activeTab === "participants" && (
          <div className="absolute inset-0 overflow-y-auto p-6 flex flex-col gap-3">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">In this board ({participants.length})</h4>
            {participants.map((pid, i) => {
              const isMe = pid === socketId;
              const name = isMe ? "You" : `User ${pid.slice(0, 4)}`;
              
              return (
                <div key={pid} className="flex items-center gap-4 p-3 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted transition-all duration-300">
                  <div className="w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold shadow-sm">
                    {name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold tracking-tight text-foreground flex items-center gap-2">
                      {name} {isMe && <span className="text-[9px] bg-foreground/10 text-muted-foreground px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Me</span>}
                    </span>
                    <span className="text-[10px] text-green-500 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span> Online
                    </span>
                  </div>
                </div>
              );
            })}
            
            {participants.length === 0 && (
              <div className="flex flex-col items-center justify-center h-60 text-muted-foreground text-sm text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center border border-border/40 opacity-50">
                   <IconUsers className="w-8 h-8" />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60">
                  No other participants yet
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabBtn({ label, badge, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative py-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 focus:outline-none flex items-center gap-2.5 ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {badge !== undefined && (
        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${active ? "bg-foreground text-background" : "bg-muted text-muted-foreground border border-border/60"}`}>
          {badge}
        </span>
      )}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"></span>
      )}
    </button>
  );
}

export default RightPanel;

function IconX({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function IconUsers({ className }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
