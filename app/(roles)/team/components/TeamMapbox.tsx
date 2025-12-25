"use client";
import React from "react";

export default function TeamMapbox() {
  return (
    <div className="w-full h-full bg-zinc-900 relative">
      <div className="absolute top-4 left-4 z-10 bg-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase italic shadow-lg border border-blue-400/30">
        Mapa TEAM: Global Operations
      </div>
      <div className="flex items-center justify-center h-full text-zinc-800 font-black uppercase italic text-xs">
        Mapbox Team Layer Active
      </div>
    </div>
  );
}
