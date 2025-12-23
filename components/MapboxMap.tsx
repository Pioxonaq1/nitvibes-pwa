"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '@/context/AuthContext';

// REGLAS DEFINIDAS [cite: 2025-12-19]
const GEOFENCE_RADIUS_METERS = 25; 
const WIFI_POPUP_RADIUS_METERS = 10;

// Función para calcular distancia entre dos puntos en metros (Haversine) [cite: 2025-12-19]
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // Radio de la tierra en metros
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; 
};

export default function MapboxMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const { user } = useAuth(); // Para lógica de usuario (B2C, B2B, etc.) [cite: 2025-12-19]
  
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [activeVenue, setActiveVenue] = useState<any>(null);
  const [showWifiPopup, setShowWifiPopup] = useState(false);

  // Venues de ejemplo (Barcelona) [cite: 2025-12-19]
  const venues = [
    { id: '1', name: 'Sutton Barcelona', lat: 41.3941, lon: 2.1491, promo: '2x1 en Copas' },
    { id: '2', name: 'Opium Barcelona', lat: 41.3858, lon: 2.1931, promo: 'Entrada libre antes de la 1am' }
  ];

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current || mapRef.current) return;

    mapboxgl.accessToken = token;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1734, 41.3851],
      zoom: 14,
      pitch: 45,
      antialias: true
    });

    (mapRef.current as any) = mapInstance;

    mapInstance.on('load', () => {
      mapInstance.resize();
      
      // Añadir marcadores visuales para las venues [cite: 2025-12-18]
      venues.forEach(venue => {
        new mapboxgl.Marker({ color: '#4ade80' }) // Verde Nitvibes
          .setLngLat([venue.lon, venue.lat])
          .setPopup(new mapboxgl.Popup().setHTML(`<b>${venue.name}</b>`))
          .addTo(mapInstance);
      });
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    });

    mapInstance.addControl(geolocate);

    geolocate.on('geolocate', (position: any) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([longitude, latitude]);
      checkGeofencing(latitude, longitude);
    });

    return () => {
      if (mapRef.current) (mapRef.current as any).remove();
    };
  }, []);

  // Lógica de detección de perímetros [cite: 2025-12-19]
  const checkGeofencing = (userLat: number, userLon: number) => {
    let foundVenue = null;
    let nearWifi = false;

    venues.forEach(venue => {
      const distance = getDistance(userLat, userLon, venue.lat, venue.lon);

      // Regla 25 metros: Usuario en la venue [cite: 2025-12-19]
      if (distance <= GEOFENCE_RADIUS_METERS) {
        foundVenue = venue;
      }

      // Regla 10 metros: Pop-up invitación WIFI [cite: 2025-12-19]
      if (distance <= WIFI_POPUP_RADIUS_METERS) {
        nearWifi = true;
      }
    });

    setActiveVenue(foundVenue);
    setShowWifiPopup(nearWifi);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Pop-up de Invitación WIFI (10 metros) [cite: 2025-12-19] */}
      {showWifiPopup && activeVenue && (
        <div className="absolute bottom-24 left-4 right-4 bg-white p-4 rounded-2xl shadow-2xl z-50 animate-bounce">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase">Estás en {activeVenue.name}</p>
              <p className="text-sm font-black text-black">¿Quieres conectarte al WIFI?</p>
            </div>
            <button 
              onClick={() => setShowWifiPopup(false)}
              className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-bold"
            >
              CONECTAR
            </button>
          </div>
        </div>
      )}

      {/* Indicador de Zona Geofence (25 metros) [cite: 2025-12-19] */}
      {activeVenue && !showWifiPopup && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-green-500/90 backdrop-blur-sm px-4 py-1 rounded-full z-10 border border-white/20">
          <p className="text-[10px] font-black text-white uppercase tracking-widest">
            Inside: {activeVenue.name}
          </p>
        </div>
      )}
    </div>
  );
}