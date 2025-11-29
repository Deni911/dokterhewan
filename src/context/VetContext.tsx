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
    vetData: Omit<Vet, "uid" | "createdAt">
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const VetContext = createContext<VetContextType | undefined>(undefined);

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
      await loginVet(email, password);
    } catch (err: any) {
      const errorMessage = err.message || "Login gagal";
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
    vetData: Omit<Vet, "uid" | "createdAt">
  ) => {
    try {
      setError("");
      setLoading(true);
      await registerVet(email, password, vetData);
    } catch (err: any) {
      const errorMessage = err.message || "Register gagal";
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
