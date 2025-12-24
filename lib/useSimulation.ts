import { useRef, useEffect } from 'react';

// Definición de tipos para nuestros agentes
type Agent = {
  id: number;
  coords: [number, number];
  targetVenue: any;
  type: 'pedestrian' | 'vehicle';
  speedKmh: number; // Velocidad real para calcular el zoom
};

export function useSimulation(count: number, venues: any[], currentZoom: number) {
  const users = useRef<Agent[]>([]);

  useEffect(() => {
    if (venues.length > 0 && users.current.length === 0) {
      users.current = Array.from({ length: count }).map((_, i) => {
        const venue = venues[i % venues.length];
        const isVehicle = Math.random() > 0.7; // 30% son vehículos
        return {
          id: i,
          coords: [
            venue.lon + (Math.random() - 0.5) * 0.015,
            venue.lat + (Math.random() - 0.5) * 0.015
          ],
          targetVenue: venue,
          type: isVehicle ? 'vehicle' : 'pedestrian',
          speedKmh: isVehicle ? 30 : 5 // Velocidad inicial
        };
      });
    }
  }, [venues, count]);

  const updatePositions = () => {
    if (users.current.length === 0 || venues.length === 0) return { type: 'FeatureCollection', features: [] };

    const features = users.current.map((u) => {
      const dx = u.targetVenue.lon - u.coords[0];
      const dy = u.targetVenue.lat - u.coords[1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      // --- Lógica de Velocidad Realista para probar UX ---
      let moveSpeed = 0; // Grados por frame

      if (u.type === 'pedestrian') {
        // Peatón: Constante ~5 km/h
        u.speedKmh = 5;
        moveSpeed = 0.000004; 
      } else {
        // Vehículo: Acelera en tramos largos, frena cerca del destino
        if (dist > 0.005) {
          u.speedKmh = 45; // Rápido (Zoom debe alejarse)
          moveSpeed = 0.00004; 
        } else if (dist > 0.002) {
          u.speedKmh = 20; // Medio
          moveSpeed = 0.00002;
        } else {
          u.speedKmh = 5; // Aparcando (Zoom debe acercarse)
          moveSpeed = 0.000005;
        }
      }

      // Movimiento
      if (dist < 0.0001) {
        // Llegó: Merodeo y cambio de destino
        if (Math.random() > 0.99) u.targetVenue = venues[Math.floor(Math.random() * venues.length)];
      } else {
        // Interpolación lineal hacia el destino
        u.coords[0] += (dx / dist) * moveSpeed;
        u.coords[1] += (dy / dist) * moveSpeed;
      }

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: u.coords },
        properties: {
          id: u.id,
          type: u.type,
          speed: u.speedKmh // Pasamos la velocidad al mapa para la lógica de zoom
        }
      };
    });

    return { type: 'FeatureCollection', features, rawUsers: users.current };
  };

  return { updatePositions };
}