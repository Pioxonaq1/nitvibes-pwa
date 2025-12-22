"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Shield, Brain, Activity, Users, CheckCircle, AlertTriangle, PenTool } from 'lucide-react';
import { client } from '@/sanity/client';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Estado para verificar conexiones
  const [sanityStatus, setSanityStatus] = useState<'checking' | 'ok' | 'error'>('checking');

  // 👇 LÓGICA DE ROLES (Recuperada de memoria)
  // Si es tu email, eres el SUPER ADMIN y ves el Cerebro.
  const isAdmin = user?.email === 'pioxonaq@gmail.com' || user?.email === 'admin@nitvibes.com';

  useEffect(() => {
    if (!user) {
      router.push(ROUTES.ADMIN_LOGIN);
      return;
    }

    // Diagnóstico de Sanity en vivo
    const checkSanity = async () => {
      try {
        await client.fetch(`count(*[_type == "post"])`);
        setSanityStatus('ok');
      } catch (e) {
        console.error("Sanity Error:", e);
        setSanityStatus('error');
      }
    };
    checkSanity();

  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.HOME);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      
      {/* 1. HEADER PREMIUM */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2 tracking-tighter">
            <Shield className={isAdmin ? "text-red-500" : "text-blue-500"} fill="currentColor" fillOpacity={0.2} />
            NITVIBES <span className="text-gray-500 font-light">TEAM</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1 ml-1">
            Hola, <span className="text-white font-bold">{user.email?.split('@')[0]}</span> 
            <span className={`ml-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${isAdmin ? 'bg-red-900/50 text-red-200' : 'bg-blue-900/50 text-blue-200'}`}>
              {isAdmin ? 'Admin Nivel 1' : 'Colaborador'}
            </span>
          </p>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-900/50 px-3 py-1 rounded-full hover:bg-red-900/20 transition-colors">
          Salir
        </button>
      </header>

      {/* 2. DIAGNÓSTICO DEL SISTEMA (Compacto) */}
      <section className="mb-6 flex gap-2 text-xs overflow-x-auto pb-2">
        <div className="bg-gray-900/80 px-3 py-2 rounded-lg border border-gray-800 flex items-center gap-2 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Firebase: <span className="text-green-400 font-bold">Conectado</span>
        </div>
        <div className="bg-gray-900/80 px-3 py-2 rounded-lg border border-gray-800 flex items-center gap-2 whitespace-nowrap">
          <span className={`w-2 h-2 rounded-full ${sanityStatus === 'ok' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          Sanity: 
          {sanityStatus === 'ok' ? <span className="text-green-400 font-bold">Online</span> : <span className="text-red-400 font-bold">Error</span>}
        </div>
      </section>

      {/* 3. CEREBRO SEMANAL (Solo Admin - Tu diseño favorito) */}
      {isAdmin && (
        <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="relative bg-gradient-to-br from-red-950 via-black to-black border border-red-900/50 p-6 rounded-2xl overflow-hidden shadow-2xl shadow-red-900/10">
            {/* Fondo decorativo */}
            <div className="absolute -top-4 -right-4 text-red-900/20 rotate-12">
              <Brain size={120} />
            </div>
            
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2 z-10 relative">
              <Brain className="text-red-500" size={20} /> 
              CEREBRO SEMANAL
            </h2>
            <p className="text-gray-400 text-xs mb-5 z-10 relative max-w-[80%]">
              Inteligencia estratégica y métricas confidenciales.
            </p>

            <div className="grid grid-cols-2 gap-3 z-10 relative">
              <div className="bg-black/60 backdrop-blur-sm p-3 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase font-bold">Ingresos (Proj)</div>
                <div className="text-xl font-mono text-white">€ 0.00</div>
              </div>
              <div className="bg-black/60 backdrop-blur-sm p-3 rounded-xl border border-white/5">
                <div className="text-[10px] text-gray-500 uppercase font-bold">Partners Activos</div>
                <div className="text-xl font-mono text-white">0</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. HERRAMIENTAS DE GESTIÓN (Para todos) */}
      <section>
        <h2 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2">
           <span className="w-4 h-[1px] bg-gray-700"></span> Operaciones
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          
          {/* BOTÓN AL STUDIO DE SANITY (El que arreglamos) */}
          <a 
            href="/studio" 
            target="_blank" 
            className="group relative bg-[#111] p-5 rounded-2xl border border-gray-800 flex flex-col items-center justify-center gap-3 text-center hover:bg-[#161616] hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="bg-purple-900/20 p-3 rounded-full group-hover:bg-purple-900/40 transition-colors">
              <PenTool className="text-purple-400 group-hover:scale-110 transition-transform" size={24} />
            </div>
            <div>
              <span className="block text-sm font-bold text-gray-200 group-hover:text-white">Editor de Contenido</span>
              <span className="text-[10px] text-gray-500">Gestión de Vibes (Sanity)</span>
            </div>
          </a>

          {/* BOTÓN GESTIÓN USUARIOS */}
          <div className="group bg-[#111] p-5 rounded-2xl border border-gray-800 flex flex-col items-center justify-center gap-3 text-center hover:bg-[#161616] hover:border-blue-500/30 transition-all duration-300 cursor-pointer">
            <div className="bg-blue-900/20 p-3 rounded-full group-hover:bg-blue-900/40 transition-colors">
              <Users className="text-blue-400 group-hover:scale-110 transition-transform" size={24} />
            </div>
            <div>
              <span className="block text-sm font-bold text-gray-200 group-hover:text-white">Usuarios</span>
              <span className="text-[10px] text-gray-500">Permisos y Roles</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}