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
  state: 'DRIVING' | 'WALKING'; // Conduciendo (en calle) o Caminando (última milla)
  currentRouteIndex: number;    // En qué calle está
  progressOnRoute: number;      // Progreso en esa calle (0.0 a 1.0)
  direction: 1 | -1;            // 1 = hacia adelante, -1 = hacia atrás
  targetVenueId: string | null; // Si ha visto una venue, va hacia ella
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

// Velocidades (ajustadas para simulación visual)
const SPEED_STREET_KMH = 40;  // Rápido en calle
const SPEED_WALK_KMH = 5;     // Lento acercándose

// --- RED DE CALLES DE BARCELONA (SKELETON) ---
// Coordenadas reales simplificadas de las arterias principales
const STREET_NETWORK = [
  // Gran Via (Largo recorrido horizontal)
  [[2.123, 41.363], [2.150, 41.375], [2.185, 41.398], [2.210, 41.415]],
  // Diagonal (Diagonal completa)
  [[2.100, 41.385], [2.145, 41.393], [2.170, 41.400], [2.220, 41.412]],
  // Aragó (Centro ciudad)
  [[2.145, 41.380], [2.165, 41.392], [2.190, 41.408]],
  // Paral·lel
  [[2.175, 41.374], [2.163, 41.375], [2.148, 41.374]],
  // Meridiana
  [[2.185, 41.398], [2.195, 41.420], [2.200, 41.430]],
  // Zona Puerto / Colón
  [[2.175, 41.374], [2.180, 41.368], [2.188, 41.378]],
  // Marina (Vertical)
  [[2.195, 41.385], [2.180, 41.400]],
  // Balmes (Vertical)
  [[2.165, 41.385], [2.150, 41.405]]
];

// Convertimos a GeoJSON Lines para Turf
const ROADS = STREET_NETWORK.map(coords => turf.lineString(coords));

// --- HELPERS ---
const getDistanceMeters = (from: number[], to: number[]) => {
  return turf.distance(turf.point(from), turf.point(to), { units: 'kilometers' }) * 1000;
};

export const useSimulation = (venues: Venue[]) => {
  const [users, setUsers] = useState<SimulatedUser[]>([]);
  const [venueCounts, setVenueCounts] = useState<Record<string, number>>({});
  const initialized = useRef(false);

  // 1. INICIALIZAR USUARIOS EN LAS CALLES
  useEffect(() => {
    if (initialized.current || venues.length === 0) return;

    const initialUsers: SimulatedUser[] = Array.from({ length: USER_COUNT }).map((_, i) => {
      // Asignar una calle aleatoria al nacer
      const routeIndex = Math.floor(Math.random() * ROADS.length);
      const randomProgress = Math.random(); 
      const startPos = turf.along(ROADS[routeIndex], randomProgress * turf.length(ROADS[routeIndex]));
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
        direction: Math.random() > 0.5 ? 1 : -1,
        targetVenueId: null
      };
    });

    setUsers(initialUsers);
    initialized.current = true;
  }, [venues]);

  // 2. BUCLE DE SIMULACIÓN
  useEffect(() => {
    if (venues.length === 0) return;

    const interval = setInterval(() => {
      setUsers(currentUsers => {
        const newCounts: Record<string, number> = {};
        venues.forEach(v => newCounts[v.id] = 0);

        const updatedUsers = currentUsers.map(user => {
          // --- A. ANALIZAR ENTORNO (Venues cercanas) ---
          let nearestDist = Infinity;
          let nearestVenueId = null;
          let nearestVenueLoc = null;

          venues.forEach(v => {
            if (!v.location) return;
            const d = getDistanceMeters([user.lng, user.lat], [v.location._long, v.location._lat]);
            if (d < nearestDist) {
              nearestDist = d;
              nearestVenueId = v.id;
              nearestVenueLoc = [v.location._long, v.location._lat];
            }
          });

          // Actualizar Densidad
          if (nearestDist < 50 && nearestVenueId) {
            newCounts[nearestVenueId] = (newCounts[nearestVenueId] || 0) + 1;
          }

          // --- B. MÁQUINA DE ESTADOS (Cerebro del Usuario) ---
          let nextState = user.state;
          let nextColor = COLOR_FAR;
          let nextSpeed = SPEED_STREET_KMH;

          // REGLA 1: Si está muy cerca (<200m), cambia a modo CAMINAR hacia la venue
          if (nearestDist < 200) {
            nextState = 'WALKING';
            nextColor = COLOR_NEAR; // Cyan
            nextSpeed = SPEED_WALK_KMH; // 5 km/h
          } 
          // REGLA 2: Si se aleja (>250m con histéresis), vuelve al COCHE a la calle
          else if (nearestDist > 250) {
            nextState = 'DRIVING';
            nextColor = COLOR_FAR;  // Gris
            nextSpeed = SPEED_STREET_KMH; // 40 km/h
          }

          // --- C. MOVIMIENTO FÍSICO ---
          let nextLat = user.lat;
          let nextLng = user.lng;
          let nextProgress = user.progressOnRoute;
          let nextRouteIndex = user.currentRouteIndex;
          let nextDirection = user.direction;

          // MODO CONDUCCIÓN (Pegado a la calle)
          if (nextState === 'DRIVING') {
            const road = ROADS[user.currentRouteIndex];
            const roadLengthKm = turf.length(road);
            
            // Distancia a avanzar en este frame (km)
            const moveDistKm = (nextSpeed / 3600) * (UPDATE_INTERVAL_MS / 1000);
            
            // Calcular nuevo progreso (0 a 1)
            const progressDelta = moveDistKm / roadLengthKm;
            nextProgress += (progressDelta * user.direction);

            // Rebote al final de la calle (simple)
            if (nextProgress >= 1 || nextProgress <= 0) {
              nextDirection *= -1; // Cambiar sentido
              nextProgress = Math.max(0, Math.min(1, nextProgress));
              
              // Opcional: Cambiar de calle aleatoriamente al llegar al final
              if (Math.random() > 0.7) {
                 nextRouteIndex = Math.floor(Math.random() * ROADS.length);
                 nextProgress = Math.random(); // Aparece en otra calle (simula giro)
              }
            }

            // Calcular coordenada exacta en la línea
            const pointOnLine = turf.along(ROADS[nextRouteIndex], nextProgress * turf.length(ROADS[nextRouteIndex]));
            [nextLng, nextLat] = pointOnLine.geometry.coordinates;
          } 
          
          // MODO CAMINAR (Vector directo hacia la venue - Última milla)
          else if (nextState === 'WALKING' && nearestVenueLoc) {
            // Movimiento vectorial suave hacia el objetivo
            const bearing = turf.bearing([user.lng, user.lat], nearestVenueLoc);
            const moveDistKm = (nextSpeed / 3600) * (UPDATE_INTERVAL_MS / 1000);
            const dest = turf.destination([user.lng, user.lat], moveDistKm, bearing);
            [nextLng, nextLat] = dest.geometry.coordinates;
          }

          return {
            ...user,
            lat: nextLat,
            lng: nextLng,
            color: nextColor,
            speed: nextSpeed,
            state: nextState,
            currentRouteIndex: nextRouteIndex,
            progressOnRoute: nextProgress,
            direction: nextDirection
          };
        });

        setVenueCounts(newCounts);
        return updatedUsers;
      });
    }, UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [venues]);

  return { users, venueCounts };
};

export const getDensityColor = (count: number) => {
  if (count > 200) return "#EF4444"; // Rojo (Lleno)
  if (count >= 50) return "#EAB308"; // Amarillo (Animado)
  if (count >= 1) return "#22C55E";  // Verde (Tranquilo)
  return "#808080"; // Gris (Vacío)
};