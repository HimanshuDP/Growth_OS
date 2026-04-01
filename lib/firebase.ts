// ─── Firebase Client ──────────────────────────────────────────────────────────

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Firestore,
  Timestamp,
} from 'firebase/firestore';
import type { BusinessProfile, WeeklyCalendar } from '@/types';

// ─── Firebase Config ──────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ─── Lazy initialization ──────────────────────────────────────────────────────

export let app: FirebaseApp | null = null;
export let db: Firestore | null = null;

function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null;
  if (!app) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  return app;
}

function getDB(): Firestore | null {
  if (db) return db;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  db = getFirestore(firebaseApp);
  return db;
}

// Pre-initialize for direct exports if config is available
if (typeof window !== 'undefined') {
  getDB();
}

// ─── Business Profile CRUD ────────────────────────────────────────────────────

export async function saveBusinessProfile(profile: BusinessProfile): Promise<void> {
  const database = getDB();
  if (!database) {
    // Fallback: save to localStorage
    localStorage.setItem('growthOS_business', JSON.stringify(profile));
    return;
  }

  await setDoc(doc(database, 'businesses', profile.id), {
    ...profile,
    createdAt: Timestamp.fromDate(new Date(profile.createdAt)),
  });

  // Also save to localStorage for quick access
  localStorage.setItem('growthOS_business', JSON.stringify(profile));
}

export async function getBusinessProfile(id: string): Promise<BusinessProfile | null> {
  // Try localStorage first (fast)
  try {
    const stored = localStorage.getItem('growthOS_business');
    if (stored) return JSON.parse(stored) as BusinessProfile;
  } catch {
    // continue to Firestore
  }

  const database = getDB();
  if (!database) return null;

  const snap = await getDoc(doc(database, 'businesses', id));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  } as BusinessProfile;
}

// ─── Calendar CRUD ────────────────────────────────────────────────────────────

export async function saveCalendar(calendar: WeeklyCalendar): Promise<void> {
  const database = getDB();
  if (!database) {
    localStorage.setItem('growthOS_calendar', JSON.stringify(calendar));
    return;
  }

  await setDoc(
    doc(database, 'calendars', `${calendar.businessId}_${calendar.weekStartDate}`),
    calendar
  );
  localStorage.setItem('growthOS_calendar', JSON.stringify(calendar));
}

export async function getLatestCalendar(businessId: string): Promise<WeeklyCalendar | null> {
  try {
    const stored = localStorage.getItem('growthOS_calendar');
    if (stored) return JSON.parse(stored) as WeeklyCalendar;
  } catch {
    // continue
  }

  const database = getDB();
  if (!database) return null;

  const q = query(
    collection(database, 'calendars'),
    orderBy('weekStartDate', 'desc'),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as WeeklyCalendar;
}
