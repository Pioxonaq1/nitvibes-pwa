"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import NearbyUsersCounter from "@/components/NearbyUsersCounter";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Bell, QrCode, Store } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function BusinessDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenue = async () => {
      if (user?.email) {
        try {
          const q = query(collection(db, "Venues"), where("b2b_email", "==", user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            const loc = data.location ? {
                latitude: data.location.latitude || data.location._lat,
                longitude: data.location.longitude || data.location._long
            } : { latitude: 41.3851, longitude: 2.1911 };

            setVenue({ ...data, id: querySnapshot.docs[0].id, location: loc });
          }
        } catch (error) {
          console.error("Error cargando Venue:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchVenue();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.HOME);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Cargando datos del local...</div>;

  return (
    <div className="min-h-screen bg-black p-4 pb-24">
      <header className="flex justify-between items-center mb-8 pt-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 truncate max-w-[200px]">
            {venue?.name || "Tu Negocio"}
          </h1>
          <div className="flex items-center gap-1 text-gray-400 text-xs uppercase tracking-widest mt-1">
             <Store size={12} /> <span>Partner Dashboard</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-400 hover:bg-red-900/20">
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      <main className="space-y-6 max-w-md mx-auto">
        {venue && (
            <div className="flex items-center gap-4 bg-[#111] p-3 rounded-xl border border-gray-800">
                <div className={`w-3 h-3 rounded-full ${venue.isOpen ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'}`}></div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-white">{venue.isOpen ? 'ABIERTO' : 'CERRADO'}</p>
                    <p className="text-xs text-gray-500 truncate">{venue.vibe || 'Sin vibe definido'}</p>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-400 block">Aforo</span>
                    <span className="text-lg font-mono font-bold text-white">{venue.occupancy || '0'}%</span>
                </div>
            </div>
        )}

        <section>
          {venue?.location && (
              <NearbyUsersCounter 
                venueLat={venue.location.latitude} 
                venueLng={venue.location.longitude} 
              />
          )}
        </section>

        <section className="grid grid-cols-2 gap-4">
           <div className="bg-[#111] border border-gray-800 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#222] transition-colors cursor-pointer">
              <QrCode className="text-purple-500 w-6 h-6" />
              <span className="text-sm font-bold text-gray-200">Escanear QR</span>
           </div>
           <div className="bg-[#111] border border-gray-800 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#222] transition-colors cursor-pointer">
              <Settings className="text-gray-400 w-6 h-6" />
              <span className="text-sm font-bold text-gray-200">Ajustes</span>
           </div>
        </section>
      </main>
    </div>
  );
}
