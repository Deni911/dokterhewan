import { auth, db } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

export interface Vet {
  uid: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  clinic: string;
  createdAt?: Timestamp;
}

// Register vet baru
export const registerVet = async (
  email: string,
  password: string,
  vetData: Omit<Vet, "uid" | "createdAt">
): Promise<Vet> => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // Save vet data to Firestore
    const vetDoc: Vet = {
      uid,
      ...vetData,
      createdAt: Timestamp.now(),
    };

    await setDoc(doc(db, "vets", uid), vetDoc);
    console.log("Vet registered successfully");
    return vetDoc;
  } catch (error) {
    console.error("Error registering vet:", error);
    throw error;
  }
};

// Login vet
export const loginVet = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const uid = userCredential.user.uid;

    // Get vet data from Firestore
    const vetDocSnap = await getDoc(doc(db, "vets", uid));

    if (!vetDocSnap.exists()) {
      throw new Error("Vet data tidak ditemukan");
    }

    const vetData = vetDocSnap.data() as Vet;
    console.log("Vet login successful:", vetData);
    return vetData;
  } catch (error) {
    console.error("Error logging in vet:", error);
    throw error;
  }
};

// Logout vet
export const logoutVet = async () => {
  try {
    await signOut(auth);
    console.log("Vet logged out");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Get current vet
export const getCurrentVet = async (user: User): Promise<Vet | null> => {
  try {
    const vetDocSnap = await getDoc(doc(db, "vets", user.uid));

    if (!vetDocSnap.exists()) {
      return null;
    }

    return vetDocSnap.data() as Vet;
  } catch (error) {
    console.error("Error getting vet:", error);
    return null;
  }
};

// Listen to vet auth state changes
export const onVetAuthStateChanged = (
  callback: (vet: Vet | null, user: User | null) => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const vet = await getCurrentVet(user);
      callback(vet, user);
    } else {
      callback(null, null);
    }
  });
};
