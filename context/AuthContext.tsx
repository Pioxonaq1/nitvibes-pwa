"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  login: (userData: any, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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
    // Si viene como (email, pass), simulamos el objeto para no romper páginas antiguas
    const profile = password ? { email: userData, role: "gov" } : userData;
    setUser(profile);
    sessionStorage.setItem("user", JSON.stringify(profile));
    
    if (profile.role === "viber") router.push("/viber/components/dashboard");
    else if (profile.role === "partner") router.push("/partner/venues/dashboard");
    else if (profile.role === "gov") router.push("/gov/dashboard");
    else router.push("/perfil");
  };

  const loginWithGoogle = async () => {
    const mockGoogleUser = { email: "user@google.com", role: "viber", name: "Google User" };
    await login(mockGoogleUser);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
