"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Chrome, Mail, Lock, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ViberLoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      // Tras login exitoso con Google, redirigimos al Panel según tus notas
      router.push("/viber/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Error al acceder con Google. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push("/viber/dashboard");
    } catch (err: any) {
      setError("Credenciales incorrectas o usuario no encontrado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-24">
      <div className="w-full max-w-sm space-y-8">
        
        <div className="text-center">
          <div className="inline-flex p-4 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4">
             <Chrome size={32} className="text-blue-400" />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">VIBER ACCESS</h1>
        </div>

        {/* BOTÓN GOOGLE PRIORITARIO */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Chrome size={18} /> Entrar con Google</>}
        </button>

        <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] bg-white/10 flex-1"></div>
            <span className="text-[10px] text-gray-600 font-bold uppercase">o usa tu email</span>
            <div className="h-[1px] bg-white/10 flex-1"></div>
        </div>

        {/* FORMULARIO EMAIL */}
        <form onSubmit={handleEmailLogin} className="space-y-4 bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5">
          <div className="space-y-1">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-purple-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                type="password" 
                placeholder="Contraseña" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-purple-500 transition-all text-sm"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold justify-center animate-pulse">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-2xl font-black uppercase italic tracking-wider shadow-lg active:scale-95 transition-all"
          >
            ENTRAR
          </button>
        </form>

        <p className="text-center text-[10px] text-zinc-500 uppercase font-bold tracking-tight">
          ¿No tienes cuenta? <Link href="/perfil" className="text-white underline">Regístrate gratis</Link>
        </p>

      </div>
    </div>
  );
}
