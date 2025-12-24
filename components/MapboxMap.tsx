"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useSimulation } from '@/lib/useSimulation';

// --- LÓGICA GLOVO: Zoom según velocidad [cite: 2025-12-24] ---
const getTargetZoom = (speed: number) => {
  if (speed > 40) return 15;   // Rápido -> Zoom Lejano
  if (speed > 20) return 16;   // Medio -> Zoom Medio
  if (speed > 5) return 17;    // Lento -> Zoom Cercano
  return 19;                   // Parado/Andando -> Zoom Máximo (Detalle)
};

export default function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Captura de zoom para la lógica de velocidad escalar [cite: 2025-12-23]
  const [currentZoom, setCurrentZoom] = useState(14);
  
  // Estado para el Modo Espía [cite: 2025-12-24]
  const [trackedUserId, setTrackedUserId] = useState<number | null>(null);

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

  // Simulación con 1000 usuarios [cite: 2025-12-23]
  const { updatePositions } = useSimulation(1000, venues, currentZoom);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1696, 41.3744],
      zoom: 14,
      pitch: 45 // Inclinación para efecto 3D
    });
    mapRef.current = map;

    map.on('zoom', () => {
      setCurrentZoom(map.getZoom());
    });

    map.on('load', () => {
      map.resize();

      map.addSource('sim-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // 1. CAPA HEATMAP [cite: 2025-12-23]
      map.addLayer({
        id: 'viber-heat',
        type: 'heatmap',
        source: 'sim-source',
        paint: {
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)', 0.2, '#22c55e', 0.5, '#eab308', 0.8, '#ef4444'
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 10, 15, 30],
          'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 15, 0.8, 18, 0.2]
        }
      });

      // 2. CAPA PUNTOS 1:1 CON LÓGICA GLOVO (Colores por velocidad) [cite: 2025-12-24]
      map.addLayer({
        id: 'viber-points',
        type: 'circle',
        source: 'sim-source',
        minzoom: 13,
        paint: {
          'circle-radius': [
            'interpolate', ['exponential', 2], ['zoom'],
            14, 1.5, 
            18, 6, 
            22, 25
          ],
          // Rojo si corre (>20km/h), Verde si camina [cite: 2025-12-24]
          'circle-color': ['case', ['>', ['get', 'speed'], 20], '#ef4444', '#4ade80'],
          'circle-opacity': ['interpolate', ['linear'], ['zoom'], 13, 0, 15, 0.9],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#000'
        }
      });

      // INTERACCIÓN: Click para espiar (Follow Mode) [cite: 2025-12-24]
      map.on('click', 'viber-points', (e) => {
        if (e.features && e.features[0].properties) {
          const id = e.features[0].properties.id;
          setTrackedUserId(id); 
          
          // Popup temporal de feedback
          new mapboxgl.Popup({ closeButton: false, className: 'spy-popup' })
            .setLngLat(e.lngLat)
            .setHTML(`<div style="color:black; font-weight:900; font-size:10px;">ESPIANDO ID #${id}</div>`)
            .addTo(map);
        }
      });

      // Cambiar cursor al pasar sobre un Viber
      map.on('mouseenter', 'viber-points', () => map.getCanvas().style.cursor = 'pointer');
      map.on('mouseleave', 'viber-points', () => map.getCanvas().style.cursor = '');

      // Marcadores fijos de locales [cite: 2025-12-18]
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

  // BUCLE DE ANIMACIÓN + CÁMARA DINÁMICA [cite: 2025-12-24]
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      if (isSimulating && mapRef.current) {
        // Obtenemos features y datos crudos para buscar el ID
        const result: any = updatePositions();
        // Manejo defensivo por si updatePositions devuelve diferente estructura
        const { type, features, rawUsers } = result.rawUsers ? result : { ...result, rawUsers: [] };

        const source: any = mapRef.current.getSource('sim-source');
        
        // Actualizamos los puntos en el mapa
        if (source) {
            source.setData({ type: 'FeatureCollection', features: result.features || result });
        }

        // LÓGICA DE CÁMARA DINÁMICA (Spy Mode) [cite: 2025-12-24]
        if (trackedUserId !== null && rawUsers && rawUsers.length > 0) {
          const targetUser = rawUsers.find((u: any) => u.id === trackedUserId);
          
          if (targetUser) {
            const currentSpeed = targetUser.speedKmh || 5; // Fallback a 5km/h
            const targetZoom = getTargetZoom(currentSpeed);

            // Transición suave Glovo-style [cite: 2025-12-24]
            mapRef.current.easeTo({
              center: targetUser.coords,
              zoom: targetZoom,
              bearing: mapRef.current.getBearing(),
              pitch: 50,
              duration: 1000, // Suavizado
              easing: t => t * (2 - t)
            });
          }
        }
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [isSimulating, updatePositions, trackedUserId]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* HUD DE CONTROL */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        {trackedUserId !== null && (
          <div className="bg-black/80 text-white px-4 py-1 rounded-full text-[10px] font-mono border border-yellow-400 animate-pulse uppercase">
            Spying ID: {trackedUserId}
          </div>
        )}

        <button 
          onClick={() => {
            setIsSimulating(!isSimulating);
            setTrackedUserId(null); // Reset al parar
          }}
          className={`px-10 py-4 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 ${
            isSimulating ? 'bg-red-600 text-white' : 'bg-green-500 text-black'
          }`}
        >
          {isSimulating ? 'Detener Tráfico' : 'Simular 1000 Vibers'}
        </button>
      </div>
    </div>
  );
}