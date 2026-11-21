// DALENZIA FEST 2K26 - Official Firebase Configuration & Services
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCPZUUrCn3xpsw9eYRDdTZU6M28X6De8Kc",
  authDomain: "dalenzia-fest-2k26.firebaseapp.com",
  projectId: "dalenzia-fest-2k26",
  storageBucket: "dalenzia-fest-2k26.firebasestorage.app",
  messagingSenderId: "549822904024",
  appId: "1:549822904024:web:e1214e761d4753f80289ad",
  measurementId: "G-4W1XVXX8CF"
};

// Initialize Firebase (guarding against multiple initializations in HMR / dev mode)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (safely initialized only in supported browser environments)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics fallback in local/offline modes
  });
}

export default app;
