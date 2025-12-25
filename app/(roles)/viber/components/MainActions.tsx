"use client";
import React from "react";
import { Plus, Sparkles, Map, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface MainActionsProps {
  onOpenVibe: () => void;
  isMoodActive: boolean;
}

export default function MainActions({ onOpenVibe, isMoodActive }: MainActionsProps) {
  const router = useRouter();
  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      <button onClick={onOpenVibe} className="flex flex-col items-center gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 transition-all">
        <div className={`p-3 rounded-xl shadow-lg transition-colors ${isMoodActive ? "bg-green-500 text-black" : "bg-zinc-700 text-zinc-400"}`}>
          {isMoodActive ? <Check size={20} /> : <Plus size={20} />}
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black uppercase italic tracking-tighter">Tu Vibe</span>
          {isMoodActive && <span className="text-[7px] font-black text-green-500 uppercase leading-none mt-1">Mood Activo</span>}
        </div>
      </button>
      <button onClick={() => router.push('/viber/flash-actions')} className="flex flex-col items-center gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
        <div className="bg-purple-600 p-3 rounded-xl shadow-lg"><Sparkles size={20} /></div>
        <span className="text-[9px] font-black uppercase italic tracking-tighter">Últimos</span>
      </button>
      <button onClick={() => router.push('/mapa')} className="flex flex-col items-center gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
        <div className="bg-emerald-600 p-3 rounded-xl shadow-lg"><Map size={20} /></div>
        <span className="text-[9px] font-black uppercase italic tracking-tighter">Mapa</span>
      </button>
    </div>
  );
}
