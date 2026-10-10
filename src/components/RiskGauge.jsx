import React from "react";
import { AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";

export default function RiskGauge({ score = 0, level = "LOW", safeDays = 0, language = "en" }) {
  // Normalize score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score));

  // Determine stroke color & gradient
  let strokeColor = "#16a34a"; // green
  let badgeClass = "LOW";
  let labelEn = "LOW RISK";
  let labelTa = "குறைந்த இடர் (பாதுகாப்பானது)";
  let Icon = CheckCircle;

  if (normalizedScore >= 70) {
    strokeColor = "#dc2626"; // red
    badgeClass = "HIGH";
    labelEn = "HIGH RISK";
    labelTa = "அதிக இடர் (அவசர நடவடிக்கை)";
    Icon = ShieldAlert;
  } else if (normalizedScore >= 40) {
    strokeColor = "#d97706"; // amber
    badgeClass = "MEDIUM";
    labelEn = "MEDIUM RISK";
    labelTa = "நடுத்தர இடர் (கவனிக்கவும்)";
    Icon = AlertTriangle;
  }

  // Semi-circle SVG math
  const radius = 90;
  const circumference = Math.PI * radius; // 180 degree arc
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      <svg width="240" height="150" viewBox="0 0 240 150" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="riskGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <filter id="gaugeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Background Arc */}
        <path
          d="M 30 130 A 90 90 0 0 1 210 130"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Progress Arc */}
        <path
          d="M 30 130 A 90 90 0 0 1 210 130"
          fill="none"
          stroke="url(#riskGaugeGrad)"
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />

        {/* Center Indicator Text */}
        <text
          x="120"
          y="105"
          textAnchor="middle"
          fontSize="44"
          fontWeight="800"
          fill="#0f172a"
          style={{ fontFamily: "inherit" }}
        >
          {normalizedScore}
        </text>
        <text
          x="120"
          y="126"
          textAnchor="middle"
          fontSize="13"
          fontWeight="700"
          fill="#64748b"
          letterSpacing="0.05em"
        >
          / 100 SPOILAGE RISK
        </text>
      </svg>

      {/* Risk Level Badge */}
      <div style={{ marginTop: "-10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
        <div className={`badge-risk ${badgeClass}`} style={{ fontSize: "0.92rem", padding: "0.4rem 1rem" }}>
          <Icon size={16} />
          <span>{language === "ta" ? labelTa : labelEn}</span>
        </div>

        {/* Safe Storage Days Callout */}
        <div
          style={{
            background: normalizedScore >= 70 ? "#fef2f2" : normalizedScore >= 40 ? "#fffbeb" : "#f0fdf4",
            border: `1px solid ${normalizedScore >= 70 ? "#fca5a5" : normalizedScore >= 40 ? "#fde68a" : "#86efac"}`,
            borderRadius: "12px",
            padding: "0.45rem 1rem",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: normalizedScore >= 70 ? "#991b1b" : normalizedScore >= 40 ? "#92400e" : "#166534",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <span>⏱️ {language === "ta" ? "பாதுகாப்பான சேமிப்பு:" : "Estimated safe storage:"}</span>
          <span style={{ fontSize: "1.05rem", fontWeight: 800 }}>
            {safeDays} {language === "ta" ? "நாட்கள்" : safeDays === 1 ? "day" : "days"}
          </span>
        </div>
      </div>
    </div>
  );
}
