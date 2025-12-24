"use client";

import React, { useEffect, useState } from 'react';
import MapboxMap from '@/components/MapboxMap';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSimulation } from '@/lib/useSimulation';

export default function MapaPage() {
  const [venues, setVenues] = useState<any[]>([]);

  useEffect(() => {
    // CORRECCIÓN IMPORTANTE: "venues" en minúscula
    console.log("📡 Conectando a Firebase (colección: venues)...");
    const unsubscribe = onSnapshot(collection(db, "venues"), (snapshot) => {
      console.log(`✅ Datos recibidos: ${snapshot.docs.length} venues encontradas.`);
      const venuesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVenues(venuesData);
    }, (error) => {
      console.error("❌ Error leyendo venues:", error);
    });

    return () => unsubscribe();
  }, []);

  const { users, venueCounts } = useSimulation(venues);

  return (
    <main className="fixed inset-0 flex flex-col bg-black overflow-hidden">
      <div className="absolute top-10 w-full text-center z-20 pointer-events-none">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-green-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          VIBE <span className="text-white">MAP</span>
        </h1>
      </div>
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
