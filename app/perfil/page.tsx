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

  // Redirección inteligente según el rol del usuario logueado [cite: 2025-12-19, 2025-12-21]
  const goToPanel = () => {
    if (!user) return;
    if (user.role === 'admin' || user.role === 'colaborador') {
      router.push('/admin');
    } else if (user.role === 'partner') {
      router.push('/business');
    } else if (user.role === 'gov') {
      router.push('/gov');
    } else {
      router.push('/viber');
    }
  };

  // Si ya hay un usuario logueado, mostramos su opción de ir al panel [cite: 2025-12-21]
  if (user && user.role) {
    return (
      <div className="min-h-screen bg-black p-6 pt-20 text-white">
        <h1 className="text-3xl font-black italic mb-2 uppercase tracking-tighter leading-none">HOLA, {user.nombre || 'VIBER'}</h1>
        <p className="text-zinc-500 mb-8 uppercase text-[10px] font-bold tracking-widest">Perfil de Acceso: <span className="text-green-500">{user.role}</span></p>
        
        <div className="space-y-4">
          <button 
            onClick={goToPanel}
            className="w-full bg-zinc-900 border border-white/10 p-5 rounded-[2rem] flex items-center justify-between transition-all active:scale-95"
          >
            <span className="font-black italic uppercase text-sm">Ir a mi Panel de Control</span>
            <ArrowRight size={20} className="text-yellow-400" />
          </button>

          <button 
            onClick={handleLogout}
            className="w-full bg-red-900/10 border border-red-900/30 text-red-500 p-5 rounded-[2rem] flex items-center justify-center gap-2 font-black italic mt-10 uppercase text-[11px]"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de selección de ID para usuarios anónimos [cite: 2025-12-21]
  return (
    <div className="min-h-screen bg-black p-6 pt-20 flex flex-col items-center">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">Nitvibes ID</h2>
        <p className="text-zinc-500 text-[11px] uppercase font-bold tracking-widest mt-2">Selecciona tu perfil de acceso</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {/* VIBER Login [cite: 2025-12-19] */}
        <button onClick={() => router.push('/login')} className="w-full bg-white text-black p-6 rounded-[2.5rem] flex items-center gap-4 transition-transform active:scale-95">
          <UserCircle size={36} />
          <div className="text-left">
            <p className="font-black text-xl leading-none italic uppercase">VIBER</p>
            <p className="text-[10px] font-bold uppercase opacity-60">Acceso Usuarios</p>
          </div>
        </button>

        {/* PARTNER / BUSINESS [cite: 2025-12-19, 2025-12-21] */}
        <button onClick={() => router.push('/business')} className="w-full bg-zinc-900 border border-white/10 text-white p-6 rounded-[2.5rem] flex items-center gap-4 transition-transform active:scale-95">
          <Building2 size={36} className="text-yellow-400" />
          <div className="text-left">
            <p className="font-black text-xl leading-none italic uppercase">PARTNER</p>
            <p className="text-[10px] font-bold uppercase text-zinc-500">Venues & Bares</p>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-4">
            {/* GOV [cite: 2025-12-19] */}
            <button onClick={() => router.push('/gov')} className="bg-zinc-900 border border-white/10 text-white p-6 rounded-[2.5rem] flex flex-col items-center gap-2 transition-transform active:scale-95">
                <Landmark size={28} className="text-blue-400" />
                <span className="font-black text-[10px] uppercase">GOV</span>
            </button>
            {/* TEAM [cite: 2025-12-19, 2025-12-24] */}
            <button onClick={() => router.push('/admin')} className="bg-zinc-900 border border-white/10 text-white p-6 rounded-[2.5rem] flex flex-col items-center gap-2 transition-transform active:scale-95">
                <Users size={28} className="text-purple-400" />
                <span className="font-black text-[10px] uppercase">TEAM</span>
            </button>
        </div>
      </div>
    </div>
  );
}