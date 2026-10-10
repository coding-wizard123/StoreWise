import React, { useState } from "react";
import { Sprout, Phone, Mail, User, Lock, MapPin, Globe, ArrowRight, AlertCircle, ShieldCheck, Sparkles } from "lucide-react";
import { authService, isValidEmail, isValidIndianPhone, normalizePhoneNumber, isFirebaseTestPhone, getFirebaseTestPhones } from "../services/authService";
import { FIREBASE_CONFIGURED } from "../services/firebase";
import { translations, SUPPORTED_LANGUAGES } from "../translations/translations";

export default function Signup({
  onOtpRequested,
  onNavigateToLogin,
  language,
  setLanguage
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    language: language || "en",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const t = translations[language] || translations.en;
  const at = t.auth || {};

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = at.errors?.required;
    if (!isValidEmail(formData.email)) errs.email = at.errors?.invalidEmail;
    if (!formData.phone.trim()) {
      errs.phone = at.errors?.phoneMandatory;
    } else if (!isValidIndianPhone(formData.phone)) {
      errs.phone = at.errors?.invalidPhone;
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = at.errors?.weakPassword;
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = at.errors?.passwordMismatch;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    try {
      const res = await authService.requestSignupOtp(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          language: formData.language,
          location: formData.location,
        },
        "recaptcha-container"
      );

      // Pass phone and isTestPhone flag to OtpVerify
      onOtpRequested({
        phone: res.phone,
        isTestPhone: res.isTestPhone,
        signupData: {
          ...formData,
          phone: res.phone,
          isTestPhone: res.isTestPhone,
        },
      });
    } catch (err) {
      const errKey = err.message.replace("errors.", "");
      const friendlyMsg = at.errors?.[errKey];
      setErrors({
        form: friendlyMsg || err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillTestPhone = () => {
    const defaultTestPhone = getFirebaseTestPhones()[0] || "+919876543210";
    setFormData((prev) => ({
      ...prev,
      phone: defaultTestPhone,
      name: prev.name || "Test Farmer",
      email: prev.email || "test.farmer@storewise.in",
      password: prev.password || "farmer123",
      confirmPassword: prev.confirmPassword || "farmer123",
    }));
  };

  const isTest = isFirebaseTestPhone(formData.phone);

  return (
    <div style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
      {/* Invisible reCAPTCHA container – must be in DOM when requestSignupOtp is called */}
      <div id="recaptcha-container" />

      <div
        className="card"
        style={{
          maxWidth: "460px",
          width: "100%",
          padding: "2rem 1.75rem",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0"
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
          <div style={{ width: "48px", height: "48px", background: "linear-gradient(135deg, #10b981 0%, #047857 100%)", borderRadius: "14px", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)", marginBottom: "0.5rem" }}>
            <Sprout size={26} strokeWidth={2.4} />
          </div>
          <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#064e3b" }}>
            StoreWise
          </h1>
        </div>

        <div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
            {at.signupTitle}
          </h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b", marginTop: "2px", marginBottom: "1.25rem" }}>
            {at.signupSubtitle}
          </p>
        </div>

        {/* Firebase config warning (developer-facing only) */}
        {!FIREBASE_CONFIGURED && (
          <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.8rem", marginBottom: "1.25rem", lineHeight: 1.5 }}>
            ⚠️ <strong>Firebase not configured.</strong> Open <code>.env.local</code> and fill in your Firebase project keys.
          </div>
        )}

        {/* Global Error Banner */}
        {errors.form && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", padding: "0.65rem 0.85rem", borderRadius: "10px", fontSize: "0.82rem", display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.25rem" }}>
            <AlertCircle size={16} />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: "0.85rem" }}>
            <label className="form-label" style={{ fontSize: "0.82rem" }}>
              {at.fullName} *
            </label>
            <input
              type="text"
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder={at.fullNamePlaceholder}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          {/* Email */}
          <div className="form-group" style={{ marginBottom: "0.85rem" }}>
            <label className="form-label" style={{ fontSize: "0.82rem" }}>
              {at.email} *
            </label>
            <input
              type="email"
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder={at.emailPlaceholder}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          {/* Mandatory Phone Number */}
          <div className="form-group" style={{ marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <label className="form-label" style={{ fontSize: "0.82rem", color: "#065f46", marginBottom: 0 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Phone size={14} color="#059669" />
                  <strong>{at.phone}</strong>
                </span>
              </label>
              {isTest && (
                <span style={{ background: "#dbeafe", color: "#1e40af", padding: "1px 6px", borderRadius: "5px", fontSize: "0.7rem", fontWeight: 700 }}>
                  ✓ {at.testPhoneBadge || "Firebase Test Number"}
                </span>
              )}
            </div>
            <input
              type="tel"
              inputMode="numeric"
              className={`form-input ${errors.phone ? "error" : ""}`}
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ fontWeight: 600, borderColor: isTest ? "#3b82f6" : "#a7f3d0" }}
            />
            {errors.phone ? (
              <div className="error-text">{errors.phone}</div>
            ) : (
              <div style={{ marginTop: "4px" }}>
                <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                  {at.phoneNote}
                </div>
                {/* 1-Click Fill Test Phone Number for Demo */}
                <button
                  type="button"
                  onClick={handleFillTestPhone}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#2563eb",
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    padding: 0,
                    marginTop: "3px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px"
                  }}
                >
                  <Sparkles size={12} />
                  <span>{at.useTestNumber || "Fill Test Phone Number (+91 98765 43210)"}</span>
                </button>
              </div>
            )}
            {/* Developer / Demo Note */}
            <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "8px", padding: "6px 8px", marginTop: "6px", fontSize: "0.72rem", color: "#64748b", lineHeight: 1.4 }}>
              ℹ️ <strong>Demo Note:</strong> {at.demoNote || "Real SMS requires a configured SMS billing/provider. Demo mode uses Firebase test numbers and does not send SMS."}
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="form-grid-2" style={{ marginBottom: "0.85rem" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>
                {at.password} *
              </label>
              <input
                type="password"
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="≥ 6 chars"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && <div className="error-text">{errors.password}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>
                {at.confirmPassword} *
              </label>
              <input
                type="password"
                className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
            </div>
          </div>

          {/* Preferred Language & District Grid */}
          <div className="form-grid-2" style={{ marginBottom: "1.25rem" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>
                {at.preferredLanguage}
              </label>
              <select
                className="form-select"
                value={formData.language}
                onChange={(e) => {
                  setFormData({ ...formData, language: e.target.value });
                  setLanguage(e.target.value);
                }}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName} ({l.label})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: "0.82rem" }}>
                {at.location}
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={at.locationPlaceholder}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          {/* Submit: Send OTP */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.85rem", fontSize: "0.95rem", fontWeight: 800 }}
            disabled={isLoading || !FIREBASE_CONFIGURED}
          >
            {isLoading ? (at.sendingOtp || "Sending OTP…") : (
              <>
                <span>{at.signupBtn || "Continue to Phone Verification"}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div style={{ textAlign: "center", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9" }}>
          <button
            type="button"
            onClick={onNavigateToLogin}
            style={{ background: "none", border: "none", color: "#047857", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}
          >
            {at.alreadyHaveAccount}
          </button>
        </div>
      </div>
    </div>
  );
}
