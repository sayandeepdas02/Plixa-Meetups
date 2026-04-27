// frontend-react/src/pages/auth.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/logo.png';
import authBg from '../assets/auth-bg.png';
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from '@react-oauth/google';

export default function Auth() {
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup, signin, googleSignin } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const validateForm = () => {
    if (mode === "signup") {
      if (!formData.name.trim()) {
        setError("Name is required");
        return false;
      }
      if (!formData.dateOfBirth) {
        setError("Date of birth is required");
        return false;
      }
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      let result;
      if (mode === "signup") {
        result = await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth
        });
      } else {
        result = await signin({
          email: formData.email,
          password: formData.password
        });
      }

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error || "Authentication failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError("");
    setFormData({ name: "", email: "", password: "", dateOfBirth: "" });
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        const result = await googleSignin(tokenResponse.access_token);
        if (result.success) {
          navigate("/dashboard");
        } else {
          setError(result.error || "Google authentication failed");
        }
      } catch (err) {
        setError("Something went wrong with Google sign-in.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError("Google authentication was canceled or failed.");
    }
  });

  return (
    <div className="min-h-screen flex font-sans bg-background text-foreground overflow-hidden">
      {/* Left Side - Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative z-10 border-r border-border">
        <div className="w-full max-w-[400px]">
          {/* Logo & Navigation */}
          <Link to="/" className="inline-flex items-center gap-2.5 mb-12 group">
            <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center group-hover:opacity-90 transition-opacity">
               <img src={logo} alt="P" className="w-5 h-auto invert dark:invert-0" />
            </div>
            <span className="text-lg font-bold tracking-tight">Plixa</span>
          </Link>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight mb-3">
              {mode === "signup" ? "Create an account" : "Sign in to Plixa"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {mode === "signup"
                ? "Enter your details below to get started with your workspace."
                : "Enter your email below to access your collaborative boards."}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className="field-input"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="field-input"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="field-input"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
                {mode === "signin" && (
                  <button type="button" className="text-[11px] font-medium text-brand-blue hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="field-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "signin" && (
              <div className="flex items-center ml-1 py-1">
                <input
                  type="checkbox"
                  id="keepLoggedIn"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-foreground focus:ring-foreground/20"
                />
                <label htmlFor="keepLoggedIn" className="ml-2.5 text-xs font-medium text-muted-foreground cursor-pointer">
                  Keep me logged in
                </label>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              variant="brand"
              className="w-full h-11 text-sm font-semibold mt-6"
            >
              {loading ? "Processing..." : mode === "signup" ? "Sign Up" : "Sign In"}
            </Button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest font-bold">
                <span className="px-4 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 gap-3 text-sm font-medium border-border"
              onClick={() => handleGoogleLogin()}
              disabled={loading}
            >
              <IconGoogle className="w-4 h-4" />
              Google
            </Button>
          </form>

          {/* Toggle Mode */}
          <p className="text-center text-sm text-muted-foreground mt-10">
            {mode === "signup" ? (
              <>
                Already have an account?{" "}
                <button type="button" onClick={toggleMode} className="text-foreground font-semibold hover:underline">
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button type="button" onClick={toggleMode} className="text-foreground font-semibold hover:underline">
                  Create one
                </button>
              </>
            )}
          </p>

          <footer className="mt-16 pt-8 border-t border-border flex flex-col items-center gap-4">
            <Link to="/" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
              <IconArrowBack className="w-3.5 h-3.5" />
              Back to main page
            </Link>
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] font-bold">
              © 2024 Plixa Technologies
            </p>
          </footer>
        </div>
      </div>

      {/* Right Side - Visual Area */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted relative items-center justify-center overflow-hidden pattern-dots">
        <div className="absolute inset-0 bg-gradient-to-br from-background/20 via-transparent to-background/20 z-0"></div>
        
        <div className="relative z-10 p-16 max-w-xl">
          <div className="space-y-6">
            <div className="w-12 h-1 px-0 bg-foreground mb-12"></div>
            <h2 className="text-5xl font-semibold tracking-tight leading-[1.1] text-foreground">
              Design, collaborate, <br />
              <span className="text-muted-foreground">and build together.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Join thousands of teams who use Plixa to visualize their ideas and streamline their creative workflows in real-time.
            </p>
            
            <div className="pt-12 grid grid-cols-2 gap-8 border-t border-border/60">
              <div>
                <p className="text-2xl font-semibold tracking-tight text-foreground">99.9%</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight text-foreground">10k+</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Daily Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative structural lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 w-full h-px bg-border/40"></div>
          <div className="absolute top-3/4 w-full h-px bg-border/40"></div>
          <div className="absolute left-1/4 h-full w-px bg-border/40"></div>
          <div className="absolute left-3/4 h-full w-px bg-border/40"></div>
        </div>
      </div>
    </div>
  );
}

// Icons
function IconEye({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function IconEyeOff({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function IconGoogle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function IconArrowBack({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}
