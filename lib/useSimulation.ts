import { useRef, useEffect } from 'react';

export function useSimulation(count: number, venues: any[], currentZoom: number) {
  const users = useRef<any[]>([]);

  useEffect(() => {
    if (venues.length > 0 && users.current.length === 0) {
      users.current = Array.from({ length: count }).map((_, i) => {
        const venue = venues[i % venues.length];
        return {
          coords: [
            venue.lon + (Math.random() - 0.5) * 0.005,
            venue.lat + (Math.random() - 0.5) * 0.005
          ],
          targetVenue: venue,
          jitter: 0.00002
        };
      });
    }
  }, [venues, count]);

  const updatePositions = () => {
    if (users.current.length === 0 || venues.length === 0) return { type: 'FeatureCollection', features: [] };

    // Referencia 1:1 en zoom 18 [cite: 2025-12-23]
    const zoomFactor = Math.pow(2, currentZoom - 18);

    const features = users.current.map((u) => {
      const dx = u.targetVenue.lon - u.coords[0];
      const dy = u.targetVenue.lat - u.coords[1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      let baseSpeed = 0;

      // Aplicación de las 3 velocidades memorizadas [cite: 2025-12-23]
      if (dist < 0.0018) {
        baseSpeed = 0.00001; // Peatón (4-6 km/h)
      } else if (dist < 0.0045) {
        baseSpeed = 0.000025; // Atracción (10 km/h)
      } else {
        baseSpeed = 0.00007; // Ciudad (30 km/h)
      }

      const finalSpeed = baseSpeed * zoomFactor;

      if (dist < 0.0001) {
        u.coords[0] += (Math.random() - 0.5) * 0.000005 * zoomFactor;
        u.coords[1] += (Math.random() - 0.5) * 0.000005 * zoomFactor;
        if (Math.random() > 0.998) u.targetVenue = venues[Math.floor(Math.random() * venues.length)];
      } else {
        const sideNoise = dist < 0.0018 ? (Math.random() - 0.5) * u.jitter * zoomFactor : 0;
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