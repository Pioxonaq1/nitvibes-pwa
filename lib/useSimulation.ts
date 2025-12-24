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
          jitter: 0.00003 // Ruido para simular el ancho de la acera [cite: 2025-12-23]
        };
      });
    }
  }, [venues, count]);

  const updatePositions = () => {
    if (users.current.length === 0 || venues.length === 0) {
      return { type: 'FeatureCollection', features: [] };
    }

    // Factor de escala: ralentiza el movimiento al hacer zoom out [cite: 2025-12-23]
    const zoomFactor = Math.pow(2, currentZoom - 18);

    const features = users.current.map((u) => {
      const dx = u.targetVenue.lon - u.coords[0];
      const dy = u.targetVenue.lat - u.coords[1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      let baseSpeed = 0;
      let isVehicle = false;

      // Determinación de velocidad según radio de la venue [cite: 2025-12-23]
      if (dist < 0.0018) {
        // Peatón: 4-6 km/h [cite: 2025-12-23]
        baseSpeed = 0.00001;
      } else if (dist < 0.0045) {
        // Aproximación: 10 km/h [cite: 2025-12-23]
        baseSpeed = 0.000025;
      } else {
        // Ciudad: 30 km/h [cite: 2025-12-23]
        baseSpeed = 0.00007;
        isVehicle = true; // Por la calle, sin jitter [cite: 2025-12-23]
      }

      const finalSpeed = baseSpeed * zoomFactor;

      if (dist < 0.0001) {
        // Merodeo en la puerta (Radio 10m) [cite: 2025-12-23]
        u.coords[0] += (Math.random() - 0.5) * 0.000005 * zoomFactor;
        u.coords[1] += (Math.random() - 0.5) * 0.000005 * zoomFactor;
        // Salto gravitatorio a otra venue aleatoria [cite: 2025-12-23]
        if (Math.random() > 0.998) {
          u.targetVenue = venues[Math.floor(Math.random() * venues.length)];
        }
      } else {
        // Si es vehículo va por el eje (calle). Si es peatón, usa jitter (acera) [cite: 2025-12-23]
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