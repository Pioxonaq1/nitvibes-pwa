"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Zap, ArrowLeft, Filter } from "lucide-react";
import FlashList from "../components/FlashList";

export default function FlashActionsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.back()} className="p-3 bg-zinc-800 rounded-full text-zinc-400">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">FLASH ACTIONS</h1>
            <p className="text-[9px] font-bold text-yellow-500 uppercase tracking-widest">Promos activas ahora</p>
          </div>
          <button className="p-3 bg-zinc-800 rounded-full text-zinc-400">
            <Filter size={20} />
          </button>
        </div>

        {/* Componente de lista con las columnas solicitadas [cite: 2025-12-23] */}
        <FlashList />
      </div>
    </div>
  );
}
