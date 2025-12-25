
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { ShieldCheck, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TeamLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      
      // Verificación de ROL en Firestore
      const q = query(
        collection(db, "users"), 
        where("email", "==", email.toLowerCase()),
        where("role", "in", ["admin", "collaborator"]) 
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Acceso denegado. Perfil de equipo no encontrado.");
        auth.signOut();
      } else {
        router.push("/team/dashboard");
      }
    } catch (err: any) {
      setError("Error de autenticación: Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <ShieldCheck size={48} className="text-blue-500" />
        </div>
        <h1 className="text-3xl font-black text-center text-white mb-8 uppercase italic">VIBE TEAM</h1>
        <form onSubmit={handleLogin} className="space-y-4 bg-zinc-900/50 p-8 rounded-[2rem] border border-white/10">
          <input 
            type="email" 
            placeholder="Email Corporativo" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black border border-white/10 p-3 rounded-xl text-white outline-none focus:border-blue-500"
          />
          {error && <div className="text-red-500 text-xs font-bold flex gap-2"><AlertTriangle size={14}/> {error}</div>}
          <button className="w-full bg-blue-600 p-4 rounded-xl font-bold text-white uppercase italic">
            {loading ? <Loader2 className="animate-spin mx-auto"/> : "ACCEDER"}
          </button>
        </form>
      </div>
    </div>
  );
}
