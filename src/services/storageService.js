// StoreWise LocalStorage Persistence Service
// Supports strict user data isolation (userId partitioning) and offline-first availability

import { INITIAL_DEMO_RECORDS, INITIAL_DEMO_ALERTS } from "../data/initialDemoData.js";
import { DEMO_USER } from "./authService.js";

export const storageService = {
  // Helper to get key partitioned by user
  _getKey(type, userId) {
    const safeUser = userId || "guest";
    return `storewise_${type}_${safeUser}_v2`;
  },

  // Get records for a specific user
  getRecords(userId) {
    try {
      const isDemo = userId === DEMO_USER.id || !userId || userId === "usr-demo-murugan";
      const key = this._getKey("records", userId);
      const data = localStorage.getItem(key);

      if (!data) {
        if (isDemo) {
          localStorage.setItem(key, JSON.stringify(INITIAL_DEMO_RECORDS));
          return INITIAL_DEMO_RECORDS;
        }
        return [];
      }
      return JSON.parse(data);
    } catch (err) {
      console.error("Failed to read user records from storage", err);
      return [];
    }
  },

  // Save/Add a crop record associated with userId
  saveRecord(record, userId) {
    try {
      const records = this.getRecords(userId);
      const newRecord = {
        ...record,
        id: record.id || `rec-${Date.now()}`,
        userId: userId || "guest",
        createdAt: record.createdAt || new Date().toISOString()
      };
      
      const updated = [newRecord, ...records.filter((r) => r.id !== newRecord.id)];
      const key = this._getKey("records", userId);
      localStorage.setItem(key, JSON.stringify(updated));

      // Auto-generate corresponding user alert
      this.generateAlertFromRecord(newRecord, userId);

      return newRecord;
    } catch (err) {
      console.error("Failed to save user record", err);
      return record;
    }
  },

  // Delete a crop record
  deleteRecord(id, userId) {
    try {
      const records = this.getRecords(userId);
      const updated = records.filter((r) => r.id !== id);
      const key = this._getKey("records", userId);
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error("Failed to delete record", err);
      return [];
    }
  },

  // Get alerts for user
  getAlerts(userId) {
    try {
      const isDemo = userId === DEMO_USER.id || !userId || userId === "usr-demo-murugan";
      const key = this._getKey("alerts", userId);
      const data = localStorage.getItem(key);

      if (!data) {
        if (isDemo) {
          localStorage.setItem(key, JSON.stringify(INITIAL_DEMO_ALERTS));
          return INITIAL_DEMO_ALERTS;
        }
        return [];
      }
      return JSON.parse(data);
    } catch (err) {
      console.error("Failed to get user alerts", err);
      return [];
    }
  },

  // Generate an alert from a new or updated record
  generateAlertFromRecord(record, userId) {
    try {
      const alerts = this.getAlerts(userId);
      let message = "";
      let messageTa = "";
      let riskLevel = record.riskLevel || "LOW";

      if (riskLevel === "HIGH") {
        message = `${record.cropName} storage conditions require immediate attention: High spoilage risk (${record.riskScore}/100). Only ~${record.safeDaysRemaining} safe days remaining.`;
        messageTa = `${record.cropNameTa || record.cropName} சேமிப்புக்கு உடனடி கவனம் தேவை: அதிக அழுகல் அபாயம் (${record.riskScore}/100). இன்னும் ~${record.safeDaysRemaining} நாட்கள் மட்டுமே உள்ளன.`;
      } else if (riskLevel === "MEDIUM") {
        message = `${record.cropName} storage conditions need monitoring (${record.riskScore}/100, ${record.humidity}% RH). Inspect ventilation within 24h.`;
        messageTa = `${record.cropNameTa || record.cropName} சேமிப்பு சூழலை கண்காணிக்கவும் (${record.riskScore}/100, ${record.humidity}% RH). காற்றோட்டத்தை சரிசெய்யவும்.`;
      } else {
        message = `${record.cropName} storage conditions are currently within the safe range. Good storage stability.`;
        messageTa = `${record.cropNameTa || record.cropName} சேமிப்பு நிலை தற்போது பாதுகாப்பான வரம்பில் உள்ளது. தரம் நன்றாக உள்ளது.`;
        riskLevel = "SAFE";
      }

      const newAlert = {
        id: `alt-${Date.now()}`,
        userId: userId || "guest",
        recordId: record.id,
        cropName: record.cropName,
        cropNameTa: record.cropNameTa || record.cropName,
        riskLevel,
        message,
        messageTa,
        isRead: false,
        timestamp: new Date().toISOString()
      };

      const updated = [newAlert, ...alerts];
      const key = this._getKey("alerts", userId);
      localStorage.setItem(key, JSON.stringify(updated.slice(0, 30)));
    } catch (err) {
      console.error("Failed to generate alert", err);
    }
  },

  // Mark single alert read
  markAlertRead(id, userId) {
    try {
      const alerts = this.getAlerts(userId);
      const updated = alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a));
      const key = this._getKey("alerts", userId);
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error("Failed to mark alert as read", err);
      return [];
    }
  },

  // Mark all alerts read
  markAllAlertsRead(userId) {
    try {
      const alerts = this.getAlerts(userId);
      const updated = alerts.map((a) => ({ ...a, isRead: true }));
      const key = this._getKey("alerts", userId);
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error("Failed to mark all alerts as read", err);
      return [];
    }
  },

  // Clear read alerts
  clearReadAlerts(userId) {
    try {
      const alerts = this.getAlerts(userId);
      const updated = alerts.filter((a) => !a.isRead);
      const key = this._getKey("alerts", userId);
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    } catch (err) {
      console.error("Failed to clear read alerts", err);
      return [];
    }
  },

  // Language preference
  getLanguage() {
    try {
      return localStorage.getItem("storewise_language_v2") || "en";
    } catch {
      return "en";
    }
  },

  setLanguage(lang) {
    try {
      localStorage.setItem("storewise_language_v2", lang);
    } catch (err) {
      console.error("Failed to save language", err);
    }
  },

  // Reset demo user data
  resetDemoData() {
    try {
      const demoKey = this._getKey("records", DEMO_USER.id);
      const alertKey = this._getKey("alerts", DEMO_USER.id);
      localStorage.setItem(demoKey, JSON.stringify(INITIAL_DEMO_RECORDS));
      localStorage.setItem(alertKey, JSON.stringify(INITIAL_DEMO_ALERTS));
      return { records: INITIAL_DEMO_RECORDS, alerts: INITIAL_DEMO_ALERTS };
    } catch (err) {
      console.error("Failed to reset demo data", err);
      return { records: [], alerts: [] };
    }
  }
};
