import React, { useState } from "react";
import { Bell, CheckCheck, Trash2, AlertTriangle, ShieldCheck, Clock, Check } from "lucide-react";
import { translations } from "../translations/translations";

export default function Alerts({ 
  alerts = [], 
  onMarkRead, 
  onMarkAllRead, 
  onClearRead, 
  onNavigateToRisk,
  language = "en" 
}) {
  const [filter, setFilter] = useState("all");
  const t = translations[language];

  // Filtering
  const filteredAlerts = alerts.filter((alt) => {
    if (filter === "high") return alt.riskLevel === "HIGH";
    if (filter === "unread") return !alt.isRead;
    return true;
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div style={{ maxWidth: "880px", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">
            <Bell size={30} color="#059669" />
            <span>{t.alerts.title}</span>
            {unreadCount > 0 && (
              <span style={{ fontSize: "0.8rem", background: "#ef4444", color: "white", padding: "2px 10px", borderRadius: "999px", verticalAlign: "middle" }}>
                {unreadCount} {t.alerts.unreadOnly}
              </span>
            )}
          </h1>
          <p className="page-subtitle">{t.alerts.subtitle}</p>
        </div>

        {/* Bulk Action Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {unreadCount > 0 && (
            <button
              className="btn btn-secondary"
              style={{ fontSize: "0.82rem", padding: "0.45rem 0.85rem" }}
              onClick={onMarkAllRead}
            >
              <CheckCheck size={16} />
              <span>{t.alerts.markAllRead}</span>
            </button>
          )}

          <button
            className="btn btn-secondary"
            style={{ fontSize: "0.82rem", padding: "0.45rem 0.85rem" }}
            onClick={onClearRead}
          >
            <Trash2 size={15} />
            <span>{t.alerts.clearAll}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <button
          onClick={() => setFilter("all")}
          className={`btn ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "0.4rem 0.9rem", fontSize: "0.82rem" }}
        >
          {t.alerts.all} ({alerts.length})
        </button>
        <button
          onClick={() => setFilter("high")}
          className={`btn ${filter === "high" ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "0.4rem 0.9rem", fontSize: "0.82rem" }}
        >
          {t.alerts.highRiskOnly} ({alerts.filter((a) => a.riskLevel === "HIGH").length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`btn ${filter === "unread" ? "btn-primary" : "btn-secondary"}`}
          style={{ padding: "0.4rem 0.9rem", fontSize: "0.82rem" }}
        >
          {t.alerts.unreadOnly} ({unreadCount})
        </button>
      </div>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "#f0fdf4", color: "#16a34a", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "0.85rem" }}>
            <CheckCheck size={26} />
          </div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
            {t.alerts.empty}
          </h3>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {filteredAlerts.map((alt) => {
            const isHigh = alt.riskLevel === "HIGH";
            const isMed = alt.riskLevel === "MEDIUM";
            const isSafe = alt.riskLevel === "SAFE" || alt.riskLevel === "LOW";

            let iconColor = "#16a34a";
            let borderColor = "#bbf7d0";
            let bgColor = "#ffffff";
            let badgeBg = "#f0fdf4";
            let badgeColor = "#166534";
            let badgeText = language === "ta" ? "பாதுகாப்பானது" : "SAFE";

            if (isHigh) {
              iconColor = "#dc2626";
              borderColor = "#fca5a5";
              bgColor = alt.isRead ? "#fff" : "#fff5f5";
              badgeBg = "#fee2e2";
              badgeColor = "#991b1b";
              badgeText = language === "ta" ? "அதிக அபாயம்" : "HIGH RISK";
            } else if (isMed) {
              iconColor = "#d97706";
              borderColor = "#fde68a";
              bgColor = alt.isRead ? "#fff" : "#fffdf5";
              badgeBg = "#fef3c7";
              badgeColor = "#92400e";
              badgeText = language === "ta" ? "நடுத்தர அபாயம்" : "MEDIUM RISK";
            }

            const message = language === "ta" ? (alt.messageTa || alt.message) : alt.message;
            const cropName = language === "ta" ? (alt.cropNameTa || alt.cropName) : alt.cropName;

            return (
              <div
                key={alt.id}
                style={{
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: "14px",
                  padding: "1.1rem 1.25rem",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "1rem",
                  opacity: alt.isRead ? 0.75 : 1,
                  boxShadow: alt.isRead ? "none" : "0 2px 8px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", flex: 1 }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: badgeBg,
                      color: iconColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    {isHigh ? <AlertTriangle size={20} /> : isMed ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: badgeBg,
                          color: badgeColor,
                          padding: "2px 8px",
                          borderRadius: "999px",
                          fontSize: "0.72rem",
                          fontWeight: 800
                        }}
                      >
                        {badgeText}
                      </span>
                      <strong style={{ fontSize: "0.95rem", color: "#0f172a" }}>{cropName}</strong>
                      <span style={{ fontSize: "0.74rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={12} />
                        {new Date(alt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.88rem", color: "#334155", lineHeight: 1.45 }}>
                      {message}
                    </p>
                  </div>
                </div>

                {/* Mark as read button */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  {!alt.isRead ? (
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem" }}
                      onClick={() => onMarkRead(alt.id)}
                      title={t.alerts.markRead}
                    >
                      <Check size={14} />
                      <span>{t.alerts.markRead}</span>
                    </button>
                  ) : (
                    <span style={{ fontSize: "0.74rem", color: "#94a3b8", fontStyle: "italic" }}>
                      {language === "ta" ? "படிக்கப்பட்டது" : "Read"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
