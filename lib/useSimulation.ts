import { useRef, useEffect } from 'react';

export function useSimulation(count: number, venues: any[]) {
  const users = useRef<any[]>([]);

  useEffect(() => {
    if (venues.length > 0 && users.current.length === 0) {
      users.current = Array.from({ length: count }).map(() => {
        // Seleccionamos una venue de inicio aleatoria [cite: 2025-12-18]
        const startVenue = venues[Math.floor(Math.random() * venues.length)];
        
        return {
          // Posición inicial con un pequeño desfase para no estar todos en el mismo punto [cite: 2025-12-23]
          coords: [
            startVenue.lon + (Math.random() - 0.5) * 0.005,
            startVenue.lat + (Math.random() - 0.5) * 0.005
          ],
          target: venues[Math.floor(Math.random() * venues.length)],
          speed: 0.000008 + Math.random() * 0.00002, // Velocidad de peatón real [cite: 2025-12-23]
          jitter: Math.random() * 0.00005, // Variación para simular veredas [cite: 2025-12-23]
          groupId: Math.floor(Math.random() * 500)
        };
      });
    }
  }, [venues, count]);

  const updatePositions = () => {
    if (users.current.length === 0 || venues.length === 0) return { type: 'FeatureCollection', features: [] };

    const features = users.current.map((u) => {
      // Movimiento con "jitter" para evitar líneas rectas artificiales y simular veredas [cite: 2025-12-23]
      const noiseX = (Math.random() - 0.5) * u.jitter;
      const noiseY = (Math.random() - 0.5) * u.jitter;

      u.coords[0] += (u.target.lon - u.coords[0]) * u.speed + noiseX;
      u.coords[1] += (u.target.lat - u.coords[1]) * u.speed + noiseY;

      // Si llegan a la venue (umbral de 15 metros aprox) [cite: 2025-12-19, 2025-12-23]
      if (Math.abs(u.coords[0] - u.target.lon) < 0.00015 && Math.abs(u.coords[1] - u.target.lat) < 0.00015) {
        // Un 80% de probabilidad de ir a otra venue, 20% de quedarse merodeando [cite: 2025-12-23]
        if (Math.random() > 0.2) {
          u.target = venues[Math.floor(Math.random() * venues.length)];
        }
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