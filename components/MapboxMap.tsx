"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(2.1734); // Barcelona
  const [lat] = useState(41.3851);
  const [zoom] = useState(13);

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;
    if (!MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom
    });
  }, [lng, lat, zoom]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-[500px] bg-gray-900 flex items-center justify-center text-white border border-white/10 rounded-xl">
        <p>🗺️ Configura la API Key de Mapbox</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}