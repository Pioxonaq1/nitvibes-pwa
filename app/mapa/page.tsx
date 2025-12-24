
"use client";

import React, { useEffect, useState } from 'react';
import MapboxMap from '@/components/MapboxMap';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSimulation } from '@/lib/useSimulation';
import { Clock, Users, PlayCircle } from 'lucide-react';

export default function MapaPage() {
  const [venues, setVenues] = useState<any[]>([]);
  
  // ESTADO PARA EL SELECTOR DE USUARIOS (Default 2000)
  const [targetPax, setTargetPax] = useState(2000);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "venues"), (snapshot) => {
      const venuesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVenues(venuesData);
    });
    return () => unsubscribe();
  }, []);

  // PASAMOS targetPax AL SIMULADOR
  const { users, venueCounts, clock } = useSimulation(venues, targetPax);

  return (
    <main className="fixed inset-0 flex flex-col bg-black overflow-hidden">
      
      {/* HEADER */}
      <div className="absolute top-10 w-full text-center z-20 pointer-events-none">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-green-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          VIBE <span className="text-white">MAP</span>
        </h1>
      </div>

      {/* --- UI DE PRESENTADOR (Abajo a la derecha) --- */}
      <div className="absolute bottom-28 right-4 z-30 flex flex-col items-end gap-3">
        
        {/* RELOJ */}
        <div className="bg-black/80 backdrop-blur border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl w-fit">
          <Clock className="text-green-400 animate-pulse" size={16} />
          <div className="flex flex-col text-right">
             <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Hora Simulada</span>
             <span className="text-xl font-mono font-black text-white leading-none">{clock}</span>
          </div>
        </div>

        {/* SELECTOR DE PAX */}
        <div className="bg-zinc-900/90 backdrop-blur border border-white/10 p-2 rounded-xl flex flex-col gap-2 shadow-2xl">
          <div className="flex items-center gap-2 px-1 mb-1">
             <Users size={14} className="text-pink-500" />
             <span className="text-[10px] uppercase font-bold text-gray-400">Densidad de Tráfico</span>
          </div>
          <div className="flex gap-2">
            {[1000, 2500, 5000].map((count) => (
              <button
                key={count}
                onClick={() => setTargetPax(count)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  targetPax === count 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105 shadow-lg shadow-purple-500/30' 
                    : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {count / 1000}k
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAPA */}
      <div className="relative w-full h-full">
        <MapboxMap 
          venues={venues}           
          simulatedUsers={users}    
          densityData={venueCounts} 
        />
      </div>
      
    </main>
  );
}
