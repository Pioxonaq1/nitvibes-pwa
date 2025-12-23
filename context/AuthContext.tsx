"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Definimos la interfaz exacta de lo que hay en Firebase [cite: 2025-12-19]
interface NitvibesUser {
  uid: string;
  email: string | null;
  role: 'free' | 'partner' | 'gov' | 'admin' | 'colaborador';
  nombre?: string;
}

interface AuthContextType {
  user: NitvibesUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<NitvibesUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Leemos la "tabla" real del usuario en Firestore [cite: 2025-12-19]
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const data = userDoc.data();

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: data?.role || 'free', // Si no tiene rol, es free por defecto
          nombre: data?.nombre || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => auth.signOut();

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};