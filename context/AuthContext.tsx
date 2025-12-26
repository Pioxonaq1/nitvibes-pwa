"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
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

    // Cierre de sesión y fin de procesos al cerrar pestaña [cite: 2025-12-25]
    const handleTabClose = () => {
      sessionStorage.removeItem("user");
      // Detener procesos activos
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(() => {}); 
      }
    };

    window.addEventListener("beforeunload", handleTabClose);
    return () => window.removeEventListener("beforeunload", handleTabClose);
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    // Redirección inicial tras login
    if (userData.role === "viber") router.push("/viber/components/dashboard");
    else if (userData.role === "partner") router.push("/partner/venues/dashboard");
    else router.push("/perfil");
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/"); // Regresa a HOME al cerrar sesión [cite: 2021-12-21, 2025-12-25]
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
