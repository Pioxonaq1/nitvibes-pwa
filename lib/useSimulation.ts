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
          jitter: 0.00003 // Ruido para la acera [cite: 2025-12-23]
        };
      });
    }
  }, [venues, count]);

  const updatePositions = () => {
    if (users.current.length === 0 || venues.length === 0) return { type: 'FeatureCollection', features: [] };

    const zoomFactor = Math.pow(2, currentZoom - 18); [cite: 2025-12-23]

    const features = users.current.map((u) => {
      const dx = u.targetVenue.lon - u.coords[0];
      const dy = u.targetVenue.lat - u.coords[1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      let baseSpeed = 0;
      let isVehicle = false;

      // Determinación de velocidad y tipo de transporte [cite: 2025-12-23]
      if (dist < 0.0018) {
        baseSpeed = 0.00001; // Peatón (4-6 km/h) [cite: 2025-12-23]
      } else if (dist < 0.0045) {
        baseSpeed = 0.000025; // Aproximación (10 km/h) [cite: 2025-12-23]
      } else {
        baseSpeed = 0.00007; // Ciudad (30 km/h) [cite: 2025-12-23]
        isVehicle = true; // Identificado como vehículo para circular por calle [cite: 2025-12-23]
      }

      const finalSpeed = baseSpeed * zoomFactor; [cite: 2025-12-23]

      if (dist < 0.0001) {
        // Merodeo en puerta (10m) [cite: 2025-12-23]
        u.coords[0] += (Math.random() - 0.5) * 0.000005 * zoomFactor;
        u.coords[1] += (Math.random() - 0.5) * 0.000005 * zoomFactor;
        if (Math.random() > 0.998) u.targetVenue = venues[Math.floor(Math.random() * venues.length)];
      } else {
        // LÓGICA CALLE vs ACERA [cite: 2025-12-23]
        // Si es vehículo, el ruido lateral es 0 (va por el centro de la calle) [cite: 2025-12-23]
        // Si es peatón, aplicamos el jitter para que transite por la acera [cite: 2025-12-23]
        const sideNoise = isVehicle ? 0 : (Math.random() - 0.5) * u.jitter * zoomFactor;
        
        u.coords[0] += (dx / dist) * finalSpeed + sideNoise;
        u.coords[1] += (dy / dist) * finalSpeed + sideNoise;
      }

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [u.coords[0], u.coords[1]] },
        properties: { type: isVehicle ? 'vehicle' : 'pedestrian' }
      };
    });

    return { type: 'FeatureCollection', features };
  };

  return { updatePositions };
}