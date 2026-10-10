import React from "react";
import { BarChart3, ShieldAlert, Bell, ShoppingBag, User } from "lucide-react";
import { translations } from "../translations/translations";

export default function BottomNav({ currentTab, setCurrentTab, unreadAlertCount = 0, language }) {
  const t = translations[language] || translations.en;

  const items = [
    { id: "dashboard", label: t.nav.dashboard, icon: BarChart3 },
    { id: "checkRisk", label: t.nav.checkRisk, icon: ShieldAlert },
    { id: "alerts", label: t.nav.alerts, icon: Bell, badge: unreadAlertCount },
    { id: "markets", label: t.nav.markets, icon: ShoppingBag },
    { id: "profile", label: t.nav.profile, icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(({ id, label, icon: Icon, badge }) => {
        const isActive = currentTab === id;
        return (
          <button
            key={id}
            className={`bottom-nav-btn ${isActive ? "active" : ""}`}
            onClick={() => setCurrentTab(id)}
            aria-label={label}
          >
            <div className="bottom-nav-icon-wrap">
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              {badge > 0 && (
                <span className="bottom-nav-badge">{badge > 9 ? "9+" : badge}</span>
              )}
            </div>
            <span className="bottom-nav-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
