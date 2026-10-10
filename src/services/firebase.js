// StoreWise – Firebase Initialization
// Reads config from Vite environment variables (set in .env.local)
// NEVER commit real keys to source control.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Detect missing / placeholder config keys
const REQUIRED_KEYS = ["apiKey", "authDomain", "projectId", "appId"];
export const FIREBASE_CONFIGURED = REQUIRED_KEYS.every(
  (k) => Boolean(firebaseConfig[k]) && !firebaseConfig[k].includes("your_")
);

// Fallback config to prevent crash during module evaluation if .env.local is missing
const safeConfig = FIREBASE_CONFIGURED ? firebaseConfig : {
  apiKey: firebaseConfig.apiKey || "AIzaSy_Placeholder_Configure_Env_Local",
  authDomain: firebaseConfig.authDomain || "storewise-app.firebaseapp.com",
  projectId: firebaseConfig.projectId || "storewise-app",
  storageBucket: firebaseConfig.storageBucket || "storewise-app.appspot.com",
  messagingSenderId: firebaseConfig.messagingSenderId || "123456789012",
  appId: firebaseConfig.appId || "1:123456789012:web:placeholder",
};

// Initialize Firebase (singleton – safe to call multiple times)
const app = getApps().length ? getApp() : initializeApp(safeConfig);
export const auth = getAuth(app);

export default app;
