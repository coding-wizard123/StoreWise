import React from "react";
import { 
  ShieldAlert, 
  Sprout, 
  AlertTriangle, 
  CheckCircle, 
  IndianRupee, 
  ArrowRight, 
  Sparkles,
  CloudSun,
  RefreshCw,
  TrendingDown
} from "lucide-react";
import StatCard from "../components/StatCard";
import CropStorageChart from "../components/CropStorageChart";
import RecentRecordsTable from "../components/RecentRecordsTable";
import { translations } from "../translations/translations";

export default function Dashboard({ 
  records = [], 
  onNavigate, 
  onViewRecord, 
  onFindMarketForCrop, 
  onDeleteRecord,
  onLaunchDemo,
  environmentData,
  onRefreshWeather,
  language = "en",
  currentUser
}) {
  const t = translations[language] || translations.en;
  const d = t.dashboard || {};

  // Compute live statistics
  const totalCrops = records.length;
  const highRiskCount = records.filter((r) => r.riskLevel === "HIGH").length;
  const safeCount = records.filter((r) => r.riskLevel === "LOW" || r.riskLevel === "SAFE").length;

  // Approximate economic loss prevented based on saved batches
  const totalKg = records.reduce((acc, r) => acc + (Number(r.quantity) || 0), 0);
  const estimatedSavings = Math.round(totalKg * 18.5); // avg ₹18.5/kg post-harvest margin saved

  const welcomeGreeting = currentUser?.name 
    ? `${d.welcomeUser || "Welcome,"} ${currentUser.name}`
    : (d.welcome || d.welcomeUser || "Welcome to StoreWise");

  return (
    <div>
      {/* 1. Hero Welcome Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            <Sprout size={14} />
            <span>{language === "ta" ? "அறுவடைக்குப் பிந்தைய இழப்பு தடுப்பு அமைப்பு" : "Smart Post-Harvest Spoilage Prevention"}</span>
          </div>
          <h1 className="hero-title">{welcomeGreeting}</h1>
          <p className="hero-desc">{d.welcomeSubtitle || "Monitor your post-harvest storage conditions in real time to prevent avoidable crop loss."}</p>
          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-lg" 
              onClick={() => onNavigate("checkRisk")}
              style={{ background: "#ffffff", color: "#065f46", fontWeight: 800 }}
            >
              <ShieldAlert size={18} />
              <span>{d.checkCropRiskBtn || d.checkRiskBtn || "Check Spoilage Risk"}</span>
              <ArrowRight size={16} />
            </button>
            <button 
              className="btn" 
              onClick={onLaunchDemo}
              style={{ background: "rgba(0,0,0,0.25)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
            >
              <Sparkles size={16} color="#fde047" />
              <span>{d.demoScenarioBtn || "Quick Demo Scenario"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Top Summary Cards */}
      <section className="stat-grid">
        <StatCard
          icon={Sprout}
          value={totalCrops}
          label={d.summary?.cropsStored || d.cropsStored || "Crops Stored"}
          theme="emerald"
          subtitle={language === "ta" ? "மொத்த சேமிப்பு சரக்குகள்" : "Active monitored lots"}
        />
        <StatCard
          icon={AlertTriangle}
          value={highRiskCount}
          label={d.summary?.highRisk || d.highRisk || "High Risk"}
          theme="danger"
          subtitle={language === "ta" ? "உடனடி கவனம் தேவை" : "Urgent intervention needed"}
          onClick={() => onNavigate("alerts")}
        />
        <StatCard
          icon={CheckCircle}
          value={safeCount}
          label={d.summary?.safeCrops || d.safeCrops || "Safe"}
          theme="safe"
          subtitle={language === "ta" ? "பாதுகாப்பான சூழல்" : "Within safe biology ranges"}
        />
        <StatCard
          icon={IndianRupee}
          value={`₹${estimatedSavings.toLocaleString("en-IN")}`}
          label={d.summary?.lossPrevented || d.estimatedLossPrevented || "Est. Loss Prevented"}
          theme="amber"
          subtitle={language === "ta" ? `~${totalKg.toLocaleString()} கிலோ பயிர்கள்` : `Across ~${totalKg.toLocaleString()} kg produce`}
        />
      </section>

      {/* 3. Live Environmental Conditions Banner */}
      <section className="card" style={{ marginBottom: "2rem", background: "linear-gradient(to right, #ffffff, #f0fdf4)", borderColor: "#bbf7d0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#ecfdf5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CloudSun size={24} />
            </div>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#047857", textTransform: "uppercase" }}>
                {d.environmentalSnapshot || "Local Storage Environment"}
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#0f172a" }}>
                {environmentData.temperature}°C • {environmentData.humidity}% RH • {environmentData.weather}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              {language === "ta" ? "நிலையம்: விருதுநகர் மண்டலம்" : "Station: Tamil Nadu Agro Hub"}
            </span>
            <button
              className="btn btn-secondary"
              style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
              onClick={onRefreshWeather}
              title={d.refreshWeather || d.refreshTelemetry || "Refresh"}
            >
              <RefreshCw size={14} />
              <span>{d.refreshWeather || d.refreshTelemetry || "Refresh"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Chart & Trend Section */}
      <section style={{ marginBottom: "2rem" }}>
        <CropStorageChart records={records} language={language} />
      </section>

      {/* 5. Recent Crop Storage Records */}
      <section>
        <RecentRecordsTable
          records={records}
          onViewRecord={onViewRecord}
          onFindMarketForCrop={onFindMarketForCrop}
          onDeleteRecord={onDeleteRecord}
          language={language}
        />
      </section>
    </div>
  );
}
