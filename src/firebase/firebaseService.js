// DALENZIA FEST 2K26 - Centralized Firebase Firestore & Cloud Synchronization Service
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db, auth, analytics } from "./config";

/**
 * Collections schema for DALENZIA FEST 2K26:
 * - 'registrations': Centralized registration desk records (Main Admin & Convener)
 * - 'students': Official Dalailussunna Dars student registry
 * - 'programmes': 83 official charter programmes across 5 categories
 * - 'evaluations': Judge score sheets and submitted evaluations
 * - 'system_config': Scoring configurations, marks schema, and festival metadata
 */

export const COLLECTIONS = {
  REGISTRATIONS: "registrations",
  STUDENTS: "students",
  PROGRAMMES: "programmes",
  EVALUATIONS: "evaluations",
  CONFIG: "system_config",
  LOGS: "audit_logs"
};

/**
 * Test connectivity with Firebase Firestore
 */
export async function testFirebaseConnection() {
  try {
    const testDocRef = doc(db, COLLECTIONS.CONFIG, "connectivity_status");
    await setDoc(testDocRef, {
      lastChecked: serverTimestamp(),
      festival: "DALENZIA FEST 2K26",
      edition: "NUEVA ERA",
      clientVersion: "2.6.0",
      status: "online"
    }, { merge: true });
    return { success: true, message: "Connected to Firebase Firestore (dalenzia-fest-2k26)" };
  } catch (err) {
    console.warn("Firebase Firestore connection notice:", err.message);
    return { success: false, message: err.message };
  }
}

/**
 * Save / Update a registration record to Firebase Firestore
 */
export async function syncRegistrationToFirebase(regRecord) {
  try {
    if (!regRecord || !regRecord.id) return { success: false, error: "Missing registration ID" };
    const docRef = doc(db, COLLECTIONS.REGISTRATIONS, String(regRecord.id));
    await setDoc(docRef, {
      ...regRecord,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true, id: regRecord.id };
  } catch (err) {
    console.warn("Failed to sync registration to Firebase:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Subscribe to real-time registration desk updates (Shared across Main Admin & Convener)
 */
export function subscribeToRegistrations(onUpdate, onError) {
  try {
    const colRef = collection(db, COLLECTIONS.REGISTRATIONS);
    return onSnapshot(colRef, (snapshot) => {
      const records = [];
      snapshot.forEach((doc) => {
        records.push({ ...doc.data(), id: doc.id });
      });
      if (onUpdate) onUpdate(records);
    }, (err) => {
      console.warn("Real-time registration listener fallback:", err);
      if (onError) onError(err);
    });
  } catch (err) {
    console.warn("Failed to initialize registration snapshot listener:", err);
    return () => {};
  }
}

/**
 * Sync scoring & marks configuration to Firebase Firestore
 */
export async function syncScoringConfigToFirebase(scoringConfig) {
  try {
    const docRef = doc(db, COLLECTIONS.CONFIG, "scoring_engine");
    await setDoc(docRef, {
      ...scoringConfig,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (err) {
    console.warn("Failed to sync scoring config to Firebase:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Export full festival snapshot to Firebase
 */
export async function syncFestivalStoreToCloud(storeData) {
  const results = {
    programmes: 0,
    registrations: 0,
    students: 0,
    errors: []
  };

  try {
    // 1. Sync programmes
    if (storeData.programmes && Array.isArray(storeData.programmes)) {
      for (const prog of storeData.programmes) {
        try {
          const docRef = doc(db, COLLECTIONS.PROGRAMMES, String(prog.id));
          await setDoc(docRef, { ...prog, syncedAt: serverTimestamp() }, { merge: true });
          results.programmes++;
        } catch (e) {
          results.errors.push(`Prog ${prog.id}: ${e.message}`);
        }
      }
    }

    // 2. Sync registrations
    if (storeData.registrations && Array.isArray(storeData.registrations)) {
      for (const reg of storeData.registrations) {
        try {
          const docRef = doc(db, COLLECTIONS.REGISTRATIONS, String(reg.id));
          await setDoc(docRef, { ...reg, syncedAt: serverTimestamp() }, { merge: true });
          results.registrations++;
        } catch (e) {
          results.errors.push(`Reg ${reg.id}: ${e.message}`);
        }
      }
    }

    return { success: true, results };
  } catch (err) {
    return { success: false, error: err.message, results };
  }
}
