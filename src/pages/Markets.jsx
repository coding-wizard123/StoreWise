import React, { useState } from "react";
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Filter,
  Store,
  Users
} from "lucide-react";
import { MARKETS_DATA } from "../data/marketsData";
import { CROP_DATA } from "../data/cropData";
import { translations } from "../translations/translations";

export default function Markets({ 
  selectedCropId, 
  hasHighRiskCrop = false, 
  language = "en" 
}) {
  const [cropFilter, setCropFilter] = useState(selectedCropId || "all");
  const [callModal, setCallModal] = useState(null); // active call simulation modal
  const t = translations[language];

  // Filter markets by crop compatibility
  const filteredMarkets = MARKETS_DATA.filter((m) => {
    if (cropFilter === "all") return true;
    return m.supportedCrops.includes(cropFilter);
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <ShoppingBag size={30} color="#059669" />
          <span>{t.market.title}</span>
        </h1>
        <p className="page-subtitle">{t.market.subtitle}</p>
      </div>

      {/* Urgent Warning Banner if High Risk Produce Exists */}
      {hasHighRiskCrop && (
        <div
          style={{
            background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
            border: "2px solid #ef4444",
            borderRadius: "16px",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.75rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            boxShadow: "0 4px 14px rgba(239, 68, 68, 0.15)"
          }}
        >
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#dc2626", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#991b1b" }}>
              {language === "ta" ? "அவசர விற்பனை பரிந்துரை!" : "Recommended Action: Consider selling soon"}
            </h4>
            <p style={{ fontSize: "0.88rem", color: "#7f1d1d", marginTop: "2px" }}>
              {t.market.urgentBanner}
            </p>
          </div>
        </div>
      )}

      {/* Crop Filter Bar */}
      <div className="card" style={{ marginBottom: "1.75rem", padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Filter size={15} />
            <span>{language === "ta" ? "பயிர் வாரியாக வடிகட்டு:" : "Filter by Produce:"}</span>
          </div>

          <button
            onClick={() => setCropFilter("all")}
            className={`btn ${cropFilter === "all" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
          >
            {t.market.filterAll}
          </button>

          {CROP_DATA.map((c) => (
            <button
              key={c.id}
              onClick={() => setCropFilter(c.id)}
              className={`btn ${cropFilter === c.id ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.4rem 0.85rem", fontSize: "0.82rem" }}
            >
              <span>{c.icon}</span>
              <span>{language === "ta" ? c.nameTa : c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Markets Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
        {filteredMarkets.map((market) => {
          const name = language === "ta" ? market.nameTa : market.name;
          const loc = language === "ta" ? market.locationTa : market.location;
          const status = language === "ta" ? market.statusTa : market.status;
          const fType = language === "ta" ? market.facilityTypeTa : market.facilityType;

          return (
            <div
              key={market.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                borderTop: "4px solid #059669"
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <span style={{ fontSize: "0.72rem", background: "#ecfdf5", color: "#065f46", padding: "2px 8px", borderRadius: "999px", fontWeight: 700 }}>
                    {fType}
                  </span>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", marginTop: "0.35rem" }}>
                    {name}
                  </h3>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#047857" }}>
                    {market.distanceKm} km
                  </span>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                    {language === "ta" ? "தொலைவு" : "from storage"}
                  </div>
                </div>
              </div>

              {/* Location & Status */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#64748b", marginBottom: "0.85rem" }}>
                <MapPin size={15} color="#ea580c" />
                <span>{loc}</span>
              </div>

              {/* Status Pill & Rates */}
              <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", fontWeight: 700, color: "#16a34a" }}>
                    <CheckCircle size={14} />
                    {status}
                  </span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#0f172a" }}>
                    {market.indicativePrice}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#64748b" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Clock size={12} />
                    {market.operatingHours}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Users size={12} />
                    {market.traderCount} {language === "ta" ? "வியாபாரிகள்" : "active traders"}
                  </span>
                </div>
              </div>

              {/* Supported Crops */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#64748b", marginBottom: "0.4rem" }}>
                  {t.market.supportedCrops}:
                </div>
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                  {market.supportedCrops.map((cId) => {
                    const cObj = CROP_DATA.find((c) => c.id === cId);
                    return (
                      <span
                        key={cId}
                        style={{
                          fontSize: "0.75rem",
                          background: "#f1f5f9",
                          color: "#334155",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem"
                        }}
                      >
                        <span>{cObj ? cObj.icon : "🌱"}</span>
                        <span>{cObj ? (language === "ta" ? cObj.nameTa : cObj.name) : cId}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Actions Footer */}
              <div style={{ marginTop: "auto", display: "flex", gap: "0.6rem" }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: "0.85rem", padding: "0.55rem 0.85rem" }}
                  onClick={() => setCallModal(market)}
                >
                  <Phone size={15} />
                  <span>{t.market.callNow}</span>
                </button>

                <button
                  className="btn btn-secondary"
                  style={{ fontSize: "0.85rem", padding: "0.55rem 0.85rem" }}
                  onClick={() => alert(`Directions to ${market.name} (${market.distanceKm} km) simulated via GPS waypoint.`)}
                >
                  <ExternalLink size={15} />
                  <span>{t.market.directions}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Phone Call Modal */}
      {callModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "1rem"
          }}
          onClick={() => setCallModal(null)}
        >
          <div
            className="card"
            style={{ maxWidth: "420px", width: "100%", padding: "2rem", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#ecfdf5", color: "#059669", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Phone size={28} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
              {language === "ta" ? "மண்டி முகவரை அழைக்கவும்" : "Contact Mandi Agent"}
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "0.25rem", marginBottom: "1.25rem" }}>
              {callModal.name}
            </p>

            <div style={{ background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#047857" }}>
                {callModal.phone}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "4px" }}>
                {language === "ta" ? "நேரடி APMC முகவர் இணைப்பு" : "Direct APMC Mandi Procurement Line"}
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setCallModal(null)}
              >
                {language === "ta" ? "மூடுக" : "Close"}
              </button>
              <a
                href={`tel:${callModal.phone}`}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                <Phone size={16} />
                <span>{language === "ta" ? "அழைக்க" : "Dial Now"}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
