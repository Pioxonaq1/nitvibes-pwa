"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Zap, Users, BarChart3, Settings, LogOut, MapPin, Share2, Navigation } from "lucide-react";
import PartnerMapbox from "../components/PartnerMapbox";

export default function VenueDashboard() {
  const { user, logout } = useAuth();
  
  // Datos de ejemplo para las Flash Actions del local [cite: 2025-12-23]
  const [myActions] = useState([
    { id: 1, promo: "2x1 Gin Tonic", price: "12€", time: "45 min", vibes: 45 },
    { id: 2, promo: "Entrada Gratis", price: "0€", time: "12 min", vibes: 120 }
  ]);

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* HEADER CON LOGOUT REDIRIGIENDO A HOME [cite: 2025-12-21] */}
        <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              PANEL <span className="text-pink-500">VENUE</span>
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 italic">
              {user?.nombre || "Partner Mode"}
            </p>
          </div>
          <button 
            onClick={() => { logout(); window.location.href = '/'; }} 
            className="p-3 bg-zinc-800 rounded-full text-zinc-500 hover:text-red-500 transition-all shadow-inner"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* STATS RÁPIDAS (Identidad Visual Unificada) [cite: 2025-12-25] */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <Users size={18} className="text-blue-400" />
            <p className="text-lg font-black leading-none">128</p>
            <p className="text-[7px] font-black uppercase text-zinc-500">Vibers</p>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <Zap size={18} className="text-yellow-500" />
            <p className="text-lg font-black leading-none">{myActions.length}</p>
            <p className="text-[7px] font-black uppercase text-zinc-500">Flash</p>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <BarChart3 size={18} className="text-pink-500" />
            <p className="text-lg font-black leading-none">1.2k</p>
            <p className="text-[7px] font-black uppercase text-zinc-500">Alcance</p>
          </div>
        </div>

        {/* MÓDULO DE ACCIÓN: Lanzar Flash Action [cite: 2025-12-23] */}
        <button className="w-full h-20 bg-gradient-to-r from-pink-600 to-purple-700 rounded-2xl flex items-center justify-between px-6 shadow-lg shadow-pink-500/10 active:scale-95 transition-all group">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Zap size={24} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-black uppercase italic">Lanzar Flash Action</p>
              <p className="text-[9px] opacity-70 font-bold uppercase tracking-tighter">Atrae gente a tu local ahora</p>
            </div>
          </div>
          <Navigation size={20} className="opacity-50" />
        </button>

        {/* LISTA DE ACCIONES ACTIVAS (Formato Solicitado) [cite: 2025-12-23] */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-6">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 italic">Mis Promociones Activas</h3>
          <div className="space-y-3">
            {myActions.map(action => (
              <div key={action.id} className="flex items-center justify-between bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase italic text-white">{action.promo}</span>
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">{action.time} restantes</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-pink-500">{action.price}</span>
                  <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-green-400">
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAPA DE UBICACIÓN MIGRADO [cite: 2025-12-25] */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden h-64 relative group">
          <PartnerMapbox />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <MapPin size={14} className="text-pink-500" />
            <span className="text-[10px] font-black uppercase italic">Tu ubicación en el mapa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
