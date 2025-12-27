"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export default function MapboxMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [density, setDensity] = useState(2500); // 2.5k por defecto
  const [simTime, setSimTime] = useState("18:00");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [2.1734, 41.3851],
      zoom: 14,
      pitch: 45
    });

    map.on('load', () => {
      // Configuración de la capa de calor (Heatzones) [cite: 2025-12-25]
      map.addSource('vibers', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      map.addLayer({
        id: 'vibers-heat',
        type: 'heatmap',
        source: 'vibers',
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0, 255, 255, 0)',
            0.2, 'rgb(0, 255, 255)',
            0.4, 'rgb(0, 200, 200)',
            0.6, 'rgb(255, 255, 0)',
            1, 'rgb(255, 0, 0)'
          ],
          'heatmap-radius': 20,
          'heatmap-opacity': 0.7
        }
      });

      // Capa de puntos Cyan (Simulación) [cite: 2025-12-25]
      map.addLayer({
        id: 'vibers-points',
        type: 'circle',
        source: 'vibers',
        paint: {
          'circle-radius': 2,
          'circle-color': '#00ffff',
          'circle-opacity': 0.8
        }
      });

      // Lógica de Movimiento y Reloj [cite: 2025-12-25]
      let startTime = new Date();
      startTime.setHours(18, 0, 0);

      const animate = () => {
        // Actualizar reloj simulado
        startTime.setSeconds(startTime.getSeconds() + 120); // Acelerar tiempo
        setSimTime(startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        // Generar movimiento lógico (puedes expandir esto con rutas reales)
        const features = [];
        for (let i = 0; i < density / 100; i++) {
          features.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [2.1734 + (Math.random() - 0.5) * 0.03, 41.3851 + (Math.random() - 0.5) * 0.03]
            }
          });
        }
        (map.getSource('vibers') as mapboxgl.GeoJSONSource).setData({ type: 'FeatureCollection', features } as any);
        requestAnimationFrame(animate);
      };

      animate();
    });

    return () => map.remove();
  }, [density]);

  if (!mounted) return null;

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Selector de Densidad e Info [cite: 2025-12-25] */}
      <div className="absolute bottom-10 right-10 bg-black/90 p-4 rounded-2xl border border-white/10 text-white min-w-[200px]">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-black uppercase text-zinc-500">Hora Simulada</span>
          <span className="text-xl font-black italic text-green-400">{simTime}</span>
        </div>
        <p className="text-[10px] font-black uppercase text-zinc-500 mb-2">Densidad de Tráfico</p>
        <div className="flex gap-2">
          {[1000, 2500, 5000].map(val => (
            <button 
              key={val}
              onClick={() => setDensity(val)}
              className={`flex-1 py-1 rounded text-[10px] font-black ${density === val ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
            >
              {val / 1000}k
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
