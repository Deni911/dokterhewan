import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXglP3ddLgNTpjvTvF-mQ8HBPcT5MrjJk",
  authDomain: "healthypet-62dd9.firebaseapp.com",
  projectId: "healthypet-62dd9",
  storageBucket: "healthypet-62dd9.firebasestorage.app",
  messagingSenderId: "723505846624",
  appId: "1:723505846624:web:22645e7bd4f3a7b408a605",
  measurementId: "G-44K27GLK4V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Set persistence (user tetap login meski refresh browser)
setPersistence(auth, browserLocalPersistence).catch((error) =>
  console.error("Persistence error:", error)
);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage (untuk upload foto)
export const storage = getStorage(app);

export default app;
