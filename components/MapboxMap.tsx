"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function MapboxMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Carga de Venues reales desde Firebase [cite: 2025-12-18, 2025-12-19]
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        console.log("📡 Conectando con Firestore...");
        const querySnapshot = await getDocs(collection(db, "venues"));
        
        const venuesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Normalización para detectar coordenadas sin importar el nombre del campo [cite: 2025-12-18]
          const lat = data.lat || data.latitude || data.latitud;
          const lon = data.lon || data.longitude || data.longitud;

          return {
            id: doc.id,
            name: data.name || "Venue sin nombre",
            lat: Number(lat),
            lon: Number(lon),
          };
        });

        console.log("✅ Venues obtenidas:", venuesData);
        setVenues(venuesData);
      } catch (error) {
        console.error("❌ Error Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // 2. Inicialización del Mapa [cite: 2025-12-18, 2025-12-23]
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    // No iniciamos el mapa hasta tener el token y las venues cargadas [cite: 2025-12-18]
    if (!token || !mapContainer.current || venues.length === 0) return;

    mapboxgl.accessToken = token;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1734, 41.3851], // Barcelona [cite: 2025-12-19]
      zoom: 13,
      pitch: 45
    });

    mapRef.current = mapInstance as any;

    mapInstance.on('load', () => {
      console.log("🗺️ Mapa cargado correctamente");
      mapInstance.resize();

      // 3. Dibujar Marcadores Reales [cite: 2025-12-18, 2025-12-23]
      venues.forEach(venue => {
        if (isNaN(venue.lat) || isNaN(venue.lon)) return;

        // Estilo del marcador Nitvibes [cite: 2025-12-23]
        const el = document.createElement('div');
        el.className = 'marker-venue';
        el.style.width = '18px';
        el.style.height = '18px';
        el.style.backgroundColor = '#4ade80';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 0 10px rgba(74, 222, 128, 0.8)';

        new mapboxgl.Marker(el)
          .setLngLat([venue.lon, venue.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<b style="color:black">${venue.name}</b>`)
          )
          .addTo(mapInstance);
      });
    });

    return () => {
      if (mapRef.current) (mapRef.current as any).remove();
    };
  }, [venues]);

  return (
    <div className="relative w-full h-full bg-zinc-950">
      {/* Spinner de carga [cite: 2025-12-18] */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-[9px] font-black uppercase tracking-widest">Sincronizando Venues...</p>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}