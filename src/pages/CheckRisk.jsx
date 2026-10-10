import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Sparkles, 
  Thermometer, 
  Droplets, 
  Calendar, 
  Package, 
  Warehouse, 
  User, 
  Info,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { CROP_DATA, STORAGE_TYPES } from "../data/cropData";
import { calculateSpoilageRisk } from "../services/riskEngine";
import { translations } from "../translations/translations";

export default function CheckRisk({ 
  onAnalysisComplete, 
  environmentData, 
  prefillScenario,
  language = "en" 
}) {
  const t = translations[language];

  // Form State
  const [formData, setFormData] = useState({
    farmerName: "Murugan Selvam",
    cropId: "tomato",
    quantity: 450,
    quantityUnit: "kg",
    harvestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    storageType: "Open Storage",
    temperature: 31,
    humidity: 78,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If a prefill scenario was passed from Navbar demo button
  useEffect(() => {
    if (prefillScenario) {
      setFormData({
        farmerName: prefillScenario.farmerName || "Murugan Selvam",
        cropId: prefillScenario.cropId || "tomato",
        quantity: prefillScenario.quantity || 450,
        quantityUnit: "kg",
        harvestDate: prefillScenario.harvestDate || new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        storageType: prefillScenario.storageType || "Open Storage",
        temperature: prefillScenario.temperature !== undefined ? prefillScenario.temperature : 31,
        humidity: prefillScenario.humidity !== undefined ? prefillScenario.humidity : 78,
      });
    }
  }, [prefillScenario]);

  // Load Tomato Demo Scenario
  const handleLoadDemo = () => {
    setFormData({
      farmerName: "Murugan Selvam",
      cropId: "tomato",
      quantity: 500,
      quantityUnit: "kg",
      harvestDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      storageType: "Open Storage",
      temperature: 31,
      humidity: 78,
    });
    setErrors({});
  };

  // Sync with current live telemetry
  const handleUseLiveTelemetry = () => {
    if (environmentData) {
      setFormData((prev) => ({
        ...prev,
        temperature: environmentData.temperature,
        humidity: environmentData.humidity,
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.farmerName.trim()) {
      errs.farmerName = t.form.errors.farmerName;
    }
    if (!formData.cropId) {
      errs.cropId = t.form.errors.crop;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      errs.quantity = t.form.errors.quantity;
    }
    if (!formData.harvestDate) {
      errs.harvestDate = t.form.errors.harvestDate;
    } else {
      const selected = new Date(formData.harvestDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (selected > today) {
        errs.harvestDate = t.form.errors.harvestDate;
      }
    }
    if (!formData.storageType) {
      errs.storageType = t.form.errors.storageType;
    }
    if (formData.temperature === "" || isNaN(formData.temperature) || Number(formData.temperature) < -10 || Number(formData.temperature) > 60) {
      errs.temperature = t.form.errors.temperature;
    }
    if (formData.humidity === "" || isNaN(formData.humidity) || Number(formData.humidity) < 5 || Number(formData.humidity) > 100) {
      errs.humidity = t.form.errors.humidity;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Compute automatic storage days from harvest date
    const harvest = new Date(formData.harvestDate);
    const now = new Date();
    harvest.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffDays = Math.max(0, Math.floor((now - harvest) / (1000 * 60 * 60 * 24)));

    // Run the Smart Spoilage Risk Engine
    const analysisResult = calculateSpoilageRisk({
      cropId: formData.cropId,
      harvestDate: formData.harvestDate,
      storageDays: diffDays,
      temperature: formData.temperature,
      humidity: formData.humidity,
      storageType: formData.storageType,
    });

    const fullRecord = {
      ...analysisResult,
      farmerName: formData.farmerName,
      quantity: Number(formData.quantity),
      quantityUnit: formData.quantityUnit,
      harvestDate: formData.harvestDate,
    };

    // Small delay for clean feedback
    setTimeout(() => {
      setIsSubmitting(false);
      onAnalysisComplete(fullRecord);
    }, 350);
  };

  // Selected crop details for preview helper
  const selectedCrop = CROP_DATA.find((c) => c.id === formData.cropId) || CROP_DATA[0];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">
            <ShieldAlert size={30} color="#059669" />
            <span>{t.form.title}</span>
          </h1>
          <p className="page-subtitle">{t.form.subtitle}</p>
        </div>

        {/* Demo button */}
        <button
          type="button"
          className="btn btn-amber"
          onClick={handleLoadDemo}
          style={{ fontWeight: 700, boxShadow: "0 2px 8px rgba(217, 119, 6, 0.2)" }}
        >
          <Sparkles size={16} />
          <span>{t.form.demoFill}</span>
        </button>
      </div>

      {/* Main Form */}
      <div className="card form-card">
        <form onSubmit={handleSubmit}>
          {/* Farmer / Farm Name */}
          <div className="form-group">
            <label className="form-label">
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <User size={15} color="#059669" />
                {t.form.farmerName} *
              </span>
            </label>
            <input
              type="text"
              className={`form-input ${errors.farmerName ? "error" : ""}`}
              placeholder={t.form.farmerNamePlaceholder}
              value={formData.farmerName}
              onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
            />
            {errors.farmerName && <div className="error-text">{errors.farmerName}</div>}
          </div>

          {/* Crop & Quantity Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Package size={15} color="#059669" />
                  {t.form.cropSelect} *
                </span>
              </label>
              <select
                className={`form-select ${errors.cropId ? "error" : ""}`}
                value={formData.cropId}
                onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
              >
                {CROP_DATA.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.icon} {language === "ta" ? crop.nameTa : crop.name} ({language === "ta" ? crop.categoryTa : crop.category})
                  </option>
                ))}
              </select>
              {errors.cropId && <div className="error-text">{errors.cropId}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                {t.form.quantity} ({t.form.quantityUnit}) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                className={`form-input ${errors.quantity ? "error" : ""}`}
                placeholder="e.g. 500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
              {errors.quantity && <div className="error-text">{errors.quantity}</div>}
            </div>
          </div>

          {/* Harvest Date & Storage Type Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Calendar size={15} color="#059669" />
                  {t.form.harvestDate} *
                </span>
              </label>
              <input
                type="date"
                max={new Date().toISOString().split("T")[0]}
                className={`form-input ${errors.harvestDate ? "error" : ""}`}
                value={formData.harvestDate}
                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
              />
              {errors.harvestDate && <div className="error-text">{errors.harvestDate}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Warehouse size={15} color="#059669" />
                  {t.form.storageType} *
                </span>
              </label>
              <select
                className={`form-select ${errors.storageType ? "error" : ""}`}
                value={formData.storageType}
                onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
              >
                {STORAGE_TYPES.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.icon} {language === "ta" ? st.nameTa : st.name}
                  </option>
                ))}
              </select>
              {errors.storageType && <div className="error-text">{errors.storageType}</div>}
            </div>
          </div>

          {/* Environmental Conditions Section */}
          <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0f172a" }}>
                {language === "ta" ? "சேமிப்புக் கிடங்கின் தற்போதைய சூழல்" : "Storage Facility Micro-Climate"}
              </div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                onClick={handleUseLiveTelemetry}
              >
                <RefreshCw size={13} />
                <span>{t.form.useLiveEnv} ({environmentData.temperature}°C, {environmentData.humidity}%)</span>
              </button>
            </div>

            <div className="form-grid-2">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Thermometer size={15} color="#ea580c" />
                    {t.form.temperature} *
                  </span>
                </label>
                <input
                  type="number"
                  step="0.5"
                  className={`form-input ${errors.temperature ? "error" : ""}`}
                  placeholder="e.g. 31"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                />
                {errors.temperature && <div className="error-text">{errors.temperature}</div>}
                <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "4px" }}>
                  {language === "ta" ? `பரிந்துரை: ${selectedCrop.minTemp}°C - ${selectedCrop.maxTemp}°C` : `Safe range: ${selectedCrop.minTemp}°C to ${selectedCrop.maxTemp}°C`}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Droplets size={15} color="#0284c7" />
                    {t.form.humidity} *
                  </span>
                </label>
                <input
                  type="number"
                  step="1"
                  className={`form-input ${errors.humidity ? "error" : ""}`}
                  placeholder="e.g. 78"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                />
                {errors.humidity && <div className="error-text">{errors.humidity}</div>}
                <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "4px" }}>
                  {language === "ta" ? `பரிந்துரை: ${selectedCrop.minHumidity}% - ${selectedCrop.maxHumidity}%` : `Safe range: ${selectedCrop.minHumidity}% to ${selectedCrop.maxHumidity}%`}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", fontWeight: 800, padding: "1rem" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>{t.form.analyzing}</span>
            ) : (
              <>
                <ShieldAlert size={20} />
                <span>{t.form.analyzeBtn}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
