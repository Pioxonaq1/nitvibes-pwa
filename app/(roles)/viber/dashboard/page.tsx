
"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogOut, Zap, User, Plus } from "lucide-react";

export default function ViberDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/"); // 2) Al cerrar sesión debe dirigir al home
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      {/* Header del Panel */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            PANEL VIBER
          </h1>
          {/* 1) Se borra StageLink y se cambia Viber Hub */}
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">User Console</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-500/10 border border-red-500/50 px-4 py-2 rounded-full text-[10px] font-black text-red-500 uppercase italic hover:bg-red-500 hover:text-white transition-all"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Secciones de Promos y Vibes (Mantenemos estructura visual de tu adjunto) */}
      <div className="space-y-8">
        <section>
          <h2 className="flex items-center gap-2 text-xs font-black uppercase italic mb-4 text-yellow-400">
            <Zap size={14} fill="currentColor" /> Flash Actions Activas
          </h2>
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-3xl p-6 text-center">
            <p className="text-gray-600 text-[10px] font-bold uppercase">No hay acciones flash en tu zona ahora mismo</p>
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-xs font-black uppercase italic mb-4">
            <User size={14} /> Mis Vibes
          </h2>
          <div className="bg-zinc-900/30 border border-dashed border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center gap-4">
             <p className="text-gray-500 text-[10px] font-bold uppercase">Aún no has publicado ningún Vibe</p>
             <button className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
               <Plus size={14} /> Crear
             </button>
          </div>
        </section>
      </div>
    </div>
  );
}
