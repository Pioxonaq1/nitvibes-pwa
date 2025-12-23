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

  // 1. CARGA OK (Manteniendo tu lógica de Geopoint) [cite: 2025-12-18]
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "venues"));
        const data = querySnapshot.docs.map(doc => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.name || "Venue",
            lat: d.location?.latitude,
            lon: d.location?.longitude
          };
        }).filter(v => v.lat !== undefined && v.lon !== undefined);
        setVenues(data);
      } catch (e) { console.error(e); }
    };
    fetchVenues();
  }, []);

  // 2. INICIALIZAR SIMULADOR [cite: 2025-12-18]
  const { updatePositions } = useSimulation(5000, venues);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1696, 41.3744],
      zoom: 13
    });
    mapRef.current = map;

    map.on('load', () => {
      map.resize();

      // Fuente para los 5000 Vibers [cite: 2025-12-18]
      map.addSource('sim-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // CAPA HEATMAP (Verde-Amarillo-Rojo) [cite: 2025-12-23]
      map.addLayer({
        id: 'viber-heat',
        type: 'heatmap',
        source: 'sim-source',
        maxzoom: 16,
        paint: {
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)', 0.2, '#22c55e', 0.5, '#eab308', 1, '#ef4444'
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 2, 15, 20]
        }
      });

      // CAPA 1:1 (Círculos que aparecen al acercarse) [cite: 2025-12-23]
      map.addLayer({
        id: 'viber-points',
        type: 'circle',
        source: 'sim-source',
        minzoom: 15,
        paint: {
          'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 15, 2, 21, 20],
          'circle-color': '#4ade80',
          'circle-opacity': 0.6
        }
      });

      // Marcadores de Venues (Los que ya funcionan) [cite: 2025-12-18]
      venues.forEach(v => {
        const el = document.createElement('div');
        el.style.cssText = 'width:12px; height:12px; background:#4ade80; border-radius:50%; border:2px solid white; box-shadow:0 0 10px #4ade80;';
        new mapboxgl.Marker(el)
          .setLngLat([v.lon, v.lat])
          .setPopup(new mapboxgl.Popup({ offset: 10 }).setHTML(`<b style="color:black">${v.name}</b>`))
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [venues]);

  // LOOP DE ANIMACIÓN [cite: 2025-12-18]
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      if (isSimulating && mapRef.current) {
        const source: any = mapRef.current.getSource('sim-source');
        if (source) source.setData(updatePositions());
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [isSimulating]);

  return (
    <div className="relative w-full h-full bg-black">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* BOTÓN DE ACTIVACIÓN [cite: 2025-12-23] */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${
            isSimulating ? 'bg-red-600 text-white' : 'bg-green-500 text-black'
          }`}
        >
          {isSimulating ? 'Detener Vibers' : 'Simular 5000 Vibers'}
        </button>
      </div>
    </div>
  );
}