// frontend-react/src/pages/settings.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const [name, setName] = useState("Guest");
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="container mx-auto py-12 lg:py-20 max-w-3xl">
        <div className="mb-8">
          <Link to="/dashboard" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors inline-block mb-4">
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-5xl tracking-tighter font-regular">Settings</h1>
        </div>

        <section className="glass-card p-8 mb-8 border border-border">
          <h2 className="text-xl tracking-tight mb-6">Profile</h2>
          <div className="grid gap-4">
            <input 
              value={name} 
              onChange={(e)=>setName(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm" 
            />
            <input 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-border bg-background outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm" 
              placeholder="email@example.com" 
            />
            <Button className="w-max mt-2">Save profile</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
