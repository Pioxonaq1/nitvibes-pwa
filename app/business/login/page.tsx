"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function BusinessLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Usamos directamente Firebase para evitar errores de tipos en el context
      await signInWithEmailAndPassword(auth, email, password);
      // Tras loguearse, redirigimos al perfil que ahora actúa como selector de ID/Panel
      router.push('/perfil'); 
    } catch (err: any) {
      setError('Credenciales de Partner incorrectas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="text-center">
            <h1 className="text-3xl font-black text-yellow-400 italic uppercase tracking-tighter">Partner Login</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase mt-2 tracking-widest">Acceso exclusivo Venues</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-bold uppercase text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-4">Email Profesional</label>
            <input 
              type="email" 
              placeholder="nombre@sala.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-yellow-400 transition-colors" 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-4">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-yellow-400 transition-colors" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-yellow-300 transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Entrar al Panel'}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">
            Si has olvidado tus credenciales contacta con <span className="text-white">NITVIBES TEAM</span>
        </p>
      </div>
    </div>
  );
}