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
    };
    window.addEventListener("beforeunload", handleTabClose);
    return () => window.removeEventListener("beforeunload", handleTabClose);
  }, []);

  const login = async (userData: any, password?: string) => {
    // Si es login manual, determinamos rol por email o hint 
    let profile = userData;
    if (password) {
      const role = userData.includes("konnektwerk") ? "team" : 
                   userData.includes("test") ? "partner" : "viber";
      profile = { email: userData, role };
    }
    
    setUser(profile);
    sessionStorage.setItem("user", JSON.stringify(profile));
    
    // Rutas canónicas sin '/components/' [cite: 1]
    const routes = {
      viber: "/viber/dashboard",
      partner: "/partner/venues/dashboard",
      team: "/team/dashboard",
      gov: "/gov/dashboard"
    };
    
    router.push(routes[profile.role as keyof typeof routes] || "/");
  };

  const loginWithGoogle = async () => {
    await login({ email: "viber@barcelona.com", role: "viber", name: "Viber User" });
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
