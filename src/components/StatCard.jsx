import React from "react";

export default function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  theme = "emerald", 
  subtitle,
  onClick
}) {
  const iconColors = {
    emerald: { bg: "#ecfdf5", color: "#059669" },
    danger: { bg: "#fef2f2", color: "#dc2626" },
    safe: { bg: "#f0fdf4", color: "#16a34a" },
    amber: { bg: "#fffbeb", color: "#d97706" }
  };

  const style = iconColors[theme] || iconColors.emerald;

  return (
    <div 
      className={`stat-card ${theme}`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div>
        <div className="stat-val">{value}</div>
        <div className="stat-lbl">{label}</div>
        {subtitle && (
          <div style={{ fontSize: "0.74rem", color: "#94a3b8", marginTop: "2px", fontWeight: 500 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div 
        className="stat-icon" 
        style={{ backgroundColor: style.bg, color: style.color }}
      >
        <Icon size={24} />
      </div>
    </div>
  );
}
