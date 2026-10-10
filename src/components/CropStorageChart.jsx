import React from "react";
import { AlertCircle, TrendingUp, Thermometer, Droplets } from "lucide-react";

export default function CropStorageChart({ records = [], language = "en" }) {
  // If no records, use default demo records
  const displayItems = records.length > 0 ? records.slice(0, 6) : [
    { cropName: "Tomato", cropNameTa: "தக்காளி", riskScore: 82, riskLevel: "HIGH" },
    { cropName: "Onion", cropNameTa: "வெங்காயம்", riskScore: 54, riskLevel: "MEDIUM" },
    { cropName: "Rice", cropNameTa: "நெல்", riskScore: 18, riskLevel: "LOW" },
  ];

  // 24-hr simulated environmental data points
  const hourlyData = [
    { hour: "06:00", temp: 24, hum: 82 },
    { hour: "09:00", temp: 27, hum: 76 },
    { hour: "12:00", temp: 32, hum: 68 },
    { hour: "15:00", temp: 34, hum: 64 },
    { hour: "18:00", temp: 29, hum: 74 },
    { hour: "21:00", temp: 26, hum: 80 },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
      {/* 1. Bar Chart: Crop Storage Risk Overview */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
              {language === "ta" ? "பயிர் சேமிப்பு இடர் கண்ணோட்டம்" : "Crop Storage Risk Overview"}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
              {language === "ta" ? "அழுகல் அபாய அளவு (0–100)" : "Comparative spoilage score index (0–100)"}
            </p>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, background: "#ecfdf5", color: "#065f46", padding: "3px 8px", borderRadius: "6px" }}>
            {displayItems.length} {language === "ta" ? "பயிர்கள்" : "Batches"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {displayItems.map((item, idx) => {
            const score = item.riskScore || 0;
            let barColor = "#16a34a"; // green
            let badgeBg = "#f0fdf4";
            let badgeText = "#166534";

            if (score >= 70) {
              barColor = "#dc2626";
              badgeBg = "#fef2f2";
              badgeText = "#991b1b";
            } else if (score >= 40) {
              barColor = "#d97706";
              badgeBg = "#fffbeb";
              badgeText = "#92400e";
            }

            const name = language === "ta" ? (item.cropNameTa || item.cropName) : item.cropName;

            return (
              <div key={item.id || idx}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.3rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span>{item.cropIcon || "🌱"}</span>
                    <span>{name}</span>
                  </span>
                  <span
                    style={{
                      background: badgeBg,
                      color: badgeText,
                      padding: "1px 8px",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      fontWeight: 800
                    }}
                  >
                    {score} / 100
                  </span>
                </div>
                {/* Horizontal Progress Bar */}
                <div style={{ width: "100%", height: "12px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${score}%`,
                      height: "100%",
                      background: barColor,
                      borderRadius: "999px",
                      transition: "width 0.8s ease-out"
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Micro-climate Environmental Trend */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
              {language === "ta" ? "24 மணி நேர சேமிப்பு சூழல் போக்கு" : "24-Hour Micro-Climate Trend"}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
              {language === "ta" ? "வெப்பநிலை & ஈரப்பத மாறுபாடுகள்" : "Storage facility ambient temp & humidity"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", fontWeight: 700 }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#ea580c" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ea580c" }}></span>
              Temp (°C)
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#0284c7" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0284c7" }}></span>
              RH (%)
            </span>
          </div>
        </div>

        {/* Mini SVG Trend Line */}
        <div style={{ padding: "0.5rem 0" }}>
          <svg viewBox="0 0 300 120" style={{ width: "100%", height: "110px", overflow: "visible" }}>
            {/* Grid lines */}
            <line x1="0" y1="20" x2="300" y2="20" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="60" x2="300" y2="60" stroke="#f1f5f9" strokeWidth="1" />
            <line x1="0" y1="100" x2="300" y2="100" stroke="#f1f5f9" strokeWidth="1" />

            {/* Temp line: 24, 27, 32, 34, 29, 26 (mapped to 0-300 x and 120-0 y) */}
            <polyline
              fill="none"
              stroke="#ea580c"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="10,85 65,72 125,50 185,42 245,62 290,75"
            />
            {/* Humidity line: 82, 76, 68, 64, 74, 80 */}
            <polyline
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.5"
              strokeDasharray="4 2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="10,30 65,42 125,58 185,68 245,46 290,34"
            />

            {/* Data points */}
            {[[10,85], [65,72], [125,50], [185,42], [245,62], [290,75]].map(([cx, cy], i) => (
              <circle key={`t-${i}`} cx={cx} cy={cy} r="3.5" fill="#ea580c" />
            ))}
            {[[10,30], [65,42], [125,58], [185,68], [245,46], [290,34]].map(([cx, cy], i) => (
              <circle key={`h-${i}`} cx={cx} cy={cy} r="3.5" fill="#0284c7" />
            ))}
          </svg>

          {/* Time axis labels */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "#94a3b8", marginTop: "4px" }}>
            {hourlyData.map((h, i) => (
              <span key={i}>{h.hour}</span>
            ))}
          </div>
        </div>

        {/* Current reading status */}
        <div style={{ marginTop: "0.75rem", background: "#f8fafc", padding: "0.6rem 0.85rem", borderRadius: "8px", display: "flex", justifyContent: "space-around", fontSize: "0.82rem", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Thermometer size={16} color="#ea580c" />
            <span>Peak: <strong>34°C</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Droplets size={16} color="#0284c7" />
            <span>Mean RH: <strong>74%</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
