"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '@/context/AuthContext';

// Reglas de negocio [2025-12-19]
const GEOFENCE_RADIUS_KM = 0.025; // 25 metros
const WIFI_RADIUS_KM = 0.010;     // 10 metros

interface Venue {
  id: string;
  name: string;
  coordinates: [number, number];
  hasPromo: boolean;
  wifiSsid?: string;
}

export default function MapboxMap() {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapbox-gl.Map | null>(null);
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [activeVenue, setActiveVenue] = useState<Venue | null>(null);

  const venues: Venue[] = [
    { id: '1', name: 'Sutton Barcelona', coordinates: [2.1491, 41.3941], hasPromo: true, wifiSsid: 'Sutton_Guest_WIFI' },
    { id: '2', name: 'Opium', coordinates: [2.1931, 41.3858], hasPromo: false, wifiSsid: 'Opium_Free_WIFI' }
  ];

  // Función para calcular distancia en KM entre dos puntos
  const calculateDistance = (coords1: [number, number], coords2: [number, number]) => {
    const R = 6371; // Radio de la Tierra en km
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
    if (map.current) return;

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
      const coords: [number, number] = [e.coords.longitude, e.coords.latitude];
      setUserLocation(coords);
    });
  }, []);

  // Lógica de detección de proximidad (Geofencing) [2025-12-21]
  useEffect(() => {
    if (!userLocation) return;

    venues.forEach(venue => {
      const dist = calculateDistance(userLocation, venue.coordinates);

      // Si está a menos de 10m y no hay una alerta activa, disparamos WIFI [2025-12-19]
      if (dist <= WIFI_RADIUS_KM && activeVenue?.id !== venue.id) {
        setActiveVenue(venue);
        // Aquí lanzaremos el pop-up visual en el siguiente paso
        console.log(`DENTRO DE WIFI: ${venue.name}`);
      } 
      // Si se aleja más de 25m, limpiamos la venue activa
      else if (dist > GEOFENCE_RADIUS_KM && activeVenue?.id === venue.id) {
        setActiveVenue(null);
      }
    });
  }, [userLocation, activeVenue]);

  useEffect(() => {
    if (!map.current) return;

    venues.forEach(venue => {
      const el = document.createElement('div');
      el.className = 'venue-marker';
      
      // Aplicamos el "brillo" si el usuario está cerca (25m) [2025-12-23]
      const isNear = userLocation ? calculateDistance(userLocation, venue.coordinates) <= GEOFENCE_RADIUS_KM : false;

      el.style.width = isNear ? '40px' : '30px';
      el.style.height = isNear ? '40px' : '30px';
      el.style.backgroundColor = venue.hasPromo ? '#fbbf24' : '#ffffff';
      el.style.border = isNear ? '4px solid #4ade80' : '2px solid black'; // Borde verde si está en rango
      el.style.boxShadow = isNear ? '0 0 20px #4ade80' : '0 0 10px rgba(0,0,0,0.5)';
      el.style.borderRadius = '50%';
      el.style.transition = 'all 0.5s ease';

      new mapboxgl.Marker(el)
        .setLngLat(venue.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="color: black; padding: 5px; font-family: sans-serif;">
                <h3 style="margin:0; font-size:14px; font-weight:900;">${venue.name}</h3>
                <p style="margin:5px 0; font-size:10px;">${isNear ? '📍 ESTÁS AQUÍ' : 'A UNOS PASOS'}</p>
              </div>
            `)
        )
        .addTo(map.current!);
    });
  }, [userLocation]);

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-140px)]">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Pop-up Automático de WIFI (Se muestra solo a < 10m) [2025-12-19] */}
      {activeVenue && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-sm animate-in slide-in-from-bottom duration-500">
          <div className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📶</span>
            </div>
            <h2 className="text-black font-black text-lg uppercase tracking-tighter">
              ¡Bienvenido a {activeVenue.name}!
            </h2>
            <p className="text-zinc-500 text-sm mb-6">
              ¿Quieres conectarte gratis a nuestro WIFI y recibir las ofertas VIP?
            </p>
            <div className="flex gap-3 w-full">
              <button 
                onClick={() => setActiveVenue(null)}
                className="flex-1 py-3 text-zinc-400 font-bold text-xs uppercase"
              >
                Ahora no
              </button>
              <button 
                className="flex-1 py-3 bg-black text-white rounded-xl font-black text-xs uppercase shadow-lg active:scale-95 transition-transform"
                onClick={() => alert(`Conectando a ${activeVenue.wifiSsid}...`)}
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-black/80 backdrop-blur-md border border-yellow-400/50 px-4 py-1 rounded-full">
          <span className="text-[10px] font-black uppercase text-yellow-400 tracking-widest">
            {userLocation ? 'Localización Activa' : 'Buscando señal...'}
          </span >
        </div>
      </div>
    </div>
  );
}