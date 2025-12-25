"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Zap, Users, BarChart3, LogOut, MapPin } from "lucide-react";
import PartnerMapbox from "../components/PartnerMapbox";

export default function VenueDashboard() {
  const { user, logout } = useAuth();

  if (!user || user.role !== "partner") return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
              PANEL <span className="text-pink-500 italic">VENUE</span>
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2 italic">
              {user.name || "Sala Apolo"}
            </p>
          </div>
          <button onClick={logout} className="p-3 bg-zinc-800 rounded-full text-zinc-500 hover:text-red-500 transition-all shadow-inner">
            <LogOut size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <Users size={18} className="text-blue-400" />
            <p className="text-lg font-black leading-none">15</p>
            <p className="text-[7px] font-black uppercase text-zinc-500">Vibers</p>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <Zap size={18} className="text-yellow-500" />
            <p className="text-lg font-black leading-none">{user.hasFlash ? "1" : "0"}</p>
            <p className="text-[7px] font-black uppercase text-zinc-500">Flash</p>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <BarChart3 size={18} className="text-pink-500" />
            <p className="text-lg font-black leading-none">1.2k</p>
            <p className="text-[7px] font-black uppercase text-zinc-500">Alcance</p>
          </div>
        </div>

        <button className="w-full h-20 bg-gradient-to-r from-pink-600 to-purple-700 rounded-2xl flex items-center justify-between px-6 shadow-lg shadow-pink-500/10 active:scale-95 transition-all group">
          <div className="flex items-center gap-4 text-left font-black uppercase italic">
            <Zap size={24} />
            <div>
              <p className="text-sm">Lanzar Flash Action</p>
              <p className="text-[9px] opacity-70 mt-1">Saca tu promo al mapa</p>
            </div>
          </div>
        </button>

        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden h-64 relative">
          <PartnerMapbox />
          <div className="absolute bottom-4 left-6 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <MapPin size={14} className="text-pink-500" />
            <span className="text-[10px] font-black uppercase italic">Ubicación: {user.vibe || "Poble Sec"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
