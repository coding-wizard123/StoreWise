import React, { useState } from "react";
import { Sprout, Mail, Phone, Lock, ArrowLeft, AlertCircle, CheckCircle, KeyRound, Globe } from "lucide-react";
import { authService, isValidEmail, isValidIndianPhone, normalizePhoneNumber } from "../services/authService";
import { FIREBASE_CONFIGURED } from "../services/firebase";
import { translations, SUPPORTED_LANGUAGES } from "../translations/translations";

export default function ForgotPassword({
  onNavigateToLogin,
  language,
  setLanguage,
}) {
  const [method, setMethod] = useState("email"); // "email" | "phone"
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneStep, setPhoneStep] = useState("request"); // "request" | "verify"
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const t = translations[language] || translations.en;
  const at = t.auth || {};

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!isValidEmail(email)) {
      setError(at.errors?.invalidEmail || "Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await authService.recoverUsingEmail(email);
      setSuccessMessage(
        language === "ta" 
          ? "கடவுச்சொல் மீட்டெடுப்பு இணைப்பு உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டுள்ளது!"
          : "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      const errKey = err.message.replace("errors.", "");
      setError(at.errors?.[errKey] || at.errors?.authFailed || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const normalized = normalizePhoneNumber(phone);
    if (!isValidIndianPhone(normalized)) {
      setError(at.errors?.invalidPhone || "Please enter a valid 10-digit Indian phone number (+91)");
      return;
    }

    if (!FIREBASE_CONFIGURED) {
      setError(at.errors?.configError || "Firebase is not configured yet.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.requestPhoneRecoveryOtp(normalized, "recaptcha-container-forgot");
      setPhoneStep("verify");
      setSuccessMessage(at.otpSentSuccess || "OTP sent successfully via SMS.");
    } catch (err) {
      const errKey = err.message.replace("errors.", "");
      setError(at.errors?.[errKey] || at.errors?.smsFailed || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneVerifyAndReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!otp || otp.trim().length !== 6) {
      setError(at.errors?.otpRequired || "Please enter the 6-digit OTP code.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError(at.errors?.weakPassword || "Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(at.errors?.passwordMismatch || "Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyPhoneRecoveryOtp(otp.trim());
      await authService.resetPasswordByPhone(phone, newPassword);
      setSuccessMessage(at.passwordUpdated || "Password updated successfully! You can now log in.");
      setPhoneStep("done");
    } catch (err) {
      const errKey = err.message.replace("errors.", "");
      setError(at.errors?.[errKey] || at.errors?.invalidOtp || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
      {/* Invisible reCAPTCHA container for phone recovery */}
      <div id="recaptcha-container-forgot" />

      <div
        className="card"
        style={{
          maxWidth: "460px",
          width: "100%",
          padding: "2rem 1.75rem",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Back Link */}
        <button
          type="button"
          onClick={onNavigateToLogin}
          style={{
            background: "none",
            border: "none",
            color: "#64748b",
            fontSize: "0.82rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "1rem",
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          <span>{at.backToLogin || "Back to Login"}</span>
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
              borderRadius: "14px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 6px 16px rgba(16, 185, 129, 0.35)",
              marginBottom: "0.6rem",
            }}
          >
            <KeyRound size={26} strokeWidth={2.2} />
          </div>
          <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#064e3b" }}>
            {at.forgotTitle || "Recover Your Account"}
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "3px" }}>
            {at.forgotSubtitle || "Choose your preferred recovery method"}
          </p>
        </div>

        {/* Recovery Method Tabs */}
        {phoneStep !== "done" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              background: "#f1f5f9",
              padding: "4px",
              borderRadius: "12px",
              marginBottom: "1.25rem",
            }}
          >
            <button
              type="button"
              onClick={() => { setMethod("email"); setError(""); setSuccessMessage(""); }}
              style={{
                border: "none",
                borderRadius: "9px",
                padding: "0.55rem 0.5rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                background: method === "email" ? "white" : "transparent",
                color: method === "email" ? "#065f46" : "#64748b",
                boxShadow: method === "email" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
              }}
            >
              <Mail size={15} />
              <span>{at.recoverUsingEmail || "Email"}</span>
            </button>
            <button
              type="button"
              onClick={() => { setMethod("phone"); setError(""); setSuccessMessage(""); }}
              style={{
                border: "none",
                borderRadius: "9px",
                padding: "0.55rem 0.5rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
                background: method === "phone" ? "white" : "transparent",
                color: method === "phone" ? "#065f46" : "#64748b",
                boxShadow: method === "phone" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
              }}
            >
              <Phone size={15} />
              <span>{at.recoverUsingPhone || "Phone OTP"}</span>
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              padding: "0.65rem 0.85rem",
              borderRadius: "10px",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              marginBottom: "1rem",
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              background: "#ecfdf5",
              border: "1px solid #6ee7b7",
              color: "#065f46",
              padding: "0.65rem 0.85rem",
              borderRadius: "10px",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              marginBottom: "1rem",
            }}
          >
            <CheckCircle size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ─── Mode 1: Email Recovery ─── */}
        {method === "email" && phoneStep !== "done" && (
          <form onSubmit={handleEmailSubmit}>
            <p style={{ fontSize: "0.82rem", color: "#475569", marginBottom: "1rem" }}>
              {at.emailResetDesc || "Receive a secure password reset link to your registered email."}
            </p>
            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>
                {at.email || "Email Address"}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder={at.emailPlaceholder || "farmer@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: "2.4rem", fontSize: "0.92rem" }}
                  autoComplete="email"
                />
                <Mail
                  size={16}
                  style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: "100%", padding: "0.8rem", fontSize: "0.92rem", fontWeight: 800 }}
            >
              {isLoading ? "Sending..." : (at.sendResetEmailBtn || "Send Password Reset Link")}
            </button>
          </form>
        )}

        {/* ─── Mode 2: Phone OTP Recovery ─── */}
        {method === "phone" && phoneStep === "request" && (
          <form onSubmit={handlePhoneRequestOtp}>
            <p style={{ fontSize: "0.82rem", color: "#475569", marginBottom: "1rem" }}>
              {at.phoneResetDesc || "Verify your registered mobile number via SMS OTP to set a new password."}
            </p>
            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>
                {at.phone || "Phone Number"}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: "2.4rem", fontSize: "0.92rem" }}
                  autoComplete="tel"
                />
                <Phone
                  size={16}
                  style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !FIREBASE_CONFIGURED}
              style={{ width: "100%", padding: "0.8rem", fontSize: "0.92rem", fontWeight: 800 }}
            >
              {isLoading ? (at.sendingOtp || "Sending OTP…") : (at.sendPhoneOtpBtn || "Send Recovery OTP")}
            </button>
          </form>
        )}

        {/* ─── Mode 2 Step 2: Verify OTP and Set New Password ─── */}
        {method === "phone" && phoneStep === "verify" && (
          <form onSubmit={handlePhoneVerifyAndReset}>
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>
                {at.enterOtp || "Enter 6-digit OTP"}
              </label>
              <input
                type="text"
                maxLength={6}
                className="form-input"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                style={{ textAlign: "center", fontSize: "1.25rem", letterSpacing: "0.3em", fontWeight: 800 }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>
                {at.newPassword || "New Password"}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  className="form-input"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ paddingLeft: "2.4rem", fontSize: "0.92rem" }}
                />
                <Lock
                  size={16}
                  style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>
                {at.confirmNewPassword || "Confirm New Password"}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: "2.4rem", fontSize: "0.92rem" }}
                />
                <Lock
                  size={16}
                  style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: "100%", padding: "0.8rem", fontSize: "0.92rem", fontWeight: 800 }}
            >
              {isLoading ? (at.verifying || "Verifying…") : (at.updatePasswordBtn || "Update Password")}
            </button>
          </form>
        )}

        {/* ─── Mode 2 Step 3: Success state ─── */}
        {phoneStep === "done" && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.8rem", fontSize: "0.95rem", fontWeight: 800 }}
            >
              {at.backToLogin || "Back to Login"}
            </button>
          </div>
        )}

        {/* Language Selector */}
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
              cursor: "pointer",
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
