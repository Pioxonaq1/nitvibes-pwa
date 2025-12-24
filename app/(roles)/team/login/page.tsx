"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TeamLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Vista: 'LOGIN' o 'RECOVERY' (Equivale a tu cuadro "Page Registro" en el diagrama)
  const [view, setView] = useState<'LOGIN' | 'RECOVERY'>('LOGIN');
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // --- LOGICA 1: LOGIN (Caja "Login Team") ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Auth de Firebase
      await login(email, password);
      
      // 2. Verificación de Rol (Círculo "Verificación" en tu dibujo)
      const q = query(
        collection(db, "users"), 
        where("email", "==", email),
        where("role", "in", ["admin", "collaborator"]) 
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // NO OK -> No es del equipo
        setError("Acceso denegado. No perteneces al Team.");
        auth.signOut();
      } else {
        // OK -> Dashboard Panel Team
        router.push("/team/dashboard");
      }

    } catch (err: any) {
      console.error(err);
      // NO OK -> Credenciales fallidas
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError("Credenciales incorrectas.");
      } else {
        setError("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- LOGICA 2: RECUPERACIÓN (Caja "Page Registro/Recuperación") ---
  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // Verificar si es del equipo antes de enviar nada
      const q = query(
        collection(db, "users"), 
        where("email", "==", email),
        where("role", "in", ["admin", "collaborator"])
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // NO OK -> "Contacta con el administrador"
        setError("Usuario no autorizado. Contacta con el Administrador (Nitvibes).");
      } else {
        // OK -> Enviar correo
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
        setTimeout(() => setView('LOGIN'), 4000);
      }

    } catch (err: any) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Fondo Vibe */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black -z-10" />

      {/* Botón volver a selección de ID */}
      <Link href="/perfil" className="absolute top-6 left-6 text-gray-500 hover:text-white flex items-center gap-2 text-xs uppercase font-bold tracking-widest transition-colors">
        <ArrowLeft size={16} /> Volver a ID
      </Link>

      <div className="w-full max-w-sm relative z-10">
        
        {/* LOGO TEAM */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse">
            <ShieldCheck size={40} className="text-blue-400" />
          </div>
        </div>

        <h1 className="text-3xl font-black italic text-center mb-1 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
          VIBE TEAM
        </h1>
        <p className="text-center text-gray-500 text-xs mb-8 font-mono tracking-widest uppercase">Admin & Collaborators</p>

        <div className="bg-zinc-900/80 p-8 rounded-[2rem] border border-blue-500/20 backdrop-blur-md shadow-2xl">
          
          {/* --- VISTA LOGIN --- */}
          {view === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 ml-2">Email Corporativo</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" 
                  placeholder="team@nitvibes.com" 
                  required 
                />
              </div>
              
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 ml-2">Contraseña</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all" 
                  placeholder="••••••••" 
                  required 
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500 shrink-0" />
                  <p className="text-red-400 text-xs font-bold leading-tight">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-xl font-black uppercase italic tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-900/50 text-white"
              >
                {loading ? <Loader2 className="animate-spin" /> : "ACCEDER"}
              </button>

              <button 
                type="button"
                onClick={() => { setError(""); setView('RECOVERY'); }}
                className="w-full text-center text-xs text-gray-400 hover:text-white transition-colors mt-4 underline underline-offset-4"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          )}

          {/* --- VISTA RECUPERACIÓN (Tu caja "Page Registro") --- */}
          {view === 'RECOVERY' && (
            <form onSubmit={handleRecovery} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-4">
                <h3 className="text-white font-bold text-sm">Recuperación de Acceso</h3>
                <p className="text-gray-400 text-xs mt-1">Introduce tu email de equipo para verificar permisos.</p>
              </div>

              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none" 
                placeholder="Email..." 
                required 
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-400 text-xs font-bold leading-tight">{error}</p>
                </div>
              )}

              {successMsg && (
                <div className="bg-green-500/10 border border-green-500/50 p-3 rounded-lg flex items-start gap-2">
                  <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                  <p className="text-green-400 text-xs font-bold leading-tight">{successMsg}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-white text-black p-3 rounded-xl font-black uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Verificar y Enviar"}
              </button>

              <button 
                type="button"
                onClick={() => { setError(""); setSuccessMsg(""); setView('LOGIN'); }}
                className="w-full text-center text-xs text-gray-500 hover:text-white mt-2"
              >
                Volver al Login
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
