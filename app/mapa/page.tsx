"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicLayer from "@/components/map/layers/PublicLayer";
import ViberLayer from "@/components/map/layers/ViberLayer";

export default function MapaPage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-black italic uppercase text-zinc-800">Cargando Mapa...</div>;

  return (
    <div className="relative w-full h-screen bg-zinc-900 overflow-hidden">
      {/* MAPA BASE (Fondo de Google Maps/Mapbox) */}
      <div className="absolute inset-0 grayscale contrast-125 opacity-40">
        {/* Aquí se renderiza el mapa base */}
      </div>

      {/* ORQUESTADOR DE CAPAS POR ROL [cite: 2025-12-25] */}
      {!user && <PublicLayer />}
      {user?.role === 'viber' && <ViberLayer />}
      
      {/* Capa de Partner/Admin si fuera necesario en el futuro */}
      {(user?.role === 'admin' || user?.role === 'partner') && (
        <div className="absolute top-4 left-4 bg-pink-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase italic">
          Modo Gestión: Edición de Venues
        </div>
      )}

      {/* Controles de Mapa Comunes */}
      <div className="absolute bottom-32 right-4 flex flex-col gap-2">
         <div className="w-10 h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white font-bold">+</div>
         <div className="w-10 h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white font-bold">-</div>
      </div>
    </div>
  );
}
