"use client";
import { TrendingUp, Users, Calendar } from "lucide-react";

export default function PartnerPromoStats() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-[#111] p-3 rounded-xl border border-gray-800 flex flex-col items-center justify-center text-center">
        <TrendingUp size={16} className="text-green-500 mb-1" />
        <span className="text-xl font-bold text-white">0</span>
        <span className="text-[9px] text-gray-500 uppercase">Impactos</span>
      </div>
      <div className="bg-[#111] p-3 rounded-xl border border-gray-800 flex flex-col items-center justify-center text-center">
        <Users size={16} className="text-blue-500 mb-1" />
        <span className="text-xl font-bold text-white">0</span>
        <span className="text-[9px] text-gray-500 uppercase">Conectados</span>
      </div>
      <div className="bg-[#111] p-3 rounded-xl border border-gray-800 flex flex-col items-center justify-center text-center">
        <Calendar size={16} className="text-purple-500 mb-1" />
        <span className="text-xl font-bold text-white">--</span>
        <span className="text-[9px] text-gray-500 uppercase">Próx. Evento</span>
      </div>
    </div>
  );
}
