"use client";
import React, { useState } from 'react';

export default function FlashAnalytics() {
  const [selectedVenue, setSelectedVenue] = useState('all');

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-black text-xs uppercase tracking-widest">⚡ Rendimiento Flash</h3>
        <select 
          className="bg-black text-white text-[9px] font-bold p-2 rounded-lg border border-zinc-800"
          onChange={(e) => setSelectedVenue(e.target.value)}
        >
          <option value="all">TODOS LOS LOCALES</option>
          <option value="apolo">SALA APOLO</option>
          <option value="opium">OPIUM BCN</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-black p-4 rounded-2xl border border-zinc-800 text-center">
          <p className="text-zinc-500 text-[8px] uppercase font-black mb-1">Impacto</p>
          <p className="text-white text-lg font-black">12.4K</p>
        </div>
        <div className="bg-black p-4 rounded-2xl border border-zinc-800 text-center">
          <p className="text-zinc-500 text-[8px] uppercase font-black mb-1">Aceptación</p>
          <p className="text-green-500 text-lg font-black">840</p>
        </div>
        <div className="bg-black p-4 rounded-2xl border border-zinc-800 text-center">
          <p className="text-zinc-500 text-[8px] uppercase font-black mb-1">Conversión</p>
          <p className="text-orange-500 text-lg font-black">312</p>
        </div>
      </div>
    </div>
  );
}
