"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Building2, 
  ShieldAlert, 
  Zap, 
  TrendingUp, 
  Settings,
  PlusCircle,
  Search,
  LogOut
} from 'lucide-react';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Bloqueo estricto para no administradores
    if (user && user.role !== 'admin') {
      router.push('/perfil');
    }
  }, [user, router]);

  const dashboardStats = [
    { label: 'Partners', value: '124', icon: Building2, color: 'text-yellow-400' },
    { label: 'Vibers', value: '8.2k', icon: Users, color: 'text-blue-400' },
    { label: 'Promos Live', value: '42', icon: Zap, color: 'text-purple-400' },
    { label: 'Alertas', value: '0', icon: ShieldAlert, color: 'text-zinc-500' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Nav */}
      <nav className="p-6 flex justify-between items-center border-b border-white/10 bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black">
            {(user?.nombre || user?.email || 'AD').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none uppercase">
                {user?.nombre || 'Administrador'}
            </p>
            <p className="text-zinc-500 text-[10px]">{user?.email}</p>
          </div>
        </div>
        <button onClick={() => logout()} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </nav>

      <main className="p-6 space-y-8">
        {/* Header Section */}
        <section>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Cerebro Semanal</h1>
          <p className="text-zinc-500 text-xs mt-2 font-bold uppercase tracking-widest">Global Control Panel</p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4">
          {dashboardStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-zinc-900 border border-white/5 p-5 rounded-[2rem]">
                <Icon size={20} className={`${stat.color} mb-3`} />
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-tighter">{stat.label}</p>
                <p className="text-2xl font-black italic">{stat.value}</p>
              </div>
            );
          })}
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="font-black italic uppercase text-sm tracking-widest text-zinc-500">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 gap-3">
            <button className="w-full bg-white text-black p-4 rounded-2xl flex items-center justify-between font-black uppercase text-xs">
              <span className="flex items-center gap-3"><PlusCircle size={18}/> Alta de Nuevo Partner</span>
              <TrendingUp size={18} />
            </button>
            <button className="w-full bg-zinc-900 border border-white/10 text-white p-4 rounded-2xl flex items-center justify-between font-black uppercase text-xs">
              <span className="flex items-center gap-3"><Settings size={18}/> Configuración Global</span>
              <PlusCircle size={18} className="rotate-45 opacity-0" />
            </button>
          </div>
        </section>

        {/* Recents Table Placeholder */}
        <section className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-black italic uppercase text-lg">Últimas Altas</h2>
            <Search size={20} className="text-zinc-500" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800" />
                  <div>
                    <p className="font-bold text-sm">Venue ID: #440{i}</p>
                    <p className="text-[10px] text-zinc-500 uppercase">Barcelona • Hace 2h</p>
                  </div>
                </div>
                <div className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-full uppercase">Activo</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}