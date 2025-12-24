
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
  boredomTimer: number; 
};

type Venue = {
  id: string;
  location?: { _lat: number; _long: number };
  [key: string]: any;
};

// --- CONFIGURACIÓN ---
const REAL_CYCLE_MINUTES = 3; 
const SIM_START_HOUR = 18; 
const SIM_END_HOUR = 30; // 06:00 AM

// Colores
const COL_WALK = "#F97316"; // Naranja Fuerte
const COL_PARTY = "#00FFFF"; // Cyan

// Velocidades
const SPEED_WALK = 65; // km/h
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

// --- HOOK ---
// AHORA ACEPTA "userCount" COMO ARGUMENTO
export const useSimulation = (venues: Venue[], userCount: number) => {
  const [users, setUsers] = useState<SimulatedUser[]>([]);
  const [clock, setClock] = useState<string>("18:00");
  const [venueCounts, setVenueCounts] = useState<Record<string, number>>({});
  
  const initialized = useRef<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());

  // REINICIAR SIMULACIÓN CUANDO CAMBIA EL CONTEO
  useEffect(() => {
    if (venues.length === 0) return;

    // Regenerar array completo al cambiar cantidad
    const newUsers: SimulatedUser[] = Array.from({ length: userCount }).map((_, i) => {
      const station = METRO_STATIONS[Math.floor(Math.random() * METRO_STATIONS.length)];
      return {
        id: i,
        lat: station.lat + (Math.random() - 0.5) * 0.002,
        lng: station.lng + (Math.random() - 0.5) * 0.002,
        color: COL_WALK,
        state: 'TRANSIT_METRO',
        targetVenueLoc: null,
        targetMetroLoc: { lat: station.lat, lng: station.lng },
        speed: SPEED_WALK,
        boredomTimer: Math.random() * 50 // Aleatoriedad inicial
      };
    });

    setUsers(newUsers);
    initialized.current = true;
  }, [venues, userCount]); // Se ejecuta al cambiar userCount

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

      const phase3_Exodus = currentHour >= 27;

      setUsers((prevUsers: SimulatedUser[]) => {
        const newCounts: Record<string, number> = {};
        venues.forEach(v => newCounts[v.id] = 0);

        const nextUsers = prevUsers.map((u: SimulatedUser) => {
          let { state, lat, lng, targetVenueLoc, color, speed, boredomTimer } = u;
          
          // 1. SPAWN (METRO)
          if (state === 'TRANSIT_METRO') {
             if (!phase3_Exodus && Math.random() > 0.02) { 
               // Buscar venue
               let targetVenue = venues[Math.floor(Math.random() * venues.length)];
               if (targetVenue && targetVenue.location) {
                 const loc = targetVenue.location;
                 targetVenueLoc = { lat: loc._lat, lng: loc._long };
                 state = 'WALKING_TO_VENUE';
               }
             }
          }

          // 2. WALKING
          if (state === 'WALKING_TO_VENUE' && targetVenueLoc) {
            const dist = getDist([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
            color = COL_WALK; 
            // Radio de entrada un poco más amplio para que no se apelotonen tanto
            if (dist < 30) { 
              state = 'PARTYING';
              boredomTimer = 0; 
            }
          }

          // 3. PARTYING (Aquí está la clave del movimiento)
          if (state === 'PARTYING') {
            color = COL_PARTY;
            speed = SPEED_STATIONARY;
            boredomTimer += 1;

            if (phase3_Exodus) {
               if (Math.random() > 0.92) state = 'RETURNING_METRO';
            }
            // LOGICA BAR HOPPING AGRESIVA
            // Si llevan más de 40 ticks, tienen un 5% de chance CADA frame de irse
            // Esto asegura mucho más movimiento entre venues
            else if (boredomTimer > 40 && Math.random() > 0.95) {
               const nextVenue = venues[Math.floor(Math.random() * venues.length)];
               if (nextVenue && nextVenue.location) {
                  const loc = nextVenue.location;
                  targetVenueLoc = { lat: loc._lat, lng: loc._long };
                  state = 'WALKING_TO_VENUE';
                  // Pequeño empujón para salir del radio de atracción
                  lat += (Math.random() - 0.5) * 0.001; 
                  lng += (Math.random() - 0.5) * 0.001;
               }
            }
          }

          // 4. RETURNING
          if (state === 'RETURNING_METRO' && u.targetMetroLoc) {
             targetVenueLoc = u.targetMetroLoc;
             color = COL_WALK;
             speed = SPEED_WALK;
             const dist = getDist([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
             if (dist < 20) state = 'TRANSIT_METRO';
          }

          // PHYSICS
          if (targetVenueLoc && state !== 'TRANSIT_METRO') {
             const bearing = turf.bearing([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
             // Menos jitter para que se vean líneas más definidas de movimiento
             const jitter = (Math.random() - 0.5) * 5; 
             const distStep = (speed / 3600);
             const dest = turf.destination([lng, lat], distStep, bearing + jitter);
             [lng, lat] = dest.geometry.coordinates;
          }

          // DENSITY
          if (state === 'PARTYING' && targetVenueLoc) {
             // Método rápido por proximidad
             for (const v of venues) {
                 if (v.location && 
                     Math.abs(v.location._lat - lat) < 0.0005 && 
                     Math.abs(v.location._long - lng) < 0.0005) {
                     newCounts[v.id] = (newCounts[v.id] || 0) + 1;
                     break;
                 }
             }
          }
          return { ...u, lat, lng, state, targetVenueLoc, color, speed, boredomTimer };
        });

        setVenueCounts(newCounts);
        return nextUsers;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [venues, userCount]); // Reacciona a userCount

  return { users, venueCounts, clock };
};
