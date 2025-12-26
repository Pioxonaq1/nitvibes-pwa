"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  login: (userData: any, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  setExternalUser: (userData: any) => void;
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
    };
    window.addEventListener("beforeunload", handleTabClose);
    return () => window.removeEventListener("beforeunload", handleTabClose);
  }, []);

  const login = async (userData: any, password?: string) => {
    const profile = password ? { email: userData, role: "viber" } : userData;
    // Forzar rol según email para test de Team/Partner [cite: 157, 170]
    if (profile.email === "contact@konnektwerk.com") profile.role = "team";
    if (profile.email === "apolo@test.com") profile.role = "partner";
    
    setUser(profile);
    sessionStorage.setItem("user", JSON.stringify(profile));
    
    // Redirecciones lógicas sin carpetas 'components' en la URL [cite: 11, 140]
    if (profile.role === "viber") router.push("/viber/dashboard");
    else if (profile.role === "partner") router.push("/partner/venues/dashboard");
    else if (profile.role === "team") router.push("/team/dashboard");
    else router.push("/");
  };

  const loginWithGoogle = async () => {
    await login({ email: "viber@nitvibes.com", role: "viber", name: "Viber Barcelona" });
  };

  const setExternalUser = (userData: any) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/");
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
