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

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "venues"));
        const data = querySnapshot.docs.map(doc => {
          const d = doc.data();
          // Usamos la lógica de Geopoint que ya verificamos [cite: 2025-12-18]
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

  // Ahora con 2500 usuarios [cite: 2025-12-23]
  const { updatePositions } = useSimulation(2500, venues);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1696, 41.3744],
      zoom: 14,
      pitch: 45
    });
    mapRef.current = map;

    map.on('load', () => {
      map.resize();

      map.addSource('sim-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // Heatmap para visión lejana [cite: 2025-12-23]
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
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 5, 15, 25],
          'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0.8, 16, 0]
        }
      });

      // Puntos 1:1 para veredas (Zoom 16+) [cite: 2025-12-23]
      map.addLayer({
        id: 'viber-points',
        type: 'circle',
        source: 'sim-source',
        minzoom: 15,
        paint: {
          // Tamaño de aprox 0.8 metros en escala real [cite: 2025-12-23]
          'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 15, 1.5, 20, 12],
          'circle-color': '#4ade80',
          'circle-opacity': 0.7,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#000'
        }
      });

      // Marcadores de Venues reales [cite: 2025-12-18]
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
      
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all ${
            isSimulating ? 'bg-red-600 text-white' : 'bg-green-500 text-black'
          }`}
        >
          {isSimulating ? 'Stop Simulation' : 'Simular 2500 Vibers'}
        </button>
      </div>
    </div>
  );
}