import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Dashboard from "./pages/Dashboard";
import CheckRisk from "./pages/CheckRisk";
import RiskResult from "./pages/RiskResult";
import StorageGuide from "./pages/StorageGuide";
import Alerts from "./pages/Alerts";
import Markets from "./pages/Markets";
import Environment from "./pages/Environment";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OtpVerify from "./pages/OtpVerify";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import { storageService } from "./services/storageService";
import { authService } from "./services/authService";
import { translations } from "./translations/translations";
import { Sprout, RotateCcw } from "lucide-react";

export default function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [authView, setAuthView] = useState("login"); // "login" | "signup" | "otp" | "forgot"
  const [pendingOtpData, setPendingOtpData] = useState(null);

  // Navigation & Language
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [language, setLanguage] = useState(() => storageService.getLanguage());

  // Stored Data (offline-first from LocalStorage)
  const [records, setRecords] = useState(() => storageService.getRecords());
  const [alerts, setAlerts] = useState(() => storageService.getAlerts());

  // Transient state for flow transitions
  const [currentRiskResult, setCurrentRiskResult] = useState(null);
  const [selectedCropForMarket, setSelectedCropForMarket] = useState("all");
  const [prefillScenario, setPrefillScenario] = useState(null);

  // Simulated live environment telemetry
  const [environmentData, setEnvironmentData] = useState({
    temperature: 31,
    humidity: 78,
    weather: "Humid & Sunny (Pre-Monsoon)",
    lastUpdated: new Date().toISOString(),
  });

  const t = translations[language] || translations.en;

  // Persist language changes
  const handleSetLanguage = (lang) => {
    setLanguage(lang);
    storageService.setLanguage(lang);
  };

  // ─── Auth Handlers ────────────────────────────────────────────────────────
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setCurrentTab("dashboard");
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAuthView("login");
    setCurrentTab("dashboard");
  };

  const handleOtpRequested = (otpData) => {
    setPendingOtpData(otpData);
    setAuthView("otp");
  };

  const handleOtpSuccess = (user) => {
    setCurrentUser(user);
    setPendingOtpData(null);
    setCurrentTab("dashboard");
  };

  // ─── Navigation Handlers ─────────────────────────────────────────────────

  // 1. Quick Demo Scenario
  const handleLaunchDemo = () => {
    setPrefillScenario({
      farmerName: currentUser?.name || "Murugan Selvam",
      cropId: "tomato",
      quantity: 500,
      quantityUnit: "kg",
      harvestDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      storageType: "Open Storage",
      temperature: 31,
      humidity: 78,
    });
    setCurrentTab("checkRisk");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 2. Risk analysis completion handler
  const handleAnalysisComplete = (resultRecord) => {
    setCurrentRiskResult(resultRecord);
    setCurrentTab("riskResult");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 3. Save record to LocalStorage
  const handleSaveRecord = (recordToSave) => {
    const saved = storageService.saveRecord(recordToSave);
    setRecords(storageService.getRecords());
    setAlerts(storageService.getAlerts());
    return saved;
  };

  // 4. Delete record
  const handleDeleteRecord = (id) => {
    if (window.confirm(language === "ta" ? "இந்த சேமிப்பு பதிவை நீக்க விரும்புகிறீர்களா?" : "Delete this crop storage batch?")) {
      const updated = storageService.deleteRecord(id);
      setRecords(updated);
    }
  };

  // 5. View existing record details
  const handleViewRecord = (rec) => {
    setCurrentRiskResult(rec);
    setCurrentTab("riskResult");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 6. Direct shortcut to market from a crop record
  const handleFindMarketForCrop = (rec) => {
    setSelectedCropForMarket(rec.cropId || "all");
    setCurrentTab("markets");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 7. Test crop risk directly from knowledge guide
  const handleSelectCropForCheck = (cropId) => {
    setPrefillScenario({
      farmerName: currentUser?.name || "Farmer Partner",
      cropId,
      quantity: 500,
      quantityUnit: "kg",
      harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      storageType: "Open Storage",
      temperature: environmentData.temperature,
      humidity: environmentData.humidity,
    });
    setCurrentTab("checkRisk");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 8. Refresh simulated environmental telemetry
  const handleRefreshWeather = () => {
    const deltaT = (Math.random() * 1.6 - 0.8).toFixed(1);
    const deltaH = Math.round(Math.random() * 4 - 2);
    setEnvironmentData((prev) => ({
      ...prev,
      temperature: Math.max(18, Math.min(42, parseFloat((prev.temperature + parseFloat(deltaT)).toFixed(1)))),
      humidity: Math.max(30, Math.min(95, prev.humidity + deltaH)),
      lastUpdated: new Date().toISOString(),
    }));
  };

  // 9. Sync live environment telemetry directly into check risk
  const handleSyncToCalculator = () => {
    setPrefillScenario({
      farmerName: currentUser?.name || "Murugan Selvam",
      cropId: "tomato",
      quantity: 450,
      quantityUnit: "kg",
      harvestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      storageType: "Open Storage",
      temperature: environmentData.temperature,
      humidity: environmentData.humidity,
    });
    setCurrentTab("checkRisk");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 10. Alert management handlers
  const handleMarkAlertRead = (id) => {
    const updated = storageService.markAlertRead(id);
    setAlerts(updated);
  };

  const handleMarkAllAlertsRead = () => {
    const updated = storageService.markAllAlertsRead();
    setAlerts(updated);
  };

  const handleClearReadAlerts = () => {
    const updated = storageService.clearReadAlerts();
    setAlerts(updated);
  };

  // 11. Reset data to factory demo state
  const handleResetDemoData = () => {
    if (window.confirm(language === "ta" ? "அனைத்து மாதிரி தரவுகளையும் மீட்டமைக்கவா?" : "Reset all records and alerts to initial demo state?")) {
      const { records: recs, alerts: alts } = storageService.resetToDemo();
      setRecords(recs);
      setAlerts(alts);
    }
  };

  // Unread alerts count for navbar badge
  const unreadAlertCount = alerts.filter((a) => !a.isRead).length;

  // Check if any high risk crop exists for market urgent banner
  const hasHighRiskCrop = records.some((r) => r.riskLevel === "HIGH");

  // ─── Auth Wall ────────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="app-container">
        {authView === "login" && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignup={() => setAuthView("signup")}
            onNavigateToForgot={() => setAuthView("forgot")}
            language={language}
            setLanguage={handleSetLanguage}
          />
        )}
        {authView === "signup" && (
          <Signup
            onOtpRequested={handleOtpRequested}
            onNavigateToLogin={() => setAuthView("login")}
            language={language}
            setLanguage={handleSetLanguage}
          />
        )}
        {authView === "otp" && pendingOtpData && (
          <OtpVerify
            otpData={pendingOtpData}
            onVerifySuccess={handleOtpSuccess}
            onBack={() => setAuthView("signup")}
            language={language}
          />
        )}
        {authView === "forgot" && (
          <ForgotPassword
            onNavigateToLogin={() => setAuthView("login")}
            language={language}
            setLanguage={handleSetLanguage}
          />
        )}
      </div>
    );
  }

  // ─── Main App (Authenticated) ─────────────────────────────────────────────
  return (
    <div className="app-container">
      {/* Top Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => { setCurrentTab(tab); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        language={language}
        setLanguage={handleSetLanguage}
        unreadAlertCount={unreadAlertCount}
        onLaunchDemo={handleLaunchDemo}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Page Content */}
      <main className="main-content">
        {currentTab === "dashboard" && (
          <Dashboard
            records={records}
            onNavigate={(tab) => { setCurrentTab(tab); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            onViewRecord={handleViewRecord}
            onFindMarketForCrop={handleFindMarketForCrop}
            onDeleteRecord={handleDeleteRecord}
            onLaunchDemo={handleLaunchDemo}
            environmentData={environmentData}
            onRefreshWeather={handleRefreshWeather}
            language={language}
            currentUser={currentUser}
          />
        )}

        {currentTab === "checkRisk" && (
          <CheckRisk
            onAnalysisComplete={handleAnalysisComplete}
            environmentData={environmentData}
            prefillScenario={prefillScenario}
            language={language}
            currentUser={currentUser}
          />
        )}

        {currentTab === "riskResult" && (
          <RiskResult
            result={currentRiskResult || records[0]}
            onSaveRecord={handleSaveRecord}
            onFindMarket={(res) => {
              setSelectedCropForMarket(res.cropId || "all");
              setCurrentTab("markets");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onRecheck={() => { setCurrentTab("checkRisk"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            language={language}
          />
        )}

        {currentTab === "storageGuide" && (
          <StorageGuide
            language={language}
            onSelectCropForCheck={handleSelectCropForCheck}
          />
        )}

        {currentTab === "alerts" && (
          <Alerts
            alerts={alerts}
            onMarkRead={handleMarkAlertRead}
            onMarkAllRead={handleMarkAllAlertsRead}
            onClearRead={handleClearReadAlerts}
            onNavigateToRisk={handleViewRecord}
            language={language}
          />
        )}

        {currentTab === "markets" && (
          <Markets
            selectedCropId={selectedCropForMarket}
            hasHighRiskCrop={hasHighRiskCrop}
            language={language}
          />
        )}

        {currentTab === "environment" && (
          <Environment
            environmentData={environmentData}
            onRefreshWeather={handleRefreshWeather}
            onSyncToCalculator={handleSyncToCalculator}
            language={language}
          />
        )}

        {currentTab === "about" && (
          <About language={language} />
        )}

        {currentTab === "profile" && (
          <Profile
            currentUser={currentUser}
            language={language}
            setLanguage={handleSetLanguage}
            onLogout={handleLogout}
            onResetDemoData={handleResetDemoData}
            records={records}
            alerts={alerts}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        setCurrentTab={(tab) => { setCurrentTab(tab); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        unreadAlertCount={unreadAlertCount}
        language={language}
      />

      {/* Footer (Desktop only) */}
      <footer className="footer">
        <div className="footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: "#065f46" }}>
            <Sprout size={16} />
            <span>StoreWise — {t.tagline}</span>
          </div>
          <p style={{ maxWidth: "600px", fontSize: "0.78rem", color: "#64748b" }}>
            {t.prototypeDisclaimer}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginTop: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            {["dashboard","checkRisk","storageGuide","markets","about"].map(tab => (
              <button key={tab}
                onClick={() => { setCurrentTab(tab); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                style={{ background: "none", border: "none", color: "#059669", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}
              >
                {t.nav[tab]}
              </button>
            ))}
            <button
              onClick={handleResetDemoData}
              style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "0.78rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
              title="Reset sample data"
            >
              <RotateCcw size={12} />
              <span>{language === "ta" ? "தரவை மீட்டமை" : "Reset Demo"}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
