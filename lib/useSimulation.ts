
import { useState, useEffect, useRef } from 'react';
import * as turf from '@turf/turf';
import { METRO_STATIONS } from './metroData';

export type SimulatedUser = {
  id: number;
  lat: number;
  lng: number;
  color: string;
  state: 'TRANSIT_METRO' | 'WALKING_TO_VENUE' | 'PARTYING' | 'RETURNING_METRO';
  targetVenueLoc: { lat: number, lng: number } | null;
  targetMetroLoc: { lat: number, lng: number } | null;
  speed: number;
};

type Venue = {
  id: string;
  location?: { _lat: number; _long: number };
  [key: string]: any;
};

const USER_COUNT = 2000; 
const REAL_CYCLE_MINUTES = 3; 
const SIM_START_HOUR = 18; 
const SIM_END_HOUR = 30;

const COL_WALK = "#F97316"; 
const COL_PARTY = "#00FFFF"; 
const SPEED_WALK = 60; 
const SPEED_STATIONARY = 0.5;

const getDist = (p1, p2) => turf.distance(turf.point(p1), turf.point(p2), { units: 'meters' });

const formatSimTime = (decimalHour) => {
  let h = Math.floor(decimalHour);
  const m = Math.floor((decimalHour - h) * 60);
  if (h >= 24) h -= 24;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const useSimulation = (venues) => {
  const [users, setUsers] = useState([]);
  const [clock, setClock] = useState("18:00");
  const [venueCounts, setVenueCounts] = useState({});
  
  const initialized = useRef(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (initialized.current || venues.length === 0) return;

    const initialUsers = Array.from({ length: USER_COUNT }).map((_, i) => {
      const station = METRO_STATIONS[Math.floor(Math.random() * METRO_STATIONS.length)];
      return {
        id: i,
        lat: station.lat + (Math.random() - 0.5) * 0.001,
        lng: station.lng + (Math.random() - 0.5) * 0.001,
        color: COL_WALK,
        state: 'TRANSIT_METRO',
        targetVenueLoc: null,
        targetMetroLoc: { lat: station.lat, lng: station.lng },
        speed: SPEED_WALK
      };
    });

    setUsers(initialUsers);
    initialized.current = true;
    startTimeRef.current = Date.now();
  }, [venues]);

  useEffect(() => {
    if (venues.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const totalCycleMs = REAL_CYCLE_MINUTES * 60 * 1000;
      const progress = (elapsed % totalCycleMs) / totalCycleMs;
      const currentHour = SIM_START_HOUR + (progress * (SIM_END_HOUR - SIM_START_HOUR));
      setClock(formatSimTime(currentHour));

      const isClosing = currentHour >= 28;

      setUsers(prevUsers => {
        const newCounts = {};
        venues.forEach(v => newCounts[v.id] = 0);

        const nextUsers = prevUsers.map(u => {
          let { state, lat, lng, targetVenueLoc, color, speed } = u;
          
          if (state === 'TRANSIT_METRO') {
             let minDist = Infinity;
             let bestVenue = null;
             venues.forEach(v => {
               if(!v.location) return;
               const d = getDist([lng, lat], [v.location._long, v.location._lat]);
               if(d < minDist) { minDist = d; bestVenue = v; }
             });

             if (bestVenue && bestVenue.location) {
               targetVenueLoc = { lat: bestVenue.location._lat, lng: bestVenue.location._long };
               state = 'WALKING_TO_VENUE';
             }
          }

          if (state === 'WALKING_TO_VENUE' && targetVenueLoc) {
            const dist = getDist([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
            color = COL_WALK;
            if (dist < 25) state = 'PARTYING';
          }

          if (state === 'PARTYING') {
            color = COL_PARTY;
            speed = SPEED_STATIONARY;
            if (isClosing && Math.random() > 0.95) state = 'RETURNING_METRO';
          }

          if (state === 'RETURNING_METRO' && u.targetMetroLoc) {
             targetVenueLoc = u.targetMetroLoc;
             color = COL_WALK;
             speed = SPEED_WALK;
             const distToMetro = getDist([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
             if (distToMetro < 20) state = 'TRANSIT_METRO';
          }

          if (targetVenueLoc && state !== 'TRANSIT_METRO') {
             const bearing = turf.bearing([lng, lat], [targetVenueLoc.lng, targetVenueLoc.lat]);
             const jitter = (Math.random() - 0.5) * 20; 
             const distStep = (speed / 3600);
             const dest = turf.destination([lng, lat], distStep, bearing + jitter);
             [lng, lat] = dest.geometry.coordinates;
          }

          if (state === 'PARTYING') {
             for (const v of venues) {
               if(v.location && getDist([lng, lat], [v.location._long, v.location._lat]) < 40) {
                 newCounts[v.id] = (newCounts[v.id] || 0) + 1;
                 break; 
               }
             }
          }
          return { ...u, lat, lng, state, targetVenueLoc, color, speed };
        });

        setVenueCounts(newCounts);
        return nextUsers;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [venues]);

  return { users, venueCounts, clock };
};
