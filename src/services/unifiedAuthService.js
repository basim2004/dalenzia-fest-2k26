// DALENZIA FEST 2K26 - UNIFIED PORTAL AUTHENTICATION SERVICE
// Standardized cross-portal authentication engine enforcing official RBAC:
// MAIN_ADMIN, CONVENER, JUDGE, TEAM_LEADER, STUDENT, STAGE_CONTROLLER

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updatePassword as fbUpdatePassword,
  signOut as fbSignOut
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { festivalStore } from "../admin/data/festivalStore";

export const PORTAL_ROLES = {
  MAIN_ADMIN: "MAIN_ADMIN",
  CONVENER: "CONVENER",
  JUDGE: "JUDGE",
  TEAM_LEADER: "TEAM_LEADER",
  STUDENT: "STUDENT",
  STAGE_CONTROLLER: "STAGE_CONTROLLER"
};

export const PORTAL_DOMAINS = {
  admin: PORTAL_ROLES.MAIN_ADMIN,
  convener: PORTAL_ROLES.CONVENER,
  judge: PORTAL_ROLES.JUDGE,
  teamleader: PORTAL_ROLES.TEAM_LEADER,
  student: PORTAL_ROLES.STUDENT,
  stagecontroller: PORTAL_ROLES.STAGE_CONTROLLER
};

export const ROLE_LABELS = {
  [PORTAL_ROLES.MAIN_ADMIN]: "Developer & Main Admin",
  [PORTAL_ROLES.CONVENER]: "Festival Convener",
  [PORTAL_ROLES.JUDGE]: "Official Adjudicator / Judge",
  [PORTAL_ROLES.TEAM_LEADER]: "Team Leader",
  [PORTAL_ROLES.STUDENT]: "Registered Student",
  [PORTAL_ROLES.STAGE_CONTROLLER]: "Stage Controller"
};

/**
 * Parse standard username (e.g. noufal@teamleader, judge01@judge, stu1001@student)
 */
export function parsePortalUsername(usernameInput) {
  if (!usernameInput) return { raw: '', user: '', domain: '', role: null };
  const clean = usernameInput.trim().toLowerCase();
  const atIndex = clean.lastIndexOf('@');
  if (atIndex <= 0) {
    return { raw: clean, user: clean, domain: '', role: null };
  }
  const user = clean.substring(0, atIndex);
  const domain = clean.substring(atIndex + 1);
  const role = PORTAL_DOMAINS[domain] || null;
  return { raw: clean, user, domain, role };
}

/**
 * Map user input to internal Firebase Auth email format without exposing it to the UI
 */
export function toInternalFirebaseAuthEmail(rawUsername) {
  const parsed = parsePortalUsername(rawUsername);
  const safeUser = parsed.user.replace(/[^a-z0-9._-]/g, '') || 'user';
  const safeDomain = parsed.domain ? parsed.domain.replace(/[^a-z0-9._-]/g, '') : 'portal';
  return `${safeUser}.${safeDomain}@auth.dalenziafest.in`;
}

/**
 * Unified Login Executor across all 6 portals
 */
export async function unifiedLogin(username, password, expectedRole) {
  const cleanUsername = (username || '').trim();
  const cleanPassword = (password || '').trim();

  if (!cleanUsername || !cleanPassword) {
    return { success: false, error: 'Please enter both your authorized username and password.' };
  }

  const parsed = parsePortalUsername(cleanUsername);

  // Validate username format
  if (!parsed.domain || !parsed.role) {
    const roleHints = {
      [PORTAL_ROLES.MAIN_ADMIN]: 'username@admin (e.g. basim@admin, admin@admin)',
      [PORTAL_ROLES.CONVENER]: 'username@convener (e.g. irfan@convener)',
      [PORTAL_ROLES.JUDGE]: 'username@judge (e.g. judge01@judge)',
      [PORTAL_ROLES.TEAM_LEADER]: 'username@teamleader (e.g. noufal@teamleader, hashim@teamleader)',
      [PORTAL_ROLES.STUDENT]: 'username@student (e.g. stu1001@student, c101@student)',
      [PORTAL_ROLES.STAGE_CONTROLLER]: 'username@stagecontroller (e.g. stage01@stagecontroller)'
    };
    return {
      success: false,
      error: `Invalid username format. Expected format: ${roleHints[expectedRole] || 'username@portal'}`
    };
  }

  // Enforce strict Role-Based Access Control (RBAC)
  if (expectedRole && parsed.role !== expectedRole) {
    return {
      success: false,
      error: `Access Denied: Account role (${ROLE_LABELS[parsed.role]}) is not authorized to access this portal (${ROLE_LABELS[expectedRole]}).`
    };
  }

  // 1. Verify credentials via Festival Data Store engine
  let storeRes;
  try {
    storeRes = festivalStore.verifyUnifiedLogin(cleanUsername, cleanPassword, expectedRole);
  } catch (err) {
    return { success: false, error: err.message || 'Authentication error.' };
  }

  if (!storeRes.success) {
    return storeRes;
  }

  const session = storeRes.session;

  // 2. Optional Firebase Auth synchronization in background
  try {
    const internalEmail = toInternalFirebaseAuthEmail(cleanUsername);
    try {
      await signInWithEmailAndPassword(auth, internalEmail, cleanPassword);
    } catch (fbAuthErr) {
      if (fbAuthErr.code === 'auth/user-not-found' || fbAuthErr.code === 'auth/invalid-credential') {
        // Attempt provisioning user account on Firebase Auth
        try {
          await createUserWithEmailAndPassword(auth, internalEmail, cleanPassword);
        } catch (provErr) {
          // Provisioning fallback notice in client console
        }
      }
    }
  } catch (e) {
    // Graceful offline/network-free fallback
  }

  return {
    success: true,
    session,
    mustChangePassword: Boolean(session.mustChangePassword)
  };
}

/**
 * Unified Password Change Executor
 */
export async function unifiedChangePassword(role, accountId, oldPassword, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters.');
  }
  if (oldPassword === newPassword) {
    throw new Error('New password cannot be the same as the previous password.');
  }

  // Update in festival store
  const res = festivalStore.updateUnifiedPassword(role, accountId, oldPassword, newPassword);

  // Sync with Firebase Auth if current user is active
  try {
    if (auth.currentUser) {
      await fbUpdatePassword(auth.currentUser, newPassword);
    }
  } catch (e) {
    // fallback if Firebase auth token expired
  }

  // Log in Firestore without storing plaintext password
  try {
    const accountRef = doc(db, "portal_accounts", `${role}_${accountId}`);
    await setDoc(accountRef, {
      role,
      accountId,
      passwordChanged: true,
      lastPasswordUpdate: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    // offline fallback
  }

  return res;
}

/**
 * Unified Account Management Data Fetcher (Admin & Convener)
 */
export function getUnifiedPortalAccounts() {
  return festivalStore.getUnifiedAccounts();
}

/**
 * Toggle Portal Account Activation
 */
export function togglePortalAccountStatus(role, accountId, newStatus) {
  return festivalStore.setUnifiedAccountStatus(role, accountId, newStatus);
}

/**
 * Reset Portal Account to Initial Password
 */
export function resetPortalAccountPassword(role, accountId) {
  return festivalStore.resetUnifiedAccountPassword(role, accountId);
}

export default {
  PORTAL_ROLES,
  PORTAL_DOMAINS,
  ROLE_LABELS,
  parsePortalUsername,
  toInternalFirebaseAuthEmail,
  unifiedLogin,
  unifiedChangePassword,
  getUnifiedPortalAccounts,
  togglePortalAccountStatus,
  resetPortalAccountPassword
};
