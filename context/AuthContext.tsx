"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// 1. Definimos la estructura real de Nitvibes [2025-12-19]
interface NitvibesUser {
  uid: string;
  email: string | null;
  role: 'free' | 'partner' | 'gov' | 'admin' | 'colaborador';
  nombre?: string;
}

// 2. Definimos qué funciones exporta nuestro contexto
interface AuthContextType {
  user: NitvibesUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NitvibesUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para Login con Google (Requerida en app/login/page.tsx) [2025-12-19]
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error en Google Login:", error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Leemos la tabla real de usuarios en Firestore para obtener el ROL y NOMBRE [2025-12-19]
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const data = userDoc.data();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: data?.role || 'free', // Por defecto es free si no hay registro
          nombre: data?.nombre || firebaseUser.displayName || 'VIBER',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};