import { useRef, useEffect } from 'react';

export function useSimulation(count: number, venues: any[]) {
  const users = useRef<any[]>([]);

  useEffect(() => {
    // Inicializamos solo si hay venues reales y no hay usuarios creados [cite: 2025-12-18]
    if (venues.length > 0 && users.current.length === 0) {
      users.current = Array.from({ length: count }).map(() => ({
        coords: [2.1734 + (Math.random() - 0.5) * 0.04, 41.3851 + (Math.random() - 0.5) * 0.04],
        target: venues[Math.floor(Math.random() * venues.length)],
        speed: 0.00001 + Math.random() * 0.00004,
        groupId: Math.floor(Math.random() * 1000) // Lógica de grupos [cite: 2025-12-19]
      }));
    }
  }, [venues, count]);

  const updatePositions = () => {
    if (users.current.length === 0) return { type: 'FeatureCollection', features: [] };

    const features = users.current.map((u) => {
      // Movimiento hacia el destino (lat/lon de Firebase) [cite: 2025-12-18]
      u.coords[0] += (u.target.lon - u.coords[0]) * u.speed;
      u.coords[1] += (u.target.lat - u.coords[1]) * u.speed;

      // Al llegar, cambian a otra venue aleatoria [cite: 2025-12-19]
      if (Math.abs(u.coords[0] - u.target.lon) < 0.0001) {
        u.target = venues[Math.floor(Math.random() * venues.length)];
      }

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [u.coords[0], u.coords[1]] },
        properties: { groupId: u.groupId }
      };
    });

    return { type: 'FeatureCollection', features };
  };

  return { updatePositions };
}