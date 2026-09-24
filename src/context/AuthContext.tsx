import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ success: boolean; message: string }>;
  validateLogin: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; user?: User; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isValidEmail = (email: string) => {
  const normalized = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
};

const getFriendlyAuthError = (error: any, defaultMessage: string) => {
  const code = error?.code;

  switch (code) {
    case "auth/invalid-email":
      return "Format email tidak valid. Gunakan format contoh@domain.com";
    case "auth/user-not-found":
      return "Akun belum terdaftar. Silakan daftar terlebih dahulu.";
    case "auth/wrong-password":
      return "Password salah. Silakan cek kembali password Anda.";
    case "auth/invalid-credential":
      return "Email atau password salah. Silakan cek kembali data Anda.";
    case "auth/email-already-in-use":
      return "Email sudah terdaftar. Silakan gunakan email lain.";
    case "auth/weak-password":
      return "Password terlalu lemah. Gunakan minimal 6 karakter.";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan login. Coba beberapa saat lagi.";
    case "auth/network-request-failed":
      return "Koneksi jaringan bermasalah. Silakan coba lagi.";
    default:
      return error?.message || defaultMessage;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            // Get user data from Firestore
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data() as User;
              setUser(userData);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          setUser(null);
        }
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Register
  const register = async (
    email: string,
    password: string,
    name: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (!email.trim() || !password.trim() || !name.trim()) {
        return { success: false, message: "Semua field harus diisi" };
      }

      if (!isValidEmail(email)) {
        return {
          success: false,
          message:
            "Email tidak valid. Gunakan format contoh@domain.com tanpa spasi.",
        };
      }

      if (password.length < 6) {
        return { success: false, message: "Password minimal 6 karakter" };
      }

      // Create user in Firebase Auth first so Firebase validates duplicate emails.
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;

      // Store profile data under the authenticated UID, which is the safe Firestore key.
      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        email,
        phone: "",
        profilePicture: `https://ui-avatars.com/api/?name=${name}&background=random`,
        createdAt: serverTimestamp(),
      });

      return { success: true, message: "Register berhasil. Silakan login" };
    } catch (error: any) {
      console.error("Register error:", error);
      return {
        success: false,
        message: getFriendlyAuthError(error, "Register gagal"),
      };
    }
  };

  // Login
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (!email.trim() || !password.trim()) {
        return { success: false, message: "Email dan password harus diisi" };
      }

      if (!isValidEmail(email)) {
        return {
          success: false,
          message:
            "Email tidak valid. Gunakan format contoh@domain.com tanpa spasi.",
        };
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;

      // Get user data from Firestore
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        setUser(userData);
        return { success: true, message: "Login berhasil" };
      }

      return { success: false, message: "User tidak ditemukan" };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        message: getFriendlyAuthError(error, "Login gagal"),
      };
    }
  };

  // Validate Login (compatibility with existing code)
  const validateLogin = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: User; message: string }> => {
    const result = await login(email, password);
    if (result.success && user) {
      return { success: true, user, message: result.message };
    }
    return { success: false, message: result.message };
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, register, validateLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
