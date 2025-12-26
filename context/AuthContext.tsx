"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  login: (userData: any, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  setExternalUser: (userData: any) => void; // Compatibilidad Partner [cite: 2025-12-26]
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);

    const handleTabClose = () => {
      sessionStorage.removeItem("user");
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(() => {}); 
      }
    };

    window.addEventListener("beforeunload", handleTabClose);
    return () => window.removeEventListener("beforeunload", handleTabClose);
  }, []);

  const login = async (userData: any, password?: string) => {
    const profile = password ? { email: userData, role: "gov" } : userData;
    setUser(profile);
    sessionStorage.setItem("user", JSON.stringify(profile));
    
    // Redirección lógica inmediata [cite: 2021-12-21, 2025-12-25]
    if (profile.role === "viber") router.push("/viber/components/dashboard");
    else if (profile.role === "partner") router.push("/partner/venues/dashboard");
    else if (profile.role === "gov") router.push("/gov/dashboard");
    else router.push("/perfil");
  };

  const loginWithGoogle = async () => {
    const mockViber = { email: "user@gmail.com", role: "viber", name: "Viber User" };
    await login(mockViber);
  };

  const setExternalUser = (userData: any) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/"); // Logout a Home [cite: 2021-12-21, 2025-12-25]
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, setExternalUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
