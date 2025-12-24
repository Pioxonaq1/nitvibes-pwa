import { useRef, useEffect } from 'react';

export function useSimulation(count: number, venues: any[], currentZoom: number) {
  const users = useRef<any[]>([]);

  useEffect(() => {
    // Inicialización de 1000 usuarios cerca de las venues
    if (venues.length > 0 && users.current.length === 0) {
      users.current = Array.from({ length: 1000 }).map((_, i) => {
        const venue = venues[i % venues.length];
        return {
          coords: [
            venue.lon + (Math.random() - 0.5) * 0.01,
            venue.lat + (Math.random() - 0.5) * 0.01
          ],
          targetVenue: venue,
          lastUpdate: Date.now()
        };
      });
    }
  }, [venues, count]);

  const updatePositions = () => {
    if (users.current.length === 0 || venues.length === 0) return { type: 'FeatureCollection', features: [] };

    // Lógica de 1 Píxel por segundo
    // En Mapbox, a zoom 18, 1 píxel son aprox 0.000005 grados de longitud
    const baseSpeed = 0.000005; 
    const zoomFactor = Math.pow(2, currentZoom - 18);
    const finalSpeed = baseSpeed * zoomFactor;

    const features = users.current.map((u) => {
      const dx = u.targetVenue.lon - u.coords[0];
      const dy = u.targetVenue.lat - u.coords[1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.0001) {
        // Al llegar, merodeo suave y cambio de destino
        u.coords[0] += (Math.random() - 0.5) * 0.000002 * zoomFactor;
        u.coords[1] += (Math.random() - 0.5) * 0.000002 * zoomFactor;
        if (Math.random() > 0.995) {
          u.targetVenue = venues[Math.floor(Math.random() * venues.length)];
        }
      } else {
        // Movimiento lineal por la "calle" (sin jitter lateral para no invadir aceras/bloques)
        u.coords[0] += (dx / dist) * finalSpeed;
        u.coords[1] += (dy / dist) * finalSpeed;
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