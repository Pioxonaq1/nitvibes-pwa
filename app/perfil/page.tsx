"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Building2, Landmark, Users, UserCircle, LogOut, ArrowRight } from 'lucide-react';

export default function PerfilPage() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();

  // LOGOUT: Desconecta y manda al HOME [2025-12-21]
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // SI ESTÁ LOGUEADO: Mostramos su Panel o Perfil según rol
  if (user) {
    return (
      <div className="min-h-screen bg-black p-6 pt-20 text-white">
        <h1 className="text-3xl font-black italic mb-2">HOLA, {userData?.nombre || 'VIBER'}</h1>
        <p className="text-zinc-500 mb-8 uppercase text-xs tracking-widest">Rol: {userData?.role}</p>
        
        <div className="space-y-4">
          {/* Aquí iría el acceso al Dashboard específico según rol */}
          <button className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
            <span className="font-bold">Ir a mi Panel de Control</span>
            <ArrowRight size={18} className="text-yellow-400" />
          </button>

          <button 
            onClick={handleLogout}
            className="w-full bg-red-900/20 border border-red-900/50 text-red-500 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold mt-10"
          >
            <LogOut size={18} /> SALIR
          </button>
        </div>
      </div>
    );
  }

  // SI ES ANÓNIMO: Pantalla de ID (Selección de Perfil) [2025-12-21]
  return (
    <div className="min-h-screen bg-black p-6 pt-20 flex flex-col items-center">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Acceso Nitvibes</h2>
        <p className="text-zinc-500 text-sm">Selecciona tu perfil de acceso</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {/* Opción VIBER */}
        <button onClick={() => router.push('/login')} className="w-full bg-white text-black p-6 rounded-3xl flex items-center gap-4 transition-transform active:scale-95">
          <UserCircle size={32} />
          <div className="text-left">
            <p className="font-black text-lg leading-none">VIBER</p>
            <p className="text-xs opacity-60">Acceso usuarios</p>
          </div>
        </button>

        {/* Opción PARTNER */}
        <button onClick={() => router.push('/login?role=partner')} className="w-full bg-zinc-900 border border-white/10 text-white p-6 rounded-3xl flex items-center gap-4 transition-transform active:scale-95">
          <Building2 size={32} className="text-yellow-400" />
          <div className="text-left">
            <p className="font-black text-lg leading-none italic">PARTNER</p>
            <p className="text-xs text-zinc-500">Venues & Bares</p>
          </div>
        </button>

        {/* Opción GOV / TEAM */}
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => router.push('/login?role=gov')} className="bg-zinc-900 border border-white/10 text-white p-4 rounded-3xl flex flex-col items-center gap-2">
                <Landmark size={24} className="text-blue-400" />
                <span className="font-bold text-xs">GOV</span>
            </button>
            <button onClick={() => router.push('/login?role=team')} className="bg-zinc-900 border border-white/10 text-white p-4 rounded-3xl flex flex-col items-center gap-2">
                <Users size={24} className="text-purple-400" />
                <span className="font-bold text-xs">TEAM</span>
            </button>
        </div>
      </div>

      <div className="mt-10">
        <button onClick={() => router.push('/register')} className="text-yellow-400 font-bold text-sm hover:underline">
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>
    </div>
  );
}