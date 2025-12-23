"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '@/context/AuthContext';

// Reglas de negocio: 25m brillo, 10m WIFI [cite: 2025-12-19]
const GEOFENCE_RADIUS_KM = 0.025; 
const WIFI_RADIUS_KM = 0.010;     

interface Venue {
  id: string;
  name: string;
  coordinates: [number, number];
  hasPromo: boolean;
  wifiSsid?: string;
}

export default function MapboxMap() {
  // Corregimos el tipado para evitar el error de Vercel [cite: 2025-12-18]
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapbox-gl.Map | null>(null);
  
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [activeVenue, setActiveVenue] = useState<Venue | null>(null);

  // Venues de prueba [cite: 2025-12-23]
  const venues: Venue[] = [
    { id: '1', name: 'Sutton Barcelona', coordinates: [2.1491, 41.3941], hasPromo: true, wifiSsid: 'Sutton_Guest_WIFI' },
    { id: '2', name: 'Opium', coordinates: [2.1931, 41.3858], hasPromo: false, wifiSsid: 'Opium_Free_WIFI' }
  ];

  // Fórmula de Haversine para distancias precisas [cite: 2025-12-19]
  const calculateDistance = (coords1: [number, number], coords2: [number, number]) => {
    const R = 6371;
    const dLat = (coords2[1] - coords1[1]) * Math.PI / 180;
    const dLon = (coords2[0] - coords1[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(coords1[1] * Math.PI / 180) * Math.cos(coords2[1] * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1734, 41.3851],
      zoom: 14,
      pitch: 45
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    });

    map.current.addControl(geolocate);

    geolocate.on('geolocate', (e: any) => {
      setUserLocation([e.coords.longitude, e.coords.latitude]);
    });
  }, []);

  // Control de proximidad (Geofencing) [cite: 2025-12-19]
  useEffect(() => {
    if (!userLocation) return;

    venues.forEach(venue => {
      const dist = calculateDistance(userLocation, venue.coordinates);
      
      // Disparo de Pop-up WIFI a 10 metros [cite: 2025-12-19]
      if (dist <= WIFI_RADIUS_KM && activeVenue?.id !== venue.id) {
        setActiveVenue(venue);
      } 
      // Salida de zona a 25 metros [cite: 2025-12-19]
      else if (dist > GEOFENCE_RADIUS_KM && activeVenue?.id === venue.id) {
        setActiveVenue(null);
      }
    });
  }, [userLocation, activeVenue]);

  // Renderizado de marcadores y estados visuales [cite: 2025-12-23]
  useEffect(() => {
    if (!map.current) return;

    venues.forEach(venue => {
      const el = document.createElement('div');
      el.className = 'venue-marker';
      
      const isNear = userLocation ? calculateDistance(userLocation, venue.coordinates) <= GEOFENCE_RADIUS_KM : false;

      el.style.width = isNear ? '38px' : '28px';
      el.style.height = isNear ? '38px' : '28px';
      el.style.backgroundColor = venue.hasPromo ? '#fbbf24' : '#ffffff';
      el.style.border = isNear ? '3px solid #4ade80' : '2px solid black';
      el.style.boxShadow = isNear ? '0 0 15px #4ade80' : '0 0 8px rgba(0,0,0,0.4)';
      el.style.borderRadius = '50%';
      el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

      new mapboxgl.Marker(el)
        .setLngLat(venue.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="color: black; padding: 5px; font-family: inherit; text-align: center;">
                <h3 style="margin:0; font-size:12px; font-weight:900; text-transform: uppercase;">${venue.name}</h3>
                <p style="margin:2px 0; font-size:9px; font-weight: 700;">${isNear ? '📍 EN RANGO' : 'DESCUBRE'}</p>
              </div>
            `)
        )
        .addTo(map.current!);
    });
  }, [userLocation]);

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-140px)]">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Pop-up WIFI (Interacción 10m) [cite: 2025-12-19, 2025-12-23] */}
      {activeVenue && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-xs animate-in slide-in-from-bottom duration-500">
          <div className="bg-white rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-green-500/20">
              <span className="text-white text-xl">📶</span>
            </div>
            <h2 className="text-black font-black text-md uppercase tracking-tighter">
              WIFI {activeVenue.name}
            </h2>
            <p className="text-zinc-500 text-[11px] mb-4 font-medium">
              Conéctate para recibir promociones exclusivas en tiempo real.
            </p>
            <div className="flex gap-2 w-full">
              <button 
                onClick={() => setActiveVenue(null)}
                className="flex-1 py-2 text-zinc-400 font-bold text-[10px] uppercase tracking-wider"
              >
                Ignorar
              </button>
              <button 
                className="flex-1 py-2 bg-black text-white rounded-lg font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all"
                onClick={() => alert(`Conectando...`)}
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badge de estado superior */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full shadow-xl">
          <span className="text-[9px] font-black uppercase text-white tracking-[0.2em]">
            Vibe Map <span className="text-yellow-400 mx-1">•</span> Barcelona
          </span>
        </div>
      </div>
    </div>
  );
}