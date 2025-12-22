"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, // 👈 ESTO ES LO QUE FALTABA
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  User 
} from "firebase/auth";
import { auth } from "@/lib/firebase";

// Definimos la forma del contexto
interface AuthContextType {
  user: User | null;
  loading: boolean;
  // 👇 AQUÍ ESTÁ EL ARREGLO: password ahora es opcional (?) pero aceptado
  login: (email: string, password?: string) => Promise<void>; 
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar sesión
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Verificar Magic Link (si volvemos del email)
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Confirma tu email:');
      }
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => {
            window.localStorage.removeItem('emailForSignIn');
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch((e) => console.error("Error Magic Link:", e));
      }
    }
    return () => unsubscribe();
  }, []);

  // --- FUNCIÓN DE LOGIN INTELIGENTE ---
  const login = async (email: string, password?: string) => {
    // SI HAY CONTRASEÑA -> Login Clásico (Admin/Team)
    if (password) {
      await signInWithEmailAndPassword(auth, email, password);
    } 
    // SI NO HAY CONTRASEÑA -> Magic Link (Usuario Normal)
    else {
      const actionCodeSettings = {
        url: window.location.origin + '/perfil',
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      alert(`Enlace mágico enviado a ${email}.`);
    }
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);