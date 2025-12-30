// frontend-react/src/pages/settings.jsx
import React, { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("Guest");
  const [email, setEmail] = useState("");
  const [dark, setDark] = useState(false);

  return (
    <div className={`min-h-screen p-6 ${dark ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>

        <section className="bg-white dark:bg-slate-800 p-4 rounded shadow mb-4">
          <h2 className="font-semibold mb-2">Profile</h2>
          <div className="grid gap-3">
            <input value={name} onChange={(e)=>setName(e.target.value)} className="border px-3 py-2 rounded" />
            <input value={email} onChange={(e)=>setEmail(e.target.value)} className="border px-3 py-2 rounded" placeholder="email@example.com" />
            <button className="w-max px-4 py-2 bg-indigo-600 text-white rounded">Save profile</button>
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Preferences</h2>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={dark} onChange={(e)=>setDark(e.target.checked)} />
            <span>Enable dark mode (local only)</span>
          </label>
        </section>
      </div>
    </div>
  );
}
