import { useRef, useEffect } from 'react';

export function useSimulation(count: number, venues: any[]) {
  const users = useRef<any[]>([]);

  useEffect(() => {
    if (venues.length > 0 && users.current.length === 0) {
      // Repartimos los 2500 usuarios en grupos iniciales según tu lógica [cite: 2025-12-23]
      users.current = Array.from({ length: count }).map((_, i) => {
        const venue = venues[i % venues.length]; // Asignar a una venue cercana inicialmente
        
        // Determinar zona inicial aleatoria para diversificar
        const rand = Math.random();
        let offset = 0.0001; // 10m aprox
        if (rand > 0.7) offset = 0.0008; // 100m aprox
        if (rand > 0.9) offset = 0.005;  // Dispersos

        return {
          coords: [
            venue.lon + (Math.random() - 0.5) * offset,
            venue.lat + (Math.random() - 0.5) * offset
          ],
          homeVenue: venue,
          targetVenue: venue,
          state: 'idle', // 'approaching', 'leaving', 'at_venue'
          speed: 0.000008 + Math.random() * 0.000015,
          jitter: 0.00002
        };
      });
    }
  }, [venues, count]);

  const updatePositions = () => {
    if (users.current.length === 0 || venues.length === 0) return { type: 'FeatureCollection', features: [] };

    const features = users.current.map((u) => {
      // Calcular distancia a su venue objetivo [cite: 2025-12-23]
      const dx = u.targetVenue.lon - u.coords[0];
      const dy = u.targetVenue.lat - u.coords[1];
      const dist = Math.sqrt(dx * dx + dy * dy);

      // LÓGICA DE COMPORTAMIENTO POR RADIOS [cite: 2025-12-23]
      
      // 1. A menos de 10 metros (0.0001 aprox): MERODEO / DENTRO
      if (dist < 0.0001) {
        // Movimiento muy lento de "espera" en la puerta
        u.coords[0] += (Math.random() - 0.5) * 0.00002;
        u.coords[1] += (Math.random() - 0.5) * 0.00002;
        
        // Probabilidad de decidir irse a otra venue tras un rato
        if (Math.random() > 0.998) {
          u.targetVenue = venues[Math.floor(Math.random() * venues.length)];
        }
      } 
      // 2. Entre 50 y 100 metros: TRÁNSITO POR ACERA
      else if (dist < 0.001) {
        // Movimiento dirigido con "jitter" para simular acera, no centro de calle
        const sideOffset = (Math.random() - 0.5) * 0.00005; 
        u.coords[0] += (dx / dist) * u.speed + sideOffset;
        u.coords[1] += (dy / dist) * u.speed + sideOffset;
      }
      // 3. Más de 100 metros: DISPERSIÓN O ATRACCIÓN HACIA VENUE
      else {
        // Si está muy lejos, se mueve hacia la venue más cercana (Gravedad)
        u.coords[0] += (dx / dist) * u.speed;
        u.coords[1] += (dy / dist) * u.speed;
      }

      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [u.coords[0], u.coords[1]] },
        properties: { 
          atVenue: dist < 0.0001,
          nearVenue: dist < 0.001
        }
      };
    });

    return { type: 'FeatureCollection', features };
  };

  return { updatePositions };
}