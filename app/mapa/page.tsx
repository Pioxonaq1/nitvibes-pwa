"use client";

import React, { useEffect, useState } from 'react';
import MapboxMap from '@/components/MapboxMap';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSimulation } from '@/lib/useSimulation';

export default function MapaPage() {
  // 1. ESTADO: Guardamos las venues reales aquí
  const [venues, setVenues] = useState<any[]>([]);

  // 2. FETCH: Escuchamos cambios en la colección "Venues" en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Venues"), (snapshot) => {
      const venuesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVenues(venuesData);
    });

    return () => unsubscribe(); // Limpieza al salir
  }, []);

  // 3. SIMULACIÓN: El hook "cerebro" calcula movimientos y densidades [cite: 2025-12-24]
  // Le pasamos las venues reales para que los puntos sepan a dónde ir
  const { users, venueCounts } = useSimulation(venues);

  return (
    <main className="fixed inset-0 flex flex-col bg-black overflow-hidden">
      
      {/* Header flotante [cite: 2025-12-23] */}
      <div className="absolute top-10 w-full text-center z-20 pointer-events-none">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-green-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          VIBE <span className="text-white">MAP</span>
        </h1>
      </div>

      {/* Contenedor del Mapa ocupando todo el viewport */}
      <div className="relative w-full h-full">
        {/* Pasamos TODOS los datos al componente visual */}
        <MapboxMap 
          venues={venues}           // Los locales reales
          simulatedUsers={users}    // Los 1000 puntos moviéndose (cyan/gris)
          densityData={venueCounts} // El semáforo (verde/amarillo/rojo) para cada venue
        />
      </div>
      
    </main>
  );
}