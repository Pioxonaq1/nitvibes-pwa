"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Chrome, Mail, Store, Shield, Building2, Flame, ArrowLeft } from "lucide-react";

export default function AccessIDPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [showPartnerTypes, setShowPartnerTypes] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-32">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-full shadow-lg">
            <Shield size={28} className="text-white" />
          </div>
        </div>

        {!showPartnerTypes ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black italic uppercase tracking-tighter">ACCESS ID</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Selecciona tu perfil de acceso</p>
            </div>

            <div className="space-y-3">
              <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 text-center mb-4 italic">ACCESS VIBER</h2>
              <button onClick={() => loginWithGoogle().then(() => router.push("/viber/dashboard"))} className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
                <Chrome size={20} /> Ingresa con Google
              </button>
              <button onClick={() => router.push("/viber/login")} className="w-full bg-zinc-800 text-white h-16 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 border border-white/5 active:scale-95 transition-all">
                <Mail size={20} /> Con Email y Password
              </button>
            </div>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] bg-white/10 flex-1"></div>
              <span className="text-[8px] font-black uppercase text-zinc-600 tracking-[0.3em]">PRO ACCESS</span>
              <div className="h-[1px] bg-white/10 flex-1"></div>
            </div>

            <button onClick={() => setShowPartnerTypes(true)} className="w-full bg-zinc-900 border border-pink-500/20 h-16 rounded-2xl flex items-center justify-center gap-3 group active:border-pink-500 transition-all">
              <Store size={18} className="text-pink-500" />
              <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">ACCESS PARTNER</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black italic uppercase tracking-tighter">TIPO DE PARTNER</h1>
            </div>
            
            <button onClick={() => router.push("/partner/venues/login")} className="w-full bg-zinc-800 h-20 rounded-2xl p-4 flex items-center gap-4 border border-white/5 active:border-pink-500 transition-all">
              <div className="bg-pink-500/20 p-3 rounded-xl text-pink-500"><Store size={24} /></div>
              <div className="text-left">
                <p className="text-[11px] font-black uppercase italic">Venues</p>
                <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-tight">Bares, Clubes, Eventos...</p>
              </div>
            </button>

            <button disabled className="w-full bg-zinc-900 h-20 rounded-2xl p-4 flex items-center gap-4 border border-white/5 opacity-50 cursor-not-allowed">
              <div className="bg-orange-500/20 p-3 rounded-xl text-orange-500"><Flame size={24} /></div>
              <div className="text-left">
                <p className="text-[11px] font-black uppercase italic">HotVibers</p>
                <p className="text-[8px] text-orange-500 font-bold uppercase italic mt-1 tracking-widest">Próximamente</p>
              </div>
            </button>

            <button onClick={() => setShowPartnerTypes(false)} className="w-full flex items-center justify-center gap-2 text-zinc-500 text-[9px] font-black uppercase italic pt-4">
              <ArrowLeft size={12} /> Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
