"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import TeamDashboard from '@/components/dashboard/team/TeamDashboard';

export default function AdminPage() {
  // Eliminamos 'login' de la desestructuración para evitar el Type Error [cite: 2025-12-18]
  const { user, logout } = useAuth(); 
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificamos el rol si el usuario existe [cite: 2025-12-19]
    if (user) {
      if (user.role !== 'admin' && user.role !== 'colaborador') {
        router.push('/perfil');
      }
    }
    setLoading(false);
  }, [user, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/'); // Regla de Logout: redirección a Home [cite: 2025-12-21]
  };

  if (loading) return <div className="min-h-screen bg-black" />;

  // Si no hay usuario, mostramos la invitación al login [cite: 2025-12-19, 2025-12-21]
  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm bg-zinc-900 border border-white/10 p-8 rounded-[2.5rem] text-center shadow-2xl">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-purple-400" size={32} />
          </div>
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Team Access</h1>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-8">Identifícate para entrar al panel</p>
          
          <button 
            onClick={() => router.push('/login?role=team')}
            className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase text-xs hover:bg-zinc-200 transition-all active:scale-95"
          >
            Ir al Login de Team
          </button>
        </div>
      </div>
    );
  }

  // Si el usuario es legítimo (Admin/Collab), cargamos el dashboard modular [cite: 2025-12-19, 2025-12-24]
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center border-b border-white/10 bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black uppercase shadow-[0_0_15px_rgba(250,204,21,0.3)]">
            {(user?.nombre || 'AD').substring(0, 2)}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none uppercase">{user?.nombre || 'Team Member'}</p>
            <p className="text-zinc-500 text-[10px] italic font-medium uppercase tracking-wider">{user.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </nav>

      <main className="pt-24 pb-12">
        <TeamDashboard role={user.role as 'admin' | 'colaborador'} />
      </main>
    </div>
  );
}