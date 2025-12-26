"use client";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, Zap, ExternalLink, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

export default function MapboxMap() {
  const mapContainer = useRef<any>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [activePopUp, setActivePopUp] = useState<any>(null);
  const [recentFlashes, setRecentFlashes] = useState<any[]>([]);

  useEffect(() => {
    if (map.current) return; 

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [2.1734, 41.3851],
      zoom: 14,
      pitch: user ? 0 : 60
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

        // LISTENER DE FLASH ACTIONS PARA POP-UPS (Visitante) [cite: 2025-12-25]
        const q = query(
          collection(db, "venues"), 
          where("hasFlash", "==", true),
          limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const flashes: any[] = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === "modified" || change.type === "added") {
              const data = change.doc.data();
              // Disparar Pop-up de 3 a 5 segundos [cite: 2025-12-25]
              setActivePopUp({ id: change.doc.id, ...data });
              setTimeout(() => setActivePopUp(null), 4000); 
            }
          });
          snapshot.forEach(doc => flashes.push({ id: doc.id, ...doc.data() }));
          setRecentFlashes(flashes);
        });
        return () => unsubscribe();
      }
    });
  }, [user]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* POP-UP FLASH (EFÍMERO 3-5s) [cite: 2025-12-25] */}
      {activePopUp && !user && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 animate-in zoom-in slide-in-from-top duration-500">
          <div className="bg-pink-600 text-white px-6 py-3 rounded-full shadow-2xl shadow-pink-500/40 flex items-center gap-3 border border-white/20">
            <Zap size={18} className="fill-current animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase italic leading-none">{activePopUp.name}</span>
              <span className="text-sm font-black uppercase italic leading-none">{activePopUp.flashMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* TRIGGER SIDE MENU [cite: 2025-12-25] */}
      {!user && (
        <button 
          onClick={() => setIsSideMenuOpen(true)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-zinc-900 border-l border-t border-b border-white/10 p-2 rounded-l-xl text-pink-500 shadow-xl z-40 active:scale-95 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* SIDE MENU (Visitante) [cite: 2025-12-25] */}
      <div className={`absolute top-0 right-0 h-full w-80 bg-zinc-950/95 backdrop-blur-xl transition-transform duration-500 z-[60] border-l border-white/10 ${isSideMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-8 h-full flex flex-col">
          <button onClick={() => setIsSideMenuOpen(false)} className="mb-8 text-zinc-500 flex items-center gap-2 text-[10px] font-black uppercase italic"><X size={16} /> Cerrar Historial</button>
          
          <button onClick={() => router.push("/perfil")} className="w-full bg-gradient-to-r from-pink-600 to-purple-700 text-[11px] font-black uppercase italic p-5 rounded-2xl mb-10 leading-tight shadow-lg shadow-pink-500/20 active:scale-95 transition-all">
            Accede o regístrate para beneficiarte de las promociones
          </button>

          <h3 className="text-[10px] font-black uppercase italic text-pink-500 mb-6 tracking-[0.2em]">Últimas Acciones Flash</h3>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {recentFlashes.length > 0 ? recentFlashes.map((flash) => (
              <div key={flash.id} className="bg-zinc-900/50 p-5 rounded-[1.5rem] border border-white/5 group hover:border-pink-500/30 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase italic text-zinc-500">{flash.name}</span>
                  <Zap size={12} className="text-pink-500" />
                </div>
                <p className="text-xs font-black uppercase italic text-white leading-tight">{flash.flashMessage}</p>
                <p className="text-[14px] font-black italic text-pink-500 mt-2">{flash.flashPrice}€</p>
              </div>
            )) : (
              <p className="text-[10px] font-bold text-zinc-600 uppercase italic text-center pt-10">Buscando energía en la ciudad...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
