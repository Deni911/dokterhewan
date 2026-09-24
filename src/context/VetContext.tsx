import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  loginVet,
  logoutVet,
  registerVet,
  onVetAuthStateChanged,
  type Vet,
} from "../services/vetAuthService";

interface VetContextType {
  vet: Vet | null;
  user: User | null;
  loading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    vetData: Omit<Vet, "uid" | "createdAt">,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const VetContext = createContext<VetContextType | undefined>(undefined);

const isValidEmail = (email: string) => {
  const normalized = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
};

const getFriendlyVetError = (error: any, defaultMessage: string) => {
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

export function VetProvider({ children }: { children: React.ReactNode }) {
  const [vet, setVet] = useState<Vet | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onVetAuthStateChanged((vetData, userData) => {
      setVet(vetData);
      setUser(userData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError("");
      setLoading(true);

      if (!email.trim() || !password.trim()) {
        throw new Error("Email dan password harus diisi");
      }

      if (!isValidEmail(email)) {
        throw new Error(
          "Email tidak valid. Gunakan format contoh@domain.com tanpa spasi.",
        );
      }

      await loginVet(email, password);
    } catch (err: any) {
      const errorMessage = getFriendlyVetError(err, "Login gagal");
      setError(errorMessage);
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    vetData: Omit<Vet, "uid" | "createdAt">,
  ) => {
    try {
      setError("");
      setLoading(true);

      if (!email.trim() || !password.trim()) {
        throw new Error("Email dan password harus diisi");
      }

      if (!isValidEmail(email)) {
        throw new Error(
          "Email tidak valid. Gunakan format contoh@domain.com tanpa spasi.",
        );
      }

      if (password.length < 6) {
        throw new Error("Password minimal 6 karakter");
      }

      await registerVet(email, password, vetData);
    } catch (err: any) {
      const errorMessage = getFriendlyVetError(err, "Register gagal");
      setError(errorMessage);
      console.error("Register error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError("");
      await logoutVet();
      setVet(null);
      setUser(null);
    } catch (err: any) {
      setError(err.message || "Logout gagal");
      console.error("Logout error:", err);
    }
  };

  const value: VetContextType = {
    vet,
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };

  return <VetContext.Provider value={value}>{children}</VetContext.Provider>;
}

export function useVet() {
  const context = useContext(VetContext);
  if (context === undefined) {
    throw new Error("useVet must be used within VetProvider");
  }
  return context;
}
