"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Chrome, Loader2, AlertTriangle } from "lucide-react";

export default function ViberLoginPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Ejecuta la lógica de AuthContext (Popup + Registro en Firestore si es nuevo) [cite: 2025-12-19]
      await loginWithGoogle();
      
      // 2. Redirección inmediata al Dashboard orquestado [cite: 2025-12-25]
      router.push("/viber/dashboard");
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError("Error al conectar con Google. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm text-center space-y-8">
        <div>
          <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-2 font-mono">Nitvibes Access</h2>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">VIBER ACCESS</h1>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Chrome size={18} /> Entrar con Google</>}
        </button>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold justify-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest leading-loose">
          Al acceder aceptas que compartiremos <br/> tu ubicación para mostrarte promos reales [cite: 2025-12-24]
        </p>
      </div>
    </div>
  );
}
