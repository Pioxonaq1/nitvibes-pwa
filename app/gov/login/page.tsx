"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Landmark } from 'lucide-react';

export default function GovLoginPage() {
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
      // Usamos Firebase directamente para evitar errores de tipos [cite: 2025-12-19]
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/perfil'); // Redirige al perfil/selector de panel [cite: 2025-12-21]
    } catch (err: any) {
      setError('Credenciales de acceso gubernamental incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="text-center">
            <Landmark size={48} className="text-blue-400 mx-auto mb-4" />
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Gov Login</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase mt-2 tracking-widest">Acceso Institucional</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs font-bold uppercase text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-500 uppercase ml-4">Email Oficial</label>
            <input 
              type="email" 
              placeholder="institucion@gob.es" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-400 transition-colors" 
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
              className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-blue-400 transition-colors" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-blue-500 transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Acceder al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}