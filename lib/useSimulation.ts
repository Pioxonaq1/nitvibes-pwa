import { useState, useEffect, useRef } from 'react';
import * as turf from '@turf/turf';

// --- TIPOS ---
export type SimulatedUser = {
  id: number;
  lat: number;
  lng: number;
  color: string;
  speed: number;
  
  // Lógica de Estado
  state: 'DRIVING' | 'WALKING' | 'PARTYING'; // PARTYING = Quieto en la venue
  groupId: number; // Para moverse en grupos
  originType: 'OUTSKIRTS' | 'CITY_CROSS' | 'LOCAL'; // 50% fuera, 30% cruce, 20% local
  
  // Navegación
  currentRouteIndex: number;
  progressOnRoute: number; 
  direction: number;
  targetVenueId: string | null;
  partyTimer: number; // Tiempo que lleva de fiesta
};

type Venue = {
  id: string;
  location?: { _lat: number; _long: number };
  [key: string]: any;
};

// --- CONFIGURACIÓN ---
const USER_COUNT = 2000; // [Subimos a 2000 usuarios]
const REAL_CYCLE_DURATION_MS = 3 * 60 * 1000; // 3 minutos reales
const SIM_START_HOUR = 18; // 18:00
const SIM_END_HOUR = 30;   // 06:00 del día siguiente (24 + 6)
const TOTAL_SIM_HOURS = SIM_END_HOUR - SIM_START_HOUR; // 12 horas simuladas

// Colores
const COLOR_NEAR = "#00FFFF"; // Cyan (< 200m)
const COLOR_FAR = "#F97316";  // Naranja (> 500m) [Cambio solicitado]
const COLOR_MID = "#00FFFF";  // Cyan también entre 200 y 500 (atracción)

// Velocidades (km/h)
const SPEED_CAR = 45;  
const SPEED_WALK = 5;     
const SPEED_PARTY = 0; // Quieto

// --- RED DE CALLES (CORREGIDA: Sin cruzar el mar) ---
const STREET_NETWORK = [
  [[2.123, 41.363], [2.150, 41.375], [2.185, 41.398], [2.210, 41.415]], // Gran Via
  [[2.100, 41.385], [2.145, 41.393], [2.170, 41.400], [2.220, 41.412]], // Diagonal
  [[2.145, 41.380], [2.165, 41.392], [2.190, 41.408]], // Aragó
  [[2.175, 41.374], [2.163, 41.375], [2.148, 41.374]], // Paral·lel
  [[2.185, 41.398], [2.195, 41.420], [2.200, 41.430]], // Meridiana
  // CORRECCIÓN PUERTO: Ahora va por Paseo de Colón (Tierra) en vez de cruzar el agua
  [[2.175, 41.374], [2.182, 41.377], [2.190, 41.380], [2.195, 41.382]], 
  [[2.195, 41.385], [2.180, 41.400]], // Marina
  [[2.165, 41.385], [2.150, 41.405]]  // Balmes
];

const ROADS = STREET_NETWORK.map(coords => turf.lineString(coords));

// --- HELPERS ---
const getDistanceMeters = (from: number[], to: number[]) => {
  return turf.distance(turf.point(from), turf.point(to), { units: 'kilometers' }) * 1000;
};

// Formatear hora simulada (ej: 25.5 -> "01:30")
const formatSimTime = (decimalHour: number) => {
  let h = Math.floor(decimalHour);
  const m = Math.floor((decimalHour - h) * 60);
  if (h >= 24) h -= 24;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const useSimulation = (venues: Venue[]) => {
  const [users, setUsers] = useState<SimulatedUser[]>([]);
  const [venueCounts, setVenueCounts] = useState<Record<string, number>>({});
  const [clock, setClock] = useState("18:00"); // Reloj para la UI
  
  const initialized = useRef(false);
  const startTimeRef = useRef(Date.now());

  // 1. INICIALIZAR USUARIOS CON LÓGICA DE GRUPOS Y ORIGEN
  useEffect(() => {
    if (initialized.current || venues.length === 0) return;

    const initialUsers: SimulatedUser[] = [];
    
    // Creamos usuarios en grupos para simular "duos, trios, grupos de 8"
    let userIndex = 0;
    while (userIndex < USER_COUNT) {
      // Decidir tamaño del grupo (1, 2, 3 o 8)
      const r = Math.random();
      let groupSize = 1;
      if (r > 0.6) groupSize = 2;
      if (r > 0.8) groupSize = 3;
      if (r > 0.95) groupSize = 8;
      
      // Ajustar si nos pasamos del total
      if (userIndex + groupSize > USER_COUNT) groupSize = USER_COUNT - userIndex;

      // Asignar Origen y Ruta compartida para el grupo
      const groupId = Math.floor(Math.random() * 10000);
      const originRand = Math.random();
      let type: SimulatedUser['originType'] = 'LOCAL';
      let routeIndex = Math.floor(Math.random() * ROADS.length);
      let progress = Math.random();

      // 50% Outskirts (vienen de fuera -> extremos de las calles)
      if (originRand < 0.5) {
        type = 'OUTSKIRTS';
        progress = Math.random() > 0.5 ? 0.05 : 0.95; // Extremos
      } 
      // 30% Cross City (Este-Oeste)
      else if (originRand < 0.8) {
        type = 'CITY_CROSS';
        // Gran Via (0) o Diagonal (1) son ejes transversales
        routeIndex = Math.random() > 0.5 ? 0 : 1; 
      }

      // Crear los miembros del grupo
      for (let i = 0; i < groupSize; i++) {
        const road = ROADS[routeIndex];
        const roadLen = turf.length(road);
        
        // Pequeña variación para que no vayan pegados pixel-perfect
        const localProgress = Math.max(0, Math.min(1, progress + (Math.random() * 0.01)));
        const startPos = turf.along(road, localProgress * roadLen);
        const [lng, lat] = startPos.geometry.coordinates;

        initialUsers.push({
          id: userIndex + i,
          lat,
          lng,
          color: COLOR_FAR,
          speed: SPEED_CAR,
          state: 'DRIVING',
          currentRouteIndex: routeIndex,
          progressOnRoute: localProgress,
          direction: Math.random() > 0.5 ? 1 : -1,
          targetVenueId: null,
          groupId: groupId,
          originType: type,
          partyTimer: 0
        });
      }
      userIndex += groupSize;
    }

    setUsers(initialUsers);
    initialized.current = true;
    startTimeRef.current = Date.now();
  }, [venues]);

  // 2. BUCLE DE SIMULACIÓN Y TIEMPO
  useEffect(() => {
    if (venues.length === 0) return;

    const interval = setInterval(() => {
      // A. CALCULAR HORA SIMULADA
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      // Ciclo de 3 minutos
      const cycleProgress = (elapsed % REAL_CYCLE_DURATION_MS) / REAL_CYCLE_DURATION_MS;
      const currentSimHourDecimal = SIM_START_HOUR + (cycleProgress * TOTAL_SIM_HOURS);
      
      // Actualizar Reloj UI
      setClock(formatSimTime(currentSimHourDecimal));

      // Determinar FASE GLOBAL según la hora
      // Fases: WARMUP (18-23), PEAK (23-04), EXIT (04-06)
      const isPeakHour = currentSimHourDecimal >= 23 && currentSimHourDecimal < 28; // 23:00 a 04:00
      const isExitHour = currentSimHourDecimal >= 28; // 04:00 en adelante

      setUsers(currentUsers => {
        const newCounts: Record<string, number> = {};
        venues.forEach(v => newCounts[v.id] = 0);

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

          // --- CEREBRO INDIVIDUAL ---
          let nextState = user.state;
          let nextColor = user.color;
          let nextSpeed = user.speed;
          let nextPartyTimer = user.partyTimer;

          // 1. GESTIÓN DE COLORES Y ESTADOS SEGÚN DISTANCIA
          if (nearestDist < 500) {
            // Zona de atracción (Naranja o Cyan)
            nextColor = (nearestDist < 200) ? COLOR_NEAR : COLOR_MID;
          } else {
            nextColor = COLOR_FAR; // Naranja
          }

          // 2. COMPORTAMIENTO SEGÚN FASE DEL DÍA
          let attractionFactor = 1.0; 
          
          if (isExitHour) {
             // A las 4AM la gente se va -> Repulsión o ignorar venues
             attractionFactor = 0; 
             if (nextState === 'PARTYING') nextState = 'DRIVING'; // Se acabó la fiesta
          } else if (isPeakHour) {
             attractionFactor = 2.0; // Atracción gravitacional fuerte
          }

          // 3. TRANSICIONES DE ESTADO
          // Llegada a la Venue (< 10m) -> MODO FIESTA
          if (nearestDist < 20 && isPeakHour) { 
             // Nos quedamos quietos acumulando gente
             nextState = 'PARTYING';
             nextSpeed = SPEED_PARTY;
             nextColor = COLOR_NEAR; // Cyan intenso
             nextPartyTimer += 1;
             
             // Contamos para el heatmap
             if (nearestVenueId) newCounts[nearestVenueId] = (newCounts[nearestVenueId] || 0) + 1;

             // REGLA: Después de un rato de fiesta, moverse a otra venue
             // Simulación de "bar hopping" (aprox 20-30 segundos simulados)
             if (nextPartyTimer > 50) { 
               nextState = 'WALKING'; // Volvemos a andar
               nextPartyTimer = 0;
               // Truco: empujamos un poco al usuario para que salga del radio de 10m
               // y no se quede atrapado en el bucle
               nextSpeed = SPEED_WALK; 
             }
          } 
          // Zona de Aproximación (< 200m)
          else if (nearestDist < 200 && attractionFactor > 0) {
            nextState = 'WALKING';
            nextSpeed = SPEED_WALK;
          } 
          // Zona Lejana (> 200m)
          else {
            nextState = 'DRIVING';
            nextSpeed = SPEED_CAR;
          }

          // --- FÍSICA DE MOVIMIENTO ---
          let nextLat = user.lat;
          let nextLng = user.lng;
          let nextProgress = user.progressOnRoute;
          let nextDirection = user.direction;
          let nextRouteIndex = user.currentRouteIndex;

          if (nextState === 'PARTYING') {
            // Pequeño "jitter" o vibración para que no parezca una foto estática
            nextLat += (Math.random() - 0.5) * 0.00005;
            nextLng += (Math.random() - 0.5) * 0.00005;
          }
          else if (nextState === 'DRIVING') {
            const road = ROADS[user.currentRouteIndex];
            const roadLen = turf.length(road);
            const moveDistKm = (nextSpeed / 3600) * (1000 / 1000); // 1 segundo tick
            const progressDelta = moveDistKm / roadLen;
            
            // Si es hora de salida (4-6AM), forzamos dirección hacia extremos
            if (isExitHour) {
               // Lógica simple: alejarse del centro (aprox)
            }

            nextProgress += (progressDelta * nextDirection);

            // Rebote / Cambio calle
            if (nextProgress >= 1 || nextProgress <= 0) {
              nextDirection *= -1;
              nextProgress = Math.max(0, Math.min(1, nextProgress));
              // Cambio de calle aleatorio en cruces
              if (Math.random() > 0.7) {
                 nextRouteIndex = Math.floor(Math.random() * ROADS.length);
                 nextProgress = Math.random(); 
              }
            }

            const point = turf.along(ROADS[nextRouteIndex], nextProgress * turf.length(ROADS[nextRouteIndex]));
            [nextLng, nextLat] = point.geometry.coordinates;

          } 
          else if (nextState === 'WALKING' && nearestVenueLoc) {
            // Vector hacia la venue
            const bearing = turf.bearing([user.lng, user.lat], nearestVenueLoc);
            // Si es hora de irse, invertimos el vector (bearing + 180)
            const finalBearing = (isExitHour) ? bearing + 180 : bearing;
            
            const moveDistKm = (nextSpeed / 3600) * (1000 / 1000);
            const dest = turf.destination([user.lng, user.lat], moveDistKm, finalBearing);
            [nextLng, nextLat] = dest.geometry.coordinates;
          }

          return {
            ...user,
            lat: nextLat,
            lng: nextLng,
            color: nextColor,
            speed: nextSpeed,
            state: nextState,
            partyTimer: nextPartyTimer,
            currentRouteIndex: nextRouteIndex,
            progressOnRoute: nextProgress,
            direction: nextDirection
          };
        });

        setVenueCounts(newCounts);
      });
    }, 1000); // Actualización a 1 FPS para rendimiento con 2000 users

    return () => clearInterval(interval);
  }, [venues]);

  return { users, venueCounts, clock };
};

export const getDensityColor = (count: number) => {
  if (count > 50) return "#EAB308"; // Amarillo (>50 usuarios) - Según petición
  if (count >= 10) return "#22C55E";  // Verde (Empezando)
  if (count > 0) return "#22C55E";
  return "#808080"; // Gris
};