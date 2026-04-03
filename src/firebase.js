// src/firebase.js
// ─────────────────────────────────────────────
// Replace the values below with your Firebase project config.
// Firebase Console → Project Settings → Your Apps → SDK setup
// ─────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔧 Replace these with your actual Firebase credentials
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1lg4Mnl2LACiyXifWi5qgE2j6ZH-8OAI",
  authDomain: "localbridgeshare.firebaseapp.com",
  projectId: "localbridgeshare",
  storageBucket: "localbridgeshare.firebasestorage.app",
  messagingSenderId: "193893315063",
  appId: "1:193893315063:web:5e1040b9cdf1f7b9efbef2",
  measurementId: "G-K14K9QLHQY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);

export default app;
