"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Building2, LogOut, MapPin, FileText, UserCircle, ShieldCheck } from 'lucide-react';

export default function GovDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [govProfile, setGovProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchGovProfile = async () => {
      if (user?.email) {
        try {
          // Conectamos a 'gov_users' según tu esquema de Rowy
          const q = query(collection(db, "gov_users"), where("email", "==", user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            setGovProfile(querySnapshot.docs[0].data());
          }
        } catch (error) {
          console.error("Error buscando perfil Gov:", error);
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    fetchGovProfile();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      {/* Header Gov Dinámico */}
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
            <div className="bg-green-900/20 p-3 rounded-full border border-green-900/30">
                <Building2 className="text-green-500" size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter">
                    GOV <span className="text-green-600">PANEL</span>
                </h1>
                <p className="text-xs text-gray-400 font-medium">
                  {govProfile?.department || 'Gestión Municipal'}
                </p>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
                <p className="text-[11px] font-bold text-white uppercase tracking-wide">
                  {loadingProfile ? 'Cargando...' : (govProfile?.nombre || user?.displayName || 'USUARIO GOV')}
                </p>
                <p className="text-[9px] text-green-400 font-mono uppercase bg-green-900/20 px-2 py-0.5 rounded inline-block mt-0.5">
                  {loadingProfile ? '...' : (govProfile?.cargo || 'Oficial')}
                </p>
            </div>
            <button 
                onClick={handleLogout}
                className="bg-red-900/10 hover:bg-red-900/30 border border-red-900/20 text-red-500 p-2 rounded-full transition-colors"
                title="Cerrar Sesión"
            >
                <LogOut size={18} />
            </button>
        </div>
      </header>

      {/* Tarjeta de Identificación */}
      {govProfile && (
        <section className="mb-8 bg-[#111] p-4 rounded-xl border border-gray-800 flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="h-12 w-12 bg-gray-800 rounded-full flex items-center justify-center">
            <UserCircle size={24} className="text-gray-400" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold">Credencial Activa</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{govProfile.nombre}</span>
              <ShieldCheck size={14} className="text-blue-400" />
            </div>
            <p className="text-xs text-gray-400">{govProfile.cargo} · {govProfile.department}</p>
          </div>
        </section>
      )}

      {/* Contenido Demo Gov */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 hover:border-green-900/50 transition-colors group cursor-pointer">
             <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-white group-hover:text-green-400 transition-colors">
                <MapPin size={18} className="text-green-500"/> Monitorización Urbana
             </h3>
             <p className="text-gray-500 text-xs">Visualización de afluencia y mapas de calor en tiempo real.</p>
          </div>
          <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 hover:border-green-900/50 transition-colors group cursor-pointer">
             <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-white group-hover:text-green-400 transition-colors">
                <FileText size={18} className="text-green-500"/> Permisos y Licencias
             </h3>
             <p className="text-gray-500 text-xs">Gestión administrativa de eventos en vía pública.</p>
          </div>
      </div>
    </div>
  );
}
