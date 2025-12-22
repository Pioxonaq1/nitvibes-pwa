"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Shield, Brain, Activity, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { client } from '@/sanity/client';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // Estado para verificar conexiones
  const [sanityStatus, setSanityStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [firebaseStatus, setFirebaseStatus] = useState<'ok' | 'error'>('ok'); // Asumimos ok si user existe

  // Simulación de Rol (Esto luego vendrá de Firebase Custom Claims)
  // Por ahora, si el email es tuyo, eres SUPER ADMIN. Si no, Colaborador.
  const isAdmin = user?.email === 'pioxonaq@gmail.com' || user?.email === 'admin@nitvibes.com';

  useEffect(() => {
    if (!user) {
      router.push(ROUTES.ADMIN_LOGIN);
      return;
    }

    // 1. Probar conexión con Sanity
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
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-red-500" />
            Panel de Team
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Usuario: <span className="text-white">{user.email}</span> 
            <span className="ml-2 px-2 py-0.5 rounded bg-gray-800 text-[10px] uppercase">
              {isAdmin ? 'ADMIN (Cerebro)' : 'COLABORADOR'}
            </span>
          </p>
        </div>
        <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300">
          Cerrar Sesión
        </button>
      </header>

      {/* 1. DIAGNÓSTICO DE CONEXIONES (Visible para ambos) */}
      <section className="mb-8 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
        <h2 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">Estado del Sistema</h2>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">🔥 Firebase (Auth/Rowy)</span>
            {user ? <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14}/> Conectado</span> : <span className="text-red-500">Error</span>}
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">⚡ Sanity (Vibes)</span>
            {sanityStatus === 'checking' && <span className="text-yellow-500">Comprobando...</span>}
            {sanityStatus === 'ok' && <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14}/> Conectado</span>}
            {sanityStatus === 'error' && <span className="text-red-500 flex items-center gap-1"><AlertTriangle size={14}/> Fallo (Revisar ENV)</span>}
          </div>
        </div>
      </section>

      {/* 2. CEREBRO SEMANAL (SOLO ADMIN) */}
      {isAdmin && (
        <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-500/30 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Brain size={100} />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Brain className="text-red-400" /> Cerebro Semanal
            </h2>
            <p className="text-gray-300 text-sm mb-4">
              Resumen estratégico y métricas sensibles. Solo visible para Nivel Admin.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-3 rounded-lg">
                <div className="text-xs text-gray-400">Ingresos Proyectados</div>
                <div className="text-lg font-bold">€ 0.00</div>
              </div>
              <div className="bg-black/40 p-3 rounded-lg">
                <div className="text-xs text-gray-400">Nuevos Partners</div>
                <div className="text-lg font-bold">0</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. HERRAMIENTAS COMUNES (Collaborator + Admin) */}
      <section>
        <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Operaciones</h2>
        <div className="grid grid-cols-2 gap-4">
         <a href="/studio" target="_blank" className="bg-[#111] p-4 rounded-xl border border-gray-800 flex flex-col items-center justify-center gap-2 text-center hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
  <Activity className="text-blue-400 group-hover:scale-110 transition-transform" />
  <span className="text-sm font-medium text-white">Editar Contenido (Studio)</span>
</a>
          <div className="bg-[#111] p-4 rounded-xl border border-gray-800 flex flex-col items-center justify-center gap-2 text-center hover:bg-[#1a1a1a] transition-colors">
            <Users className="text-green-400" />
            <span className="text-sm font-medium">Gestionar Usuarios</span>
          </div>
        </div>
      </section>
    </div>
  );
}