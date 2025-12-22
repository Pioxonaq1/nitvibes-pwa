"use client";
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import * as turf from '@turf/turf';

interface Props {
  venueLat: number;
  venueLng: number;
}

export default function NearbyUsersCounter({ venueLat, venueLng }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Escuchar cambios en User Locations en tiempo real
    const unsubscribe = onSnapshot(collection(db, "User Locations"), (snapshot) => {
      let usersNear = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.Location && data["Is Online"]) {
           const uLat = data.Location.latitude || data.Location._lat;
           const uLng = data.Location.longitude || data.Location._long;
           
           // Calcular distancia
           const from = turf.point([uLng, uLat]);
           const to = turf.point([venueLng, venueLat]);
           const distance = turf.distance(from, to, { units: 'kilometers' });

           // Radio de 1 km
           if (distance <= 1) {
             usersNear++;
           }
        }
      });
      setCount(usersNear);
    });

    return () => unsubscribe();
  }, [venueLat, venueLng]);

  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 text-center">
      <h3 className="text-gray-500 text-xs uppercase tracking-widest mb-2">Vibers en zona (1km)</h3>
      <p className="text-5xl font-black text-white">{count}</p>
    </div>
  );
}
