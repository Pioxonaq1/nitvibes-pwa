
import { useState, useEffect, useRef } from 'react';
import * as turf from '@turf/turf';
import { METRO_STATIONS } from './metroData';

// --- TIPOS ---
export type SimulatedUser = {
  id: number;
  lat: number;
  lng: number;
  color: string;
  state: 'TRANSIT_METRO' | 'WALKING_TO_VENUE' | 'PARTYING' | 'RETURNING_METRO';
  targetVenueLoc: { lat: number, lng: number } | null;
  targetMetroLoc: { lat: number, lng: number } | null;
  speed: number;
  boredomTimer: number; // Contador para cambiar de bar
};

type Venue = {
  id: string;
  location?: { _lat: number; _long: number };
  [key: string]: any;
};

// --- CONFIGURACIÓN V2 ---
const USER_COUNT = 5000; // 5k Usuarios
const REAL_CYCLE_MINUTES = 3; 
const SIM_START_HOUR = 18; 
const SIM_END_HOUR = 30; // 06:00 AM

// Colores Puntos
const COL_WALK = "#F97316"; // Naranja
const COL_PARTY = "#00FFFF"; // Cyan

// Velocidades
const SPEED_WALK = 70; // km/h (Un poco más rápido para ver flujo)
const SPEED_STATIONARY = 0.2; 

// --- HELPERS ---
const getDist = (p1: number[], p2: number[]): number => {
  return turf.distance(turf.point(p1), turf.point(p2), { units: 'meters' });
};

const formatSimTime = (decimalHour: number): string => {
  let h = Math.floor(decimalHour);
  const m = Math.floor((decimalHour - h) * 60);
  if (h >= 24) h -= 24;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// --- HOOK PRINCIPAL ---
export const useSimulation = (venues: Venue[]) => {
  const [users, setUsers] = useState<SimulatedUser[]>([]);
  const [clock, setClock] = useState<string>("18:00");
  const [venueCounts, setVenueCounts] = useState<Record<string, number>>({});
  
  const initialized = useRef<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());

  // INICIALIZACIÓN (Todos en el Metro listos para salir)
  useEffect(() => {
    if (initialized.current || venues.length === 0) return;

    const initialUsers: SimulatedUser[] = Array.from({ length: USER_COUNT }).map((_, i) => {
      const station = METRO_STATIONS[Math.floor(Math.random() * METRO_STATIONS.length)];
      return {
        id: i,
        lat: station.lat + (Math.random() - 0.5) * 0.002, // Dispersión en la estación
        lng: station.lng + (Math.random() - 0.5) * 0.002,
        color: COL_WALK,
        state: 'TRANSIT_METRO',
        targetVenueLoc: null,
        targetMetroLoc: { lat: station.lat, lng: station.lng },
        speed: SPEED_WALK,
        boredomTimer: 0
      };
    });

    setUsers(initialUsers);
    initialized.current = true;
    startTimeRef.current = Date.now();
  }, [venues]);

  // BUCLE DE SIMULACIÓN
  useEffect(() => {
    if (venues.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const totalCycleMs = REAL_CYCLE_MINUTES * 60 * 1000;
      const progress = (elapsed % totalCycleMs) / totalCycleMs;
      const currentHour = SIM_START_HOUR + (progress * (SIM_END_HOUR - SIM_START_HOUR));
      setClock(formatSimTime(currentHour));

      // FASES HORARIAS
      const phase1_WarmUp = currentHour >= 18 && currentHour < 24; // 18-00
      const phase2_Peak   = currentHour >= 24 && currentHour < 27; // 00-03
      const phase3_Exodus = currentHour >= 27;                     // 03-06

      setUsers((prevUsers: SimulatedUser[]) => {
        const newCounts: Record<string, number> = {};
        venues.forEach(v => newCounts[v.id] = 0);

        const nextUsers = prevUsers.map((u: SimulatedUser) => {
          let { state, lat, lng, targetVenueLoc, color, speed, boredomTimer } = u;
          
          // --- MÁQUINA DE ESTADOS COMPLEJA ---

          // 1. SALIR DEL METRO (SPAWN)
          if (state === 'TRANSIT_METRO') {
             // Solo salen si NO estamos en fase de Exodus
             if (!phase3_Exodus && Math.random() > 0.05) { 
               // Elegir destino:
               // Fase 1: Venue cercana
               // Fase 2: Venue aleatoria (más lejos)
               let targetVenue: Venue | null = null;

               if (phase1_WarmUp) {
                  // Buscar cercana
                  let minDist = Infinity;
                  venues.forEach((v: Venue) => {
                    if(!v.location) return;
                    const d = getDist([lng, lat], [v.location._long, v.location._lat]);
                    if(d < minDist) { minDist = d; targetVenue = v; }
                  });
               } else {
                  // Fase 2: Aleatoria (dispersión)
                  targetVenue = venues[Math.floor(Math.random() * venues.length)];
               }

               if (targetVenue && (targetVenue as Venue).location) {
                 const loc = (targetVenue as Venue).location!;
                 targetVenueLoc = { lat: loc._lat, lng: loc._long };
                 state = 'WALKING_TO_VENUE';
               }
             }
          }

          // 2. CAMINANDO
          if (state === 'WALKING_TO_VENUE' && targetVenueLoc) {
            const dist = getDist([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
            color = COL_WALK;
            if (dist < 20) {
              state = 'PARTYING';
              boredomTimer = 0; // Reiniciar aburrimiento
            }
          }

          // 3. DE FIESTA (GRAVEDAD Y ABURRIMIENTO)
          if (state === 'PARTYING') {
            color = COL_PARTY;
            speed = SPEED_STATIONARY;
            boredomTimer += 1;

            // A. Regla de Éxodo (03:00 - 06:00)
            if (phase3_Exodus) {
               if (Math.random() > 0.90) state = 'RETURNING_METRO'; // Irse a casa progresivamente
            }
            // B. Regla de Bar Hopping (Aburrimiento)
            // Si llevan un rato (>50 ticks) hay prob de cambiar de venue
            else if (boredomTimer > 50 && Math.random() > 0.98) {
               // Elegir OTRA venue aleatoria
               const nextVenue = venues[Math.floor(Math.random() * venues.length)];
               if (nextVenue && nextVenue.location) {
                  const loc = nextVenue.location;
                  targetVenueLoc = { lat: loc._lat, lng: loc._long };
                  state = 'WALKING_TO_VENUE'; // Volver a caminar (crea líneas entre venues)
               }
            }
          }

          // 4. VOLVER A CASA
          if (state === 'RETURNING_METRO' && u.targetMetroLoc) {
             targetVenueLoc = u.targetMetroLoc;
             color = COL_WALK;
             speed = SPEED_WALK;
             const distToMetro = getDist([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
             
             // Si llegan al metro, "desaparecen" visualmente (esperan reinicio)
             if (distToMetro < 20) {
                state = 'TRANSIT_METRO'; 
             }
          }

          // --- MOVIMIENTO VECTORIAL ---
          if (targetVenueLoc && state !== 'TRANSIT_METRO') {
             const bearing = turf.bearing([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
             const jitter = (Math.random() - 0.5) * 15; // Jitter para naturalidad
             const distStep = (speed / 3600); // km/s aprox
             const dest = turf.destination([lng, lat], distStep, bearing + jitter);
             [lng, lat] = dest.geometry.coordinates;
          }

          // --- HEATMAP CALCULATION ---
          // Solo contamos si están realmente en la venue
          if (state === 'PARTYING') {
             // Optimización: chequeo rápido de distancia a la venue destino actual
             // Asumimos que si está PARTYING, está en su targetVenueLoc
             if (targetVenueLoc) {
                // Buscamos ID inverso (costoso, mejor aproximar en UI o buscar id en venues loop)
                // Para simplificar y rendimiento con 5k users:
                for (const v of venues) {
                   if (v.location && 
                       Math.abs(v.location._lat - lat) < 0.0005 && 
                       Math.abs(v.location._long - lng) < 0.0005) {
                       newCounts[v.id] = (newCounts[v.id] || 0) + 1;
                       break;
                   }
                }
             }
          }
          return { ...u, lat, lng, state, targetVenueLoc, color, speed, boredomTimer };
        });

        setVenueCounts(newCounts);
        return nextUsers;
      });
    }, 100); // 100ms Update Rate

    return () => clearInterval(interval);
  }, [venues]);

  return { users, venueCounts, clock };
};
