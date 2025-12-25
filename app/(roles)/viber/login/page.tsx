"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Chrome, Mail, ArrowLeft, Loader2 } from "lucide-react";

export default function ViberLoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.push("/viber/dashboard");
    } catch (err) {
      alert("Error en el login. Verifica tus datos.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 bg-zinc-900/30 p-8 rounded-[2.5rem] border border-white/5">
        <h1 className="text-3xl font-black italic uppercase text-center tracking-tighter">VIBER <span className="text-blue-500 italic">LOGIN</span></h1>
        
        <button onClick={loginWithGoogle} className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 active:scale-95 transition-all">
          <Chrome size={20} /> Entrar con Google
        </button>

        <div className="flex items-center gap-4 text-zinc-600">
          <div className="h-px bg-zinc-800 flex-1"></div>
          <span className="text-[10px] font-bold uppercase italic">o con tu email</span>
          <div className="h-px bg-zinc-800 flex-1"></div>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input type="email" placeholder="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-16 bg-zinc-800/50 rounded-2xl px-6 font-bold outline-none border border-white/5 focus:border-blue-500 transition-all" />
          <input type="password" placeholder="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-16 bg-zinc-800/50 rounded-2xl px-6 font-bold outline-none border border-white/5 focus:border-blue-500 transition-all" />
          <button type="submit" disabled={loading} className="w-full h-16 bg-blue-600 rounded-2xl font-black uppercase italic active:scale-95 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "ENTRAR"}
          </button>
        </form>

        <button onClick={() => router.push("/perfil")} className="w-full text-zinc-500 text-[10px] font-black uppercase italic flex items-center justify-center gap-2 pt-4">
          <ArrowLeft size={12} /> Volver
        </button>
      </div>
    </div>
  );
}
