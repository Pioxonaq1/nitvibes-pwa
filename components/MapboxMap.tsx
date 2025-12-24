"use client";

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getDensityColor } from '@/lib/useSimulation';

// Definimos las Props que recibe del padre (page.tsx)
interface MapboxMapProps {
  venues: any[];
  simulatedUsers: any[]; // Array de usuarios con lat, lng, color
  densityData: Record<string, number>; // { id_venue: cantidad_usuarios }
}

export default function MapboxMap({ venues, simulatedUsers, densityData }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  
  // Guardamos referencias a los marcadores de venues para actualizar su color sin borrarlos
  const venueMarkersRef = useRef<Record<string, mapboxgl.Marker>>({});

  // 1. INICIALIZACIÓN DEL MAPA (Solo una vez)
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current) return;

    mapboxgl.accessToken = token;
    
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11', // Mapa oscuro para resaltar neones
      center: [2.1696, 41.3880], // Centro aprox Barcelona
      zoom: 13.5,
      pitch: 45, // Inclinación 3D
      bearing: -10
    });
    
    mapRef.current = map;

    map.on('load', () => {
      // --- CAPA DE USUARIOS (VIBERS) ---
      // Usamos GeoJSON Source porque es lo único que aguanta 1000 puntos a 60fps
      map.addSource('users-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      map.addLayer({
        id: 'users-layer',
        type: 'circle',
        source: 'users-source',
        paint: {
          // Radio dinámico según zoom (más grandes al acercarse)
          'circle-radius': [
            'interpolate', ['exponential', 2], ['zoom'],
            12, 1.5,
            15, 4,
            22, 10
          ],
          // Color leído directamente de la propiedad 'color' que manda el simulador
          'circle-color': ['get', 'color'], 
          'circle-opacity': 0.8,
          // Un pequeño borde negro para definición
          'circle-stroke-width': 1,
          'circle-stroke-color': '#000000'
        }
      });
      
      // Efecto Hover
      map.on('mouseenter', 'users-layer', () => map.getCanvas().style.cursor = 'pointer');
      map.on('mouseleave', 'users-layer', () => map.getCanvas().style.cursor = '');
    });

    return () => map.remove();
  }, []);

  // 2. ACTUALIZACIÓN DE USUARIOS (Cada frame/segundo que cambie simulatedUsers)
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.getSource('users-source')) return;

    // Convertimos el array de usuarios JS a GeoJSON para Mapbox
    const geoJsonData: any = {
      type: 'FeatureCollection',
      features: simulatedUsers.map(user => ({
        type: 'Feature',
        properties: {
          id: user.id,
          color: user.color, // Cyan o Gris según lógica del simulador
          speed: user.speed
        },
        geometry: {
          type: 'Point',
          coordinates: [user.lng, user.lat]
        }
      }))
    };

    // Actualizamos la fuente de datos (Mapbox repinta solo)
    (mapRef.current.getSource('users-source') as mapboxgl.GeoJSONSource).setData(geoJsonData);

  }, [simulatedUsers]);

  // 3. GESTIÓN DE VENUES Y SEMÁFORO DE DENSIDAD
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    venues.forEach(venue => {
      // A. Si el marcador no existe, lo creamos
      if (!venueMarkersRef.current[venue.id]) {
        // Creamos elemento DOM personalizado
        const el = document.createElement('div');
        el.className = 'venue-marker'; // Clase para CSS (ver abajo)
        el.style.width = '24px';
        el.style.height = '24px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white'; // Borde base
        el.style.backgroundColor = '#18181b'; // Fondo oscuro (zinc-900)
        el.style.boxShadow = '0 0 15px rgba(0,0,0,0.5)';
        el.style.transition = 'all 0.3s ease'; // Transición suave de color
        
        // Icono simple dentro (opcional)
        el.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;font-size:10px;">🏢</div>';

        // Popup con nombre
        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`<strong style="color:black">${venue.name}</strong><br><span style="color:#555;font-size:10px">Esperando datos...</span>`);

        // Añadir al mapa
        const marker = new mapboxgl.Marker(el)
          .setLngLat([venue.location._long, venue.location._lat])
          .setPopup(popup)
          .addTo(map);

        venueMarkersRef.current[venue.id] = marker;
      }

      // B. ACTUALIZAR COLOR SEMÁFORO (DENSIDAD)
      const count = densityData[venue.id] || 0;
      const color = getDensityColor(count); // Verde/Amarillo/Rojo
      const marker = venueMarkersRef.current[venue.id];
      const el = marker.getElement();

      // Cambiamos el color del borde y el brillo según aforo
      el.style.borderColor = color;
      el.style.boxShadow = `0 0 20px ${color}`;

      // Actualizamos texto del popup con el conteo en tiempo real
      marker.getPopup()?.setHTML(`
        <div style="text-align:center">
          <strong style="color:black; font-size:14px;">${venue.name}</strong>
          <div style="margin-top:4px; padding:4px 8px; border-radius:4px; background:${color}; color:${count > 200 ? 'white' : 'black'}; font-weight:bold;">
            ${count} personas cerca
          </div>
        </div>
      `);
    });

  }, [venues, densityData]); // Se ejecuta cuando cambian las venues o los datos de densidad

  return <div ref={mapContainer} className="w-full h-full" />;
}