"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export default function MapboxMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [density, setDensity] = useState(2500);
  const [simTime, setSimTime] = useState("18:00");

  useEffect(() => {
    setMounted(true);
    if (!mapContainerRef.current || !mapboxgl.accessToken) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [2.1734, 41.3851],
      zoom: 14,
      pitch: 45
    });

    map.on('load', () => {
      // Capa de calor (Heatzones) 
      map.addSource('vibers', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({
        id: 'heat', type: 'heatmap', source: 'vibers',
        paint: { 'heatmap-weight': 1, 'heatmap-intensity': 1, 'heatmap-radius': 25,
                 'heatmap-color': ['interpolate', ['linear'], ['heatmap-density'], 0, 'rgba(0,255,255,0)', 0.5, 'cyan', 1, 'red'] }
      });
      // Puntos Cyan 
      map.addLayer({ id: 'points', type: 'circle', source: 'vibers', paint: { 'circle-radius': 3, 'circle-color': 'cyan' } });

      let clock = new Date(); clock.setHours(18,0,0);
      const move = () => {
        clock.setSeconds(clock.getSeconds() + 60);
        setSimTime(clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        const feats = Array.from({ length: density/50 }, () => ({
          type: 'Feature', geometry: { type: 'Point', coordinates: [2.1734+(Math.random()-0.5)*0.02, 41.3851+(Math.random()-0.5)*0.02] }
        }));
        (map.getSource('vibers') as mapboxgl.GeoJSONSource).setData({ type: 'FeatureCollection', features: feats } as any);
        requestAnimationFrame(move);
      };
      move();
    });

    return () => map.remove();
  }, [density]);

  if (!mounted) return <div className="w-full h-screen bg-black flex items-center justify-center text-zinc-500 uppercase font-black italic">Iniciando VibeMap...</div>;

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute bottom-10 right-10 bg-black/90 p-4 rounded-2xl border border-white/10 min-w-[180px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[8px] font-black uppercase text-zinc-500">Hora</span>
          <span className="text-lg font-black italic text-cyan-400">{simTime}</span>
        </div>
        <div className="flex gap-1">
          {[1000, 2500, 5000].map(v => (
            <button key={v} onClick={() => setDensity(v)} className={`flex-1 py-1 rounded text-[9px] font-black ${density===v ? 'bg-cyan-600' : 'bg-zinc-800 text-zinc-500'}`}>{v/1000}K</button>
          ))}
        </div>
      </div>
    </div>
  );
}
