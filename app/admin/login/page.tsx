'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowLeft, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES, ROUTES } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validación estándar sin GPS forzado
    if (email && password) {
        
        // Simulación de éxito
        login({
            id: 'admin-1',
            name: 'Master Admin',
            role: USER_ROLES.ADMIN,
            email: email
        });

        router.push(ROUTES.DASHBOARD_ADMIN);
        
    } else {
        alert("Por favor introduce credenciales");
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative z-50 font-sans">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4 border border-red-500/30 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <Shield className="text-red-500" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">TEAM ACCESS</h1>
          <p className="text-zinc-500 text-[10px] mt-2 font-mono uppercase tracking-widest flex items-center gap-1">
             <Lock size={10} /> Secure System v2.3
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">
              ID Corporativo
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@konnektwerk.com"
                className="w-full bg-zinc-950 text-white px-12 py-3 rounded-lg text-sm font-medium border border-zinc-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">
              Clave de Seguridad
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-950 text-white px-12 py-3 rounded-lg text-sm font-medium border border-zinc-800 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-zinc-200 transition-all duration-200 mt-4 flex justify-center items-center gap-2"
          >
            {loading ? 'ACCEDIENDO...' : 'INICIAR SESIÓN'}
          </button>

        </form>

        <div className="mt-8 flex justify-center">
          <Link href="/perfil" className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors text-xs">
            <ArrowLeft size={14} />
            <span>VOLVER A PLATAFORMA</span>
          </Link>
        </div>

      </div>
    </div>
  );
}