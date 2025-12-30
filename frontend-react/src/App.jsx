import react from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";

import Landing from "./pages/landing";
import Board from "./pages/board";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <main className="min-h-[calc(100vh-48px)]">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/board" element={<Board />} />
            <Route path="/board/:roomId" element={<Board />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
