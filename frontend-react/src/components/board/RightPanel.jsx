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
      <div className="flex items-center justify-between px-4 h-14 border-b border-border/60 bg-background flex-none w-full">
        <span className="font-semibold tracking-tight text-foreground text-sm">Collaboration Hub</span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          title="Close panel"
        >
          <IconX className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 border-b border-border/60 bg-secondary/30">
        <TabBtn label="Chat" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
        <TabBtn label="Active" badge={participants.length} active={activeTab === "participants"} onClick={() => setActiveTab("participants")} />
        {/* <TabBtn label="Activity" active={activeTab === "activity"} onClick={() => setActiveTab("activity")} /> */}
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
          <div className="absolute inset-0 overflow-y-auto p-4 flex flex-col gap-2">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">In this board ({participants.length})</h4>
            {participants.map((pid, i) => {
              const isMe = pid === socketId;
              const name = isMe ? "You" : `User ${pid.slice(0, 4)}`;
              // Generate a stable color based on socket ID
              const colors = ["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500", "bg-pink-500"];
              const colorClass = colors[i % colors.length];

              return (
                <div key={pid} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-border/50">
                  <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                      {name} {isMe && <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-medium">Me</span>}
                    </span>
                    <span className="text-[11px] text-green-500/80 flex items-center gap-1 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                    </span>
                  </div>
                </div>
              );
            })}
            
            {participants.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm text-center">
                <IconUsers className="w-8 h-8 text-muted-foreground/30 mb-2" />
                No other participants here yet.<br/>Share the board link!
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
      className={`relative py-3 px-3 text-xs font-semibold transition-colors focus:outline-none flex items-center gap-2 ${
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {badge !== undefined && (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${active ? "bg-primary/10 text-primary" : "bg-slate-200 text-slate-500"}`}>
          {badge}
        </span>
      )}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></span>
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
