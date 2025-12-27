"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "visitor" | "viber" | "partner" | "team" | "gov";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (userData: any, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  setExternalUser: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function inferRoleFromPath(): Role {
  if (typeof window === "undefined") return "visitor";
  const p = window.location.pathname || "/";
  if (p.startsWith("/team")) return "team";
  if (p.startsWith("/gov")) return "gov";
  if (p.startsWith("/partner")) return "partner";
  if (p.startsWith("/viber")) return "viber";
  return "visitor";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = sessionStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);

    const handleTabClose = () => sessionStorage.removeItem("user");
    window.addEventListener("beforeunload", handleTabClose);
    return () => window.removeEventListener("beforeunload", handleTabClose);
  }, []);

  const routes: Record<Role, string> = {
    visitor: "/perfil",
    viber: "/viber/dashboard",
    partner: "/partner/venues/dashboard",
    team: "/team/dashboard",
    gov: "/gov/dashboard",
  };

  const persistUser = (profile: any) => {
    setUser(profile);
    sessionStorage.setItem("user", JSON.stringify(profile));
  };

  const login = async (userData: any, password?: string) => {
    let profile: any;

    // Login manual: login(email, pass) -> rol según URL actual
    if (password) {
      const email = String(userData ?? "");
      const role = inferRoleFromPath();
      profile = { email, role };
    } else {
      // Login por objeto (ya trae role)
      profile = userData;
    }

    persistUser(profile);

    const role: Role = (profile?.role as Role) || "visitor";
    router.push(routes[role] || "/perfil");
  };

  const loginWithGoogle = async () => {
    await login({ email: "viber@nitvibes.com", role: "viber", name: "Viber User" });
  };

  // ✅ Esto es lo que te falta ahora mismo (y por eso falla el build)
  const setExternalUser = (userData: any) => {
    persistUser(userData);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, setExternalUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
