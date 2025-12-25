"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Chrome, Mail, UserPlus, Store, Shield, Building2 } from "lucide-react";

export default function AccessIDPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/viber/dashboard");
    } catch (error) {
      console.error("Error en login Google", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col gap-8 pb-32">
      <div className="text-center mt-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter italic">ACCESS ID</h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Selecciona tu perfil de acceso</p>
      </div>

      {/* SECCIÓN ACCESS VIBER [cite: 2025-12-25] */}
      <div className="border border-white/10 rounded-[2.5rem] p-6 bg-zinc-900/30">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-6 text-center italic">ACCESS VIBER</h2>
        <div className="flex flex-col gap-3">
          <button onClick={handleGoogleLogin} className="w-full bg-white text-black h-14 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3">
            <Chrome size={20} /> Ingresa con Google
          </button>
          <button onClick={() => router.push("/viber/login")} className="w-full bg-zinc-800 text-white h-14 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 border border-white/5">
            <Mail size={20} /> Ingresa con Email y Password
          </button>
          <button onClick={() => router.push("/register")} className="w-full h-14 rounded-2xl font-black uppercase italic text-zinc-400 border border-dashed border-white/20">
            Regístrate Gratis
          </button>
        </div>
      </div>

      {/* SECCIÓN ACCESS PARTNER [cite: 2025-12-25] */}
      <button onClick={() => router.push("/partner/login")} className="w-full bg-zinc-900 border border-pink-500/30 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 group">
        <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest group-hover:scale-110 transition-transform flex items-center gap-2">
          <Store size={14} /> ACCESS PARTNER
        </span>
        <span className="text-[8px] text-zinc-500 font-bold uppercase italic">Email & Business ID</span>
      </button>

      {/* SECCIÓN ACCESS TEAM [cite: 2025-12-25] */}
      <button onClick={() => router.push("/team/login")} className="w-full bg-zinc-900 border border-blue-500/30 h-16 rounded-2xl flex items-center justify-center gap-3 group">
        <Shield size={18} className="text-blue-500" />
        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">ACCESS TEAM</span>
      </button>

      {/* SECCIÓN ACCESS GOV [cite: 2025-12-25] */}
      <button onClick={() => router.push("/gov/login")} className="w-full bg-zinc-900 border border-emerald-500/30 h-16 rounded-2xl flex items-center justify-center gap-3 group">
        <Building2 size={18} className="text-emerald-500" />
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">ACCESS GOV</span>
      </button>
    </div>
  );
}
