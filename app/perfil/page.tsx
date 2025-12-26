"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Chrome, Mail, Store, Shield, Building2 } from "lucide-react";

export default function AccessIDPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push("/viber/components/dashboard");
    } catch (error) {
      console.error("Error en login Google", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8">
        
        <div className="text-center mt-12 mb-4">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">ACCESS ID</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Selecciona tu perfil de acceso</p>
        </div>

        {/* SECCIÓN ACCESS VIBER (Contenedor del dibujo) [cite: 2025-12-25] */}
        <div className="border border-white/10 rounded-[2.5rem] p-8 bg-zinc-900/20 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 text-center mb-6 italic">ACCESS VIBER</h2>
          
          <button 
            onClick={handleGoogleLogin} 
            className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
          >
            <Chrome size={22} /> Ingresa con Google
          </button>

          <button 
            onClick={() => router.push("/viber/login")} 
            className="w-full bg-zinc-800 text-white h-16 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 border border-white/5 active:scale-95 transition-all"
          >
            <Mail size={22} /> Ingresa con Email y Password
          </button>

          <button 
            onClick={() => router.push("/register")} 
            className="w-full h-16 rounded-2xl font-black uppercase italic text-zinc-400 border border-dashed border-white/20 active:opacity-70 transition-all"
          >
            Regístrate Gratis
          </button>
        </div>

        {/* RESTO DE PERFILES (Orden del dibujo) [cite: 2025-12-25] */}
        <div className="space-y-4">
          <button 
            onClick={() => router.push("/partner/venues/login")} 
            className="w-full bg-zinc-900 border border-pink-500/20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 active:border-pink-500 transition-all"
          >
            <span className="text-xs font-black text-pink-500 uppercase tracking-widest flex items-center gap-2">
              <Store size={18} /> ACCESS PARTNER
            </span>
            <span className="text-[8px] text-zinc-600 font-bold uppercase italic tracking-tighter">Venues & HotVibers</span>
          </button>

          <button 
            onClick={() => router.push("/team/login")} 
            className="w-full bg-zinc-900 border border-blue-500/20 h-16 rounded-2xl flex items-center justify-center gap-3 active:border-blue-500 transition-all"
          >
            <Shield size={20} className="text-blue-500" />
            <span className="text-xs font-black text-blue-400 uppercase tracking-widest">ACCESS TEAM</span>
          </button>

          <button 
            onClick={() => router.push("/gov/login")} 
            className="w-full bg-zinc-900 border border-emerald-500/20 h-16 rounded-2xl flex items-center justify-center gap-3 active:border-emerald-500 transition-all"
          >
            <Building2 size={20} className="text-emerald-500" />
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">ACCESS GOV</span>
          </button>
        </div>

      </div>
    </div>
  );
}
