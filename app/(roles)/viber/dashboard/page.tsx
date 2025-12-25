"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ViberHeader from "../components/ViberHeader";
import MainActions from "../components/MainActions";
import FlashSlider from "../components/FlashSlider";
import SocialModule from "../components/SocialModule";
import TuVibeSelector from "../components/TuVibeSelector";

export default function ViberDashboard() {
  const { user, logout } = useAuth();
  // Estado para controlar la visibilidad del selector de Mood [cite: 2025-12-25]
  const [isVibeOpen, setIsVibeOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-32">
      <ViberHeader onLogout={logout} />

      {/* Pasamos la función para abrir el componente al componente MainActions [cite: 2025-12-25] */}
      <MainActions onOpenVibe={() => setIsVibeOpen(true)} />

      <FlashSlider />

      <SocialModule />
      
      {/* Renderizado condicional del Selector [cite: 2025-12-25] */}
      <TuVibeSelector 
        isOpen={isVibeOpen} 
        onClose={() => setIsVibeOpen(false)} 
      />
      
      <div className="mt-8 opacity-20 text-[8px] font-black uppercase tracking-[0.5em] text-center">
        Konnektwerk Engine v1.1
      </div>
    </main>
  );
}
