"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserCircle, ArrowRight, Loader2 } from "lucide-react";

export default function ViberLogin() {
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
      router.push("/viber/dashboard");
    } catch (err) { setError("Credenciales incorrectas"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6 text-blue-500"><UserCircle size={48} /></div>
        <h1 className="text-3xl font-black italic text-center mb-2 uppercase tracking-tighter">Viber Access</h1>
        <form onSubmit={handleLogin} className="space-y-4 bg-zinc-900/50 p-8 rounded-[2rem] border border-white/10">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none" placeholder="Email" required />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none" placeholder="Contraseña" required />
          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl font-black uppercase italic tracking-wider flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Entrar"}
          </button>
        </form>
        <p onClick={() => router.push('/register')} className="text-center text-xs text-gray-500 mt-6 cursor-pointer hover:text-white">¿No tienes cuenta? <span className="text-blue-400 underline">Regístrate gratis</span></p>
      </div>
    </div>
  );
}