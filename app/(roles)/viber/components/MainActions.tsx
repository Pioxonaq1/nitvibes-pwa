"use client";
import React from "react";
import { Plus, Sparkles, Map } from "lucide-react";
import { useRouter } from "next/navigation";

interface MainActionsProps {
  onOpenVibe: () => void;
}

export default function MainActions({ onOpenVibe }: MainActionsProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {/* Acción 1: Abrir Selector de Mood [cite: 2025-12-25] */}
      <button 
        onClick={onOpenVibe}
        className="flex flex-col items-center gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 active:scale-95 transition-all group"
      >
        <div className="bg-blue-600 p-3 rounded-xl shadow-lg group-hover:bg-blue-500 transition-colors">
          <Plus size={20} />
        </div>
        <span className="text-[9px] font-black uppercase italic tracking-tighter text-zinc-400 group-hover:text-white">Tu Vibe</span>
      </button>
      
      {/* Acción 2: Ver Últimos (Podemos vincularlo a un filtro de Flash Actions) [cite: 2025-12-25] */}
      <button 
        onClick={() => router.push('/viber/flash-actions')}
        className="flex flex-col items-center gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 active:scale-95 transition-all group"
      >
        <div className="bg-purple-600 p-3 rounded-xl shadow-lg group-hover:bg-purple-500 transition-colors">
          <Sparkles size={20} />
        </div>
        <span className="text-[9px] font-black uppercase italic tracking-tighter text-zinc-400 group-hover:text-white">Últimos</span>
      </button>
      
      {/* Acción 3: Ir al Mapa Real [cite: 2025-12-25] */}
      <button 
        onClick={() => router.push('/mapa')} 
        className="flex flex-col items-center gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 active:scale-95 transition-all group"
      >
        <div className="bg-green-600 p-3 rounded-xl shadow-lg group-hover:bg-green-500 transition-colors">
          <Map size={20} />
        </div>
        <span className="text-[9px] font-black uppercase italic tracking-tighter text-zinc-400 group-hover:text-white">Mapa</span>
      </button>
    </div>
  );
}
