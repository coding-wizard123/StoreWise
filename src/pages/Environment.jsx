import React from "react";
import { 
  CloudSun, 
  Thermometer, 
  Droplets, 
  Wind, 
  RefreshCw, 
  ShieldAlert, 
  Cpu, 
  Radio, 
  Clock, 
  CheckCircle2 
} from "lucide-react";
import { translations } from "../translations/translations";

export default function Environment({ 
  environmentData, 
  onRefreshWeather, 
  onSyncToCalculator, 
  language = "en" 
}) {
  const t = translations[language];

  return (
    <div style={{ maxWidth: "920px", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">
            <CloudSun size={30} color="#059669" />
            <span>{t.environment.title}</span>
          </h1>
          <p className="page-subtitle">{t.environment.subtitle}</p>
        </div>

        {/* Refresh button */}
        <button
          className="btn btn-primary"
          onClick={onRefreshWeather}
          style={{ fontWeight: 700 }}
        >
          <RefreshCw size={16} />
          <span>{t.environment.refreshBtn}</span>
        </button>
      </div>

      {/* Main Station Card */}
      <div className="card" style={{ marginBottom: "1.75rem", background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)", borderColor: "#a7f3d0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="pulse-dot"></span>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#065f46" }}>
              {t.environment.station}
            </span>
          </div>

          <div style={{ fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Clock size={13} />
            <span>{t.environment.lastUpdated}: {new Date(environmentData.lastUpdated).toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Large Telemetry Numbers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ background: "white", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ea580c", fontSize: "0.82rem", fontWeight: 700 }}>
              <Thermometer size={18} />
              <span>{language === "ta" ? "வெப்பநிலை" : "Ambient Temperature"}</span>
            </div>
            <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
              {environmentData.temperature}°C
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
              {environmentData.temperature > 30 ? "⚠️ Elevated thermal stress" : "Normal thermal zone"}
            </div>
          </div>

          <div style={{ background: "white", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#0284c7", fontSize: "0.82rem", fontWeight: 700 }}>
              <Droplets size={18} />
              <span>{language === "ta" ? "ஈரப்பதம்" : "Relative Humidity"}</span>
            </div>
            <div style={{ fontSize: "2.4rem", fontWeight: 800, color: "#0f172a", marginTop: "0.25rem" }}>
              {environmentData.humidity}% RH
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
              {environmentData.humidity > 75 ? "⚠️ High moisture level" : "Moderate humidity"}
            </div>
          </div>

          <div style={{ background: "white", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#7c3aed", fontSize: "0.82rem", fontWeight: 700 }}>
              <Wind size={18} />
              <span>{language === "ta" ? "வானிலை & காற்று" : "Condition & Airflow"}</span>
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", marginTop: "0.6rem" }}>
              {environmentData.weather}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
              Air speed: ~12 km/h • Barometer: 1012 hPa
            </div>
          </div>
        </div>

        {/* CTA to run Risk Analysis with this live telemetry */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ecfdf5", padding: "1rem 1.25rem", borderRadius: "12px", border: "1px solid #a7f3d0", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Cpu size={22} color="#059669" />
            <div>
              <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#065f46" }}>
                {language === "ta" ? "நேரடி சேமிப்பு இடர் கணக்கீடு" : "Instant Risk Check with Telemetry"}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#047857" }}>
                {language === "ta" ? "இந்த வெப்ப-ஈரப்பதம் அளவீடுகளுடன் உங்கள் பயிரின் அழுகல் அபாயத்தை கணக்கிடுங்கள்." : "Analyze how your stored crops react under these exact real-time temperature and humidity readings."}
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={onSyncToCalculator}
            style={{ fontWeight: 800 }}
          >
            <ShieldAlert size={16} />
            <span>{t.environment.syncToCalc}</span>
          </button>
        </div>
      </div>

      {/* Integration Architecture Card (demonstrating IoT / OpenWeatherMap readiness) */}
      <div className="card">
        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Radio size={18} color="#059669" />
          <span>{language === "ta" ? "சென்சார் & வானிலை API இணைப்பு கட்டமைப்பு" : "Sensor & External Weather API Integration"}</span>
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.5, marginBottom: "1rem" }}>
          {language === "ta" 
            ? "கிராப்கார்டு தற்போது உள்ளூர் மாதிரி அளவீடுகளைக் கொண்டு உடனுக்குடன் கணக்கிடுகிறது. உண்மையான பயன்பாட்டிற்கு, ESP32 DHT22 சென்சார்கள் அல்லது OpenWeather API-ஐ நேரடியாக இணைக்கக்கூடிய வகையில் இதன் நிரல் மாதிரி வடிவமைக்கப்பட்டுள்ளது."
            : "The telemetry pipeline is architected for drop-in connectivity with hardware BLE/LoRaWAN sensor nodes (e.g., ESP32 + DHT22/SHT31) and open meteorology APIs (e.g., OpenWeatherMap, IMD Agro-Met). Current values simulate a typical semi-arid tropical agricultural belt."}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", fontSize: "0.8rem", color: "#334155" }}>
          <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <CheckCircle2 size={16} color="#16a34a" />
            <span>IoT Wireless Probe Compatible</span>
          </div>
          <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <CheckCircle2 size={16} color="#16a34a" />
            <span>OpenWeatherMap / IMD JSON schema</span>
          </div>
          <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <CheckCircle2 size={16} color="#16a34a" />
            <span>Zero-latency offline fallback</span>
          </div>
        </div>
      </div>
    </div>
  );
}
