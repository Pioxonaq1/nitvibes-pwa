"use client";
import React from "react";
import { Plus, Sparkles, Map } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MainActions() {
  const router = useRouter();
  const actions = [
    { label: "Tu Vibe", icon: Plus, color: "bg-blue-600", click: () => {} },
    { label: "Últimos", icon: Sparkles, color: "bg-purple-600", click: () => {} },
    { label: "Mapa", icon: Map, color: "bg-green-600", click: () => router.push('/mapa') }
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {actions.map((btn, i) => (
        <button key={i} onClick={btn.click} className="flex flex-col items-center gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 active:scale-95 transition-all">
          <div className={`${btn.color} p-3 rounded-xl shadow-lg`}><btn.icon size={20} /></div>
          <span className="text-[9px] font-black uppercase italic tracking-tighter">{btn.label}</span>
        </button>
      ))}
    </div>
  );
}
