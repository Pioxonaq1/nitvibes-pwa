"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [venues, setVenues] = useState<any[]>([]);

  // 1. Carga directa de Firebase usando la estructura Geopoint [cite: 2025-12-18]
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "venues"));
        const data = querySnapshot.docs.map(doc => {
          const d = doc.data();
          // Acceso directo a las propiedades del Geopoint de tu captura [cite: 2025-12-18]
          return {
            id: doc.id,
            name: d.name || "Sala Apolo",
            lat: d.location?.latitude, // Firebase Geopoint property
            lon: d.location?.longitude  // Firebase Geopoint property
          };
        }).filter(v => v.lat !== undefined && v.lon !== undefined);

        setVenues(data);
      } catch (e) {
        console.error("Error cargando Firebase:", e);
      }
    };
    fetchVenues();
  }, []);

  // 2. Renderizado en Mapbox [cite: 2025-12-18, 2025-12-23]
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1696, 41.3744], // Centrado en Sala Apolo según tu captura
      zoom: 13,
      pitch: 0
    });
    mapRef.current = map;

    map.on('load', () => {
      map.resize();
      
      // Dibujar los marcadores reales de tus 15 venues [cite: 2025-12-18]
      venues.forEach(v => {
        const el = document.createElement('div');
        el.style.cssText = 'width:15px; height:15px; background:#4ade80; border-radius:50%; border:2px solid white; box-shadow:0 0 12px #4ade80; cursor:pointer;';

        new mapboxgl.Marker(el)
          .setLngLat([v.lon, v.lat]) // Orden Mapbox: Longitud, Latitud [cite: 2025-12-18]
          .setPopup(new mapboxgl.Popup({ offset: 10 }).setHTML(`<b style="color:black; font-family:sans-serif;">${v.name}</b>`))
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [venues]);

  return <div ref={mapContainer} className="w-full h-full bg-black" />;
}