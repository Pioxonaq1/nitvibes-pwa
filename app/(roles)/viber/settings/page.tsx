"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Settings, User, Bell, Shield, ArrowLeft, LogOut } from "lucide-react";

export default function ViberSettings() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-32">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-zinc-500 to-zinc-800 p-4 rounded-full shadow-lg">
            <Settings size={28} className="text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-8">
          AJUSTES <span className="text-blue-400">VIBER</span>
        </h1>

        <div className="space-y-3">
          <button className="w-full h-16 bg-black border border-white/5 rounded-2xl px-6 flex items-center gap-4 active:scale-95 transition-all">
            <User size={20} className="text-zinc-500" />
            <span className="text-xs font-black uppercase italic">Editar Perfil</span>
          </button>
          
          <button className="w-full h-16 bg-black border border-white/5 rounded-2xl px-6 flex items-center gap-4 active:scale-95 transition-all">
            <Bell size={20} className="text-zinc-500" />
            <span className="text-xs font-black uppercase italic">Notificaciones</span>
          </button>

          <button className="w-full h-16 bg-black border border-white/5 rounded-2xl px-6 flex items-center gap-4 active:scale-95 transition-all">
            <Shield size={20} className="text-zinc-500" />
            <span className="text-xs font-black uppercase italic">Privacidad</span>
          </button>

          <button 
            onClick={logout}
            className="w-full h-16 bg-red-500/10 border border-red-500/20 rounded-2xl px-6 flex items-center gap-4 active:scale-95 transition-all text-red-500"
          >
            <LogOut size={20} />
            <span className="text-xs font-black uppercase italic">Cerrar Sesión</span>
          </button>
        </div>

        <button 
          onClick={() => router.back()}
          className="w-full flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-black uppercase italic hover:text-white transition-colors pt-8"
        >
          <ArrowLeft size={14} /> Volver
        </button>
      </div>
    </div>
  );
}
