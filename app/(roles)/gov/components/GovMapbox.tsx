"use client";
import React from "react";

export default function GovMapbox() {
  return (
    <div className="w-full h-full bg-zinc-900 relative">
      <div className="absolute top-4 left-4 z-10 bg-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase italic shadow-lg">
        Mapa GOV: City Safety & Analytics
      </div>
      <div className="flex items-center justify-center h-full text-zinc-800 font-black uppercase italic text-xs">
        Mapbox Gov Layer Active
      </div>
    </div>
  );
}
