"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Función conversora: de coordenadas Rowy (41°22'27"N) a Decimal (41.3741) [cite: 2025-12-18]
const parseDMS = (dmsString: string) => {
  if (!dmsString || typeof dmsString !== 'string') return null;
  
  // Regex para capturar grados, minutos, segundos y dirección [cite: 2025-12-18]
  const dmsRegex = /(\d+)\u00B0(\d+)'([\d.]+)"([NSEW])/g;
  const matches = [...dmsString.matchAll(dmsRegex)];
  
  if (matches.length < 2) return null;

  const convert = (degrees: string, minutes: string, seconds: string, direction: string) => {
    let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / 3600;
    if (direction === "S" || direction === "W") dd = dd * -1;
    return dd;
  };

  const lat = convert(matches[0][1], matches[0][2], matches[0][3], matches[0][4]);
  const lon = convert(matches[1][1], matches[1][2], matches[1][3], matches[1][4]);

  return { lat, lon };
};

export default function MapboxMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Carga y procesamiento de datos de Firebase/Rowy [cite: 2025-12-18]
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        console.log("📡 Sincronizando con Rowy/Firebase...");
        const querySnapshot = await getDocs(collection(db, "venues"));
        
        const venuesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Intentamos convertir el campo 'location' de Rowy [cite: 2025-12-18]
          const coords = parseDMS(data.location) || { 
            lat: parseFloat(data.lat || data.latitude), 
            lon: parseFloat(data.lon || data.longitude) 
          };

          return {
            id: doc.id,
            name: data.name || "Venue",
            ...coords
          };
        }).filter(v => !isNaN(v.lat) && !isNaN(v.lon)); // Solo locales con coordenadas válidas [cite: 2025-12-18]

        setVenues(venuesData);
        console.log("✅ Venues listas para mapear:", venuesData);
      } catch (error) {
        console.error("❌ Error en la sincronización:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  // 2. Inicialización de Mapbox con los 15 locales [cite: 2025-12-18, 2025-12-23]
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current || venues.length === 0) return;

    mapboxgl.accessToken = token;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1734, 41.3851], // Centro de Barcelona [cite: 2025-12-19]
      zoom: 12,
      pitch: 0
    });

    mapRef.current = mapInstance as any;

    mapInstance.on('load', () => {
      mapInstance.resize();

      venues.forEach(venue => {
        // Marcador visual estilo Nitvibes [cite: 2025-12-23]
        const el = document.createElement('div');
        el.className = 'marker-venue';
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.backgroundColor = '#4ade80'; // Verde Neón [cite: 2025-12-23]
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 0 10px #4ade80';

        new mapboxgl.Marker(el)
          .setLngLat([venue.lon, venue.lat])
          .setPopup(new mapboxgl.Popup({ offset: 10 }).setHTML(`<b style="color:black">${venue.name}</b>`))
          .addTo(mapInstance);
      });
      
      console.log(`📍 ${venues.length} marcadores inyectados con éxito.`);
    });

    return () => { if (mapRef.current) (mapRef.current as any).remove(); };
  }, [venues]);

  return (
    <div className="relative w-full h-full bg-zinc-950">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Overlay de carga para Rowy [cite: 2025-12-18] */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50">
           <div className="text-center">
             <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
             <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Convirtiendo Coordenadas...</p>
           </div>
        </div>
      )}
    </div>
  );
}