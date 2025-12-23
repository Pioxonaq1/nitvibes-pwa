import { useRef, useEffect } from 'react';

export function useSimulation(count: number, venues: any[]) {
  const users = useRef<any[]>([]);

  useEffect(() => {
    if (venues.length > 0 && users.current.length === 0) {
      users.current = Array.from({ length: count }).map(() => ({
        coords: [2.1734 + (Math.random() - 0.5) * 0.02, 41.3851 + (Math.random() - 0.5) * 0.02],
        target: venues[Math.floor(Math.random() * venues.length)].coords,
        speed: 0.000015 + Math.random() * 0.00003,
        groupId: Math.floor(Math.random() * (count / 4)), // Grupos iniciales aleatorios [cite: 2025-12-19]
        offset: [(Math.random() - 0.5) * 0.0001, (Math.random() - 0.5) * 0.0001]
      }));
    }
  }, [venues, count]);

  const updatePositions = () => {
    if (users.current.length === 0) return { type: 'FeatureCollection', features: [] };

    const features = users.current.map((u) => {
      // Cambio aleatorio de grupo (acoplamiento/desacoplamiento) [cite: 2025-12-19]
      if (Math.random() > 0.995) u.groupId = Math.floor(Math.random() * 1250);

      // Movimiento hacia el target con ligera deriva de grupo
      u.coords[0] += (u.target[0] - u.coords[0]) * u.speed + u.offset[0] * 0.1;
      u.coords[1] += (u.target[1] - u.coords[1]) * u.speed + u.offset[1] * 0.1;

      // Lógica de llegada y cambio de venue [cite: 2025-12-19]
      if (Math.abs(u.coords[0] - u.target[0]) < 0.0001) {
        u.target = venues[Math.floor(Math.random() * venues.length)].coords;
      }

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [u.coords[0], u.coords[1]] },
        properties: { group: u.groupId }
      };
    });

    return { type: 'FeatureCollection', features };
  };

  return { updatePositions };
}