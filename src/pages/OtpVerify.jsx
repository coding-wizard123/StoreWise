import React, { useState, useEffect, useRef } from "react";
import { Shield, ArrowLeft, RefreshCw, CheckCircle, AlertCircle, Phone } from "lucide-react";
import { authService } from "../services/authService";
import { translations } from "../translations/translations";

/**
 * OtpVerify
 * ─────────
 * Renders the 6-digit OTP input screen.
 * Relies on Firebase ConfirmationResult already stored inside authService
 * (set by authService.requestSignupOtp). Calls authService.verifyOtpAndCreateAccount()
 * which confirms the code with Firebase and only then creates the local profile.
 *
 * Props:
 *   otpData        – { phone, signupData: { name, email, phone, password, language, location } }
 *   onVerifySuccess(user) – called after successful Firebase OTP confirmation
 *   onBack()       – navigate back to Signup form
 *   language       – active language code
 */
export default function OtpVerify({ otpData, onVerifySuccess, onBack, language }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  const t = translations[language] || translations.en;
  const at = t.auth || {};

  const isTest = Boolean(otpData?.isTestPhone);

  // Auto-focus first input on mount & set demo banner for test numbers
  useEffect(() => {
    inputs.current[0]?.focus();
    if (isTest) {
      setSuccessMsg(at.demoOtpEnabled || "Demo OTP verification enabled.");
    }
  }, [isTest]);

  // Countdown for "Resend OTP" cooldown
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ── Digit input handling ────────────────────────────────────────────────
  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setError("");

    if (value && index < 5) inputs.current[index + 1]?.focus();
    if (!value && index > 0) inputs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") handleVerify();
  };

  // ── Translate Firebase error key to display message ─────────────────────
  const translateError = (errMessage) => {
    const key = errMessage.replace("errors.", "");
    return (
      at.errors?.[key] ||
      // Fallback English descriptions for any unmapped key
      {
        recaptchaFailed: "reCAPTCHA verification failed. Please refresh and try again.",
        smsFailed: "SMS could not be sent. Please check your number and try again.",
        phoneAuthDisabled: "Phone authentication is not enabled. Enable it in Firebase Console.",
        unauthorizedDomain: "This domain is not authorized. Please use the deployed app.",
        smsQuotaExceeded: "SMS quota exceeded. Please use a test phone number in Firebase Console for demo mode.",
        tooManyRequests: "Too many requests. Please wait a few minutes and try again.",
        networkError: "Network error. Please check your internet connection.",
        configError: "Firebase is not configured. Please set up .env.local.",
        otpRequired: "Please enter the 6-digit OTP code.",
        otpExpired: "OTP session expired. Please go back and request a new OTP.",
      }[key] ||
      errMessage
    );
  };

  // ── Verify OTP with Firebase ────────────────────────────────────────────
  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length !== 6) {
      setError(at.errors?.otpRequired || "Please enter the 6-digit OTP code.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const user = await authService.verifyOtpAndCreateAccount(otpData, code);
      setSuccessMsg(at.otpVerified || "✓ Phone Verified");
      setTimeout(() => onVerifySuccess(user), 600);
    } catch (err) {
      setError(translateError(err.message));
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP (re-initialises reCAPTCHA → Firebase) ───────────────────
  const handleResend = async () => {
    if (isResending) return;
    setCanResend(false);
    setIsResending(true);
    setCountdown(60);
    setDigits(["", "", "", "", "", ""]);
    setError("");
    setSuccessMsg("");

    try {
      const res = await authService.resendOtp(otpData?.phone, "recaptcha-container-otp");
      if (res?.isTestPhone) {
        setSuccessMsg(at.demoOtpEnabled || "Demo OTP verification enabled.");
      } else {
        setSuccessMsg(at.otpSentSuccess || "OTP resent successfully. Please check your SMS.");
      }
    } catch (err) {
      setError(translateError(err.message));
      // Allow retry after a short delay even on failure
      setTimeout(() => setCanResend(true), 5000);
    } finally {
      setIsResending(false);
      inputs.current[0]?.focus();
    }
  };

  return (
    <div style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
      {/* Invisible reCAPTCHA container for Resend OTP */}
      <div id="recaptcha-container-otp" />

      <div
        className="card"
        style={{
          maxWidth: "420px",
          width: "100%",
          padding: "2rem 1.75rem",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
          textAlign: "center"
        }}
      >
        {/* Brand */}
        <div style={{ marginBottom: "1.25rem" }}>
          <div style={{ width: "54px", height: "54px", background: "linear-gradient(135deg,#10b981,#047857)", borderRadius: "16px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 6px 16px rgba(16,185,129,0.35)", marginBottom: "0.6rem" }}>
            <Shield size={28} strokeWidth={2.2} />
          </div>

          {/* Title & Subtitle based on whether this is a test phone number */}
          {isTest ? (
            <div>
              <h1 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#064e3b" }}>
                {at.demoOtpEnabled || "Demo OTP verification enabled."}
              </h1>
              <p style={{ fontSize: "0.83rem", color: "#475569", marginTop: "4px" }}>
                {at.enterTestCode || "Enter the verification code configured in Firebase Console for this test number."}
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#dbeafe", color: "#1e40af", padding: "3px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 700, marginTop: "6px" }}>
                <Phone size={12} />
                <span>{at.testPhoneBadge || "Firebase Test Number"}: {otpData?.phone}</span>
              </div>
            </div>
          ) : (
            <div>
              <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#064e3b" }}>
                {at.otpTitle || "Verify Your Phone"}
              </h1>
              <p style={{ fontSize: "0.83rem", color: "#64748b", marginTop: "4px" }}>
                {at.otpSubtitle || "A 6-digit OTP was sent to"}{" "}
                <strong style={{ color: "#047857" }}>{otpData?.phone || ""}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Developer / Demo Note */}
        <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "10px", padding: "8px 10px", fontSize: "0.73rem", color: "#475569", lineHeight: 1.4, marginBottom: "1.25rem", textAlign: "left" }}>
          ℹ️ <strong>Demo Note:</strong> {at.demoNote || "Real SMS requires a configured SMS billing/provider. Demo mode uses Firebase test numbers and does not send SMS."}
        </div>

        {/* Success Message */}
        {successMsg && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "0.6rem 0.85rem", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem", justifyContent: "center" }}>
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: "0.6rem 0.85rem", borderRadius: "10px", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem" }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* OTP Boxes */}
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1.5rem" }} onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`OTP digit ${i + 1}`}
              style={{
                width: "48px",
                height: "56px",
                textAlign: "center",
                fontSize: "1.4rem",
                fontWeight: 800,
                border: d ? "2px solid #10b981" : "2px solid #e2e8f0",
                borderRadius: "12px",
                outline: "none",
                color: "#064e3b",
                background: d ? "#ecfdf5" : "#f8fafc",
                transition: "all 0.15s",
                fontFamily: "inherit",
              }}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading || digits.join("").length !== 6}
          className="btn btn-primary"
          style={{ width: "100%", padding: "0.8rem", fontSize: "0.95rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
        >
          {isLoading ? (at.verifying || "Verifying…") : (
            <>
              <CheckCircle size={18} />
              {at.verifyOtp || "Verify OTP"}
            </>
          )}
        </button>

        {/* Resend */}
        <div style={{ marginTop: "1.25rem", fontSize: "0.82rem", color: "#64748b" }}>
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              style={{ background: "none", border: "none", color: "#059669", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
            >
              <RefreshCw size={13} />
              {isResending ? (at.resending || "Sending…") : (at.resendOtp || "Resend OTP")}
            </button>
          ) : (
            <span>{at.resendIn || "Resend in"} <strong>{countdown}s</strong></span>
          )}
        </div>

        {/* Back */}
        <button
          onClick={onBack}
          style={{ marginTop: "1rem", background: "none", border: "none", color: "#64748b", fontWeight: 600, cursor: "pointer", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
        >
          <ArrowLeft size={14} /> {at.back || "Back"}
        </button>
      </div>
    </div>
  );
}
