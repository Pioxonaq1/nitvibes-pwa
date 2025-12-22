'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { USER_ROLES } from '@/lib/constants'; // Asegúrate que esta ruta exista (Paso 1)

// Definimos qué forma tiene un usuario
interface User {
  id: string;
  name: string;
  role: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, intentamos leer si hay usuario guardado (Simulación por ahora)
  useEffect(() => {
    const storedUser = localStorage.getItem('nitvibes_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error leyendo usuario", e);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('nitvibes_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nitvibes_user');
    // Aquí podríamos limpiar también cookies si fuera necesario
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}