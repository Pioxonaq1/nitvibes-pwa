"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Chrome, Mail, UserPlus, Store, Shield, Building2, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center pb-32">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        
        {/* Icono decorativo superior para uniformidad con Registro */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-full shadow-lg shadow-blue-500/20">
            <Shield size={28} className="text-white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">ACCESS ID</h1>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Selecciona tu perfil de acceso</p>
        </div>

        <div className="space-y-4">
          {/* SECCIÓN VIBER - Estética idéntica a Registro */}
          <div className="space-y-3 p-1">
             <button 
              onClick={handleGoogleLogin} 
              className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 shadow-xl hover:bg-zinc-200 transition-all"
            >
              <Chrome size={20} /> Ingresa con Google
            </button>

            <button 
              onClick={() => router.push("/viber/login")} 
              className="w-full bg-zinc-800 text-white h-16 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 border border-white/5 hover:bg-zinc-700 transition-all"
            >
              <Mail size={20} /> Con Email y Password
            </button>

            <button 
              onClick={() => router.push("/register")} 
              className="w-full h-14 rounded-2xl font-black uppercase italic text-zinc-500 border border-dashed border-white/20 hover:text-white hover:border-white/40 transition-all text-xs"
            >
              Regístrate Gratis
            </button>
          </div>

          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] bg-white/10 flex-1"></div>
            <span className="text-[8px] font-black uppercase text-zinc-600 tracking-[0.3em]">Otros Perfiles</span>
            <div className="h-[1px] bg-white/10 flex-1"></div>
          </div>

          {/* PARTNER - Botón con altura y estilo unificado */}
          <button 
            onClick={() => router.push("/partner/login")} 
            className="w-full bg-zinc-900 border border-pink-500/30 h-16 rounded-2xl flex items-center justify-center gap-3 group hover:border-pink-500 transition-all"
          >
            <Store size={18} className="text-pink-500" />
            <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">ACCESS PARTNER</span>
          </button>

          {/* TEAM & GOV - Compactos pero con la misma altura que los secundarios de Registro */}
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => router.push("/team/login")} 
              className="bg-zinc-900 border border-blue-500/30 h-14 rounded-2xl flex items-center justify-center gap-2 group hover:border-blue-500 transition-all"
            >
              <Shield size={16} className="text-blue-500" />
              <span className="text-[9px] font-black text-blue-400 uppercase">TEAM</span>
            </button>

            <button 
              onClick={() => router.push("/gov/login")} 
              className="bg-zinc-900 border border-emerald-500/30 h-14 rounded-2xl flex items-center justify-center gap-2 group hover:border-emerald-500 transition-all"
            >
              <Building2 size={16} className="text-emerald-500" />
              <span className="text-[9px] font-black text-emerald-400 uppercase">GOV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
