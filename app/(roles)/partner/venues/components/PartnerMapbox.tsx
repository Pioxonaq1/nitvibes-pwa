"use client";
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '@/context/AuthContext';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function PartnerMapbox() {
  const mapContainer = useRef<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1700, 41.3750], // Centrado en Apolo (Poble Sec) [cite: 2025-12-25]
      zoom: 15,
      interactive: false // Mapa estático decorativo para el panel
    });

    new mapboxgl.Marker({ color: '#ec4899' })
      .setLngLat([2.1700, 41.3750])
      .addTo(map);

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
}
