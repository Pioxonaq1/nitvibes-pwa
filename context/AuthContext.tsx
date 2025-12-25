"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Interfaz robusta que acepta campos de Viber y Venues [cite: 2025-12-25]
interface UserData {
  uid: string;
  email: string | null;
  nombre?: string;
  name?: string;     // Nombre de la tabla Venues [cite: 2025-12-25]
  role?: string;
  hasFlash?: boolean;
  vibe?: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setExternalUser: (data: UserData) => void; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...docSnap.data() } as UserData);
        } else {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'viber' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    window.location.href = "/"; // Regla: logout manda a HOME [cite: 2025-12-25]
  };

  const setExternalUser = (data: UserData) => {
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, setExternalUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
