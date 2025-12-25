"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicNav from "./navigation/PublicNav";
import ViberNav from "./navigation/ViberNav";
// Aquí podrías importar PartnerNav, TeamNav, etc.

export default function BottomNav() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Si no hay usuario, mostramos el menú público [cite: 2025-12-25]
  if (!user) return <PublicNav />;

  // Si es Viber, mostramos su menú específico [cite: 2025-12-25]
  if (user.role === 'viber') return <ViberNav />;

  // Para otros roles (Partner, Team, Gov), podemos crear sus menús o usar uno genérico por ahora
  return <ViberNav />; 
}
