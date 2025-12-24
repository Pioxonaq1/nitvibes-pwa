
"use client";

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { METRO_STATIONS } from '@/lib/metroData';

// --- DEFINICIÓN DE TIPOS ---
interface Venue {
  id: string;
  name: string;
  location?: { _lat: number; _long: number };
  [key: string]: any;
}

interface SimulatedUser {
  id: number;
  lat: number;
  lng: number;
  color: string;
  [key: string]: any;
}

interface MapboxMapProps {
  venues: Venue[];
  simulatedUsers: SimulatedUser[];
  densityData: Record<string, number>;
}

export default function MapboxMap({ venues, simulatedUsers, densityData }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const venueMarkersRef = useRef<Record<string, mapboxgl.Marker>>({});

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1700, 41.3870],
      zoom: 13,
      pitch: 45,
    });
    
    mapRef.current = map;

    map.on('load', () => {
      // FUENTE
      map.addSource('users-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // 1. HEATMAP (Fondo)
      map.addLayer({
        id: 'user-heat',
        type: 'heatmap',
        source: 'users-source',
        maxzoom: 18,
        paint: {
          'heatmap-weight': 1,
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 11, 1, 15, 3],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, '#22c55e', 
            0.5, '#eab308', 
            0.8, '#ef4444' 
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 11, 15, 15, 40],
          'heatmap-opacity': 0.8
        }
      });

      // 2. PUNTOS (Encima)
      map.addLayer({
        id: 'user-points',
        type: 'circle',
        source: 'users-source',
        minzoom: 13,
        paint: {
          'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 13, 1.5, 16, 3],
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.9,
          'circle-stroke-width': 0
        }
      });

      // 3. METROS
      METRO_STATIONS.forEach(station => {
        const el = document.createElement('div');
        el.className = 'metro-marker';
        el.innerHTML = 'M';
        el.style.cssText = 'background:#0055A5; color:white; width:16px; height:16px; font-size:10px; font-weight:bold; display:flex; align-items:center; justify-content:center; border:1px solid white; z-index:5;';
        new mapboxgl.Marker(el).setLngLat([station.lng, station.lat]).addTo(map);
      });
    });

    return () => map.remove();
  }, []);

  // ACTUALIZAR POSICIONES
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.getSource('users-source')) return;

    const geoJsonData: any = {
      type: 'FeatureCollection',
      features: simulatedUsers.map(user => ({
        type: 'Feature',
        properties: { color: user.color },
        geometry: { type: 'Point', coordinates: [user.lng, user.lat] }
      }))
    };

    (mapRef.current.getSource('users-source') as mapboxgl.GeoJSONSource).setData(geoJsonData);
  }, [simulatedUsers]);

  // ACTUALIZAR VENUES
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    venues.forEach(venue => {
      const count = densityData[venue.id] || 0;
      
      if (!venueMarkersRef.current[venue.id]) {
        // Crear marcador si no existe
        const el = document.createElement('div');
        el.className = 'venue-marker';
        el.style.cssText = 'width:24px; height:24px; border-radius:50%; border:2px solid white; background:#18181b; display:flex; justify-content:center; align-items:center; transition: all 0.3s ease;';
        el.innerHTML = '🏢';

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`<b style="color:black">${venue.name}</b>`);
        
        // Checkeo defensivo de location
        if (venue.location && venue.location._long && venue.location._lat) {
            const marker = new mapboxgl.Marker(el)
                .setLngLat([venue.location._long, venue.location._lat])
                .setPopup(popup)
                .addTo(map);
            venueMarkersRef.current[venue.id] = marker;
        }
      }

      // Actualizar estilo si existe el marcador
      const marker = venueMarkersRef.current[venue.id];
      if (marker) {
          const el = marker.getElement();
          
          let color = '#808080';
          if (count > 100) color = '#ef4444';
          else if (count > 50) color = '#eab308';
          else if (count > 10) color = '#22c55e';

          el.style.borderColor = color;
          el.style.boxShadow = `0 0 ${count > 100 ? 30 : 10}px ${color}`;

          marker.getPopup()?.setHTML(`
            <div style="text-align:center">
              <strong style="color:black; font-size:12px;">${venue.name}</strong>
              <div style="margin-top:2px; background:${color}; color:${count > 100 ? 'white':'black'}; border-radius:4px; font-size:11px; font-weight:800; padding:2px 4px;">
                ${count} VIBERS
              </div>
            </div>
          `);
      }
    });
  }, [venues, densityData]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
