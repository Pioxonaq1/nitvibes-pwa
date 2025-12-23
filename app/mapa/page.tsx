"use client";

import React from 'react';
import MapboxMap from '@/components/MapboxMap';

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header del Mapa */}
      <div className="p-6 pt-12 text-center bg-gradient-to-b from-black to-transparent z-10">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-green-400">
          VIBE <span className="text-white">MAP</span>
        </h1>
      </div>

      {/* Contenedor del Mapa */}
      <div className="flex-grow relative">
        <MapboxMap />
      </div>

      {/* Espacio para que el Navbar no tape el mapa */}
      <div className="h-24" />
    </div>
  );
}