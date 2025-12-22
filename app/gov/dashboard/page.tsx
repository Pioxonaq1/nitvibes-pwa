'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, ShieldAlert, Users, Radio } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/lib/constants';

export default function GovDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  // Lógica de Salida: Borra sesión y manda al HOME
  const handleLogout = () => {
    logout();
    router.push(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24 p-6 font-sans">
      
      {/* HEADER GOV */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-white/10 gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-wider flex items-center gap-2 text-yellow-500">
              <span className="italic">CITY</span> CONTROL
            </h1>
            <p className="text-zinc-500 text-xs mt-1">Gestión de Aforos & Seguridad Ciudadana</p>
        </div>
        
        <div className="flex items-center gap-4 bg-zinc-900/50 p-2 pr-4 rounded-full border border-white/5">
            <div className="w-8 h-8 bg-yellow-900/30 rounded-full flex items-center justify-center text-[10px] font-bold text-yellow-500 border border-yellow-500/30">
                GOV
            </div>
            <div className="hidden sm:block">
                <p className="text-[10px] font-bold text-white uppercase">{user?.name || 'ENTIDAD PÚBLICA'}</p>
                <p className="text-[9px] text-zinc-500 font-mono">{user?.email}</p>
            </div>

            <div className="h-6 w-px bg-white/10 mx-2"></div>

            {/* BOTÓN SALIR */}
            <button 
                onClick={handleLogout}
                className="text-red-500 text-[10px] font-bold hover:text-red-400 transition-colors tracking-wider"
            >
                SALIR
            </button>
        </div>
      </header>

      {/* WIDGETS GOV */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        
        {/* Widget Alertas */}
        <div className="bg-zinc-900/30 border border-red-900/30 rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-900/20 rounded-lg text-red-500">
                    <ShieldAlert size={24} />
                </div>
                <span className="text-[10px] bg-red-950 text-red-500 px-2 py-1 rounded border border-red-900/30 animate-pulse">
                    EN VIGILANCIA
                </span>
            </div>
            <h3 className="text-lg font-bold mb-1">Alertas Activas</h3>
            <p className="text-zinc-500 text-xs mb-6">Incidencias reportadas en las últimas 24h.</p>
            <div className="text-3xl font-mono text-white mb-2">0</div>
            <p className="text-[10px] text-green-500">Sin incidencias graves.</p>
        </div>

        {/* Widget Aforo Ciudad */}
        <div className="bg-zinc-900/30 border border-blue-900/30 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-900/20 rounded-lg text-blue-500">
                    <Users size={24} />
                </div>
                <span className="text-[10px] bg-blue-950 text-blue-400 px-2 py-1 rounded border border-blue-900/30">
                    TIEMPO REAL
                </span>
            </div>
            <h3 className="text-lg font-bold mb-1">Densidad Poblacional</h3>
            <p className="text-zinc-500 text-xs mb-6">Estimación de afluencia en zonas de ocio.</p>
            
            <div className="flex items-center gap-2">
                <Radio size={16} className="text-green-500 animate-pulse" />
                <span className="text-sm font-bold">Normal</span>
            </div>
        </div>

      </div>
    </div>
  );
}