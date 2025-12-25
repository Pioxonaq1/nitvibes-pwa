"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import ViberMapbox from "../(roles)/viber/components/ViberMapbox";
import PartnerMapbox from "../(roles)/partner/components/PartnerMapbox";
import GovMapbox from "../(roles)/gov/components/GovMapbox";
import TeamMapbox from "../(roles)/team/components/TeamMapbox";

export default function MapaPage() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <span className="text-zinc-800 font-black italic uppercase animate-pulse tracking-widest">Iniciando Geo-Sistemas...</span>
    </div>
  );

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Orquestación de Mapbox por Rol [cite: 2025-12-25] */}
      {user?.role === 'viber' && <ViberMapbox />}
      {user?.role === 'partner' && <PartnerMapbox />}
      {user?.role === 'gov' && <GovMapbox />}
      {(user?.role === 'admin' || user?.role === 'collaborator') && <TeamMapbox />}
      
      {/* Vista por defecto para usuarios no logueados (Simulador) [cite: 2025-12-25] */}
      {!user && (
        <div className="h-full bg-zinc-900 flex flex-col items-center justify-center gap-4">
          <div className="absolute top-4 left-4 bg-purple-600 px-3 py-1 rounded-full text-[10px] font-black uppercase italic">
            Mapa Público: Simulador Activo
          </div>
          <span className="text-zinc-700 font-black italic uppercase text-xs">Modo Simulación de Usuarios</span>
        </div>
      )}
    </div>
  );
}
