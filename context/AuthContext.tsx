"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Definición del tipo de Usuario con Rol
type UserData = {
  uid: string;
  email: string | null;
  role: string; // 'viber' | 'partner' | 'gov' | 'team'
  nombre?: string;
};

// Interfaz que define qué funciones expone el contexto
interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Escuchar cambios de sesión y recuperar Rol de Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Buscamos el rol en la colección 'users' para verificar permisos
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              role: userDoc.data().role || 'viber',
              nombre: userDoc.data().nombre
            });
          } else {
            // Si el documento no existe en 'users', lo tratamos como Viber por defecto
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              role: 'viber'
            });
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUser({ uid: currentUser.uid, email: currentUser.email, role: 'viber' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Funciones de Autenticación

  // Login con Email y Password
  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  // Registro manual de Viber (B2C)
  const signup = async (email: string, pass: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", res.user.uid), {
      email: email.toLowerCase(),
      role: 'viber',
      shareLocation: true, // Regla: Usuario registrado comparte ubicación
      createdAt: new Date().toISOString()
    });
  };

  // Acceso con Google para Vibers
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      const userDocRef = doc(db, "users", res.user.uid);
      const userDoc = await getDoc(userDocRef);

      // Si es la primera vez que entra con Google, creamos su perfil Viber
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: res.user.email?.toLowerCase(),
          role: 'viber',
          nombre: res.user.displayName,
          shareLocation: true, // Regla: Compartir ubicación automáticamente
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error in Google Login:", error);
      throw error;
    }
  };

  // Logout: Desconecta sesión y devuelve al estado anónimo
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login