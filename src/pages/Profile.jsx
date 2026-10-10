import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  ShieldCheck,
  LogOut,
  RotateCcw,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Settings,
  Sprout,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { translations, SUPPORTED_LANGUAGES } from "../translations/translations";
import { authService } from "../services/authService";

export default function Profile({
  currentUser,
  language,
  setLanguage,
  onLogout,
  onResetDemoData,
  records = [],
  alerts = [],
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: currentUser?.name || "",
    location: currentUser?.location || "",
  });
  const [saveMsg, setSaveMsg] = useState("");

  const t = translations[language] || translations.en;
  const at = t.auth || {};

  const highRisk = records.filter((r) => r.riskLevel === "HIGH").length;
  const medRisk = records.filter((r) => r.riskLevel === "MEDIUM").length;
  const lowRisk = records.filter((r) => r.riskLevel === "LOW").length;
  const unread = alerts.filter((a) => !a.isRead).length;

  const totalQty = records.reduce((sum, r) => {
    const q = parseFloat(r.quantity) || 0;
    return sum + q;
  }, 0);

  const handleSaveEdit = () => {
    const updated = { ...currentUser, ...editData };
    authService.updateCurrentUser(updated);
    setSaveMsg("Profile updated!");
    setIsEditing(false);
    setTimeout(() => setSaveMsg(""), 2500);
  };

  const avatarInitials = currentUser?.name
    ? currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{ width: "36px", height: "36px", background: "linear-gradient(135deg,#10b981,#047857)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <User size={20} />
          </div>
          <div>
            <h1 className="page-title">{t.nav.profile || "My Profile"}</h1>
            <p className="page-subtitle">{at.profileSubtitle || "Manage your account & preferences"}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* ─── Avatar Card ─── */}
        <div className="card" style={{ padding: "1.5rem", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
            <div style={{
              width: "70px", height: "70px",
              background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
              borderRadius: "20px",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: "1.5rem", fontWeight: 900,
              boxShadow: "0 6px 16px rgba(16,185,129,0.35)",
              flexShrink: 0,
            }}>
              {avatarInitials}
            </div>
            <div style={{ flex: 1, minWidth: "140px" }}>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="form-input"
                  style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}
                  placeholder="Your Full Name"
                />
              ) : (
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", marginBottom: "2px" }}>
                  {currentUser?.name}
                </div>
              )}
              <div style={{ fontSize: "0.8rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                {currentUser?.phoneVerified && <ShieldCheck size={13} color="#10b981" />}
                {currentUser?.phone || currentUser?.email}
              </div>
              {currentUser?.location && !isEditing && (
                <div style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: "2px", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <MapPin size={12} /> {currentUser.location}
                </div>
              )}
              {isEditing && (
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  className="form-input"
                  style={{ marginTop: "0.4rem", fontSize: "0.85rem" }}
                  placeholder="Your Village / District"
                />
              )}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {isEditing ? (
                <>
                  <button onClick={handleSaveEdit} className="btn btn-primary" style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem", gap: "0.3rem", display: "flex", alignItems: "center" }}>
                    <Save size={14} /> Save
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem" }}>
                    <X size={14} />
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary" style={{ padding: "0.45rem 0.75rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Edit2 size={13} /> Edit
                </button>
              )}
            </div>
          </div>
          {saveMsg && (
            <div style={{ marginTop: "0.75rem", background: "#ecfdf5", color: "#065f46", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 700 }}>
              ✓ {saveMsg}
            </div>
          )}
        </div>

        {/* ─── Stats Summary ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.85rem" }}>
          {[
            { label: "Total Batches", value: records.length, icon: BarChart3, color: "#3b82f6", bg: "#eff6ff" },
            { label: "High Risk", value: highRisk, icon: AlertTriangle, color: "#ef4444", bg: "#fef2f2" },
            { label: "Total Stored", value: `${totalQty.toLocaleString()} kg`, icon: Sprout, color: "#10b981", bg: "#ecfdf5" },
            { label: "Unread Alerts", value: unread, icon: TrendingUp, color: "#f59e0b", bg: "#fffbeb" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card" style={{ padding: "1rem", borderRadius: "14px", textAlign: "center" }}>
              <div style={{ width: "36px", height: "36px", background: bg, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.5rem" }}>
                <Icon size={18} color={color} />
              </div>
              <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a" }}>{value}</div>
              <div style={{ fontSize: "0.72rem", color: "#64748b", fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ─── Account Details ─── */}
        <div className="card" style={{ padding: "1.25rem", borderRadius: "16px" }}>
          <h2 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Settings size={15} color="#64748b" /> Account Information
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { icon: User, label: "Name", value: currentUser?.name },
              { icon: Phone, label: "Phone", value: currentUser?.phone, badge: currentUser?.phoneVerified ? "Verified" : null },
              { icon: Mail, label: "Email", value: currentUser?.email || "—" },
              { icon: MapPin, label: "Location", value: currentUser?.location || "Not set" },
            ].map(({ icon: Icon, label, value, badge }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.55rem 0.75rem", background: "#f8fafc", borderRadius: "10px" }}>
                <Icon size={15} color="#64748b" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
                </div>
                {badge && (
                  <span style={{ background: "#ecfdf5", color: "#065f46", fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "0.2rem", flexShrink: 0 }}>
                    <ShieldCheck size={11} /> {badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─── Language Preference ─── */}
        <div className="card" style={{ padding: "1.25rem", borderRadius: "16px" }}>
          <h2 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Globe size={15} color="#64748b" /> Language / மொழி
          </h2>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-input"
            style={{ fontSize: "0.9rem", fontWeight: 600 }}
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.label})
              </option>
            ))}
          </select>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.5rem" }}>
            Changes apply immediately to all screens.
          </p>
        </div>

        {/* ─── Account Actions ─── */}
        <div className="card" style={{ padding: "1.25rem", borderRadius: "16px" }}>
          <h2 style={{ fontSize: "0.9rem", fontWeight: 800, color: "#0f172a", marginBottom: "0.85rem" }}>
            Account Actions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <button
              onClick={onResetDemoData}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "12px", cursor: "pointer", color: "#92400e", fontWeight: 700, fontSize: "0.85rem", width: "100%", textAlign: "left" }}
            >
              <RotateCcw size={16} color="#f59e0b" />
              <div>
                <div>Reset Demo Data</div>
                <div style={{ fontSize: "0.72rem", fontWeight: 500, color: "#b45309" }}>Restore sample crop records & alerts</div>
              </div>
            </button>

            <button
              onClick={onLogout}
              style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.75rem", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "12px", cursor: "pointer", color: "#991b1b", fontWeight: 700, fontSize: "0.85rem", width: "100%", textAlign: "left" }}
            >
              <LogOut size={16} color="#ef4444" />
              <div>
                <div>{at.logout || "Logout"}</div>
                <div style={{ fontSize: "0.72rem", fontWeight: 500, color: "#b91c1c" }}>Sign out from your StoreWise account</div>
              </div>
            </button>
          </div>
        </div>

        {/* ─── App Version ─── */}
        <div style={{ textAlign: "center", padding: "1rem 0 2rem", color: "#94a3b8", fontSize: "0.72rem" }}>
          <Sprout size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
          <strong>StoreWise</strong> v1.0.0-beta · Prototype · Built for farmers 🌾
        </div>
      </div>
    </div>
  );
}
