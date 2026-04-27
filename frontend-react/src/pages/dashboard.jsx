// frontend-react/src/pages/dashboard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/logo.png';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../components/theme-toggle";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [boards, setBoards] = useState([
    { id: "board_1", name: "Sprint Planning", updated: "2h ago" },
    { id: "board_2", name: "Product Roadmap", updated: "5h ago" },
    { id: "board_3", name: "Architecture Review", updated: "1d ago" },
  ]);
  const [name, setName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  function createBoard(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const id = `board_${Date.now()}`;
    setBoards([{ id, name, updated: "Just now" }, ...boards]);
    setName("");
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pattern-dots">
      <nav className="h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group">
          <div className="w-7 h-7 bg-foreground rounded flex items-center justify-center">
             <img src={logo} alt="P" className="w-4 h-auto invert dark:invert-0" />
          </div>
          <span className="font-bold tracking-tight text-foreground">Plixa</span>
        </Link>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <div className="h-4 w-px bg-border"></div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground hidden sm:block">
              <span className="text-foreground">{user?.name || 'User'}</span>
            </span>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-[10px] font-bold text-foreground hover:bg-border transition-colors"
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-premium border border-border py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <Link to="/settings" className="block px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors">
                    Settings
                  </Link>
                  <div className="h-px bg-border my-1.5"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-6xl py-12 px-6">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="section-badge mb-2">Workspace</div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">Your Boards</h1>
            <p className="text-muted-foreground text-sm max-w-md">
              Collaborate in real-time with your team on an infinite canvas.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/board/global">
               <Button variant="outline" className="h-10 text-xs">Global Board</Button>
            </Link>
            <Button className="h-10 text-xs" onClick={() => document.getElementById('new-board-input').focus()}>New Board</Button>
          </div>
        </header>

        <section className="mb-16">
          <form onSubmit={createBoard} className="bg-background border border-border rounded-xl p-4 flex items-center gap-4 max-w-2xl shadow-sm focus-within:border-foreground/20 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground">
              <IconPlus className="w-5 h-5" />
            </div>
            <input
              id="new-board-input"
              className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground/60 text-base font-medium"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter board title..."
            />
            <Button size="sm" className="h-9">Create</Button>
          </form>
        </section>

        <div className="screen-line !my-12"></div>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {boards.map(b => (
            <BoardCard key={b.id} board={b} />
          ))}
        </section>
      </div>
    </div>
  );
}

function BoardCard({ board }) {
  return (
    <div className="group border border-border rounded-xl bg-card overflow-hidden hover:border-foreground/20 transition-all duration-300 flex flex-col">
      <div className="h-44 bg-muted/30 border-b border-border relative overflow-hidden flex items-center justify-center pattern-dots opacity-60 group-hover:opacity-100 transition-opacity">
        <div className="w-3/4 h-3/4 border border-border bg-background rounded shadow-sm rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent"></div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-6 flex-1">
          <h3 className="text-base font-semibold tracking-tight text-foreground truncate group-hover:text-brand-blue transition-colors duration-300">
            {board.name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
              Updated {board.updated}
            </p>
          </div>
        </div>
        <div className="flex gap-2 pt-4 border-t border-border/50">
          <Link to={`/board/${board.id}`} className="flex-1">
             <Button size="sm" className="w-full h-8 text-[11px] font-bold uppercase tracking-wider">Open Board</Button>
          </Link>
          <Button size="icon" variant="outline" className="w-8 h-8 rounded-lg" title="Share Board">
            <IconShare className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function IconPlus({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
}

function IconShare({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
}
