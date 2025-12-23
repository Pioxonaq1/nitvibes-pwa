"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  Users, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  Search,
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function GovDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [govProfile, setGovProfile] = useState<any>(null);

  // Redirigir si no es un usuario Gov o Admin
  useEffect(() => {
    if (user && user.role !== 'gov' && user.role !== 'admin') {
      router.push('/perfil');
    }
  }, [user, router]);

  const stats = [
    { label: 'Afluencia Total', value: '12.4k', change: '+12%', icon: Users },
    { label: 'Zonas Activas', value: '8', change: 'Estable', icon: MapPin },
    { label: 'Alertas Ruido', value: '3', change: '-5%', icon: Bell },
    { label: 'Seguridad', value: 'Óptimo', change: '100%', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header Gov */}
      <header className="p-6 pt-12 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Panel de Gestión Pública</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <p className="text-[11px] font-bold uppercase text-blue-500 tracking-widest">
                {govProfile?.nombre || user?.nombre || 'GESTOR GOV'}
              </p>
            </div>
          </div>
          <button onClick={() => logout()} className="p-2 bg-white/5 rounded-full border border-white/10">
            <ShieldCheck size={20} className="text-zinc-400" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-zinc-900 border border-white/5 p-4 rounded-3xl">
                <Icon size={18} className="text-blue-400 mb-2" />
                <p className="text-zinc-500 text-[10px] font-bold uppercase">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black italic">{stat.value}</span>
                  <span className="text-[10px] text-blue-400 font-bold">{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mapa de Calor / Control de Zonas */}
        <div className="bg-zinc-900 border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden h-64">
          <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center">
            <MapPin size={40} className="text-blue-500/20" />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h3 className="font-black italic uppercase text-lg">Mapa de Actividad</h3>
              <p className="text-zinc-500 text-xs">Monitoreo en tiempo real - Barcelona</p>
            </div>
            <button className="w-fit bg-white text-black text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-tighter">
              Ver Mapa Completo
            </button>
          </div>
        </div>

        {/* Alertas y Acciones */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <h3 className="font-black italic uppercase text-sm">Reportes Recientes</h3>
            <button className="text-blue-400 text-[10px] font-bold uppercase">Ver todo</button>
          </div>
          
          <div className="space-y-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-zinc-900 border border-white/5 p-4 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center">
                    <BarChart3 size={20} className="text-zinc-500" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Control de Aforo {item}</p>
                    <p className="text-[10px] text-zinc-500 uppercase">Ciutat Vella • 12:40 PM</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-600" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}