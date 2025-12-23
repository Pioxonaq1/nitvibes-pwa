"use client";

import React from 'react';
// Esta es la línea que faltaba y causaba el error de compilación [cite: 2025-12-18]
import MapboxMap from '@/components/MapboxMap';

export default function MapaPage() {
  return (
    <main className="fixed inset-0 flex flex-col bg-black overflow-hidden">
      {/* Header flotante [cite: 2025-12-23] */}
      <div className="absolute top-10 w-full text-center z-20 pointer-events-none">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-green-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          VIBE <span className="text-white">MAP</span>
        </h1>
      </div>

      {/* Contenedor del Mapa ocupando todo el viewport [cite: 2025-12-18, 2025-12-23] */}
      <div className="relative w-full h-full">
        <MapboxMap />
      </div>
      
      {/* El Navbar es global, no se añade aquí [cite: 2025-12-21] */}
    </main>
  );
}