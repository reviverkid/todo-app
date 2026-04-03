// src/components/Auth.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Auth() {
  const [mode, setMode]         = useState("login"); // "login" | "signup"
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const switchMode = (m) => { setMode(m); setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      const msg = err.message
        .replace("Firebase: ", "")
        .replace(/\(auth\/.*\)\.?/, "")
        .trim();
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-scene">
      {/* Animated background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="auth-card glass">
        {/* Logo */}
        <div className="auth-logo-wrap">
          <div className="auth-icon-ring">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l5.5 5.5L22 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="auth-brand">Taskflow</h1>
          <p className="auth-tagline">Focus. Flow. Finish.</p>
        </div>

        {/* Mode tabs */}
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === "login" ? "active" : ""}`}
            onClick={() => switchMode("login")}
            type="button"
          >Sign In</button>
          <button
            className={`mode-btn ${mode === "signup" ? "active" : ""}`}
            onClick={() => switchMode("signup")}
            type="button"
          >Sign Up</button>
          <span className="mode-slider" style={{ transform: mode === "signup" ? "translateX(100%)" : "translateX(0)" }} />
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email */}
          <div className="input-wrap">
            <span className="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </span>
            <input
              className="auth-input"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="input-wrap">
            <span className="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
              className="auth-input"
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
            <button type="button" className="pass-toggle" onClick={() => setShowPass(p => !p)}>
              {showPass ? "Hide" : "Show"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error-box">
              <span className="error-dot" />
              {error}
            </div>
          )}

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading ? (
              <span className="btn-spinner" />
            ) : (
              mode === "login" ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "Don't have an account? " : "Already have one? "}
          <button
            type="button"
            className="auth-switch-btn"
            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
