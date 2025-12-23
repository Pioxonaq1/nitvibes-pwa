"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useEffect } from 'react';
// IMPORTAMOS EL COMPONENTE MODULAR [cite: 2025-12-18]
import TeamDashboard from '@/components/dashboard/team/TeamDashboard';

export default function AdminPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Bloqueo estricto para no administradores o colaboradores [cite: 2025-12-19, 2025-12-21]
    if (user && (user.role !== 'admin' && user.role !== 'colaborador')) {
      router.push('/perfil');
    }
  }, [user, router]);

  // Regla de salida (Logout): Desconecta y manda al HOME [cite: 2025-12-21]
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) return <div className="min-h-screen bg-black" />;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Nav - Mantenemos tu diseño original [cite: 2025-12-18] */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center border-b border-white/10 bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-black">
            {(user?.nombre || user?.email || 'AD').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none uppercase">
                {user?.nombre || 'Administrador'}
            </p>
            <p className="text-zinc-500 text-[10px] italic">{user.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </nav>

      <main className="pt-24 pb-12">
        {/* INYECTAMOS EL DASHBOARD MODULAR [cite: 2025-12-23] */}
        {/* Esto carga automáticamente: Cerebro Semanal, Sanity, Venues y Analytics */}
        <TeamDashboard role={user.role as 'admin' | 'colaborador'} />
      </main>
    </div>
  );
}