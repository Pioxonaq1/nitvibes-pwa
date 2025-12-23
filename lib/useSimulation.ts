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

    // Factor de escala basado en zoom (Referencia 1:1 en zoom 18)
    const zoomFactor = Math.pow(2, currentZoom - 18);

    const features = users.current.map((u) => {
      const dx = u.targetVenue.lon - u.coords[0];
      const dy = u.targetVenue.lat - u.coords[1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      let baseSpeed = 0;

      // LÓGICA DE RADIOS Y VELOCIDADES (En zoom max)
      // 1. < 200m (aprox 0.0018 grados): Peatón (4-6 km/h) -> ~0.00001
      if (dist < 0.0018) {
        baseSpeed = 0.00001;
      } 
      // 2. 200m a 500m (aprox 0.0045 grados): Aproximación (10 km/h) -> ~0.000025
      else if (dist < 0.0045) {
        baseSpeed = 0.000025;
      }
      // 3. > 500m: Tráfico ciudad (30 km/h) -> ~0.00007
      else {
        baseSpeed = 0.00007;
      }

      // Aplicamos el freno por Zoom Out para que no "vuelen" al alejarse
      const finalSpeed = baseSpeed * zoomFactor;

      // Movimiento con Gravedad hacia la Venue
      if (dist < 0.0001) {
        // Merodeo final a 10m
        u.coords[0] += (Math.random() - 0.5) * 0.000005 * zoomFactor;
        u.coords[1] += (Math.random() - 0.5) * 0.000005 * zoomFactor;
        if (Math.random() > 0.998) u.targetVenue = venues[Math.floor(Math.random() * venues.length)];
      } else {
        // Atracción gravitatoria + Jitter si es peatón
        const sideNoise = dist < 0.0018 ? (Math.random() - 0.5) * u.jitter * zoomFactor : 0;
        u.coords[0] += (dx / dist) * finalSpeed + sideNoise;
        u.coords[1] += (dy / dist) * finalSpeed + sideNoise;
      }

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [u.coords[0], u.coords[1]] },
        properties: { isPedestrian: dist < 0.0018 }
      };
    });

    return { type: 'FeatureCollection', features };
  };

  return { updatePositions };
}