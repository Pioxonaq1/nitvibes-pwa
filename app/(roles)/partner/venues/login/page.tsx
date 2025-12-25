"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Store, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function VenueLoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedUser = userCredential.user;

      // Verificar el rol en Firestore antes de permitir el acceso [cite: 2021-12-21]
      const docRef = doc(db, "users", loggedUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().role === "partner") {
        router.push("/partner/venues/dashboard");
      } else {
        alert("Acceso denegado: Esta cuenta no tiene permisos de Partner/Venue.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error en login Venue", error);
      alert("Credenciales incorrectas o error de conexión.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-32">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex justify-center mb-6">
          <div className="bg-pink-600 p-4 rounded-full shadow-lg shadow-pink-500/20 text-white animate-pulse">
            <Store size={28} />
          </div>
        </div>

        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-2 leading-none">
          VENUES <span className="text-pink-500 italic">LOGIN</span>
        </h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center mb-8 italic">
          Bares, Clubes y Discotecas
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="apolo@test.com" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-16 bg-blue-50 border border-white/5 rounded-2xl px-6 text-sm font-bold text-black focus:border-pink-500 outline-none transition-all" 
          />
          <input 
            type="password" 
            placeholder="••••••••" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-16 bg-blue-50 border border-white/5 rounded-2xl px-6 text-sm font-bold text-black focus:border-pink-500 outline-none transition-all" 
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic text-lg shadow-xl active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "ENTRAR AL PANEL"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase italic text-zinc-500 mb-2 tracking-tighter">¿Aún no eres Partner?</p>
          <button onClick={() => router.push("/contact/nitvibes")} className="text-xs font-black uppercase italic text-pink-500 hover:text-white transition-colors animate-bounce">
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
