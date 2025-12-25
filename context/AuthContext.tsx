"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Interfaz robusta que unifica Viber y Venues [cite: 2025-12-25]
interface UserData {
  uid: string;
  email: string | null;
  nombre?: string;
  name?: string;      // Campo de la tabla Venues [cite: 2025-12-25]
  role?: string;
  isVenue?: boolean;
  b2BEmail?: string;  // Case-sensitive exacto a tu Firebase [cite: 2025-12-25]
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  setExternalUser: (data: UserData) => void; // FORMALIZADO PARA TS [cite: 2025-12-25]
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar, verificamos si hay una sesión persistida de Venue [cite: 2025-12-25]
    const saved = localStorage.getItem("venue_session");
    if (saved) {
      setUser(JSON.parse(saved));
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !localStorage.getItem("venue_session")) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...docSnap.data() } as UserData);
        } else {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'viber' });
        }
      } else if (!firebaseUser && !localStorage.getItem("venue_session")) {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    localStorage.removeItem("venue_session");
    await signOut(auth);
    setUser(null);
    window.location.href = "/"; // Regla: Logout va al HOME [cite: 2025-12-25]
  };

  const setExternalUser = (data: UserData) => {
    const venueUser = { ...data, role: 'partner', isVenue: true };
    setUser(venueUser);
    localStorage.setItem("venue_session", JSON.stringify(venueUser)); // Persistencia Real [cite: 2025-12-25]
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setExternalUser, loginWithGoogle: async () => {} } as any}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
