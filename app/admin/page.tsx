'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, RefreshCw, Database } from 'lucide-react'; 
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [brainActive, setBrainActive] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Lógica de Salida
  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  const handleForceSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 p-6 font-sans">
      
      {/* HEADER SUPERIOR */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-white/10 gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 italic">NITVIBES</span> 
              <span>COMMAND</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Panel de Control Central & Operaciones</p>
        </div>
        
        <div className="flex items-center gap-6 bg-zinc-900/50 p-2 pr-4 rounded-full border border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-700 rounded-full flex items-center justify-center font-bold text-xs shadow-lg shadow-purple-900/20">
                    {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                </div>
                <div className="hidden sm:block">
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">{user?.email || 'ADMIN'}</p>
                    <p className="text-[9px] text-pink-500 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse"></span>
                        MASTER ADMIN
                    </p>
                </div>
            </div>

            <div className="h-8 w-px bg-white/10"></div>
            
            <a href="/" target="_blank" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors">
                WEB <ExternalLink size={10} />
            </a>

            <button 
                onClick={handleLogout}
                className="bg-red-500/10 border border-red-500/20 text-red-500 px-5 py-2 rounded-full text-[10px] font-bold hover:bg-red-600 hover:text-white transition-all tracking-wider"
            >
                SALIR
            </button>
        </div>
      </header>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* WIDGET CEREBRO */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-3xl p-1 overflow-hidden shadow-2xl shadow-purple-900/5">
            <div className="bg-zinc-900/30 rounded-[20px] p-6 h-full flex flex-col justify-between relative group">
                <div className={`absolute top-0 right-0 p-32 bg-purple-600/5 blur-[100px] rounded-full transition-opacity duration-1000 ${brainActive ? 'opacity-100' : 'opacity-20'}`}></div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-3">🧠 Cerebro Semanal</h3>
                        <p className="text-zinc-500 text-xs mt-1">Gestión Inteligente de Horarios & Aforos</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-2 transition-all ${brainActive ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${brainActive ? 'bg-green-400 animate-pulse' : 'bg-zinc-500'}`}></div>
                        {brainActive ? 'OPERATIVO' : 'APAGADO'}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 relative z-10">
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Último Ciclo</p>
                        <p className="text-2xl font-mono text-white tracking-widest">{brainActive ? '14:30:05' : '--:--:--'}</p>
                    </div>
                    <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Estado</p>
                        <p className={`text-sm font-medium ${brainActive ? 'text-blue-400' : 'text-zinc-600'}`}>
                            {syncing ? 'Sincronizando...' : (brainActive ? 'Análisis en tiempo real activo.' : 'Sistema en espera.')}
                        </p>
                    </div>
                </div>

                <div className="bg-zinc-950/50 -m-6 mt-0 p-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setBrainActive(!brainActive)} className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 relative ${brainActive ? 'bg-purple-600' : 'bg-zinc-700'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${brainActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                        <span className="text-xs font-medium text-zinc-400">Activar Piloto Automático</span>
                    </div>
                    <button onClick={handleForceSync} disabled={!brainActive || syncing} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${brainActive ? 'bg-white text-black hover:bg-zinc-200 border-white' : 'bg-transparent text-zinc-600 border-zinc-800 cursor-not-allowed'}`}>
                        <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
                        {syncing ? 'Sync...' : 'Forzar Sync'}
                    </button>
                </div>
            </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="flex flex-col gap-6">
            <div className="bg-zinc-900/30 border border-orange-500/20 rounded-3xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/20">✏️</div>
                    <span className="text-[10px] bg-orange-950 text-orange-400 px-2 py-1 rounded border border-orange-500/20">CMS</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">Sanity Studio</h3>
                <p className="text-zinc-500 text-xs mb-6 leading-relaxed">Gestor de contenido. Sube Vibes, gestiona venues y configura la app desde aquí.</p>
                <Link href="/studio" passHref>
                    <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 py-3 rounded-xl font-bold text-xs shadow-lg shadow-orange-900/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 text-white">
                        ABRIR EDITOR <ExternalLink size={12} />
                    </button>
                </Link>
            </div>

            <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 flex-grow flex flex-col justify-center gap-4">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">Estado del Sistema</p>
                <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-400">Role Actual</span>
                    <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-500/20">ADMIN</span>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-white/5">
                    <span className="text-xs text-zinc-400 flex items-center gap-2"><Database size={12} /> Base de Datos</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}