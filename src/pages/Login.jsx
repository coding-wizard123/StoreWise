import React, { useState } from "react";
import { Sprout, Lock, User, Sparkles, Globe, ArrowRight, AlertCircle, Phone } from "lucide-react";
import { authService } from "../services/authService";
import { translations, SUPPORTED_LANGUAGES } from "../translations/translations";

export default function Login({ 
  onLoginSuccess, 
  onNavigateToSignup, 
  onNavigateToForgot, 
  language, 
  setLanguage 
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language] || translations.en;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError(t.auth.errors.required);
      return;
    }

    setIsLoading(true);
    try {
      const user = await authService.login(identifier, password);
      onLoginSuccess(user);
    } catch (err) {
      const errKey = err.message.replace("errors.", "");
      setError(t.auth.errors[errKey] || t.auth.errors.authFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const demoUser = authService.loginDemoUser();
    onLoginSuccess(demoUser);
  };

  return (
    <div style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
      {/* Mobile-First Login Card */}
      <div 
        className="card" 
        style={{ 
          maxWidth: "440px", 
          width: "100%", 
          padding: "2rem 1.75rem", 
          borderRadius: "20px", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0"
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ width: "54px", height: "54px", background: "linear-gradient(135deg, #10b981 0%, #047857 100%)", borderRadius: "16px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 6px 16px rgba(16, 185, 129, 0.35)", marginBottom: "0.75rem" }}>
            <Sprout size={30} strokeWidth={2.4} />
          </div>
          <h1 style={{ fontSize: "1.65rem", fontWeight: 800, color: "#064e3b", letterSpacing: "-0.02em" }}>
            StoreWise
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600, marginTop: "2px" }}>
            {t.tagline}
          </p>
        </div>

        {/* Title */}
        <div style={{ marginBottom: "1.25rem" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
            {t.auth.loginTitle}
          </h2>
          <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "2px" }}>
            {t.auth.loginSubtitle}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: "0.65rem 0.85rem", borderRadius: "10px", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email or Phone */}
          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label" style={{ fontSize: "0.82rem" }}>
              {t.auth.emailOrPhone}
            </label>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-input"
                placeholder={t.auth.emailOrPhonePlaceholder}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                style={{ paddingLeft: "1rem", fontSize: "0.92rem" }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
              <label className="form-label" style={{ fontSize: "0.82rem", marginBottom: 0 }}>
                {t.auth.password}
              </label>
              <button
                type="button"
                onClick={onNavigateToForgot}
                style={{ background: "none", border: "none", color: "#059669", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", padding: 0 }}
              >
                {t.auth.forgotPasswordLink}
              </button>
            </div>
            <input
              type="password"
              className="form-input"
              placeholder={t.auth.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{ fontSize: "0.92rem" }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.8rem", fontSize: "0.95rem", fontWeight: 800, marginTop: "0.5rem" }}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : t.auth.loginBtn}
          </button>
        </form>

        {/* 1-Click Demo Login Button */}
        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className="btn btn-amber"
            onClick={handleDemoLogin}
            style={{ width: "100%", padding: "0.75rem", fontSize: "0.88rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
          >
            <Sparkles size={16} />
            <span>{t.auth.demoLogin}</span>
          </button>
        </div>

        {/* Create Account Link */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid #f1f5f9" }}>
          <button
            type="button"
            onClick={onNavigateToSignup}
            style={{ background: "none", border: "none", color: "#047857", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer" }}
          >
            {t.auth.needAccount}
          </button>
        </div>

        {/* Language Selector Footer */}
        <div style={{ marginTop: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <Globe size={14} color="#64748b" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: "#f8fafc",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "4px 10px",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#334155",
              cursor: "pointer"
            }}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.label})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
