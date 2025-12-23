"use client";

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { useSimulation } from '@/lib/useSimulation';

// Reglas de negocio para perímetros [cite: 2025-12-19]
const GEOFENCE_RADIUS_METERS = 25; 
const WIFI_POPUP_RADIUS_METERS = 10;

// Cálculo de distancia precisa (Haversine) [cite: 2025-12-19]
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))); 
};

export default function MapboxMap() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const { user } = useAuth();
  
  const [venues, setVenues] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [activeVenue, setActiveVenue] = useState<any>(null);
  const [showWifiPopup, setShowWifiPopup] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // 1. Cargar Venues desde Firebase [cite: 2025-12-18]
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "venues"));
        const venuesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          coords: [doc.data().lon, doc.data().lat] // Formato Mapbox [cite: 2025-12-19]
        }));
        setVenues(venuesData);
      } catch (error) {
        console.error("Error Firebase Venues:", error);
      }
    };
    fetchVenues();
  }, []);

  // 2. Inicializar Simulador (5000 agentes) [cite: 2025-12-18]
  const { updatePositions } = useSimulation(5000, venues);

  useEffect(() => {
    if (venues.length === 0) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !mapContainer.current || mapRef.current) return;
    mapboxgl.accessToken = token;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1734, 41.3851], // Barcelona [cite: 2025-12-19]
      zoom: 14,
      pitch: 45
    });

    (mapRef.current as any) = mapInstance;

    mapInstance.on('load', () => {
      mapInstance.resize();

      // Fuente de datos para la simulación
      mapInstance.addSource('sim-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // CAPA 1: Heatmap (Zoom bajo) [cite: 2025-12-23]
      mapInstance.addLayer({
        id: 'user-heat',
        type: 'heatmap',
        source: 'sim-source',
        maxzoom: 16,
        paint: {
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.2, '#22c55e', // Verde (Baja)
            0.5, '#eab308', // Amarillo (Media)
            1, '#ef4444'    // Rojo (Alta)
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 14, 25],
          'heatmap-opacity': 0.8
        }
      });

      // CAPA 2: Círculos 1:1 (Zoom alto) [cite: 2025-12-23]
      mapInstance.addLayer({
        id: 'user-points',
        type: 'circle',
        source: 'sim-source',
        minzoom: 15,
        paint: {
          // Escala real: el radio crece exponencialmente con el zoom [cite: 2025-12-23]
          'circle-radius': ['interpolate', ['exponential', 2], ['zoom'], 15, 2, 21, 25],
          'circle-color': [
            'interpolate', ['linear'], ['get', 'groupWeight'],
            0, '#22c55e', 
            0.5, '#eab308', 
            1, '#ef4444'
          ],
          'circle-opacity': 0.9,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#000'
        }
      });

      // Marcadores de Venues cargadas de Firebase [cite: 2025-12-19]
      venues.forEach(venue => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = '#4ade80';
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 0 10px #4ade80';

        new mapboxgl.Marker(el)
          .setLngLat(venue.coords)
          .setPopup(new mapboxgl.Popup().setHTML(`<b style="color:black">${venue.name}</b>`))
          .addTo(mapInstance);
      });
    });

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true
    });

    mapInstance.addControl(geolocate);
    geolocate.on('geolocate', (pos: any) => {
      const { latitude, longitude } = pos.coords;
      setUserLocation([longitude, latitude]);
      
      // Lógica de perímetros sobre venues reales [cite: 2025-12-19]
      let foundVenue = null;
      let nearWifi = false;
      venues.forEach(v => {
        const dist = getDistance(latitude, longitude, v.lat, v.lon);
        if (dist <= GEOFENCE_RADIUS_METERS) foundVenue = v;
        if (dist <= WIFI_POPUP_RADIUS_METERS) nearWifi = true;
      });
      setActiveVenue(foundVenue);
      setShowWifiPopup(nearWifi);
    });

    return () => { if (mapRef.current) (mapRef.current as any).remove(); };
  }, [venues]);

  // Loop de Simulación (Animación) [cite: 2025-12-18]
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      if (isSimulating && mapRef.current && venues.length > 0) {
        const source: any = (mapRef.current as any).getSource('sim-source');
        if (source) source.setData(updatePositions());
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frameId);
  }, [isSimulating, venues]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Botón Simulador */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-8 py-3 rounded-full font-black text-[10px] uppercase shadow-2xl transition-all active:scale-95 ${
            isSimulating ? 'bg-red-600 text-white' : 'bg-green-500 text-black'
          }`}
        >
          {isSimulating ? 'Stop Traffic' : 'Simulate 5K Vibers'}
        </button>
      </div>

      {/* Pop-up WIFI (10m) [cite: 2025-12-19] */}
      {showWifiPopup && activeVenue && (
        <div className="absolute bottom-24 left-4 right-4 bg-white p-5 rounded-3xl shadow-2xl z-50 animate-in slide-in-from-bottom duration-500">
          <div className="flex items-center justify-between gap-4">
            <div className="bg-green-100 p-3 rounded-2xl">📶</div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{activeVenue.name}</p>
              <h3 className="text-sm font-black text-black leading-none">WIFI DISPONIBLE</h3>
            </div>
            <button 
              onClick={() => setShowWifiPopup(false)}
              className="bg-black text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase"
            >
              Conectar
            </button>
          </div>
        </div>
      )}

      {/* Indicador Geofence (25m) [cite: 2025-12-19] */}
      {activeVenue && !showWifiPopup && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-green-500/90 backdrop-blur-md px-6 py-2 rounded-full z-10 border border-white/20 shadow-xl">
          <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
            📍 Inside {activeVenue.name}
          </p>
        </div>
      )}
    </div>
  );
}