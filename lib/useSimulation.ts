import { useRef, useEffect } from 'react';

export function useSimulation(count: number, venues: any[]) {
  const users = useRef<any[]>([]);

  useEffect(() => {
    if (venues.length > 0 && users.current.length === 0) {
      users.current = Array.from({ length: count }).map((_, i) => {
        const venue = venues[i % venues.length];
        const rand = Math.random();
        
        // Distribución inicial: algunos ya en la zona, otros viniendo de lejos [cite: 2025-12-23]
        let offset = 0.0001; // ~10m
        if (rand > 0.5) offset = 0.005; // ~500m (viniendo en coche/bus) [cite: 2025-12-23]

        return {
          coords: [
            venue.lon + (Math.random() - 0.5) * offset,
            venue.lat + (Math.random() - 0.5) * offset
          ],
          targetVenue: venue,
          jitter: 0.000025
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

      // DEFINICIÓN DE VELOCIDADES [cite: 2025-12-23]
      // 200 metros en grados es aprox 0.0018
      const isFar = dist > 0.0018; 
      
      // Velocidad: 50km/h si está lejos, a pie si está cerca [cite: 2025-12-23]
      const currentSpeed = isFar ? 0.00012 : 0.000015;

      if (dist < 0.00012) {
        // Radio 10m: Merodeo (Velocidad mínima) [cite: 2025-12-23]
        u.coords[0] += (Math.random() - 0.5) * 0.000015;
        u.coords[1] += (Math.random() - 0.5) * 0.000015;
        if (Math.random() > 0.999) u.targetVenue = venues[Math.floor(Math.random() * venues.length)];
      } 
      else {
        // Tránsito: Motorizado o Peatonal según distancia [cite: 2025-12-23]
        const sideNoise = isFar ? 0 : (Math.random() - 0.5) * u.jitter; // Sin jitter si va rápido
        u.coords[0] += (dx / dist) * currentSpeed + sideNoise;
        u.coords[1] += (dy / dist) * currentSpeed + sideNoise;
      }

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [u.coords[0], u.coords[1]] },
        properties: { fast: isFar }
      };
    });

    return { type: 'FeatureCollection', features };
  };

  return { updatePositions };
}