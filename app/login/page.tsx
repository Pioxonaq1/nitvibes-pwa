"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Extraemos solo lo que existe en el contexto [cite: 2025-12-19]
  const { loginWithGoogle } = useAuth(); 
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Lógica directa para evitar bucles de tipos [cite: 2025-12-19]
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/perfil');
    } catch (err: any) {
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push('/perfil');
    } catch (err) {
      setError('Error al acceder con Google');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 bg-zinc-900 p-8 rounded-3xl border border-white/10">
        <div className="text-center mb-4">
            <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Viber Access</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase mt-2 tracking-widest">Tu noche comienza aquí</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-xs font-bold text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-yellow-400" 
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full bg-black border border-white/10 p-4 rounded-xl text-white outline-none focus:border-yellow-400" 
            required 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-zinc-500 text-[10px] uppercase font-bold">o</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-zinc-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-700 transition-colors text-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Continuar con Google
        </button>

        <p className="text-center text-zinc-500 text-xs mt-6 uppercase font-bold tracking-tighter">
          ¿No tienes cuenta? <Link href="/register" className="text-yellow-400 ml-1">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
}