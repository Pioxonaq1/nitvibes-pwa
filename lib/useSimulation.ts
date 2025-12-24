import { useState, useEffect, useRef } from 'react';
import * as turf from '@turf/turf';

// --- TIPOS ---
export type SimulatedUser = {
  id: number;
  lat: number;
  lng: number;
  color: string;
  speed: number;
  
  // Nuevas propiedades para navegación por calles
  state: 'DRIVING' | 'WALKING';
  currentRouteIndex: number;
  progressOnRoute: number; 
  direction: number; // CAMBIO: Usamos number para evitar conflictos matemáticos con TS
  targetVenueId: string | null;
};

type Venue = {
  id: string;
  location?: {
    _lat: number;
    _long: number;
  };
  [key: string]: any;
};

// --- CONFIGURACIÓN ---
const USER_COUNT = 1000; 
const UPDATE_INTERVAL_MS = 1000;

// Colores
const COLOR_NEAR = "#00FFFF"; // Cyan (< 200m)
const COLOR_FAR = "#808080";  // Gris (> 200m)

// Velocidades
const SPEED_STREET_KMH = 40;  
const SPEED_WALK_KMH = 5;     

// --- RED DE CALLES (SKELETON) ---
const STREET_NETWORK = [
  [[2.123, 41.363], [2.150, 41.375], [2.185, 41.398], [2.210, 41.415]], // Gran Via
  [[2.100, 41.385], [2.145, 41.393], [2.170, 41.400], [2.220, 41.412]], // Diagonal
  [[2.145, 41.380], [2.165, 41.392], [2.190, 41.408]], // Aragó
  [[2.175, 41.374], [2.163, 41.375], [2.148, 41.374]], // Paral·lel
  [[2.185, 41.398], [2.195, 41.420], [2.200, 41.430]], // Meridiana
  [[2.175, 41.374], [2.180, 41.368], [2.188, 41.378]], // Puerto
  [[2.195, 41.385], [2.180, 41.400]], // Marina
  [[2.165, 41.385], [2.150, 41.405]]  // Balmes
];

// Creamos las líneas GeoJSON una sola vez
const ROADS = STREET_NETWORK.map(coords => turf.lineString(coords));

// --- HELPERS ---
const getDistanceMeters = (from: number[], to: number[]) => {
  return turf.distance(turf.point(from), turf.point(to), { units: 'kilometers' }) * 1000;
};

export const useSimulation = (venues: Venue[]) => {
  const [users, setUsers] = useState<SimulatedUser[]>([]);
  const [venueCounts, setVenueCounts] = useState<Record<string, number>>({});
  const initialized = useRef(false);

  // 1. INICIALIZAR
  useEffect(() => {
    if (initialized.current || venues.length === 0) return;

    const initialUsers: SimulatedUser[] = Array.from({ length: USER_COUNT }).map((_, i) => {
      const routeIndex = Math.floor(Math.random() * ROADS.length);
      const road = ROADS[routeIndex];
      const roadLen = turf.length(road);
      const randomProgress = Math.random(); 
      
      // Calculamos posición inicial en la calle
      const startPos = turf.along(road, randomProgress * roadLen);
      const [lng, lat] = startPos.geometry.coordinates;

      return {
        id: i,
        lat,
        lng,
        color: COLOR_FAR,
        speed: SPEED_STREET_KMH,
        state: 'DRIVING',
        currentRouteIndex: routeIndex,
        progressOnRoute: randomProgress,
        direction: Math.random() > 0.5 ? 1 : -1, // 1 o -1, pero guardado como number
        targetVenueId: null
      };
    });

    setUsers(initialUsers);
    initialized.current = true;
  }, [venues]);

  // 2. BUCLE SIMULACIÓN
  useEffect(() => {
    if (venues.length === 0) return;

    const interval = setInterval(() => {
      setUsers(currentUsers => {
        const newCounts: Record<string, number> = {};
        venues.forEach(v => newCounts[v.id] = 0);

        // Mapeamos usuarios para calcular su siguiente estado
        return currentUsers.map(user => {
          let nearestDist = Infinity;
          let nearestVenueId = null;
          let nearestVenueLoc = null;

          // Buscar venue cercana
          for (const v of venues) {
            if (!v.location) continue;
            const d = getDistanceMeters([user.lng, user.lat], [v.location._long, v.location._lat]);
            if (d < nearestDist) {
              nearestDist = d;
              nearestVenueId = v.id;
              nearestVenueLoc = [v.location._long, v.location._lat];
            }
          }

          // Actualizar conteo de densidad
          if (nearestDist < 50 && nearestVenueId) {
            newCounts[nearestVenueId] = (newCounts[nearestVenueId] || 0) + 1;
          }

          // Máquina de estados
          let nextState = user.state;
          let nextColor = COLOR_FAR;
          let nextSpeed = SPEED_STREET_KMH;

          if (nearestDist < 200) {
            nextState = 'WALKING';
            nextColor = COLOR_NEAR;
            nextSpeed = SPEED_WALK_KMH;
          } else if (nearestDist > 250) {
            nextState = 'DRIVING';
            nextColor = COLOR_FAR;
            nextSpeed = SPEED_STREET_KMH;
          }

          // Cálculo de movimiento
          let nextLat = user.lat;
          let nextLng = user.lng;
          let nextProgress = user.progressOnRoute;
          let nextRouteIndex = user.currentRouteIndex;
          let nextDirection = user.direction;

          if (nextState === 'DRIVING') {
            const road = ROADS[user.currentRouteIndex];
            const roadLengthKm = turf.length(road);
            const moveDistKm = (nextSpeed / 3600) * (UPDATE_INTERVAL_MS / 1000);
            
            // Avance relativo (km recorridos / longitud total calle)
            const progressDelta = moveDistKm / roadLengthKm;
            nextProgress += (progressDelta * nextDirection);

            // Rebote al final de la calle
            if (nextProgress >= 1 || nextProgress <= 0) {
              nextDirection *= -1; // TypeScript ahora acepta esto porque es number
              nextProgress = Math.max(0, Math.min(1, nextProgress));
              
              // Opcional: cambio de calle al azar
              if (Math.random() > 0.8) {
                 nextRouteIndex = Math.floor(Math.random() * ROADS.length);
                 nextProgress = Math.random(); 
              }
            }

            const pointOnLine = turf.along(ROADS[nextRouteIndex], nextProgress * turf.length(ROADS[nextRouteIndex]));
            [nextLng, nextLat] = pointOnLine.geometry.coordinates;

          } else if (nextState === 'WALKING' && nearestVenueLoc) {
            const bearing = turf.bearing([user.lng, user.lat], nearestVenueLoc);
            const moveDistKm = (nextSpeed / 3600) * (UPDATE_INTERVAL_MS / 1000);
            const dest = turf.destination([user.lng, user.lat], moveDistKm, bearing);
            [nextLng, nextLat] = dest.geometry.coordinates;
          }

          // Retornamos usuario actualizado
          return {
            ...user,
            lat: nextLat,
            lng: nextLng,
            color: nextColor,
            speed: nextSpeed,
            state: nextState, // 'DRIVING' | 'WALKING' se mantiene correctamente
            currentRouteIndex: nextRouteIndex,
            progressOnRoute: nextProgress,
            direction: nextDirection,
            targetVenueId: nearestVenueId
          };
        });

        setVenueCounts(newCounts);
      });
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [venues]);

  return { users, venueCounts };
};

export const getDensityColor = (count: number) => {
  if (count > 200) return "#EF4444"; 
  if (count >= 50) return "#EAB308"; 
  if (count >= 1) return "#22C55E";  
  return "#808080"; 
};