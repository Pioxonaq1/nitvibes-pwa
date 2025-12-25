"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import ViberHeader from "../components/ViberHeader";
import MainActions from "../components/MainActions";
import FlashSlider from "../components/FlashSlider";
import SocialModule from "../components/SocialModule";

export default function ViberDashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-32">
      {/* Header con saludo dinámico y botón logout [cite: 2025-12-25] */}
      <ViberHeader onLogout={logout} />

      {/* Selector de Vibe, Últimos y Mapa [cite: 2025-12-25] */}
      <MainActions />

      {/* Carrusel de las 10 últimas promos con link a 'Ver todas' [cite: 2025-12-25] */}
      <FlashSlider />

      {/* Módulo de Mis Amigos / Invitar [cite: 2025-12-25] */}
      <SocialModule />
      
      <div className="mt-8 opacity-20 text-[8px] font-black uppercase tracking-[0.5em] text-center">
        Konnektwerk Engine v1.0
      </div>
    </main>
  );
}
