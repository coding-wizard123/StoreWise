import React, { useState } from "react";
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  ShoppingBag, 
  ArrowLeft, 
  Save, 
  BookmarkCheck, 
  Thermometer, 
  Droplets, 
  Calendar, 
  Warehouse,
  Wind,
  Layers,
  Clock,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import RiskGauge from "../components/RiskGauge";
import { translations } from "../translations/translations";

export default function RiskResult({ 
  result, 
  onSaveRecord, 
  onFindMarket, 
  onRecheck, 
  language = "en" 
}) {
  const [isSaved, setIsSaved] = useState(false);
  const t = translations[language];

  if (!result) return null;

  const cropName = language === "ta" ? (result.cropNameTa || result.cropName) : result.cropName;
  const isHigh = result.riskLevel === "HIGH";
  const isMed = result.riskLevel === "MEDIUM";

  const reasonsList = language === "ta" ? (result.reasonsTa || result.reasons) : result.reasons;
  const consequencesList = language === "ta" ? (result.consequencesTa || result.consequences) : result.consequences;
  const recommendationsList = result.recommendations || [];

  const handleSave = () => {
    onSaveRecord(result);
    setIsSaved(true);
  };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      {/* Top back button */}
      <div style={{ marginBottom: "1.25rem" }}>
        <button 
          onClick={onRecheck} 
          className="btn btn-secondary"
          style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}
        >
          <ArrowLeft size={16} />
          <span>{t.risk.actions.recheck}</span>
        </button>
      </div>

      {/* Main Result Card */}
      <div 
        className="card" 
        style={{ 
          padding: "2rem",
          borderTop: `6px solid ${isHigh ? "#dc2626" : isMed ? "#d97706" : "#16a34a"}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          marginBottom: "1.5rem"
        }}
      >
        {/* Header Crop Banner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "1.25rem", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ fontSize: "3rem", width: "68px", height: "68px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {result.cropIcon || "🍅"}
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {language === "ta" ? "பயிர் ஆய்வு முடிவு" : "Post-Harvest Storage Analysis"}
              </div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a" }}>
                {cropName}
              </h2>
              {result.quantity && (
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  {result.quantity} {result.quantityUnit || "kg"} • {language === "ta" ? "விவசாயி: " : "Farmer: "} {result.farmerName || "Farmer"}
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              {new Date(result.analyzedAt || Date.now()).toLocaleDateString(language === "ta" ? "ta-IN" : "en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
          </div>
        </div>

        {/* Risk Gauge Centerpiece */}
        <div style={{ padding: "1rem 0 2rem", borderBottom: "1px solid #e2e8f0", marginBottom: "1.75rem" }}>
          <RiskGauge 
            score={result.riskScore} 
            level={result.riskLevel} 
            safeDays={result.safeDaysRemaining} 
            language={language}
          />
        </div>

        {/* Environmental Snapshot Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Thermometer size={14} color="#ea580c" />
              {t.risk.temp}
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
              {result.temperature}°C
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Droplets size={14} color="#0284c7" />
              {t.risk.hum}
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
              {result.humidity}% RH
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Warehouse size={14} color="#059669" />
              {t.risk.storage}
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
              {result.storageType}
            </div>
          </div>

          <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Calendar size={14} color="#7c3aed" />
              {t.risk.storedSince}
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0f172a", marginTop: "4px" }}>
              {result.storageDays} {language === "ta" ? "நாட்கள்" : "days"}
            </div>
          </div>
        </div>

        {/* Section: Why is this risk level calculated? */}
        <div style={{ marginBottom: "1.75rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isHigh ? "#dc2626" : isMed ? "#d97706" : "#16a34a" }}></span>
            {t.risk.reasonsTitle}
          </h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", padding: 0 }}>
            {reasonsList.map((reason, idx) => (
              <li 
                key={idx} 
                style={{ 
                  background: isHigh ? "#fef2f2" : "#f8fafc", 
                  padding: "0.75rem 1rem", 
                  borderRadius: "10px", 
                  fontSize: "0.88rem", 
                  borderLeft: `4px solid ${isHigh ? "#ef4444" : "#cbd5e1"}`,
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.5rem"
                }}
              >
                <span>•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section: What happens if no action is taken? */}
        <div style={{ marginBottom: "1.75rem", background: isHigh ? "#fff1f2" : "#fffbeb", padding: "1.25rem", borderRadius: "14px", border: `1px solid ${isHigh ? "#fecdd3" : "#fde68a"}` }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: isHigh ? "#9f1239" : "#92400e", marginBottom: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <AlertTriangle size={18} />
            {t.risk.consequencesTitle}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.9rem", color: isHigh ? "#881337" : "#78350f" }}>
            {consequencesList.map((conseq, idx) => (
              <p key={idx} style={{ lineHeight: 1.45 }}>
                {conseq}
              </p>
            ))}
          </div>
        </div>

        {/* Section: Action Recommendations */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.85rem" }}>
            {t.risk.recommendationsTitle}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {recommendationsList.map((rec, idx) => {
              const text = language === "ta" ? (rec.actionTa || rec.action) : rec.action;
              const isCrit = rec.priority === "CRITICAL";

              return (
                <div
                  key={idx}
                  style={{
                    background: isCrit ? "#fef2f2" : "#f0fdf4",
                    border: `1px solid ${isCrit ? "#fca5a5" : "#bbf7d0"}`,
                    borderRadius: "12px",
                    padding: "0.85rem 1.15rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: isCrit ? "#fee2e2" : "#dcfce7", color: isCrit ? "#dc2626" : "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {isCrit ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                    </div>
                    <span style={{ fontSize: "0.92rem", fontWeight: 700, color: isCrit ? "#7f1d1d" : "#14532d" }}>
                      {text}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: "999px",
                      background: isCrit ? "#dc2626" : "#16a34a",
                      color: "white"
                    }}
                  >
                    {rec.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
          {/* Save to Batches */}
          <button
            className="btn btn-secondary"
            onClick={handleSave}
            disabled={isSaved}
            style={{ fontWeight: 700 }}
          >
            {isSaved ? (
              <>
                <BookmarkCheck size={18} color="#16a34a" />
                <span style={{ color: "#16a34a" }}>{t.risk.actions.saved}</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{t.risk.actions.saveRecord}</span>
              </>
            )}
          </button>

          {/* Find Market button */}
          <button
            className="btn btn-primary"
            onClick={() => onFindMarket(result)}
            style={{ fontWeight: 800, flex: 1 }}
          >
            <ShoppingBag size={18} />
            <span>{t.risk.actions.findMarket}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
