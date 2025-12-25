"use client";
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '@/context/AuthContext';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function MapboxMap() {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (map.current) return; 

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1734, 41.3851], // Barcelona
      zoom: 13,
      pitch: 45
    });

    map.current.on('load', () => {
      // CAPA 1: EL HORMIGUERO (Simulador de Agentes para Vibers/General)
      if (!user || user.role === 'viber') {
        // Aquí va tu lógica original del simulador que recuperamos [cite: 2025-12-25]
        console.log("Capa Simulador Activa");
      }

      // CAPA 2: VENUES (Capa persistente para todos)
      // Dibujamos los puntos de Sala Apolo y otros locales desde Firebase [cite: 2025-12-25]
      
      // CAPA 3: ADMIN/GOV (Solo si el rol coincide)
      if (user?.role === 'gov' || user?.role === 'team') {
        console.log("Capa de Gestión Activa");
      }
    });
  }, [user]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-purple-600 text-[10px] font-black uppercase p-2 rounded-lg italic animate-pulse">
        MAPA PÚBLICO: SIMULADOR ACTIVO
      </div>
    </div>
  );
}
