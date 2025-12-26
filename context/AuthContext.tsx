"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface UserData {
  uid: string;
  email: string | null;
  nombre?: string;
  role?: string;
  isVenue?: boolean;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setExternalUser: (data: UserData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedVenue = localStorage.getItem("venue_session");
    if (savedVenue) {
      setUser(JSON.parse(savedVenue));
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

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    localStorage.removeItem("venue_session");
    await signOut(auth);
    setUser(null);
    window.location.href = "/";
  };

  const setExternalUser = (data: UserData) => {
    const venueUser = { ...data, role: 'partner', isVenue: true };
    setUser(venueUser);
    localStorage.setItem("venue_session", JSON.stringify(venueUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout, setExternalUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
