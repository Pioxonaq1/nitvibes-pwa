"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Store, Mail, Lock, ArrowLeft } from "lucide-react";

export default function VenueLoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-32">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex justify-center mb-6">
          <div className="bg-pink-600 p-4 rounded-full shadow-lg shadow-pink-500/20 text-white">
            <Store size={28} />
          </div>
        </div>

        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-2">VENUES <span className="text-pink-500">LOGIN</span></h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center mb-8 italic">Bares, Clubes y Discotecas</p>

        <form className="space-y-4">
          <input type="email" placeholder="Business Email" className="w-full h-16 bg-black border border-white/5 rounded-2xl px-6 text-sm font-bold focus:border-pink-500 outline-none transition-all" />
          <input type="password" placeholder="••••••••" className="w-full h-16 bg-black border border-white/5 rounded-2xl px-6 text-sm font-bold focus:border-pink-500 outline-none transition-all" />
          <button className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic text-lg shadow-xl active:scale-95 transition-all mt-4">ENTRAR AL PANEL</button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase italic text-zinc-500 mb-2">¿Aún no eres Partner?</p>
          <button onClick={() => router.push("/contact/nitvibes")} className="text-xs font-black uppercase italic text-pink-500 hover:text-white transition-colors">
            Date de alta, contacta con NITVIBES
          </button>
        </div>

        <button onClick={() => router.push("/perfil")} className="w-full flex items-center justify-center gap-2 text-zinc-400 text-[9px] font-black uppercase italic pt-8">
          <ArrowLeft size={12} /> Volver a Access ID
        </button>
      </div>
    </div>
  );
}
