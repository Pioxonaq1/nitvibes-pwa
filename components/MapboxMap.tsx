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
      zoom: 13,
      pitch: 45
    });

    // Simulación de personas (puntos móviles) [cite: 2025-12-25]
    map.on('load', () => {
      const points = { type: 'FeatureCollection', features: [] as any[] };
      for (let i = 0; i < 50; i++) {
        points.features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [2.17 + Math.random() * 0.02, 41.38 + Math.random() * 0.02] }
        });
      }

      map.addSource('simulation', { type: 'geojson', data: points as any });
      map.addLayer({
        id: 'simulation-layer',
        type: 'circle',
        source: 'simulation',
        paint: { 'circle-radius': 4, 'circle-color': '#facc15', 'circle-opacity': 0.6 }
      });

      setInterval(() => {
        points.features.forEach(f => {
          f.geometry.coordinates[0] += (Math.random() - 0.5) * 0.001;
          f.geometry.coordinates[1] += (Math.random() - 0.5) * 0.001;
        });
        (map.getSource('simulation') as mapboxgl.GeoJSONSource).setData(points as any);
      }, 2000);
    });

    return () => map.remove();
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-screen" />
      <div className="absolute top-4 left-4 bg-black/80 px-3 py-1 rounded-full border border-yellow-400/50">
        <span className="text-[10px] font-black text-yellow-400 animate-pulse uppercase italic">SIMULACIÓN EN VIVO (DEMO)</span>
      </div>
    </div>
  );
}
