
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { UserCircle, ArrowRight, Loader2 } from "lucide-react";

export default function ViberLogin() {
  const { login, loginWithGoogle } = useAuth();
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

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      router.push("/viber/dashboard");
    } catch (err) { setError("Error con Google"); }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6 text-blue-500"><UserCircle size={48} /></div>
        <h1 className="text-3xl font-black italic text-center mb-2 uppercase tracking-tighter">Viber Access</h1>
        
        {/* BOTÓN GOOGLE */}
        <button onClick={handleGoogle} className="w-full bg-white text-black p-4 rounded-xl font-bold uppercase flex items-center justify-center gap-3 mb-6 hover:bg-gray-200 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-.61-.06-1.1-.15-1.81z"/></svg>
          Entrar con Google
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-white/10 flex-1"></div>
          <span className="text-[10px] uppercase font-bold text-gray-500">O usa tu email</span>
          <div className="h-px bg-white/10 flex-1"></div>
        </div>

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
