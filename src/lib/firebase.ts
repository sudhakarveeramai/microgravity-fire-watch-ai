/**
 * Firebase Client & Data Persistence Layer
 * Provides Google Sign-In with Firebase Auth and Firestore persistence
 * for experiment bookmarks, mission notes, custom test runs, and Veo video generations.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  collection, 
  getDocs, 
  deleteDoc,
  query, 
  where,
  Firestore 
} from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';
import { ExperimentRecord } from '../types';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role?: string;
  department?: string;
  isSimulated?: boolean;
}

export interface UserSavedData {
  bookmarks: string[]; // experiment IDs
  customNotes: Record<string, string>; // experimentId -> note
  savedVideos: {
    id: string;
    prompt: string;
    aspectRatio: '16:9' | '9:16';
    createdAt: string;
    videoUrl?: string;
    thumbnailUrl?: string;
  }[];
}

// Merge configuration from provisioned firebase-applet-config.json and Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId || '',
  firestoreDatabaseId: import.meta.env.VITE_FIRESTORE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId || '',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

export let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    // Support named database if provisioned
    db = firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
    console.log('[Firebase] Initialized Firebase Auth & Firestore for project:', firebaseConfig.projectId);

    // Test Firestore connection on boot
    getDocFromServer(doc(db, 'test', 'connection')).catch((error) => {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.warn('[Firebase] Client is offline or Firestore requires rules verification:', error.message);
      }
    });
  } catch (err) {
    console.warn('[Firebase] Initialization error, falling back to local persistence:', err);
  }
}

// Local Storage Fallback Keys
const LOCAL_STORAGE_USER_KEY = 'firewatch_auth_user';
const LOCAL_STORAGE_DATA_KEY = 'firewatch_user_data_';

/**
 * Sign in using Google Sign-in with Firebase Auth
 */
export async function signInWithGoogle(): Promise<UserProfile> {
  if (auth && isFirebaseConfigured) {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      const profile: UserProfile = {
        uid: fbUser.uid,
        displayName: fbUser.displayName || 'NASA Researcher',
        email: fbUser.email,
        photoURL: fbUser.photoURL,
        role: 'Lead Microgravity Combustion Investigator',
        department: 'NASA Glenn Combustion Research Division',
        isSimulated: false,
      };

      // Persist user profile to Firestore
      if (db) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          await setDoc(userDocRef, {
            id: fbUser.uid,
            displayName: profile.displayName,
            email: profile.email || '',
            photoURL: profile.photoURL || '',
            role: profile.role,
            department: profile.department,
            updatedAt: new Date().toISOString()
          }, { merge: true });
        } catch (dbErr) {
          console.warn('[Firestore] Could not write user profile:', dbErr);
        }
      }

      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
      return profile;
    } catch (err: any) {
      console.warn('[Firebase Auth] Popup error or closed by user, checking fallback:', err);
      // Fall through to fallback simulation if blocked by popup policies
    }
  }

  // Graceful Local Fallback for development / preview environments
  const simulatedUser: UserProfile = {
    uid: 'nasa_investigator_alpha',
    displayName: 'Dr. Evelyn Vance',
    email: 'evelyn.vance@nasa.gov',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    role: 'Principal Investigator · Microgravity Fire Safety',
    department: 'Spacecraft Fire Safety Project (Saffire / ACME)',
    isSimulated: true,
  };

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(simulatedUser));
  return simulatedUser;
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  if (auth && isFirebaseConfigured) {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.error('[Firebase Auth] Signout error:', err);
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
}

/**
 * Listen for auth state changes
 */
export function subscribeToAuth(callback: (user: UserProfile | null) => void): () => void {
  if (auth && isFirebaseConfigured) {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        let role = 'Lead Microgravity Combustion Investigator';
        let department = 'NASA Glenn Combustion Research Division';

        // Attempt reading user profile from Firestore
        if (db) {
          try {
            const userSnap = await getDoc(doc(db, 'users', fbUser.uid));
            if (userSnap.exists()) {
              const uData = userSnap.data();
              if (uData.role) role = uData.role;
              if (uData.department) department = uData.department;
            }
          } catch {
            // Ignore offline errors
          }
        }

        const profile: UserProfile = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || 'NASA Researcher',
          email: fbUser.email,
          photoURL: fbUser.photoURL,
          role,
          department,
          isSimulated: false,
        };

        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
        callback(profile);
      } else {
        const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        callback(stored ? JSON.parse(stored) : null);
      }
    });
    return unsubscribe;
  }

  // Check localStorage for persisted user
  const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (stored) {
    try {
      callback(JSON.parse(stored));
    } catch {
      callback(null);
    }
  } else {
    callback(null);
  }

  return () => {};
}

/**
 * Fetch user data (bookmarks, notes, videos) from Firestore or localStorage
 */
export async function getUserSavedData(userId: string): Promise<UserSavedData> {
  const defaultData: UserSavedData = {
    bookmarks: ['saffire-1', 'flex-2', 'bass-pmma'],
    customNotes: {
      'saffire-1': 'Critical benchmark for Artemis vehicle cargo bay ventilation cutoff tests.',
      'flex-2': 'Demonstrates cool flame persistence down to 12% O2 without buoyant lift.'
    },
    savedVideos: []
  };

  if (db && isFirebaseConfigured) {
    try {
      // 1. Try reading user research data document
      const dataDocRef = doc(db, 'users', userId, 'data', 'userData');
      const docSnap = await getDoc(dataDocRef);
      if (docSnap.exists()) {
        const d = docSnap.data();
        return {
          bookmarks: d.bookmarks || defaultData.bookmarks,
          customNotes: d.customNotes || defaultData.customNotes,
          savedVideos: d.savedVideos || []
        };
      }
    } catch (err) {
      console.warn('[Firestore] Error reading user research data, using local cache:', err);
    }
  }

  // Read from localStorage
  const localStr = localStorage.getItem(LOCAL_STORAGE_DATA_KEY + userId);
  if (localStr) {
    try {
      return JSON.parse(localStr);
    } catch {
      return defaultData;
    }
  }

  // Seed default data
  localStorage.setItem(LOCAL_STORAGE_DATA_KEY + userId, JSON.stringify(defaultData));
  return defaultData;
}

/**
 * Save / toggle an experiment bookmark
 */
export async function toggleUserBookmark(userId: string, experimentId: string): Promise<string[]> {
  const data = await getUserSavedData(userId);
  const exists = data.bookmarks.includes(experimentId);
  const updatedBookmarks = exists 
    ? data.bookmarks.filter(id => id !== experimentId)
    : [...data.bookmarks, experimentId];

  data.bookmarks = updatedBookmarks;

  if (db && isFirebaseConfigured) {
    try {
      const dataDocRef = doc(db, 'users', userId, 'data', 'userData');
      await setDoc(dataDocRef, { 
        id: 'userData',
        userId,
        bookmarks: updatedBookmarks,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving bookmark:', err);
    }
  }

  localStorage.setItem(LOCAL_STORAGE_DATA_KEY + userId, JSON.stringify(data));
  return updatedBookmarks;
}

/**
 * Save user research note on an experiment
 */
export async function saveUserNote(userId: string, experimentId: string, note: string): Promise<void> {
  const data = await getUserSavedData(userId);
  data.customNotes[experimentId] = note;

  if (db && isFirebaseConfigured) {
    try {
      const dataDocRef = doc(db, 'users', userId, 'data', 'userData');
      await setDoc(dataDocRef, { 
        id: 'userData',
        userId,
        customNotes: data.customNotes,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving note:', err);
    }
  }

  localStorage.setItem(LOCAL_STORAGE_DATA_KEY + userId, JSON.stringify(data));
}

/**
 * Save a Veo generated video to user's research archive
 */
export async function saveUserGeneratedVideo(
  userId: string, 
  video: {
    prompt: string;
    aspectRatio: '16:9' | '9:16';
    videoUrl?: string;
    thumbnailUrl?: string;
  }
): Promise<UserSavedData['savedVideos']> {
  const data = await getUserSavedData(userId);
  const newEntry = {
    id: `veo-vid-${Date.now()}`,
    ...video,
    createdAt: new Date().toISOString()
  };

  data.savedVideos = [newEntry, ...data.savedVideos];

  if (db && isFirebaseConfigured) {
    try {
      // Save to subcollection `/users/{userId}/videos/{videoId}`
      const videoDocRef = doc(db, 'users', userId, 'videos', newEntry.id);
      await setDoc(videoDocRef, {
        id: newEntry.id,
        userId,
        prompt: newEntry.prompt,
        aspectRatio: newEntry.aspectRatio,
        videoUrl: newEntry.videoUrl || '',
        thumbnailUrl: newEntry.thumbnailUrl || '',
        createdAt: newEntry.createdAt
      });

      // Also mirror to user data document for rapid listing
      const dataDocRef = doc(db, 'users', userId, 'data', 'userData');
      await setDoc(dataDocRef, {
        savedVideos: data.savedVideos,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('[Firestore] Error saving generated video:', err);
    }
  }

  localStorage.setItem(LOCAL_STORAGE_DATA_KEY + userId, JSON.stringify(data));
  return data.savedVideos;
}

/**
 * Persist an added custom experiment record to Firestore
 */
export async function saveExperimentToFirestore(record: ExperimentRecord): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  try {
    const expDocRef = doc(db, 'experiments', record.id);
    await setDoc(expDocRef, {
      id: record.id,
      codeName: record.codeName,
      title: record.title,
      mission: record.mission,
      facility: record.facility,
      year: record.year,
      gravity: record.gravity,
      material: record.material,
      materialCategory: record.materialCategory,
      oxygenPercent: record.oxygenPercent,
      pressureKPa: record.pressureKPa,
      airflowCmS: record.airflowCmS,
      flameSpreadMmS: record.flameSpreadMmS,
      peakTemperatureK: record.peakTemperatureK,
      empiricalResult: record.empiricalResult,
      findings: record.findings,
      datasetTag: record.datasetTag || 'CUSTOM',
      createdAt: new Date().toISOString(),
      ...(auth?.currentUser ? { ownerId: auth.currentUser.uid } : {})
    }, { merge: true });
    console.log('[Firestore] Persisted experiment record:', record.id);
  } catch (err) {
    console.warn('[Firestore] Error persisting experiment:', err);
  }
}

/**
 * Delete a custom experiment record from Firestore
 */
export async function deleteExperimentFromFirestore(recordId: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  try {
    await deleteDoc(doc(db, 'experiments', recordId));
    console.log('[Firestore] Deleted experiment record:', recordId);
  } catch (err) {
    console.warn('[Firestore] Error deleting experiment from Firestore:', err);
  }
}
