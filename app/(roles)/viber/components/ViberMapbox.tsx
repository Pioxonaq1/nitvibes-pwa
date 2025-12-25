"use client";
import React from "react";

export default function ViberMapbox() {
  return (
    <div className="w-full h-full bg-zinc-900 relative">
      <div className="absolute top-4 left-4 z-10 bg-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase italic shadow-lg">
        Mapa Viber: Real Time
      </div>
      {/* Aquí integrarás el mapa de Mapbox con capas de Flash Actions y Ubicación Real */}
      <div className="flex items-center justify-center h-full text-zinc-800 font-black uppercase italic text-xs">
        Mapbox Viber Layer Active
      </div>
    </div>
  );
}
