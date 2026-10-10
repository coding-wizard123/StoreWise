import React from "react";
import { Info, AlertOctagon, Lightbulb, Target, Rocket, ShieldCheck, Cpu, Mic, Database } from "lucide-react";
import { translations } from "../translations/translations";

export default function About({ language = "en" }) {
  const t = translations[language];

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          <Info size={30} color="#059669" />
          <span>{t.about.title}</span>
        </h1>
        <p className="page-subtitle">{t.about.subtitle}</p>
      </div>

      {/* 1. Problem Section */}
      <div className="card" style={{ marginBottom: "1.5rem", borderLeft: "5px solid #dc2626" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <AlertOctagon size={22} color="#dc2626" />
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
            {t.about.problemTitle}
          </h2>
        </div>
        <p style={{ fontSize: "0.95rem", color: "#334155", lineHeight: 1.6 }}>
          {t.about.problemText}
        </p>
      </div>

      {/* 2. Solution Section */}
      <div className="card" style={{ marginBottom: "1.5rem", borderLeft: "5px solid #059669" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <Lightbulb size={22} color="#059669" />
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
            {t.about.solutionTitle}
          </h2>
        </div>
        <p style={{ fontSize: "0.95rem", color: "#334155", lineHeight: 1.6, marginBottom: "1rem" }}>
          {t.about.solutionText}
        </p>

        {/* Prototype Defensibility Note */}
        <div style={{ background: "#ecfdf5", padding: "0.85rem 1rem", borderRadius: "10px", border: "1px solid #a7f3d0", fontSize: "0.85rem", color: "#065f46", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ShieldCheck size={18} color="#059669" />
          <span>
            <strong>{language === "ta" ? "தொழில்நுட்ப வெளிப்படைத்தன்மை: " : "Methodology Transparency: "}</strong>
            {t.prototypeDisclaimer}
          </span>
        </div>
      </div>

      {/* 3. Direct Farmer Impact */}
      <div className="card" style={{ marginBottom: "1.5rem", borderLeft: "5px solid #2563eb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
          <Target size={22} color="#2563eb" />
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
            {t.about.impactTitle}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
          <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "1.2rem" }}>📉</span>
            <p style={{ fontSize: "0.88rem", color: "#334155", fontWeight: 600, marginTop: "4px" }}>
              {t.about.impact1}
            </p>
          </div>
          <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "1.2rem" }}>💰</span>
            <p style={{ fontSize: "0.88rem", color: "#334155", fontWeight: 600, marginTop: "4px" }}>
              {t.about.impact2}
            </p>
          </div>
          <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "1.2rem" }}>🗣️</span>
            <p style={{ fontSize: "0.88rem", color: "#334155", fontWeight: 600, marginTop: "4px" }}>
              {t.about.impact3}
            </p>
          </div>
          <div style={{ background: "#f8fafc", padding: "0.85rem", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <span style={{ fontSize: "1.2rem" }}>⚡</span>
            <p style={{ fontSize: "0.88rem", color: "#334155", fontWeight: 600, marginTop: "4px" }}>
              {t.about.impact4}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Future-Ready Architecture & Roadmap */}
      <div className="card" style={{ borderLeft: "5px solid #7c3aed" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
          <Rocket size={22} color="#7c3aed" />
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a" }}>
            {t.about.futureTitle}
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { icon: Cpu, text: t.about.future1 },
            { icon: ShieldCheck, text: t.about.future2 },
            { icon: Database, text: t.about.future3 },
            { icon: Mic, text: t.about.future4 },
            { icon: Rocket, text: t.about.future5 },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  background: "#f8fafc",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  border: "1px solid #e2e8f0"
                }}
              >
                <div style={{ width: "30px", height: "30px", borderRadius: "6px", background: "#ede9fe", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} />
                </div>
                <span style={{ fontSize: "0.88rem", color: "#334155", fontWeight: 600 }}>
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
