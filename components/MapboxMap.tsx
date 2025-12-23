"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '@/context/AuthContext';

const GEOFENCE_RADIUS_KM = 0.025; 
const WIFI_RADIUS_KM = 0.010;     

export default function MapboxMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [activeVenue, setActiveVenue] = useState<any>(null);

  const venues = [
    { id: '1', name: 'Sutton Barcelona', coordinates: [2.1491, 41.3941], hasPromo: true },
    { id: '2', name: 'Opium', coordinates: [2.1931, 41.3858], hasPromo: false }
  ];

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;
    mapboxgl.accessToken = token;
    
    if (!mapContainer.current || mapRef.current) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1734, 41.3851],
      zoom: 14,
      pitch: 45,
      antialias: true
    });

    (mapRef.current as any) = mapInstance;

    // Fix visual: Redimensionar al cargar [cite: 2025-12-18]
    mapInstance.on('load', () => {
      mapInstance.resize();
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    });

    mapInstance.addControl(geolocate);
    geolocate.on('geolocate', (e: any) => {
      setUserLocation([e.coords.longitude, e.coords.latitude]);
    });

    return () => {
      if (mapRef.current) (mapRef.current as any).remove();
    };
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      <div ref={mapContainer} className="flex-grow w-full h-full bg-zinc-900" />
      
      {/* Badge Superior [cite: 2025-12-23] */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-2xl">
          <span className="text-[9px] font-black uppercase text-white tracking-[0.2em]">
            Vibe Map • Barcelona
          </span>
        </div>
      </div>
    </div>
  );
}