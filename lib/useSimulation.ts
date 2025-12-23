import { useRef, useEffect } from 'react';

export function useSimulation(count: number, venues: any[], currentZoom: number) {
  const users = useRef<any[]>([]);

  useEffect(() => {
    if (venues.length > 0 && users.current.length === 0) {
      users.current = Array.from({ length: count }).map((_, i) => {
        const venue = venues[i % venues.length];
        return {
          coords: [
            venue.lon + (Math.random() - 0.5) * 0.001,
            venue.lat + (Math.random() - 0.5) * 0.001
          ],
          targetVenue: venue,
          jitter: 0.000025
        };
      });
    }
  }, [venues, count]);

  const updatePositions = () => {
    if (users.current.length === 0 || venues.length === 0) return { type: 'FeatureCollection', features: [] };

    // FACTOR DE ESCALA: Reducimos la velocidad drásticamente si el zoom es bajo (lejos) [cite: 2025-12-23]
    // A zoom 18-20 (1:1) el factor es 1. A zoom 12 el factor es ~0.1
    const zoomFactor = Math.pow(2, currentZoom - 18);

    const features = users.current.map((u) => {
      const dx = u.targetVenue.lon - u.coords[0];
      const dy = u.targetVenue.lat - u.coords[1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Regla de velocidad base: 50km/h (+200m) o a pie (-200m) [cite: 2025-12-23]
      const isFar = dist > 0.0018; 
      let baseSpeed = isFar ? 0.00012 : 0.000015;

      // Aplicamos el factor de zoom para que el desplazamiento sea relativo al plano [cite: 2025-12-23]
      const finalSpeed = baseSpeed * zoomFactor;

      if (dist < 0.00012) {
        // Merodeo en 10m [cite: 2025-12-23]
        u.coords[0] += (Math.random() - 0.5) * 0.00001 * zoomFactor;
        u.coords[1] += (Math.random() - 0.5) * 0.00001 * zoomFactor;
        if (Math.random() > 0.999) u.targetVenue = venues[Math.floor(Math.random() * venues.length)];
      } 
      else {
        const sideNoise = isFar ? 0 : (Math.random() - 0.5) * u.jitter * zoomFactor;
        u.coords[0] += (dx / dist) * finalSpeed + sideNoise;
        u.coords[1] += (dy / dist) * finalSpeed + sideNoise;
      }

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [u.coords[0], u.coords[1]] },
        properties: {}
      };
    });

    return { type: 'FeatureCollection', features };
  };

  return { updatePositions };
}