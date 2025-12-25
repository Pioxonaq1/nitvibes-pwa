"use client";
import React from "react";
import { Zap, Clock, ChevronLeft, ChevronRight } from "lucide-react";

export default function FlashSlider() {
  const promos = [
    { venue: "Opium BCN", promo: "2x1 Copas", time: "45 min", price: "15€", dist: "100m" },
    { venue: "Pacha", promo: "Entrada Gratis", time: "12 min", price: "0€", dist: "250m" }
  ];

  return (
    <section className="mb-8">
      <div className="flex justify-between items-end mb-4 px-1">
        <h2 className="text-[11px] font-black uppercase italic tracking-widest text-yellow-400 flex items-center gap-2">
          <Zap size={14} fill="currentColor" /> Acciones Flash
        </h2>
        <div className="flex gap-2 text-zinc-600">
          <ChevronLeft size={16} /><ChevronRight size={16} />
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {promos.map((promo, i) => (
          <div key={i} className="min-w-[160px] bg-gradient-to-br from-zinc-900 to-black rounded-2xl border border-yellow-500/20 p-4 flex flex-shrink-0 flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-black bg-yellow-500 text-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Flash</span>
              <div className="flex items-center gap-1 text-[8px] text-zinc-400 font-bold uppercase"><Clock size={10} /> {promo.time}</div>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase italic tracking-tighter text-white truncate">{promo.venue}</h3>
              <p className="text-[12px] font-bold text-yellow-400 uppercase mt-1">{promo.promo}</p>
            </div>
            <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-2 text-[9px] font-bold italic">
              <div className="text-zinc-500">€ {promo.price}</div>
              <div className="text-blue-400 uppercase">{promo.dist}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
