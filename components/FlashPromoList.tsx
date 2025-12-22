"use client";

import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FlashPromoList() {
  // Datos simulados (Mock data)
  const promos = [
    { id: 1, title: "2x1 en Copas", venue: "Opium BCN", time: "23:00 - 01:00", active: true },
    { id: 2, title: "Entrada Gratis", venue: "Pacha", time: "Antes de las 00:30", active: false },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Zap className="text-yellow-400 fill-yellow-400" /> Flash Promos
      </h3>
      
      <div className="grid gap-3">
        {promos.map((promo) => (
          <div 
            key={promo.id} 
            className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-white/10 p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-white text-lg">{promo.title}</h4>
                <p className="text-sm text-gray-300">{promo.venue}</p>
              </div>
              <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded font-bold border border-yellow-500/50">
                {promo.time}
              </span>
            </div>
            
            <Button 
              className="w-full mt-2 bg-white text-black hover:bg-gray-200 font-bold"
              disabled={!promo.active}
            >
              {promo.active ? "Reclamar Promo" : "No disponible"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}