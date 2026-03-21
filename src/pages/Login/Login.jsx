import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import karupattiHero from "../../assets/karupatti_hero.png";
import "./Login.css";

/* ── tiny inline SVG icons (no extra dep) ─────────────────── */
const IconCoffee = () => (
  <svg
    aria-hidden="true"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);

const IconUser = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconLock = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconEye = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconAlert = () => (
  <svg
    aria-hidden="true"
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ══════════════════════════════════════════════════════════ */
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    setError(null);

    const result = await login(username, password);
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Login failed. Please try again.");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="login-root" role="main">
      {/* ── LEFT PANEL ───────────────────────────────────────── */}
      <section
        className="login-left"
        aria-label="Karupatti Coffee brand showcase"
      >
        <img
          src={karupattiHero}
          alt="Karupatti coffee in a traditional brass tumbler with steam rising"
          className="hero-img"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-pattern" aria-hidden="true" />

        {/* blobs */}
        <div className="blob blob-1" aria-hidden="true" />
        <div className="blob blob-2" aria-hidden="true" />

        {/* hero branding */}
        <div className="hero-content">
          {/* steam wisps */}
          <div className="steam-container" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="steam-wisp" />
            ))}
          </div>

          {/* title */}
          <h1
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-0.01em",
              textShadow: "0 2px 20px rgba(0,0,0,0.4)",
            }}
          >
            Karupatti
            <br />
            <span style={{ color: "#deb887" }}>Coffee</span>
          </h1>

          {/* decorative divider */}
          <div className="hero-divider" aria-hidden="true">
            <span />
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
            <span />
          </div>

          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)",
              fontWeight: 400,
              color: "rgba(253,246,236,0.85)",
              margin: "0 0 0.5rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Authentic Taste of Tradition
          </p>

          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.82rem",
              color: "rgba(222,184,135,0.7)",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            Karupatti Coffee — Crafted with heritage &amp; heart
          </p>
        </div>
      </section>

      {/* ── RIGHT PANEL ──────────────────────────────────────── */}
      <section className="login-right" aria-label="Login form">
        <div className="login-card">
          {/* Card logo */}
          <div className="card-logo">
            <div className="card-logo-icon" aria-hidden="true">
              <IconCoffee />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#2d1400",
                }}
              >
                Karupatti Coffee
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.72rem",
                  color: "#a0522d",
                  letterSpacing: "0.05em",
                }}
              >
                TEA SHOP POS
              </p>
            </div>
          </div>

          {/* Headings */}
          <h2
            style={{
              margin: "0 0 0.3rem",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#1a0a00",
            }}
          >
            Welcome back 👋
          </h2>
          <p
            style={{
              margin: "0 0 1.6rem",
              fontSize: "0.85rem",
              color: "#6b7280",
            }}
          >
            Sign in to your account to continue
          </p>

          {/* Error */}
          {error && (
            <div className="error-alert" role="alert" aria-live="assertive">
              <IconAlert /> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="field-wrap">
              <label htmlFor="username">Username / Email</label>
              <span className="field-icon">
                <IconUser />
              </span>
              <input
                id="username"
                name="username"
                type="text"
                className="field-input"
                placeholder="Enter your username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-required="true"
                aria-label="Username or email address"
              />
            </div>

            {/* Password */}
            <div className="field-wrap">
              <label htmlFor="password">Password</label>
              <span className="field-icon">
                <IconLock />
              </span>
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                className="field-input"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-required="true"
                aria-label="Password"
              />
              <button
                type="button"
                className="pwd-toggle"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>

            {/* Remember + Forgot */}
            {/* <div className="options-row">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  aria-label="Remember me"
                />
                Remember me
              </label>
              <a href="#" className="forgot-link" aria-label="Forgot your password?">
                Forgot password?
              </a>
            </div> */}

            {/* Login CTA */}
            <button
              type="submit"
              className="btn-login"
              disabled={loading}
              aria-busy={loading}
              aria-label="Login"
            >
              {loading ? (
                <span className="spinner" aria-label="Signing in…" />
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          {/* <div className="form-divider" aria-hidden="true">
            or
          </div> */}

          {/* Secondary CTA */}
          {/* <p className="signup-row">
            Don't have an account?
            <a href="#" className="signup-link" aria-label="Create a new account">
              Create an account
            </a>
          </p> */}
        </div>
      </section>
    </div>
  );
};

export default Login;
