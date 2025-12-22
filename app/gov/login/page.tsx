'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scale, ArrowLeft, Building2, Lock } from 'lucide-react'; 
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES, ROUTES } from '@/lib/constants';

export default function GovLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validación simple
    if (email && password) {
        // 1. Login con rol GOV
        login({
            id: 'gov-001',
            name: 'Ayuntamiento',
            role: USER_ROLES.GOV, // <--- ROL CLAVE
            email: email
        });

        // 2. Redirección al Dashboard Gov
        router.push(ROUTES.DASHBOARD_GOV);
    } else {
        alert("Introduce credenciales oficiales");
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative z-50 font-sans">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-yellow-900/20 rounded-full flex items-center justify-center mb-4 border border-yellow-500/30">
            <Scale className="text-yellow-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-yellow-500 italic tracking-wider">
            GOV ACCESS
          </h1>
          <p className="text-zinc-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
            Entidades Públicas & Seguridad
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">
              ID Entidad
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seguridad@ciudad.gob"
                className="w-full bg-zinc-950 text-white px-12 py-3 rounded-lg text-sm font-medium border border-zinc-800 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">
              Credencial de Acceso
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••••••"
                className="w-full bg-zinc-950 text-white px-12 py-3 rounded-lg text-sm font-medium border border-zinc-800 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-zinc-200 transition-all duration-200 mt-4 flex justify-center items-center gap-2"
          >
            {loading ? 'VERIFICANDO...' : 'ENTRAR'}
          </button>
        </form>

        <div className="mt-8 flex justify-center">
            <button onClick={() => router.push('/perfil')} className="text-zinc-500 text-xs flex items-center gap-2 hover:text-white transition-colors">
                <ArrowLeft size={14} /> Volver a Plataforma
            </button>
        </div>
      </div>
    </div>
  );
}