"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Store, Zap, Users, BarChart3, LogOut, MapPin, Share2 } from "lucide-react";
import PartnerMapbox from "../components/PartnerMapbox";

export default function VenueDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "partner")) {
      router.push("/perfil");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">PANEL <span className="text-pink-500 italic">VENUE</span></h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 italic">{user.nombre || "Partner Venue"}</p>
          </div>
          <button onClick={() => { logout(); router.push("/"); }} className="p-3 bg-zinc-800 rounded-full text-zinc-500 hover:text-red-500 transition-all">
            <LogOut size={20} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <Users size={18} className="text-blue-400" />
            <p className="text-lg font-black leading-none">128</p>
            <p className="text-[7px] font-black uppercase text-zinc-500 tracking-tighter">Vibers</p>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <Zap size={18} className="text-yellow-500" />
            <p className="text-lg font-black leading-none">2</p>
            <p className="text-[7px] font-black uppercase text-zinc-500 tracking-tighter">Flash</p>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <BarChart3 size={18} className="text-pink-500" />
            <p className="text-lg font-black leading-none">1.2k</p>
            <p className="text-[7px] font-black uppercase text-zinc-500 tracking-tighter">Alcance</p>
          </div>
        </div>

        <button className="w-full h-20 bg-gradient-to-r from-pink-600 to-purple-700 rounded-2xl flex items-center justify-between px-6 shadow-lg shadow-pink-500/10 active:scale-95 transition-all group">
          <div className="flex items-center gap-4 text-left">
            <Zap size={24} />
            <div>
              <p className="text-sm font-black uppercase italic leading-none">Lanzar Flash Action</p>
              <p className="text-[9px] opacity-70 font-bold uppercase mt-1 tracking-tighter">Atrae gente ahora</p>
            </div>
          </div>
        </button>

        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden h-64 relative">
          <PartnerMapbox />
          <div className="absolute bottom-4 left-6 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">
            <MapPin size={14} className="text-pink-500" />
            <span className="text-[10px] font-black uppercase italic">Ubicación Actual</span>
          </div>
        </div>
      </div>
    </div>
  );
}
