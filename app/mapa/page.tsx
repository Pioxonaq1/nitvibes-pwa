"use client";

import React, { useEffect, useState } from 'react';
import MapboxMap from '@/components/MapboxMap';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSimulation } from '@/lib/useSimulation';
import { Clock } from 'lucide-react';

export default function MapaPage() {
  const [venues, setVenues] = useState<any[]>([]);

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

  // Obtenemos usuarios, contadores y el RELOJ del simulador
  const { users, venueCounts, clock } = useSimulation(venues);

  return (
    <main className="fixed inset-0 flex flex-col bg-black overflow-hidden">
      
      {/* HEADER TÍTULO */}
      <div className="absolute top-10 w-full text-center z-20 pointer-events-none">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-green-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          VIBE <span className="text-white">MAP</span>
        </h1>
      </div>

      {/* RELOJ DE SIMULACIÓN (Nuevo elemento UI) */}
      <div className="absolute bottom-28 right-4 z-20 bg-black/80 backdrop-blur border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xl">
        <Clock className="text-green-400 animate-pulse" size={16} />
        <div className="flex flex-col">
           <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Simulación</span>
           <span className="text-xl font-mono font-black text-white leading-none">{clock}</span>
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