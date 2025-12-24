
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
  heatWeight: number; 
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

// COLORES (ACTUALIZADO: TODO CYAN)
const COL_CYAN = "#00FFFF"; 

// Velocidades
const SPEED_WALK = 65; 
const SPEED_STATIONARY = 0.5; 

// --- HELPERS ---
const getDist = (p1: number[], p2: number[]): number => {
  return turf.distance(turf.point(p1), turf.point(p2), { units: 'meters' });
};

const getRandomTargetAround = (lat: number, lng: number, radiusMeters: number) => {
  const randomBear = Math.random() * 360;
  const randomDist = Math.random() * (radiusMeters / 1000); 
  const dest = turf.destination([lng, lat], randomDist, randomBear);
  return { lat: dest.geometry.coordinates[1], lng: dest.geometry.coordinates[0] };
};

const formatSimTime = (decimalHour: number): string => {
  let h = Math.floor(decimalHour);
  const m = Math.floor((decimalHour - h) * 60);
  if (h >= 24) h -= 24;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// --- HOOK ---
export const useSimulation = (venues: Venue[], userCount: number) => {
  const [users, setUsers] = useState<SimulatedUser[]>([]);
  const [clock, setClock] = useState<string>("18:00");
  const [venueCounts, setVenueCounts] = useState<Record<string, number>>({});
  
  const initialized = useRef<boolean>(false);
  const startTimeRef = useRef<number>(Date.now());

  // REINICIAR
  useEffect(() => {
    if (venues.length === 0) return;

    const newUsers: SimulatedUser[] = Array.from({ length: userCount }).map((_, i) => {
      const station = METRO_STATIONS[Math.floor(Math.random() * METRO_STATIONS.length)];
      const spawn = getRandomTargetAround(station.lat, station.lng, 80); 
      
      return {
        id: i,
        lat: spawn.lat,
        lng: spawn.lng,
        color: COL_CYAN, // SIEMPRE CYAN
        state: 'TRANSIT_METRO',
        targetVenueLoc: null,
        targetMetroLoc: { lat: station.lat, lng: station.lng },
        speed: SPEED_WALK,
        boredomTimer: Math.random() * 50,
        heatWeight: 0 
      };
    });

    setUsers(newUsers);
    initialized.current = true;
  }, [venues, userCount]); 

  // BUCLE
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
          let { state, lat, lng, targetVenueLoc, speed, boredomTimer, heatWeight } = u;
          
          // HEATMAP VISIBILITY
          let isNearAnyVenue = false;
          if (state !== 'TRANSIT_METRO' && targetVenueLoc) {
             const dist = getDist([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
             if (dist < 200) isNearAnyVenue = true;
          }
          heatWeight = isNearAnyVenue ? 1 : 0; 

          // STATES
          if (state === 'TRANSIT_METRO') {
             if (!phase3_Exodus && Math.random() > 0.02) { 
               let targetVenue = venues[Math.floor(Math.random() * venues.length)];
               if (targetVenue && targetVenue.location) {
                 const loc = targetVenue.location;
                 const noisyTarget = getRandomTargetAround(loc._lat, loc._long, 60);
                 targetVenueLoc = { lat: noisyTarget.lat, lng: noisyTarget.lng };
                 state = 'WALKING_TO_VENUE';
               }
             }
          }

          if (state === 'WALKING_TO_VENUE' && targetVenueLoc) {
            const dist = getDist([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
            if (dist < 20) { 
              state = 'PARTYING';
              boredomTimer = 0; 
            }
          }

          if (state === 'PARTYING') {
            speed = SPEED_STATIONARY;
            boredomTimer += 1;

            if (phase3_Exodus) {
               if (Math.random() > 0.92) state = 'RETURNING_METRO';
            }
            else if (boredomTimer > 40 && Math.random() > 0.96) {
               const nextVenue = venues[Math.floor(Math.random() * venues.length)];
               if (nextVenue && nextVenue.location) {
                  const loc = nextVenue.location;
                  const noisyTarget = getRandomTargetAround(loc._lat, loc._long, 60);
                  targetVenueLoc = { lat: noisyTarget.lat, lng: noisyTarget.lng };
                  state = 'WALKING_TO_VENUE';
               }
            }
          }

          if (state === 'RETURNING_METRO' && u.targetMetroLoc) {
             targetVenueLoc = u.targetMetroLoc;
             speed = SPEED_WALK;
             const dist = getDist([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
             if (dist < 20) state = 'TRANSIT_METRO';
          }

          if (targetVenueLoc && state !== 'TRANSIT_METRO') {
             const bearing = turf.bearing([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
             const jitter = (Math.random() - 0.5) * 40; 
             const distStep = (speed / 3600);
             const dest = turf.destination([lng, lat], distStep, bearing + jitter);
             [lng, lat] = dest.geometry.coordinates;
          }

          if (state === 'PARTYING' && targetVenueLoc) {
             for (const v of venues) {
                 if (v.location && 
                     Math.abs(v.location._lat - lat) < 0.0005 && 
                     Math.abs(v.location._long - lng) < 0.0005) {
                     newCounts[v.id] = (newCounts[v.id] || 0) + 1;
                     break;
                 }
             }
          }
          // SIEMPRE DEVUELVE COLOR CYAN
          return { ...u, lat, lng, state, targetVenueLoc, color: COL_CYAN, speed, boredomTimer, heatWeight };
        });

        setVenueCounts(newCounts);
        return nextUsers;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [venues, userCount]);

  return { users, venueCounts, clock };
};
