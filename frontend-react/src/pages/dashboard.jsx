// frontend-react/src/pages/dashboard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/logo.png';

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
    <div className="min-h-screen bg-bg-light">
      <nav className="h-16 border-b border-border bg-white flex items-center justify-between px-8 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <span className="font-bold text-navy">Plixa</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-muted hidden sm:block">Welcome, <span className="font-semibold text-navy">{user?.name || 'User'}</span></span>
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-premium border border-border py-2">
                <Link to="/settings" className="block px-4 py-2 text-sm text-text-main hover:bg-bg-light transition-colors">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-navy tracking-tight">Your Boards</h1>
            <p className="text-text-muted mt-2">Manage and collaborate on your real-time whiteboards.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/board/global" className="btn-secondary py-2 px-5 text-sm">Open Global Board</Link>
            <button onClick={() => document.getElementById('new-board-input').focus()} className="btn-primary py-2 px-5 text-sm">Create Board</button>
          </div>
        </header>

        <section className="mb-12">
          <form onSubmit={createBoard} className="glass-card p-6 flex items-center gap-4 max-w-2xl border-border">
            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
              <IconPlus className="w-6 h-6" />
            </div>
            <input
              id="new-board-input"
              className="flex-1 bg-transparent border-0 outline-none text-bg-navy placeholder:text-text-muted text-lg font-medium"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Give your new board a name..."
            />
            <button className="btn-primary py-2 px-6">Create</button>
          </form>
        </section>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
    <div className="group glass-card overflow-hidden hover:border-primary/30 transition-all border-border shadow-soft hover:shadow-premium">
      <div className="h-40 bg-white border-b border-border relative overflow-hidden flex items-center justify-center bg-[radial-gradient(#e2e8f0_1px,transparent_0)] bg-[size:16px_16px] opacity-80 group-hover:opacity-100 transition-opacity">
        {/* Abstract preview placeholder */}
        <div className="w-2/3 h-1/2 border-2 border-primary/10 rounded-lg rotate-3 group-hover:rotate-0 transition-transform"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
      </div>
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h3 className="font-bold text-navy truncate group-hover:text-primary transition-colors">{board.name}</h3>
          <p className="text-[10px] uppercase font-bold text-text-muted mt-1 tracking-wider">Last updated {board.updated}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/board/${board.id}`} className="btn-primary flex-1 py-1.5 text-xs">Open</Link>
          <button className="btn-secondary py-1.5 px-3 text-xs" title="Share Board">
            <IconShare className="w-3.5 h-3.5" />
          </button>
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
