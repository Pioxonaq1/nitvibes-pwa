"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  LogOut, Map, Sparkles, User, Users, UserPlus, 
  ChevronRight, ChevronLeft, Plus, Play, Zap, Clock, Euro
} from "lucide-react";

export default function ViberDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-28 font-sans">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            PANEL VIBER
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">User Console v.1.0</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-zinc-900 border border-white/10 p-2 rounded-full text-zinc-400 hover:text-white transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>

      {/* 1. FILA DE BOTONES (1, 2, 3) */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Tu Vibe", icon: Plus, color: "bg-blue-600" },
          { label: "Últimos", icon: Sparkles, color: "bg-purple-600" },
          { label: "Mapa", icon: Map, color: "bg-green-600" }
        ].map((btn, i) => (
          <button key={i} className="flex flex-col items-center gap-2 p-4 bg-zinc-900/50 rounded-2xl border border-white/5 active:scale-95 transition-all">
            <div className={`${btn.color} p-3 rounded-xl shadow-lg`}>
              <btn.icon size={20} className="text-white" />
            </div>
            <span className="text-[9px] font-black uppercase italic tracking-tighter">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* 2. MUESTREO DE ACCIONES FLASH (Promos de Venues) [cite: 2025-12-23] */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-[11px] font-black uppercase italic tracking-widest text-yellow-400 flex items-center gap-2">
            <Zap size={14} fill="currentColor" /> Acciones Flash
          </h2>
          <div className="flex gap-2 text-zinc-600">
            <ChevronLeft size={16} /><ChevronRight size={16} />
          </div>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {[
            { venue: "Opium BCN", promo: "2x1 Copas", time: "45 min", price: "15€", dist: "100m" },
            { venue: "Pacha", promo: "Entrada Gratis", time: "12 min", price: "0€", dist: "250m" },
            { venue: "Shôko", promo: "Chupito Regalo", time: "60 min", price: "5€", dist: "500m" }
          ].map((promo, i) => (
            <div key={i} className="min-w-[160px] bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-yellow-500/20 p-4 flex flex-col gap-3 relative overflow-hidden flex-shrink-0 shadow-xl">
              <div className="flex justify-between items-start">
                <span className="text-[8px] font-black bg-yellow-500 text-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Flash</span>
                <div className="flex items-center gap-1 text-[8px] text-zinc-400 font-bold uppercase">
                  <Clock size={10} /> {promo.time}
                </div>
              </div>
              
              <div>
                <h3 className="text-[10px] font-black uppercase italic tracking-tighter text-white truncate">{promo.venue}</h3>
                <p className="text-[12px] font-bold text-yellow-400 uppercase leading-none mt-1">{promo.promo}</p>
              </div>

              <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-2">
                <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-500">
                   <Euro size={10} /> {promo.price}
                </div>
                <div className="text-[9px] font-bold text-blue-400 uppercase">{promo.dist}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MÓDULO DUAL (MIS AMIGOS / INVITA) */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button className="flex items-center justify-center gap-3 bg-zinc-900 border border-white/5 p-4 rounded-2xl active:scale-95 transition-all">
          <Users size={18} className="text-blue-400" />
          <span className="text-[10px] font-black uppercase italic tracking-widest">Mis Amigos</span>
        </button>
        <button className="flex items-center justify-center gap-3 bg-white text-black p-4 rounded-2xl active:scale-95 transition-all">
          <UserPlus size={18} />
          <span className="text-[10px] font-black uppercase italic tracking-widest">Invita Amigos</span>
        </button>
      </div>

      {/* 4. SLIDER NUEVAS VENUES */}
      <section className="mb-8">
        <h2 className="text-[11px] font-black uppercase italic tracking-widest text-zinc-400 mb-4 px-1">Nuevas Venues</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {[1, 2].map((venue) => (
            <div key={venue} className="min-w-[240px] h-32 bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl border border-white/5 p-4 flex flex-col justify-end relative overflow-hidden">
               <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest">New Open</div>
               <h3 className="font-black italic uppercase text-sm tracking-tighter">Venue Name {venue}</h3>
               <p className="text-[9px] text-zinc-500 font-bold uppercase">Barcelona • 0.8 km</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 3 BOTONES SIN DEFINIR */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="aspect-square bg-zinc-900/30 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-zinc-700">
            <Play size={20} className="opacity-20" />
          </div>
        ))}
      </div>

    </div>
  );
}
