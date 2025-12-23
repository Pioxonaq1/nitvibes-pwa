"use client";

import React from 'react';
import { Video, Mic, FileText, ExternalLink } from 'lucide-react';

export default function VibeManager() {
  const openSanity = () => {
    // Apunta a la carpeta /studio que ya existe en tu app [cite: 2025-12-24]
    window.open('/studio', '_blank');
  };

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-white font-black text-xl uppercase italic tracking-tighter">Gestión de Vibes</h3>
          <div className="flex gap-2">
            <Video size={16} className="text-zinc-500" />
            <Mic size={16} className="text-zinc-500" />
            <FileText size={16} className="text-zinc-500" />
          </div>
        </div>
        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-8 leading-relaxed">
          Sube nuevos vídeos, podcasts o artículos del blog directamente a la PWA.
        </p>
      </div>

      <button 
        onClick={openSanity}
        className="w-full bg-white text-black text-xs font-black py-5 rounded-2xl uppercase hover:bg-yellow-400 transition-all flex items-center justify-center gap-3 group"
      >
        Abrir Sanity Studio
        <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
}