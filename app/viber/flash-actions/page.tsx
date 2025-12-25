"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Zap, MapPin, Clock, Euro, Share2, ArrowLeft } from "lucide-react";

export default function FlashActionsList() {
  const router = useRouter();
  
  // Datos de ejemplo para la lista (se conectarán a Firebase/Rowy)
  const [actions] = useState([
    { id: 1, venue: "Opium BCN", title: "2x1 en Copas", price: 15, dist: 100, time: "45 min", link: "https://maps.google.com" },
    { id: 2, venue: "Pacha", title: "Entrada Gratis", price: 0, dist: 250, time: "12 min", link: "https://maps.google.com" },
    { id: 3, venue: "Shôko", title: "Chupito Regalo", price: 5, dist: 500, time: "60 min", link: "https://maps.google.com" },
  ]);

  const shareOnWhatsApp = (title, venue) => {
    const text = encodeURIComponent(`¡Mira esta promo en ${venue}: ${title}! Descúbrelo en Nitvibes.`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 mb-6 uppercase text-[10px] font-black italic">
        <ArrowLeft size={16} /> Volver
      </button>

      <h1 className="text-2xl font-black italic uppercase mb-2 text-yellow-400 flex items-center gap-2">
        <Zap size={24} fill="currentColor" /> Flash Actions
      </h1>
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-8 text-center border-b border-white/5 pb-4">
        Todas las promociones activas en tu zona
      </p>

      <div className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-tighter">{action.venue}</h3>
                <p className="text-lg font-black italic uppercase leading-none mt-1">{action.title}</p>
              </div>
              <div className="bg-yellow-500 text-black px-2 py-1 rounded-lg text-[9px] font-black uppercase italic">Active</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-black/40 p-2 rounded-xl flex flex-col items-center">
                <Euro size={14} className="text-zinc-500 mb-1" />
                <span className="text-[10px] font-bold">{action.price}€</span>
              </div>
              <div className="bg-black/40 p-2 rounded-xl flex flex-col items-center">
                <MapPin size={14} className="text-blue-400 mb-1" />
                <span className="text-[10px] font-bold">{action.dist}m</span>
              </div>
              <div className="bg-black/40 p-2 rounded-xl flex flex-col items-center">
                <Clock size={14} className="text-yellow-400 mb-1" />
                <span className="text-[10px] font-bold">{action.time}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <a 
                href={action.link} target="_blank"
                className="flex-1 bg-white text-black p-3 rounded-xl text-[10px] font-black uppercase text-center active:scale-95 transition-all"
              >
                ¿Cómo llegar?
              </a>
              <button 
                onClick={() => shareOnWhatsApp(action.title, action.venue)}
                className="bg-zinc-800 p-3 rounded-xl active:scale-95 transition-all"
              >
                <Share2 size={18} className="text-green-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
