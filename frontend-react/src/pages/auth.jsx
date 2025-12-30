// frontend-react/src/pages/auth.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from '../assets/logo.png';
import authBg from '../assets/auth-bg.png';

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
  const { signup, signin } = useAuth();

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

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Plixa Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold text-navy">Plixa</span>
          </Link>

          {/* Title */}
          <h1 className="text-4xl font-bold text-navy mb-2">
            {mode === "signup" ? "Sign up" : "Sign in"}
          </h1>
          <p className="text-text-muted mb-8">
            {mode === "signup"
              ? "Sign up to enjoy the feature of Plixa"
              : "Please login to continue to your account."}
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field (Sign Up Only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm text-text-muted mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jonas Khanwald"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                />
              </div>
            )}

            {/* Date of Birth (Sign Up Only) */}
            {mode === "signup" && (
              <div>
                <label className="block text-sm text-text-muted mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm text-text-muted mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jonas_kahnwald@gmail.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-text-muted mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy transition-colors"
                >
                  {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Keep Logged In (Sign In Only) */}
            {mode === "signin" && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="keepLoggedIn"
                  checked={keepLoggedIn}
                  onChange={(e) => setKeepLoggedIn(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <label htmlFor="keepLoggedIn" className="ml-2 text-sm text-text-main">
                  Keep me logged in
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait..." : mode === "signup" ? "Sign up" : "Sign in"}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-text-muted">or</span>
              </div>
            </div>

            {/* Google Sign In (UI Only) */}
            <button
              type="button"
              className="w-full py-3.5 px-4 rounded-xl border border-border bg-white hover:bg-bg-light transition-colors flex items-center justify-center gap-3 text-sm font-semibold text-text-main"
            >
              <IconGoogle className="w-5 h-5" />
              {mode === "signup" ? "Continue with Google" : "Sign in with Google"}
            </button>

            {/* Toggle Mode */}
            <p className="text-center text-sm text-text-muted mt-6">
              {mode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={toggleMode} className="text-primary font-semibold hover:underline">
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Need an account?{" "}
                  <button type="button" onClick={toggleMode} className="text-primary font-semibold hover:underline">
                    Create one
                  </button>
                </>
              )}
            </p>
          </form>

          {/* Back to Home */}
          <div className="mt-8 pt-6 border-t border-border">
            <Link to="/" className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors flex items-center justify-center gap-1">
              <IconArrowBack className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Blue Wave Background */}
      <div className="hidden lg:block lg:w-3/5 relative overflow-hidden">
        <img
          src={authBg}
          alt="Abstract waves"
          className="absolute inset-0 w-full h-full object-cover"
        />
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
