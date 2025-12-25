"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Store, MapPin, Zap, Users, BarChart3, Settings, LogOut } from "lucide-react";
import PartnerMapbox from "../components/PartnerMapbox";

export default function VenueDashboard() {
  const { user, logout } = useAuth();

  const stats = [
    { label: "Vibes Hoy", value: "128", icon: Users, color: "text-blue-400" },
    { label: "Flash Activas", value: "3", icon: Zap, color: "text-yellow-500" },
    { label: "Alcance", value: "1.2k", icon: BarChart3, color: "text-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* HEADER UNIFICADO [cite: 2025-12-25] */}
        <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 shadow-2xl">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              PANEL <span className="text-pink-500">VENUE</span>
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
              {user?.nombre || "Cargando Local..."}
            </p>
          </div>
          <button onClick={logout} className="p-3 bg-zinc-800 rounded-full text-zinc-500 hover:text-red-500 transition-all">
            <LogOut size={20} />
          </button>
        </div>

        {/* STATS RÁPIDAS (Los componentes del adjunto) [cite: 2025-12-25] */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-2">
              <stat.icon size={20} className={stat.color} />
              <div className="text-center">
                <p className="text-lg font-black leading-none">{stat.value}</p>
                <p className="text-[7px] font-black uppercase text-zinc-500 mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MAPA DE UBICACIÓN (Migrado de Partner) [cite: 2025-12-25] */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden h-64 relative">
          <PartnerMapbox />
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <MapPin size={12} className="text-pink-500" />
            <span className="text-[9px] font-black uppercase italic">Ubicación del Local</span>
          </div>
        </div>

        {/* ACCIONES DE GESTIÓN [cite: 2025-12-25] */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="h-20 bg-gradient-to-r from-pink-600 to-purple-700 rounded-2xl flex items-center justify-between px-6 shadow-lg active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <Zap size={24} />
              <div className="text-left">
                <p className="text-sm font-black uppercase italic">Lanzar Flash Action</p>
                <p className="text-[9px] opacity-70 font-bold uppercase">Atrae vibers ahora mismo</p>
              </div>
            </div>
          </button>

          <button className="h-20 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-between px-6 active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <Settings size={24} className="text-zinc-400" />
              <div className="text-left">
                <p className="text-sm font-black uppercase italic text-white">Editar Perfil</p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase">Horarios, fotos y música</p>
              </div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
