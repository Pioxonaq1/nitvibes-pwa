"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

type UserData = {
  uid: string;
  email: string | null;
  role: string;
  nombre?: string;
};

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true, login: async () => {}, signup: async () => {}, logout: async () => {}, loginWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aplicar regla: Cerrar sesión al cerrar el navegador (Persistencia de Sesión)
    setPersistence(auth, browserSessionPersistence);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            role: userDoc.data().role || 'viber',
            nombre: userDoc.data().nombre
          });
        } else {
          setUser({ uid: currentUser.uid, email: currentUser.email, role: 'viber' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = async (email: string, pass: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", res.user.uid), {
      email: email.toLowerCase(),
      role: 'viber',
      shareLocation: true,
      createdAt: new Date().toISOString()
    });
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    const userDocRef = doc(db, "users", res.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: res.user.email?.toLowerCase(),
        role: 'viber',
        nombre: res.user.displayName,
        shareLocation: true,
        createdAt: new Date().toISOString()
      });
    }
  };

  const logout = async () => {
    if (user) {
      // Regla: Dejar de compartir ubicación al salir
      try {
        await updateDoc(doc(db, "users", user.uid), { shareLocation: false });
      } catch (e) { console.error("Error updating location status on logout"); }
    }
    await signOut(auth);
    setUser(null);
    window.location.href = "/"; // Regla genérica: Salir lleva al Home
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};
