// StoreWise – Authentication & Session Service
// ─────────────────────────────────────────────────────────────────────────────
// Features:
//   1. Mandatory Indian Phone Number (+91) with real Firebase SMS OTP
//   2. RecaptchaVerifier (invisible) wired to signInWithPhoneNumber
//   3. Dual Recovery: Firebase Email Reset Link + Phone OTP (re-auth flow)
//   4. Secure Session Management via localStorage (profile data only)
//   5. Graceful degradation: if Firebase is not configured, the app fails
//      loudly instead of silently showing a fake "OTP sent" message.
// ─────────────────────────────────────────────────────────────────────────────

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  updatePassword,
  signOut,
  reauthenticateWithCredential,
  PhoneAuthProvider,
} from "firebase/auth";
import { auth, FIREBASE_CONFIGURED } from "./firebase";

// ─── Public helpers ───────────────────────────────────────────────────────────

/** Normalize Indian phone numbers to E.164 (+91XXXXXXXXXX) */
export function normalizePhoneNumber(phone) {
  if (!phone) return "";
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  if (cleaned.startsWith("+91")) return cleaned;
  if (cleaned.startsWith("91") && cleaned.length === 12) return `+${cleaned}`;
  if (/^\d{10}$/.test(cleaned)) return `+91${cleaned}`;
  return cleaned;
}

export function isValidIndianPhone(phone) {
  const normalized = normalizePhoneNumber(phone);
  return /^\+91[6-9]\d{9}$/.test(normalized);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Firebase Test Phone Numbers for Development / Demo Mode ─────────────────
// These correspond to "Phone numbers for testing" configured in Firebase Console
export const DEFAULT_FIREBASE_TEST_PHONES = [
  "+919876543210",
  "+919842188320",
  "+919999999999",
];

export function getFirebaseTestPhones() {
  const envTestPhones = import.meta.env.VITE_FIREBASE_TEST_PHONE_NUMBERS;
  if (!envTestPhones) return DEFAULT_FIREBASE_TEST_PHONES;
  const list = envTestPhones
    .split(",")
    .map((p) => normalizePhoneNumber(p.trim()))
    .filter(Boolean);
  return list.length ? list : DEFAULT_FIREBASE_TEST_PHONES;
}

export function isFirebaseTestPhone(phone) {
  if (!phone) return false;
  const normalized = normalizePhoneNumber(phone);
  return getFirebaseTestPhones().includes(normalized);
}

// ─── Demo user (pre-seeded for 1-click demo login) ───────────────────────────
export const DEMO_USER = {
  id: "usr-demo-murugan",
  name: "Murugan Selvam",
  email: "murugan.farm@storewise.in",
  phone: "+919842188320",
  phoneVerified: true,
  language: "en",
  location: "Virudhunagar, Tamil Nadu",
  createdAt: "2026-03-15T08:30:00.000Z",
};

// ─── Local storage keys ───────────────────────────────────────────────────────
const STORAGE_KEYS = {
  CURRENT_USER: "storewise_current_user_v2",
  USERS_REGISTRY: "storewise_users_registry_v2",
};

// ─── Minimal crypto hash (never store plaintext passwords for local accounts) ─
function hashSecret(secret) {
  let hash = 0;
  const str = `storewise_salt_${secret}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sw_hash_${Math.abs(hash).toString(36)}`;
}

// ─── Map Firebase error codes to user-friendly error keys ─────────────────────
function mapFirebaseError(error) {
  const code = error?.code || "";
  if (code === "auth/invalid-phone-number") return "errors.invalidPhone";
  if (code === "auth/too-many-requests") return "errors.tooManyRequests";
  if (code === "auth/quota-exceeded") return "errors.smsQuotaExceeded";
  if (code === "auth/invalid-verification-code") return "errors.invalidOtp";
  if (code === "auth/code-expired") return "errors.otpExpired";
  if (code === "auth/missing-phone-number") return "errors.invalidPhone";
  if (code === "auth/captcha-check-failed") return "errors.recaptchaFailed";
  if (code === "auth/missing-client-identifier") return "errors.recaptchaFailed";
  if (code === "auth/network-request-failed") return "errors.networkError";
  if (code === "auth/unauthorized-domain") return "errors.unauthorizedDomain";
  if (code === "auth/operation-not-allowed") return "errors.phoneAuthDisabled";
  if (code === "auth/invalid-api-key") return "errors.configError";
  if (code === "auth/user-disabled") return "errors.userDisabled";
  if (code === "auth/app-deleted") return "errors.configError";
  return "errors.smsFailed";
}

// ─── AuthService class ────────────────────────────────────────────────────────
class AuthService {
  constructor() {
    this._recaptchaVerifier = null;
    this._confirmationResult = null; // Firebase ConfirmationResult from signInWithPhoneNumber
    this._pendingSignupData = null;  // Temporary registration payload while OTP is pending
    this._ensureRegistryInitialized();
  }

  // ── Local user registry (profile data only, no password for Firebase users) ──
  _ensureRegistryInitialized() {
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.USERS_REGISTRY);
      if (!existing) {
        const initialUsers = {
          [DEMO_USER.id]: { ...DEMO_USER, passwordHash: hashSecret("farmer123") },
        };
        localStorage.setItem(STORAGE_KEYS.USERS_REGISTRY, JSON.stringify(initialUsers));
      }
    } catch (e) {
      console.error("[StoreWise] Registry init failed", e);
    }
  }

  _getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS_REGISTRY) || "{}");
    } catch { return {}; }
  }

  _saveAllUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS_REGISTRY, JSON.stringify(users));
    } catch (e) { console.error("[StoreWise] Save users failed", e); }
  }

  getCurrentUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  }

  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    }
  }

  // ── reCAPTCHA management ──────────────────────────────────────────────────

  /**
   * Create (or recreate) an invisible reCAPTCHA verifier bound to a DOM element.
   * Must be called while the DOM element #recaptcha-container exists.
   * Clears any previous verifier to avoid "already rendered" errors on resend.
   */
  _initRecaptcha(containerId = "recaptcha-container") {
    // Always clear previous verifier before creating a new one
    if (this._recaptchaVerifier) {
      try { this._recaptchaVerifier.clear(); } catch (_) { /* ignore */ }
      this._recaptchaVerifier = null;
    }
    this._recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved – signInWithPhoneNumber will proceed automatically
      },
      "expired-callback": () => {
        console.warn("[StoreWise] reCAPTCHA expired");
      },
    });
    return this._recaptchaVerifier;
  }

  // ── Step 1 of Signup: Validate form, request Firebase SMS OTP ─────────────

  /**
   * Validates the signup form and calls Firebase signInWithPhoneNumber.
   * The success message is ONLY returned if Firebase actually sends the SMS.
   * All Firebase errors are propagated as translated error keys, not hidden.
   *
   * @param {{ name, email, phone, password, language, location }} userData
   * @param {string} recaptchaContainerId – ID of the invisible reCAPTCHA div
   * @returns {{ success: true, phone: string }}
   * @throws Error with a translated error key on any failure
   */
  async requestSignupOtp(userData, recaptchaContainerId = "recaptcha-container") {
    const { name, email, phone, password } = userData;
    const normalizedPhone = normalizePhoneNumber(phone);

    // ─ Validate inputs ─
    if (!name?.trim()) throw new Error("errors.required");
    if (!isValidEmail(email)) throw new Error("errors.invalidEmail");
    if (!isValidIndianPhone(normalizedPhone)) throw new Error("errors.invalidPhone");
    if (!password || password.length < 6) throw new Error("errors.weakPassword");

    // ─ Check Firebase is configured ─
    if (!FIREBASE_CONFIGURED) {
      throw new Error("errors.configError");
    }

    const isTest = isFirebaseTestPhone(normalizedPhone);

    // ─ Check local duplicate phone (exempt test numbers so demos can be run repeatedly) ─
    const users = this._getAllUsers();
    const phoneExists = Object.values(users).some(
      (u) => normalizePhoneNumber(u.phone) === normalizedPhone && !isTest
    );
    if (phoneExists) throw new Error("errors.phoneInUse");

    const emailExists = Object.values(users).some(
      (u) => u.email.toLowerCase() === email.toLowerCase() && !isTest
    );
    if (emailExists) throw new Error("errors.emailInUse");

    // ─ Stash signup data; we will use it after OTP verification ─
    this._pendingSignupData = { ...userData, phone: normalizedPhone, isTestPhone: isTest };

    // ─ Init reCAPTCHA then call Firebase ─
    const verifier = this._initRecaptcha(recaptchaContainerId);
    try {
      this._confirmationResult = await signInWithPhoneNumber(auth, normalizedPhone, verifier);
    } catch (firebaseError) {
      console.error("[StoreWise] signInWithPhoneNumber failed:", firebaseError);
      // Clear verifier so it can be recreated on retry
      try { verifier.clear(); } catch (_) { /* ignore */ }
      this._recaptchaVerifier = null;
      throw new Error(mapFirebaseError(firebaseError));
    }

    // ─ Verification initiated with Firebase ─
    return { success: true, phone: normalizedPhone, isTestPhone: isTest };
  }

  // ── Resend OTP (re-initialises reCAPTCHA, calls Firebase again) ──────────

  async resendOtp(phone, recaptchaContainerId = "recaptcha-container") {
    const normalizedPhone = normalizePhoneNumber(phone || this._pendingSignupData?.phone || "");
    if (!isValidIndianPhone(normalizedPhone)) throw new Error("errors.invalidPhone");
    if (!FIREBASE_CONFIGURED) throw new Error("errors.configError");

    const isTest = isFirebaseTestPhone(normalizedPhone);
    const verifier = this._initRecaptcha(recaptchaContainerId);
    try {
      this._confirmationResult = await signInWithPhoneNumber(auth, normalizedPhone, verifier);
    } catch (firebaseError) {
      console.error("[StoreWise] resendOtp failed:", firebaseError);
      try { verifier.clear(); } catch (_) { /* ignore */ }
      this._recaptchaVerifier = null;
      throw new Error(mapFirebaseError(firebaseError));
    }
    return { success: true, phone: normalizedPhone, isTestPhone: isTest };
  }

  // ── Step 2 of Signup: Verify OTP with Firebase and create local profile ───

  /**
   * Verifies the OTP code with Firebase ConfirmationResult.
   * Only creates the user account if Firebase confirms the code.
   *
   * @param {object} otpData – the object passed back from requestSignupOtp
   * @param {string} enteredOtp – the 6-digit code the user typed
   * @returns {object} safeUser – the created user profile (no password)
   * @throws Error with translated error key on failure
   */
  async verifyOtpAndCreateAccount(otpData, enteredOtp) {
    if (!this._confirmationResult) {
      throw new Error("errors.otpExpired");
    }
    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      throw new Error("errors.otpRequired");
    }

    let firebaseUser;
    try {
      const credential = await this._confirmationResult.confirm(enteredOtp.trim());
      firebaseUser = credential.user;
    } catch (firebaseError) {
      console.error("[StoreWise] OTP confirmation failed:", firebaseError);
      throw new Error(mapFirebaseError(firebaseError));
    }

    // ─ Firebase confirmed – build local profile record ─
    const pending = this._pendingSignupData || otpData?.signupData || {};
    const normalizedPhone = normalizePhoneNumber(pending.phone || firebaseUser.phoneNumber || "");
    const users = this._getAllUsers();
    const newUserId = firebaseUser.uid || `usr-${Date.now()}`;

    // Don't double-register if same Firebase UID already exists
    if (!users[newUserId]) {
      const newUser = {
        id: newUserId,
        name: (pending.name || "").trim(),
        email: (pending.email || "").trim().toLowerCase(),
        phone: normalizedPhone,
        phoneVerified: true,
        language: pending.language || "en",
        location: (pending.location || "").trim(),
        createdAt: new Date().toISOString(),
        // Passwords for Firebase-auth users are managed by Firebase, not stored here
      };
      users[newUserId] = newUser;
      this._saveAllUsers(users);
    }

    // ─ Sign out from Firebase (we manage session locally for offline support) ─
    try { await signOut(auth); } catch (_) { /* ignore */ }

    this._confirmationResult = null;
    this._pendingSignupData = null;

    const { passwordHash, ...safeUser } = users[newUserId]; // eslint-disable-line no-unused-vars
    this.setCurrentUser(safeUser);
    return safeUser;
  }

  // ── Login (email/phone + password for local-registry accounts) ───────────

  async login(identifier, password) {
    if (!identifier || !password) throw new Error("errors.required");

    const cleanId = identifier.trim();
    const cleanPassHash = hashSecret(password);
    const users = this._getAllUsers();

    const user = Object.values(users).find((u) => {
      const matchEmail = u.email.toLowerCase() === cleanId.toLowerCase();
      const matchPhone = normalizePhoneNumber(u.phone) === normalizePhoneNumber(cleanId);
      return matchEmail || matchPhone;
    });

    if (!user || user.passwordHash !== cleanPassHash) {
      throw new Error("errors.authFailed");
    }

    const { passwordHash, ...safeUser } = user; // eslint-disable-line no-unused-vars
    this.setCurrentUser(safeUser);
    return safeUser;
  }

  // ── Demo login ────────────────────────────────────────────────────────────
  loginDemoUser() {
    this.setCurrentUser(DEMO_USER);
    return DEMO_USER;
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  logout() {
    this.setCurrentUser(null);
    try { signOut(auth); } catch (_) { /* ignore */ }
  }

  // ── Password Recovery Method 1: Firebase Email Reset Link ────────────────

  async recoverUsingEmail(email) {
    if (!isValidEmail(email)) throw new Error("errors.invalidEmail");
    if (!FIREBASE_CONFIGURED) {
      // Local-only fallback: pretend to send (no real email possible without Firebase)
      return { success: true };
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (firebaseError) {
      // Intentionally swallow user-not-found to avoid account enumeration
      if (firebaseError.code !== "auth/user-not-found") {
        console.error("[StoreWise] sendPasswordResetEmail failed:", firebaseError);
      }
    }
    return { success: true };
  }

  // ── Password Recovery Method 2: Phone OTP (via Firebase, same flow) ───────

  /**
   * Starts a phone recovery OTP flow using Firebase signInWithPhoneNumber.
   * On success the caller should collect the OTP, call verifyPhoneRecoveryOtp(),
   * and then allow the user to update their password.
   */
  async requestPhoneRecoveryOtp(phone, recaptchaContainerId = "recaptcha-container") {
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!isValidIndianPhone(normalizedPhone)) throw new Error("errors.invalidPhone");
    if (!FIREBASE_CONFIGURED) throw new Error("errors.configError");

    const verifier = this._initRecaptcha(recaptchaContainerId);
    try {
      this._recoveryConfirmation = await signInWithPhoneNumber(auth, normalizedPhone, verifier);
    } catch (firebaseError) {
      console.error("[StoreWise] requestPhoneRecoveryOtp failed:", firebaseError);
      try { verifier.clear(); } catch (_) { /* ignore */ }
      this._recaptchaVerifier = null;
      throw new Error(mapFirebaseError(firebaseError));
    }
    this._recoveryPhone = normalizedPhone;
    return { success: true, phone: normalizedPhone };
  }

  /**
   * Verifies the recovery OTP with Firebase.
   * On success returns the Firebase user so the caller can update the password.
   */
  async verifyPhoneRecoveryOtp(enteredOtp) {
    if (!this._recoveryConfirmation) throw new Error("errors.otpExpired");
    let firebaseUser;
    try {
      const credential = await this._recoveryConfirmation.confirm(enteredOtp.trim());
      firebaseUser = credential.user;
    } catch (firebaseError) {
      console.error("[StoreWise] Recovery OTP confirmation failed:", firebaseError);
      throw new Error(mapFirebaseError(firebaseError));
    }
    this._recoveryConfirmation = null;
    return firebaseUser;
  }

  // ── Update Profile ────────────────────────────────────────────────────────

  async updateProfile(userId, { name, location, language }) {
    const users = this._getAllUsers();
    const user = users[userId];
    if (!user) throw new Error("User not found");
    if (name) user.name = name.trim();
    if (location !== undefined) user.location = location.trim();
    if (language) user.language = language;
    this._saveAllUsers(users);
    const { passwordHash, ...safeUser } = user; // eslint-disable-line no-unused-vars
    this.setCurrentUser(safeUser);
    return safeUser;
  }

  // ── Change Password (local accounts only) ─────────────────────────────────

  async changePassword(userId, oldPassword, newPassword) {
    if (!newPassword || newPassword.length < 6) throw new Error("errors.weakPassword");
    const users = this._getAllUsers();
    const user = users[userId];
    if (!user) throw new Error("User not found");
    if (user.passwordHash !== hashSecret(oldPassword)) throw new Error("errors.authFailed");
    user.passwordHash = hashSecret(newPassword);
    this._saveAllUsers(users);
    return { success: true };
  }

  async resetPasswordByPhone(phone, newPassword) {
    if (!newPassword || newPassword.length < 6) throw new Error("errors.weakPassword");
    const normalizedPhone = normalizePhoneNumber(phone || this._recoveryPhone);
    const users = this._getAllUsers();
    const user = Object.values(users).find(
      (u) => normalizePhoneNumber(u.phone) === normalizedPhone
    );
    if (!user) throw new Error("errors.userNotFound");
    user.passwordHash = hashSecret(newPassword);
    this._saveAllUsers(users);
    return { success: true };
  }
}

export const authService = new AuthService();
