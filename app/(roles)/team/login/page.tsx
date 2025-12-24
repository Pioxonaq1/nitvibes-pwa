"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, Loader2 } from "lucide-react";

export default function TeamLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, pass);
      router.push("/team/dashboard");
    } catch (err) { setError("Credenciales inválidas"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white border-4 border-red-900/10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6 text-gray-500"><ShieldAlert size={48} /></div>
        <h1 className="text-3xl font-black italic text-center mb-2 uppercase tracking-tighter">TEAM ONLY</h1>
        <form onSubmit={handleLogin} className="space-y-4 bg-zinc-900 p-8 rounded-[2rem] border border-white/5">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/5 rounded-xl p-3 text-white focus:border-white/50 outline-none font-mono" placeholder="Admin Email" required />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full bg-black border border-white/5 rounded-xl p-3 text-white focus:border-white/50 outline-none" placeholder="Security Key" required />
          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-white text-black p-4 rounded-xl font-black uppercase italic tracking-wider flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <>Auth <Lock size={14} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}