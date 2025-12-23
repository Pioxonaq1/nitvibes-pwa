"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Building2, Landmark, Users, UserCircle, LogOut, ArrowRight } from 'lucide-react';

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (user && user.role) {
    return (
      <div className="min-h-screen bg-black p-6 pt-20 text-white">
        <h1 className="text-3xl font-black italic mb-2 uppercase">HOLA, {user.nombre || 'VIBER'}</h1>
        <p className="text-zinc-500 mb-8 uppercase text-xs tracking-widest">Acceso: {user.role}</p>
        
        <div className="space-y-4">
          <button className="w-full bg-zinc-900 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
            <span className="font-bold uppercase text-sm">Ir a mi Panel de Control</span>
            <ArrowRight size={18} className="text-yellow-400" />
          </button>

          <button 
            onClick={handleLogout}
            className="w-full bg-red-900/10 border border-red-900/30 text-red-500 p-4 rounded-2xl flex items-center justify-center gap-2 font-bold mt-10 uppercase text-xs"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 pt-20 flex flex-col items-center">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Acceso Nitvibes</h2>
        <p className="text-zinc-500 text-sm">Selecciona tu perfil de acceso</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button onClick={() => router.push('/login')} className="w-full bg-white text-black p-6 rounded-3xl flex items-center gap-4 transition-transform active:scale-95">
          <UserCircle size={32} />
          <div className="text-left">
            <p className="font-black text-lg leading-none">VIBER</p>
            <p className="text-xs opacity-60">Acceso usuarios</p>
          </div>
        </button>

        <button onClick={() => router.push('/login?role=partner')} className="w-full bg-zinc-900 border border-white/10 text-white p-6 rounded-3xl flex items-center gap-4 transition-transform active:scale-95">
          <Building2 size={32} className="text-yellow-400" />
          <div className="text-left">
            <p className="font-black text-lg leading-none italic">PARTNER</p>
            <p className="text-xs text-zinc-500">Venues & Bares</p>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => router.push('/login?role=gov')} className="bg-zinc-900 border border-white/10 text-white p-4 rounded-3xl flex flex-col items-center gap-2">
                <Landmark size={24} className="text-blue-400" />
                <span className="font-bold text-[10px] uppercase">GOV</span>
            </button>
            <button onClick={() => router.push('/login?role=team')} className="bg-zinc-900 border border-white/10 text-white p-4 rounded-3xl flex flex-col items-center gap-2">
                <Users size={24} className="text-purple-400" />
                <span className="font-bold text-[10px] uppercase">TEAM</span>
            </button>
        </div>
      </div>
    </div>
  );
}
