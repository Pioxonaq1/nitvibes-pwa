"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Función conversora compatible con todas las versiones de TS/JS [cite: 2025-12-18]
const parseDMS = (dmsString: string) => {
  if (!dmsString || typeof dmsString !== 'string') return null;
  
  const dmsRegex = /(\d+)\u00B0(\d+)'([\d.]+)"([NSEW])/g;
  const matches: any[] = [];
  let match;

  // Usamos un bucle while para evitar el error de iteración en Vercel [cite: 2025-12-18]
  while ((match = dmsRegex.exec(dmsString)) !== null) {
    matches.push(match);
  }
  
  if (matches.length < 2) return null;

  const convert = (degrees: string, minutes: string, seconds: string, direction: string) => {
    let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / 3600;
    if (direction === "S" || direction === "W") dd = dd * -1;
    return dd;
  };

  // matches[0] es Latitud, matches[1] es Longitud [cite: 2025-12-18]
  const lat = convert(matches[0][1], matches[0][2], matches[0][3], matches[0][4]);
  const lon = convert(matches[1][1], matches[1][2], matches[1][3], matches[1][4]);

  return { lat, lon };
};

export default function MapboxMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        console.log("📡 Sincronizando datos de Rowy/Firebase...");
        const querySnapshot = await getDocs(collection(db, "venues"));
        
        const venuesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Prioridad: 1. Formato DMS de Rowy, 2. Coordenadas directas [cite: 2025-12-18]
          const coords = parseDMS(data.location) || { 
            lat: parseFloat(data.lat || data.latitude), 
            lon: parseFloat(data.lon || data.longitude) 
          };

          return {
            id: doc.id,
            name: data.name || "Venue",
            ...coords
          };
        }).filter(v => v.lat !== undefined && v.lon !== undefined && !isNaN(v.lat));

        setVenues(venuesData);
        console.log("✅ Datos listos:", venuesData);
      } catch (error) {
        console.error("❌ Error Firebase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current || venues.length === 0) return;

    mapboxgl.accessToken = token;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1734, 41.3851], // Barcelona [cite: 2025-12-19]
      zoom: 12
    });

    (mapRef.current as any) = mapInstance;

    mapInstance.on('load', () => {
      mapInstance.resize();

      venues.forEach(venue => {
        // Marcador visual estilo neón Nitvibes [cite: 2025-12-23]
        const el = document.createElement('div');
        el.className = 'marker-venue';
        el.style.width = '14px';
        el.style.height = '14px';
        el.style.backgroundColor = '#4ade80';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 0 10px #4ade80';

        new mapboxgl.Marker(el)
          .setLngLat([venue.lon, venue.lat])
          .setPopup(new mapboxgl.Popup({ offset: 10 }).setHTML(`<b style="color:black">${venue.name}</b>`))
          .addTo(mapInstance);
      });
      console.log(`📍 ${venues.length} marcadores inyectados.`);
    });

    return () => { if (mapRef.current) (mapRef.current as any).remove(); };
  }, [venues]);

  return (
    <div className="relative w-full h-full bg-zinc-950">
      <div ref={mapContainer} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
           <p className="text-white text-[10px] font-black uppercase tracking-widest animate-pulse">Procesando Rowy...</p>
        </div>
      )}
    </div>
  );
}