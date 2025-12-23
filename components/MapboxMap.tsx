"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useSimulation } from '@/lib/useSimulation';

export default function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // 1. Estado para capturar el zoom en tiempo real [cite: 2025-12-23]
  const [currentZoom, setCurrentZoom] = useState(14);

  // 2. Carga de Venues reales de Firebase Geopoints [cite: 2025-12-18]
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "venues"));
        const data = querySnapshot.docs.map(doc => {
          const d = doc.data();
          // Acceso a Geopoint: latitude y longitude [cite: 2025-12-18]
          return {
            id: doc.id,
            name: d.name || "Venue",
            lat: d.location?.latitude,
            lon: d.location?.longitude
          };
        }).filter(v => v.lat !== undefined && v.lon !== undefined);
        setVenues(data);
      } catch (e) {
        console.error("Error en Firebase:", e);
      }
    };
    fetchVenues();
  }, []);

  // 3. Hook del simulador con paso de Zoom [cite: 2025-12-23]
  const { updatePositions } = useSimulation(1000, venues, currentZoom);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1696, 41.3744], // Centrado en Sala Apolo [cite: 2025-12-18]
      zoom: 14,
      pitch: 45
    });

    mapRef.current = map;

    // 4. Escuchar el cambio de zoom para actualizar el simulador [cite: 2025-12-23]
    map.on('zoom', () => {
      setCurrentZoom(map.getZoom());
    });

    map.on('load', () => {
      map.resize();

      // Fuente de datos para el simulador [cite: 2025-12-23]
      map.addSource('sim-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // Capa Heatmap con gradiente de ocupación [cite: 2025-12-23]
      map.addLayer({
        id: 'viber-heat',
        type: 'heatmap',
        source: 'sim-source',
        maxzoom: 16,
        paint: {
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, '#22c55e', 
            0.5, '#eab308', 
            0.8, '#ef4444' 
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 10, 15, 35],
          'heatmap-opacity': 0.8
        }
      });

      // Marcadores reales (Puntos verdes fijos) [cite: 2025-12-18, 2025-12-23]
      venues.forEach(v => {
        const el = document.createElement('div');
        el.style.cssText = 'width:10px; height:10px; background:#4ade80; border-radius:50%; border:2px solid white; box-shadow:0 0 8px #4ade80;';
        new mapboxgl.Marker(el)
          .setLngLat([v.lon, v.lat])
          .setPopup(new mapboxgl.Popup({ offset: 10 }).setHTML(`<b style="color:black">${v.name}</b>`))
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [venues]);

  // 5. Bucle de animación para actualizar posiciones [cite: 2025-12-23]
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      if (isSimulating && mapRef.current) {
        const source: any = mapRef.current.getSource('sim-source');
        if (source) {
          source.setData(updatePositions());
        }
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [isSimulating, updatePositions]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Botón de control del simulador [cite: 2025-12-23] */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${
            isSimulating ? 'bg-red-600 text-white' : 'bg-green-500 text-black'
          }`}
        >
          {isSimulating ? 'Stop Traffic' : 'Simulate Traffic'}
        </button>
      </div>
    </div>
  );
}