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
import { db, auth, analytics } from "./config.js";

const isIsolatedTestEnv = () => Boolean(typeof globalThis !== 'undefined' && globalThis.__DALENZIA_ISOLATED_TEST__);

/**
 * Collections schema for DALENZIA FEST 2K26:
 * - 'registrations': Centralized registration desk records (Main Admin & Convener)
 * - 'students': Official Dalailussunna Dars student registry (46 scholars)
 * - 'programmes': 77 official charter programmes across Sub Junior, Junior, Senior, General
 * - 'evaluations': Judge score sheets and submitted evaluations
 * - 'published_results': Verified and published competition results & posters
 * - 'system_config': Scoring configurations, marks schema, and festival metadata
 */

export const COLLECTIONS = {
  REGISTRATIONS: "registrations",
  STUDENTS: "students",
  PROGRAMMES: "programmes",
  SCHEDULES: "programme_schedules",
  EVALUATIONS: "evaluations",
  PUBLISHED_RESULTS: "published_results",
  TEAMS: "teams",
  TEAM_ALLOCATIONS: "team_allocations",
  CONFIG: "system_config",
  LOGS: "audit_logs"
};

/**
 * Save / Update a Team record to Firebase Firestore
 */
export async function syncTeamToFirebase(teamRecord) {
  try {
    if (isIsolatedTestEnv() || !teamRecord || !teamRecord.id) return { success: false, error: "Skipped or missing team ID" };
    const docRef = doc(db, COLLECTIONS.TEAMS, String(teamRecord.id));
    await setDoc(docRef, {
      ...teamRecord,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true, id: teamRecord.id };
  } catch (err) {
    console.warn("Failed to sync team to Firebase:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Save / Update a student team assignment in Firebase Firestore
 */
export async function syncStudentTeamAssignmentToFirebase(assignment) {
  try {
    if (!assignment || !assignment.studentId) return { success: false, error: "Missing student ID" };
    const docRef = doc(db, COLLECTIONS.TEAM_ALLOCATIONS, String(assignment.studentId));
    await setDoc(docRef, {
      ...assignment,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (err) {
    console.warn("Failed to sync student team assignment to Firebase:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Record a team allocation audit log entry to Firebase Firestore
 */
export async function syncTeamAuditLogToFirebase(logEntry) {
  try {
    const docRef = doc(db, COLLECTIONS.LOGS, logEntry.id || `LOG-${Date.now()}`);
    await setDoc(docRef, {
      ...logEntry,
      syncedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (err) {
    console.warn("Failed to sync team audit log to Firebase:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Subscribe to real-time teams updates (Shared across Team Leader, Convener & Main Admin)
 */
export function subscribeToTeams(onUpdate, onError) {
  try {
    const colRef = collection(db, COLLECTIONS.TEAMS);
    return onSnapshot(colRef, (snapshot) => {
      const records = [];
      snapshot.forEach((doc) => {
        records.push({ ...doc.data(), id: doc.id });
      });
      if (onUpdate) onUpdate(records);
    }, (err) => {
      console.warn("Real-time teams listener fallback:", err);
      if (onError) onError(err);
    });
  } catch (err) {
    console.warn("Failed to initialize teams snapshot listener:", err);
    return () => {};
  }
}

/**
 * Subscribe to real-time student registry updates from Firebase Firestore
 */
export function subscribeToStudents(onUpdate, onError) {
  try {
    const colRef = collection(db, COLLECTIONS.STUDENTS);
    return onSnapshot(colRef, (snapshot) => {
      const records = [];
      snapshot.forEach((doc) => {
        records.push({ ...doc.data(), id: doc.id });
      });
      if (onUpdate) onUpdate(records);
    }, (err) => {
      console.warn("Real-time students listener fallback:", err);
      if (onError) onError(err);
    });
  } catch (err) {
    console.warn("Failed to initialize students snapshot listener:", err);
    return () => {};
  }
}

/**
 * Fetch all students from Firebase Firestore
 */
export async function fetchStudentsFromFirebase() {
  try {
    const colRef = collection(db, COLLECTIONS.STUDENTS);
    const snapshot = await getDocs(colRef);
    const records = [];
    snapshot.forEach((doc) => {
      records.push({ ...doc.data(), id: doc.id });
    });
    return { success: true, students: records };
  } catch (err) {
    console.warn("Failed to fetch students from Firebase Firestore:", err);
    return { success: false, error: err.message, students: [] };
  }
}

/**
 * Save / Update a single student record in Firebase Firestore
 */
export async function syncStudentToFirebase(student) {
  try {
    if (!student || !student.id) return { success: false, error: "Missing student ID" };
    const docRef = doc(db, COLLECTIONS.STUDENTS, String(student.id));
    await setDoc(docRef, {
      ...student,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true, id: student.id };
  } catch (err) {
    console.warn("Failed to sync student to Firebase:", err);
    return { success: false, error: err.message };
  }
}

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
    if (isIsolatedTestEnv() || !db || !scoringConfig) return { success: false };
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

/**
 * Save / Update a Programme Schedule entry in Firebase Firestore
 */
export async function syncScheduleToFirebase(scheduleEntry) {
  try {
    if (!db) return { success: false, error: "Firebase not initialized" };
    const docId = String(scheduleEntry.id);
    const docRef = doc(db, COLLECTIONS.SCHEDULES, docId);
    await setDoc(docRef, {
      ...scheduleEntry,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error syncing schedule to Firebase:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch all Programme Schedules from Firebase Firestore
 */
export async function fetchSchedulesFromFirebase() {
  try {
    if (!db) return [];
    const colRef = collection(db, COLLECTIONS.SCHEDULES);
    const snapshot = await getDocs(colRef);
    const schedules = [];
    snapshot.forEach(d => {
      schedules.push({ id: d.id, ...d.data() });
    });
    return schedules;
  } catch (error) {
    console.error("Error fetching schedules from Firebase:", error);
    return [];
  }
}

/**
 * Real-time listener for Programme Schedules
 */
export function subscribeToSchedules(callback) {
  if (!db) return () => {};
  const colRef = collection(db, COLLECTIONS.SCHEDULES);
  return onSnapshot(colRef, (snapshot) => {
    const list = [];
    snapshot.forEach(d => list.push({ id: d.id, ...d.data() }));
    callback(list);
  }, (err) => {
    console.error("Schedule subscription error:", err);
  });
}

/**
 * Delete a Programme Schedule entry from Firebase Firestore
 */
export async function deleteScheduleFromFirebase(scheduleId) {
  try {
    if (!db) return { success: false, error: "Firebase not initialized" };
    const { deleteDoc } = await import("firebase/firestore");
    const docRef = doc(db, COLLECTIONS.SCHEDULES, String(scheduleId));
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting schedule from Firebase:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Sync an active competition / programme assignment to Firestore
 */
export async function syncCompetitionToFirebase(competitionData) {
  try {
    if (isIsolatedTestEnv() || !db || !competitionData?.id) return { success: false, error: "Invalid competition data or Firebase unavailable" };
    const compRef = doc(db, COLLECTIONS.PROGRAMMES, String(competitionData.id));
    await setDoc(compRef, {
      ...competitionData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error syncing competition to Firebase:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Real-time listener for active competitions / programme assignments
 */
export function subscribeToCompetitions(onUpdate, onError) {
  if (isIsolatedTestEnv() || !db) return () => {};
  try {
    const colRef = collection(db, COLLECTIONS.PROGRAMMES);
    return onSnapshot(colRef, (snapshot) => {
      const list = [];
      snapshot.forEach(d => list.push({ id: d.id, ...d.data() }));
      onUpdate(list);
    }, (err) => {
      console.error("Competitions subscription error:", err);
      if (onError) onError(err);
    });
  } catch (error) {
    return () => {};
  }
}

/**
 * Sync judge evaluation / approval status to Firestore
 */
export async function syncEvaluationToFirebase(evaluationData) {
  try {
    if (isIsolatedTestEnv() || !db || !evaluationData?.id) return { success: false, error: "Invalid evaluation data" };
    const evalRef = doc(db, COLLECTIONS.EVALUATIONS, String(evaluationData.id));
    await setDoc(evalRef, {
      ...evaluationData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error syncing evaluation to Firebase:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Real-time listener for judge evaluations & approvals
 */
export function subscribeToEvaluations(onUpdate, onError) {
  if (isIsolatedTestEnv() || !db) return () => {};
  try {
    const colRef = collection(db, COLLECTIONS.EVALUATIONS);
    return onSnapshot(colRef, (snapshot) => {
      const list = [];
      snapshot.forEach(d => list.push({ id: d.id, ...d.data() }));
      onUpdate(list);
    }, (err) => {
      console.error("Evaluations subscription error:", err);
      if (onError) onError(err);
    });
  } catch (error) {
    return () => {};
  }
}

/**
 * Sync official published result poster / verification state to Firestore
 */
export async function syncPublishedResultToFirebase(resultData) {
  try {
    if (isIsolatedTestEnv() || !db || !resultData?.competitionId) return { success: false, error: "Invalid published result" };
    const resRef = doc(db, COLLECTIONS.PUBLISHED_RESULTS, String(resultData.competitionId));
    await setDoc(resRef, {
      ...resultData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error syncing published result to Firebase:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Real-time listener for official published results
 */
export function subscribeToPublishedResults(onUpdate, onError) {
  if (!db) return () => {};
  try {
    const colRef = collection(db, COLLECTIONS.PUBLISHED_RESULTS);
    return onSnapshot(colRef, (snapshot) => {
      const list = [];
      snapshot.forEach(d => list.push({ id: d.id, ...d.data() }));
      onUpdate(list);
    }, (err) => {
      console.error("Published results subscription error:", err);
      if (onError) onError(err);
    });
  } catch (error) {
    return () => {};
  }
}

/**
 * Real-time listener for Scoring Config document
 */
export function subscribeToScoringConfig(onUpdate, onError) {
  if (isIsolatedTestEnv() || !db) return () => {};
  try {
    const configRef = doc(db, COLLECTIONS.CONFIG, "scoring_engine");
    return onSnapshot(configRef, (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data());
      }
    }, (err) => {
      if (onError) onError(err);
    });
  } catch (error) {
    return () => {};
  }
}

/**
 * Save pre-migration charter v1 snapshot safely into Firestore system_config
 */
export async function syncCharterMigrationBackupToFirebase(backupSnapshot) {
  try {
    if (isIsolatedTestEnv() || !db) return { success: false, error: "Firebase not initialized" };
    const backupRef = doc(db, COLLECTIONS.CONFIG, "charter_v1_backup");
    await setDoc(backupRef, {
      ...backupSnapshot,
      backedUpAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

