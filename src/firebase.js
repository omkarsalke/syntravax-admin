import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyChPTXTtcPo3DeAur7-Vk2UKPF_9yOHhzU",
  authDomain: "syntravax-7427c.firebaseapp.com",
  projectId: "syntravax-7427c",
  storageBucket: "syntravax-7427c.firebasestorage.app",
  messagingSenderId: "442325035605",
  appId: "1:442325035605:web:5ec3b474d36b78edf802dc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── MULTI-TENANT HELPERS ──────────────────────────────────
// Use these everywhere instead of collection(db, "staff") etc.

export const companyDoc = (companyId) =>
  doc(db, "companies", companyId);

export const staffCol = (companyId) =>
  collection(db, "companies", companyId, "staff");

export const tasksCol = (companyId) =>
  collection(db, "companies", companyId, "tasks");

export const attendanceCol = (companyId) =>
  collection(db, "companies", companyId, "attendance");

export const completionsCol = (companyId) =>
  collection(db, "companies", companyId, "completions");

export const settingsDoc = (companyId) =>
  doc(db, "companies", companyId, "settings", "wifi");