import React from "react";
import { Eye, ShoppingBag, Trash2, Calendar, Thermometer, Droplets, Warehouse, AlertTriangle } from "lucide-react";
import { translations } from "../translations/translations";

export default function RecentRecordsTable({ 
  records = [], 
  onViewRecord, 
  onFindMarketForCrop, 
  onDeleteRecord, 
  language = "en" 
}) {
  const t = translations[language] || translations.en;
  const d = t.dashboard || {};

  if (!records || records.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#f0fdf4", color: "#16a34a", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
          🌱
        </div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}>
          {d.noRecords || "No storage records found. Start by analyzing a crop!"}
        </h3>
        <p style={{ fontSize: "0.88rem", color: "#64748b", maxWidth: "420px", margin: "0 auto 1.25rem" }}>
          {language === "ta" 
            ? "உங்கள் பயிர் சேமிப்பு நிலையை பதிவு செய்து அழுகல் அபாயத்தை முன்கூட்டியே கணிக்கவும்." 
            : "Record your harvest batches and monitor their micro-climate to prevent post-harvest spoilage."}
        </p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "1.25rem 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a" }}>
            {d.recentRecords || d.recentAnalyses || "Recent Storage Batches"}
          </h3>
          <p style={{ fontSize: "0.82rem", color: "#64748b" }}>
            {language === "ta" ? "நேரடி சேமிப்பு நிலவரம் மற்றும் இடர் எச்சரிக்கைகள்" : "Active post-harvest storage inventory and risk status"}
          </p>
        </div>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#047857", background: "#d1fae5", padding: "4px 10px", borderRadius: "999px" }}>
          {records.length} {language === "ta" ? "தொகுப்புகள்" : "Active Batches"}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {records.map((rec) => {
          const cropName = language === "ta" ? (rec.cropNameTa || rec.cropName) : rec.cropName;
          const isHigh = rec.riskLevel === "HIGH";
          const isMed = rec.riskLevel === "MEDIUM";

          let borderTheme = "#86efac";
          let bgTheme = "#ffffff";
          if (isHigh) {
            borderTheme = "#fca5a5";
            bgTheme = "#fff5f5";
          } else if (isMed) {
            borderTheme = "#fde68a";
            bgTheme = "#fffdf5";
          }

          return (
            <div
              key={rec.id}
              style={{
                border: `1px solid ${borderTheme}`,
                background: bgTheme,
                borderRadius: "14px",
                padding: "1rem 1.25rem",
                display: "grid",
                gridTemplateColumns: "auto 1fr auto auto",
                alignItems: "center",
                gap: "1.25rem",
                transition: "transform 0.15s, box-shadow 0.15s"
              }}
            >
              {/* Crop Icon */}
              <div
                style={{
                  fontSize: "2rem",
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                  border: "1px solid #e2e8f0"
                }}
              >
                {rec.cropIcon || "🌱"}
              </div>

              {/* Crop Info */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
                    {cropName}
                  </h4>
                  <span style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
                    • {rec.quantity} {rec.quantityUnit || "kg"}
                  </span>
                  <span style={{ fontSize: "0.75rem", background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>
                    {rec.storageType}
                  </span>
                </div>

                {/* Sub details: Temp, Humidity, Storage Age */}
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.35rem", fontSize: "0.78rem", color: "#64748b", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Thermometer size={14} color="#ea580c" />
                    <strong>{rec.temperature}°C</strong>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Droplets size={14} color="#0284c7" />
                    <strong>{rec.humidity}% RH</strong>
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Calendar size={14} />
                    {rec.storageDays} {language === "ta" ? "நாட்கள் சேமிப்பு" : "days stored"}
                  </span>
                  <span style={{ color: "#0f172a", fontWeight: 600 }}>
                    {language === "ta" ? "விவசாயி: " : "Farmer: "} {rec.farmerName || "Farmer"}
                  </span>
                </div>
              </div>

              {/* Spoilage Risk Badge & Safe Days */}
              <div style={{ textAlign: "right", minWidth: "140px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.25rem" }}>
                  <span className={`badge-risk ${rec.riskLevel}`}>
                    {rec.riskLevel === "HIGH" && <AlertTriangle size={12} />}
                    {rec.riskLevel} • {rec.riskScore}/100
                  </span>
                </div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: isHigh ? "#dc2626" : isMed ? "#b45309" : "#15803d" }}>
                  ⏱️ {language === "ta" ? "பாதுகாப்பான சேமிப்பு: " : "Safe remaining: "}
                  <strong>{rec.safeDaysRemaining} {language === "ta" ? "நாட்கள்" : rec.safeDaysRemaining === 1 ? "day" : "days"}</strong>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <button
                  className="btn btn-secondary"
                  style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}
                  onClick={() => onViewRecord(rec)}
                  title={t.dashboard.viewDetails}
                >
                  <Eye size={14} />
                  <span>{language === "ta" ? "ஆய்வு" : "View"}</span>
                </button>

                {isHigh && (
                  <button
                    className="btn btn-amber"
                    style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem", fontWeight: 700 }}
                    onClick={() => onFindMarketForCrop(rec)}
                    title={t.dashboard.findBuyers}
                  >
                    <ShoppingBag size={14} />
                    <span>{language === "ta" ? "விற்பனை" : "Sell"}</span>
                  </button>
                )}

                <button
                  className="btn"
                  style={{ padding: "0.45rem 0.6rem", background: "transparent", color: "#94a3b8", border: "none" }}
                  onClick={() => onDeleteRecord(rec.id)}
                  title={t.dashboard.deleteBatch}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
