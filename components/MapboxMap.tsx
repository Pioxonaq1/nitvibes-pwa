"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export default function MapboxMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [2.1734, 41.3851], // Barcelona
      zoom: 12,
    });

    // Simulación de puntos móviles [cite: 2025-12-25]
    map.on('load', () => {
      const points = { type: 'FeatureCollection', features: [] as any[] };
      for (let i = 0; i < 40; i++) {
        points.features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [2.17 + Math.random() * 0.02, 41.38 + Math.random() * 0.02] }
        });
      }
      map.addSource('sim', { type: 'geojson', data: points as any });
      map.addLayer({ id: 'sim-layer', type: 'circle', source: 'sim', paint: { 'circle-radius': 5, 'circle-color': '#facc15' } });
    });

    return () => map.remove();
  }, []);

  if (!mounted) return <div className="w-full h-screen bg-black" />;
  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-screen" />
      <div className="absolute top-6 left-6 bg-black/80 p-2 rounded-lg border border-yellow-400">
        <p className="text-[10px] font-bold text-yellow-400 animate-pulse">SIMULACIÓN EN VIVO</p>
      </div>
    </div>
  );
}
