import React, { useState } from "react";
import {
  Sprout,
  BarChart3,
  ShieldAlert,
  BookOpen,
  Bell,
  ShoppingBag,
  CloudSun,
  Info,
  Menu,
  X,
  Sparkles,
  Wifi,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { translations, SUPPORTED_LANGUAGES } from "../translations/translations";

export default function Navbar({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  unreadAlertCount = 0,
  onLaunchDemo,
  currentUser,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const t = translations[language] || translations.en;

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const navItems = [
    { id: "dashboard", label: t.nav.dashboard, icon: BarChart3 },
    { id: "checkRisk", label: t.nav.checkRisk, icon: ShieldAlert },
    { id: "storageGuide", label: t.nav.storageGuide, icon: BookOpen },
    { id: "alerts", label: t.nav.alerts, icon: Bell, badge: unreadAlertCount },
    { id: "markets", label: t.nav.markets, icon: ShoppingBag },
    { id: "environment", label: t.nav.environment, icon: CloudSun },
    { id: "about", label: t.nav.about, icon: Info },
  ];

  const userInitials = currentUser?.name
    ? currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <div className="brand-wrapper" onClick={() => handleNavClick("dashboard")} style={{ cursor: "pointer" }}>
          <div className="brand-icon-box">
            <Sprout size={24} strokeWidth={2.4} />
          </div>
          <div>
            <div className="brand-title">
              StoreWise
              <span
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  padding: "2px 6px",
                  background: "#d1fae5",
                  color: "#065f46",
                  borderRadius: "4px",
                  marginLeft: "6px",
                }}
              >
                BETA
              </span>
            </div>
            <div className="brand-tagline">{t.tagline}</div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-btn ${isActive ? "active" : ""}`}
                title={item.label}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span
                    style={{
                      background: "#ef4444",
                      color: "white",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      borderRadius: "10px",
                      padding: "1px 5px",
                      marginLeft: "2px",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Offline-Ready Pill */}
          <div className="badge-offline" title="Works 100% offline — no internet needed">
            <span className="pulse-dot"></span>
            <Wifi size={12} />
            <span>{t.offlineReady}</span>
          </div>

          {/* Quick Demo Button */}
          <button
            className="btn-quick-demo"
            onClick={onLaunchDemo}
            title="Instant scenario: Tomato (31°C, 78% RH, Open Storage)"
          >
            <Sparkles size={14} />
            <span>Demo</span>
          </button>

          {/* Language Switcher */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="lang-toggle-btn"
            title="Switch Language"
            style={{ fontFamily: "inherit", border: "1.5px solid #d1fae5", cursor: "pointer", padding: "5px 8px" }}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName}
              </option>
            ))}
          </select>

          {/* User Avatar / Dropdown */}
          {currentUser && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  background: "linear-gradient(135deg,#10b981,#047857)",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  padding: "6px 10px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                }}
                title={currentUser.name}
              >
                <span style={{ fontSize: "0.85rem" }}>{userInitials}</span>
                <ChevronDown size={12} />
              </button>
              {userMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "14px",
                    padding: "0.5rem",
                    minWidth: "160px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    zIndex: 100,
                  }}
                >
                  <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid #f1f5f9", marginBottom: "0.35rem" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f172a" }}>{currentUser.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{currentUser.phone || currentUser.email}</div>
                  </div>
                  <button
                    onClick={() => { handleNavClick("profile"); setUserMenuOpen(false); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.75rem", border: "none", background: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", color: "#334155", fontWeight: 600 }}
                  >
                    <User size={14} /> {t.nav.profile}
                  </button>
                  <button
                    onClick={() => { setUserMenuOpen(false); onLogout(); }}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.75rem", border: "none", background: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", color: "#ef4444", fontWeight: 600 }}
                  >
                    <LogOut size={14} /> {t.auth?.logout || "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            className="mobile-menu-btn"
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setUserMenuOpen(false); }}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-btn ${isActive ? "active" : ""}`}
                style={{ width: "100%", justifyContent: "flex-start", padding: "0.65rem 0.85rem" }}
              >
                <Icon size={18} />
                <span style={{ flex: 1, textAlign: "left" }}>{item.label}</span>
                {item.badge > 0 && (
                  <span style={{ background: "#ef4444", color: "white", fontSize: "0.7rem", fontWeight: 800, borderRadius: "10px", padding: "2px 8px" }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          {/* User info in mobile drawer */}
          {currentUser && (
            <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "0.5rem", paddingTop: "0.5rem" }}>
              <button
                onClick={() => handleNavClick("profile")}
                className={`nav-btn ${currentTab === "profile" ? "active" : ""}`}
                style={{ width: "100%", justifyContent: "flex-start", padding: "0.65rem 0.85rem" }}
              >
                <User size={18} />
                <span style={{ flex: 1, textAlign: "left" }}>{t.nav.profile}</span>
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                className="nav-btn"
                style={{ width: "100%", justifyContent: "flex-start", padding: "0.65rem 0.85rem", color: "#ef4444" }}
              >
                <LogOut size={18} />
                <span style={{ flex: 1, textAlign: "left" }}>{t.auth?.logout || "Logout"}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
