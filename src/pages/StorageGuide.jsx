import React, { useState } from "react";
import { BookOpen, Search, Thermometer, Droplets, Clock, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { CROP_DATA } from "../data/cropData";
import { translations } from "../translations/translations";

export default function StorageGuide({ language = "en", onSelectCropForCheck }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const t = translations[language];

  // Filter crops
  const filteredCrops = CROP_DATA.filter((crop) => {
    const nameMatch = 
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crop.nameTa.includes(searchTerm);
    const catMatch = selectedCategory === "all" || crop.category.toLowerCase().includes(selectedCategory);
    return nameMatch && catMatch;
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <BookOpen size={30} color="#059669" />
          <span>{t.guide.title}</span>
        </h1>
        <p className="page-subtitle">{t.guide.subtitle}</p>
      </div>

      {/* Search and Filters Bar */}
      <div className="card" style={{ marginBottom: "1.75rem", padding: "1rem 1.25rem" }}>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search Input */}
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search 
              size={18} 
              style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} 
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "2.4rem" }}
              placeholder={t.guide.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Pills */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {["all", "vegetable", "bulb", "cereal", "fruit", "spice"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-secondary ${selectedCategory === cat ? "btn-amber" : ""}`}
                style={{ padding: "0.4rem 0.85rem", fontSize: "0.8rem", textTransform: "capitalize" }}
              >
                {cat === "all" ? (language === "ta" ? "அனைத்தும்" : "All Crops") : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "1.5rem" }}>
        {filteredCrops.map((crop) => {
          const name = language === "ta" ? crop.nameTa : crop.name;
          const method = language === "ta" ? crop.recommendedStorageTa : crop.recommendedStorage;
          const risks = language === "ta" ? crop.spoilageRisksTa : crop.spoilageRisks;
          const tips = language === "ta" ? crop.preventionTipsTa : crop.preventionTips;

          return (
            <div
              key={crop.id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                borderTop: `4px solid ${crop.color || "#059669"}`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
              }}
            >
              {/* Card Title */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "2.2rem" }}>{crop.icon}</span>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a" }}>
                      {name}
                    </h3>
                    <span style={{ fontSize: "0.75rem", background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "6px", fontWeight: 600 }}>
                      {language === "ta" ? crop.categoryTa : crop.category}
                    </span>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ padding: "0.4rem 0.75rem", fontSize: "0.78rem" }}
                  onClick={() => onSelectCropForCheck(crop.id)}
                  title={t.dashboard.checkRiskBtn}
                >
                  <Sparkles size={13} />
                  <span>{language === "ta" ? "இடர் பார்" : "Test Risk"}</span>
                </button>
              </div>

              {/* Recommended Metric Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", marginBottom: "1rem", border: "1px solid #e2e8f0" }}>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Thermometer size={13} color="#ea580c" />
                    {t.guide.idealTemp}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                    {crop.minTemp}°C – {crop.maxTemp}°C
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Droplets size={13} color="#0284c7" />
                    {t.guide.idealHumidity}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>
                    {crop.minHumidity}% – {crop.maxHumidity}%
                  </div>
                </div>

                <div style={{ gridColumn: "span 2", paddingTop: "0.25rem", borderTop: "1px dashed #e2e8f0" }}>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Clock size={13} color="#7c3aed" />
                    {t.guide.storageDuration}
                  </div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#0f172a" }}>
                    ~{crop.typicalStorageDays} {language === "ta" ? "நாட்கள் (சரியான சூழலில்)" : "days (under safe conditions)"}
                  </div>
                </div>
              </div>

              {/* Recommended Storage Method */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#047857", marginBottom: "0.25rem" }}>
                  📦 {t.guide.storageMethod}:
                </div>
                <p style={{ fontSize: "0.85rem", color: "#334155", lineHeight: 1.45 }}>
                  {method}
                </p>
              </div>

              {/* Spoilage Risks */}
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#dc2626", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <AlertCircle size={14} />
                  <span>{t.guide.risks}:</span>
                </div>
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.8rem", color: "#475569", lineHeight: 1.4 }}>
                  {risks.slice(0, 3).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Prevention Tips */}
              <div style={{ marginTop: "auto", background: "#f0fdf4", padding: "0.75rem", borderRadius: "8px", border: "1px solid #bbf7d0" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#166534", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <ShieldCheck size={14} />
                  <span>{t.guide.prevention}:</span>
                </div>
                <ul style={{ paddingLeft: "1.2rem", fontSize: "0.78rem", color: "#14532d", lineHeight: 1.4 }}>
                  {tips.slice(0, 2).map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
