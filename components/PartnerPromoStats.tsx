"use client";

import { BarChart3, TrendingUp } from "lucide-react";

export default function PartnerPromoStats() {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-2 text-gray-400">
          <BarChart3 className="w-4 h-4" />
          <span className="text-xs">Vistas Totales</span>
        </div>
        <p className="text-2xl font-bold text-white">2.4k</p>
      </div>
      
      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-2 text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs">Conversión</span>
        </div>
        <p className="text-2xl font-bold text-green-400">18%</p>
      </div>
    </div>
  );
}