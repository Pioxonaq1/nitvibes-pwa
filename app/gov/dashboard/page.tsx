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
          // CORRECCIÓN CLAVE: "Gov Users" con espacio, tal cual sale en Rowy
          const q = query(collection(db, "Gov Users"), where("email", "==", user.email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) setGovProfile(querySnapshot.docs[0].data());
        } catch (error) { console.error(error); } 
        finally { setLoadingProfile(false); }
      }
    };
    fetchGovProfile();
  }, [user]);

  const handleLogout = async () => { await logout(); router.push(ROUTES.HOME); };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
            <div className="bg-green-900/20 p-3 rounded-full border border-green-900/30"><Building2 className="text-green-500" size={24} /></div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter">GOV <span className="text-green-600">PANEL</span></h1>
                <p className="text-xs text-gray-400 font-medium">{govProfile?.department || 'Gestión Municipal'}</p>
            </div>
        </div>
        <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold uppercase">{govProfile?.nombre || user?.displayName}</p>
            <p className="text-[9px] text-green-400 uppercase bg-green-900/20 px-2 py-0.5 rounded inline-block">{govProfile?.cargo || 'Oficial'}</p>
        </div>
        <button onClick={handleLogout} className="text-red-500 ml-4"><LogOut size={18} /></button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#111] p-6 rounded-2xl border border-gray-800"><h3 className="font-bold flex gap-2"><MapPin className="text-green-500"/> Monitorización</h3><p className="text-xs text-gray-500">Mapas de calor en tiempo real.</p></div>
          <div className="bg-[#111] p-6 rounded-2xl border border-gray-800"><h3 className="font-bold flex gap-2"><FileText className="text-green-500"/> Licencias</h3><p className="text-xs text-gray-500">Gestión administrativa.</p></div>
      </div>
    </div>
  );
}
