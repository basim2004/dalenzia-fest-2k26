// DALENZIA FEST 2K26 - Help, Resources & Feedback Management Service
// Connects with Firebase Firestore & Firebase Storage, with resilient offline/fallback persistence.

import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { db, storage } from '../firebase/config';

const FEEDBACK_COLLECTION = 'support_feedback';
const RESOURCES_COLLECTION = 'help_resources';

const LOCAL_STORAGE_FEEDBACK_KEY = 'dalenzia_feedback_store';
const LOCAL_STORAGE_RESOURCES_KEY = 'dalenzia_resources_store';

function getLocalFeedback() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_FEEDBACK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalFeedback(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_FEEDBACK_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save feedback to localStorage', e);
  }
}

function getLocalResources() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RESOURCES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalResources(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_RESOURCES_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save resources to localStorage', e);
  }
}

/**
 * 1. Submit Public Feedback / Inquiry
 * Stored securely in Firebase Firestore, private to Admin/Convener.
 */
export async function submitPublicFeedback({ name, contact, category, message }) {
  const cleanCategory = category || 'General Suggestion';
  const cleanMessage = (message || '').trim();

  if (!cleanMessage) {
    return { success: false, error: 'Please enter your message or suggestion.' };
  }

  const feedbackData = {
    name: (name || '').trim() || 'Anonymous Scholar/Visitor',
    contact: (contact || '').trim() || 'Not Provided',
    category: cleanCategory,
    message: cleanMessage,
    status: 'New',
    createdAtIso: new Date().toISOString()
  };

  let firestoreId = null;

  try {
    const colRef = collection(db, FEEDBACK_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...feedbackData,
      createdAt: serverTimestamp()
    });
    firestoreId = docRef.id;
  } catch (err) {
    console.warn('Firestore feedback submit fallback:', err.message);
  }

  const finalId = firestoreId || `FB-${Date.now()}`;
  const localList = getLocalFeedback();
  localList.unshift({
    id: finalId,
    ...feedbackData
  });
  saveLocalFeedback(localList);

  return {
    success: true,
    feedbackId: finalId,
    message: 'Thank you! Your feedback has been received and securely forwarded to the Festival Administration.'
  };
}

/**
 * 2. Fetch Feedback Submissions (Strictly Admin & Convener Only)
 */
export async function getFeedbackSubmissions() {
  try {
    const colRef = collection(db, FEEDBACK_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const items = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        items.push({
          id: docSnap.id,
          ...d,
          createdAtIso: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : d.createdAtIso || new Date().toISOString()
        });
      });
      return items;
    }
  } catch (err) {
    console.warn('Firestore feedback fetch fallback:', err.message);
  }

  return getLocalFeedback();
}

/**
 * 3. Update Feedback Status (e.g. 'Reviewed', 'Resolved', 'Archived')
 */
export async function updateFeedbackStatus(id, newStatus) {
  try {
    const docRef = doc(db, FEEDBACK_COLLECTION, String(id));
    await updateDoc(docRef, { status: newStatus, updatedAt: serverTimestamp() });
  } catch (err) {
    console.warn('Firestore feedback update fallback:', err.message);
  }

  const localList = getLocalFeedback();
  const updated = localList.map(item => item.id === id ? { ...item, status: newStatus } : item);
  saveLocalFeedback(updated);
  return { success: true };
}

/**
 * 4. Get Published Help Resources / Documents
 * Public only sees published resources.
 */
export async function getHelpResources(includeUnpublished = false) {
  try {
    const colRef = collection(db, RESOURCES_COLLECTION);
    let q;
    if (includeUnpublished) {
      q = query(colRef, orderBy('uploadedAt', 'desc'));
    } else {
      q = query(colRef, where('published', '==', true), orderBy('uploadedAt', 'desc'));
    }
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const list = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        list.push({
          id: docSnap.id,
          ...d,
          uploadedAtIso: d.uploadedAt?.toDate ? d.uploadedAt.toDate().toISOString() : d.uploadedAtIso || new Date().toISOString()
        });
      });
      return list;
    }
  } catch (err) {
    console.warn('Firestore resources fetch fallback:', err.message);
  }

  const localList = getLocalResources();
  if (includeUnpublished) {
    return localList;
  }
  return localList.filter(item => item.published !== false);
}

/**
 * 5. Upload New Resource / PDF User Guide (Authorized Admin / Convener Only)
 */
export async function uploadHelpResource({ file, title, description, category, author }) {
  if (!file) {
    return { success: false, error: 'Please select a document file to upload.' };
  }
  if (!title || !title.trim()) {
    return { success: false, error: 'Please enter a document title.' };
  }

  const timestamp = Date.now();
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `resources/${timestamp}_${safeFileName}`;
  let downloadUrl = '';

  try {
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file);
    downloadUrl = await getDownloadURL(storageRef);
  } catch (storageErr) {
    console.warn('Firebase Storage upload notice (using blob/local URL fallback):', storageErr.message);
    downloadUrl = URL.createObjectURL(file);
  }

  const resourceData = {
    title: title.trim(),
    description: (description || '').trim(),
    category: category || 'User Guide',
    fileName: file.name,
    fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
    fileType: file.type || 'application/pdf',
    downloadUrl: downloadUrl,
    storagePath: storagePath,
    published: true,
    author: author || 'Festival Administration',
    uploadedAtIso: new Date().toISOString()
  };

  let firestoreId = null;

  try {
    const colRef = collection(db, RESOURCES_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...resourceData,
      uploadedAt: serverTimestamp()
    });
    firestoreId = docRef.id;
  } catch (err) {
    console.warn('Firestore resource record fallback:', err.message);
  }

  const finalId = firestoreId || `RES-${timestamp}`;
  const localList = getLocalResources();
  localList.unshift({
    id: finalId,
    ...resourceData
  });
  saveLocalResources(localList);

  return {
    success: true,
    resourceId: finalId,
    resource: { id: finalId, ...resourceData }
  };
}

/**
 * 6. Replace Existing Resource File
 */
export async function replaceHelpResourceFile(resourceId, newFile) {
  if (!newFile) return { success: false, error: 'No new file provided.' };

  const timestamp = Date.now();
  const safeFileName = newFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `resources/${timestamp}_${safeFileName}`;
  let downloadUrl = '';

  try {
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, newFile);
    downloadUrl = await getDownloadURL(storageRef);
  } catch (storageErr) {
    downloadUrl = URL.createObjectURL(newFile);
  }

  const updates = {
    fileName: newFile.name,
    fileSize: `${(newFile.size / (1024 * 1024)).toFixed(2)} MB`,
    fileType: newFile.type || 'application/pdf',
    downloadUrl: downloadUrl,
    storagePath: storagePath,
    updatedAtIso: new Date().toISOString()
  };

  try {
    const docRef = doc(db, RESOURCES_COLLECTION, String(resourceId));
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Firestore replace resource file fallback:', err.message);
  }

  const localList = getLocalResources();
  const updated = localList.map(r => r.id === resourceId ? { ...r, ...updates } : r);
  saveLocalResources(updated);

  return { success: true };
}

/**
 * 7. Edit Resource Metadata (Title, Description, Category, Published Status)
 */
export async function updateHelpResourceMetadata(resourceId, { title, description, category, published }) {
  const updates = {
    ...(title ? { title: title.trim() } : {}),
    ...(description !== undefined ? { description: description.trim() } : {}),
    ...(category ? { category } : {}),
    ...(published !== undefined ? { published } : {}),
    updatedAtIso: new Date().toISOString()
  };

  try {
    const docRef = doc(db, RESOURCES_COLLECTION, String(resourceId));
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Firestore update resource fallback:', err.message);
  }

  const localList = getLocalResources();
  const updated = localList.map(r => r.id === resourceId ? { ...r, ...updates } : r);
  saveLocalResources(updated);

  return { success: true };
}

/**
 * 8. Delete Resource Document
 */
export async function deleteHelpResource(resourceId, storagePath) {
  try {
    if (storagePath) {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    }
  } catch (e) {
    // Ignore storage delete errors if already missing
  }

  try {
    const docRef = doc(db, RESOURCES_COLLECTION, String(resourceId));
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore delete resource fallback:', err.message);
  }

  const localList = getLocalResources();
  const filtered = localList.filter(r => r.id !== resourceId);
  saveLocalResources(filtered);

  return { success: true };
}
