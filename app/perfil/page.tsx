"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ROUTES } from '@/lib/constants';
import { LogOut, MapPin, Edit2, User } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function PerfilPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [viberData, setViberData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos reales de Rowy
  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.uid) {
        try {
          const docRef = doc(db, "viber", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setViberData(docSnap.data());
          }
        } catch (error) {
          console.error("Error cargando perfil:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.HOME);
  };

  if (!user) {
     router.push(ROUTES.HOME); 
     return null;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black italic">MI PERFIL</h1>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 bg-red-900/10 hover:bg-red-900/30">
          <LogOut size={20} />
        </Button>
      </header>

      {/* Tarjeta de Usuario */}
      <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-purple-900/20 to-transparent"></div>
        
        <div className="relative z-10 mx-auto w-24 h-24 rounded-full bg-zinc-800 border-4 border-black flex items-center justify-center overflow-hidden mb-4">
            {viberData?.foto ? (
                <img src={viberData.foto} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
                <User size={40} className="text-zinc-500" />
            )}
        </div>

        <h2 className="text-xl font-bold mb-1">{viberData?.nombre || user.displayName || "Usuario Viber"}</h2>
        <p className="text-zinc-500 text-sm mb-4">{user.email}</p>

        {viberData?.biografia && (
            <p className="text-gray-300 text-sm italic mb-4">"{viberData.biografia}"</p>
        )}

        <div className="flex justify-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-zinc-800 text-xs text-zinc-400 flex items-center gap-1">
                <MapPin size={12} /> {viberData?.ciudad || "Ciudad desconocida"}
            </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
             <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-xs" onClick={() => router.push('/business/login')}>
                Soy Partner
             </Button>
             <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-xs" onClick={() => router.push('/gov/login')}>
                Soy Gov
             </Button>
        </div>
      </div>
    </div>
  );
}
