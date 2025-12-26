"use client";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Zap, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function MapboxMap() {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  useEffect(() => {
    if (map.current) return; 

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1734, 41.3851],
      zoom: 14,
      pitch: user?.role === 'viber' ? 0 : 60
    });

    map.current.on('load', () => {
      // CAPA VISITANTE: HORMIGUERO CYAN [cite: 2025-12-25]
      if (!user) {
        const agents = Array.from({ length: 150 }).map((_, i) => ({
          type: 'Feature',
          id: i,
          geometry: { type: 'Point', coordinates: [2.1734 + (Math.random()-0.5)*0.02, 41.3851 + (Math.random()-0.5)*0.02] }
        }));
        map.current?.addSource('agents', { type: 'geojson', data: { type: 'FeatureCollection', features: agents } as any });
        map.current?.addLayer({
          id: 'agents-layer', type: 'circle', source: 'agents',
          paint: { 'circle-radius': 2, 'circle-color': '#00ffff', 'circle-opacity': 0.6 }
        });
      }

      // CAPA VIBER: DATOS REALES (Sin simulador) [cite: 2025-12-25]
      if (user?.role === 'viber') {
        console.log("Capa Real Activa");
      }
    });
  }, [user]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* TRIGGER SIDE MENU [cite: 2025-12-25] */}
      {!user && (
        <button 
          onClick={() => setIsSideMenuOpen(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-pink-600 p-2 rounded-l-xl text-white shadow-xl animate-bounce"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* SIDE MENU [cite: 2025-12-25] */}
      <div className={`absolute top-0 right-0 h-full w-72 bg-zinc-950/95 backdrop-blur-xl transition-transform duration-500 z-[60] border-l border-white/10 ${isSideMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button onClick={() => setIsSideMenuOpen(false)} className="absolute top-6 left-[-40px] bg-zinc-950 p-2 rounded-l-lg border-l border-t border-b border-white/10"><ExternalLink size={20} className="rotate-180" /></button>
        <div className="p-6 h-full flex flex-col">
          <button onClick={() => router.push("/perfil")} className="w-full bg-pink-600 text-[10px] font-black uppercase italic p-4 rounded-xl mb-8 leading-tight">
            Accede o regístrate para beneficiarte de las promociones
          </button>
          <h3 className="text-xs font-black uppercase italic text-zinc-500 mb-4 tracking-widest">Últimas Flash Actions</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {[1,2,3].map(i => (
              <div key={i} className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 opacity-50">
                <div className="flex items-center gap-2 mb-2"><Zap size={14} className="text-pink-500" /><span className="text-[10px] font-black uppercase">Promo {i}</span></div>
                <div className="h-2 w-full bg-zinc-800 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
