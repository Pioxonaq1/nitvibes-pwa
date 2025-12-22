"use client";

import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { db } from '@/lib/firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

// Token público (Debería ir en .env, pero lo ponemos aquí para asegurar que te funcione YA)
mapboxgl.accessToken = 'pk.eyJ1Ijoibml0dmliZXMiLCJhIjoiY200eHl2aW41MDJvNzJrc255dG50eXlmZiJ9.wKqX-B6YI-k4-x1iT-Zl8g'; 

export default function MapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng] = useState(2.1734); // Barcelona
  const [lat] = useState(41.3851);
  const [zoom] = useState(12);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false
    });

    map.current.on('load', async () => {
        // 1. CARGAR VENUES (Negocios)
        try {
            const venuesSnapshot = await getDocs(collection(db, "Venues"));
            venuesSnapshot.forEach((doc) => {
                const venue = doc.data();
                if (venue.location) {
                    // Normalizar coords (pueden venir como _lat o latitude)
                    const vLat = venue.location.latitude || venue.location._lat;
                    const vLng = venue.location.longitude || venue.location._long;

                    const el = document.createElement('div');
                    el.className = 'venue-marker';
                    el.style.backgroundColor = venue.isOpen ? '#22c55e' : '#ef4444';
                    el.style.width = '12px';
                    el.style.height = '12px';
                    el.style.borderRadius = '50%';
                    el.style.border = '2px solid white';
                    el.style.boxShadow = `0 0 10px ${venue.isOpen ? '#22c55e' : '#ef4444'}`;
                    el.style.cursor = 'pointer';

                    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                        `<div style="color:black; padding:5px;"><strong>${venue.name}</strong></div>`
                    );

                    new mapboxgl.Marker(el)
                        .setLngLat([vLng, vLat])
                        .setPopup(popup)
                        .addTo(map.current!);
                }
            });
        } catch (e) {
            console.error("Error loading venues:", e);
        }

        // 2. CARGAR USER LOCATIONS (Tiempo Real)
        onSnapshot(collection(db, "User Locations"), (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                const userData = change.doc.data();
                if (userData.Location && userData["Is Online"]) {
                     const uLat = userData.Location.latitude || userData.Location._lat;
                     const uLng = userData.Location.longitude || userData.Location._long;

                     if (change.type === "added") {
                         const el = document.createElement('div');
                         el.style.width = '6px';
                         el.style.height = '6px';
                         el.style.backgroundColor = '#3b82f6';
                         el.style.borderRadius = '50%';
                         
                         new mapboxgl.Marker(el)
                             .setLngLat([uLng, uLat])
                             .addTo(map.current!);
                     }
                }
            });
        });
    });
  }, [lng, lat, zoom]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
