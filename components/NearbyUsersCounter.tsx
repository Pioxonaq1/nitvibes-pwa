"use client";

import { Users } from "lucide-react";

export default function NearbyUsersCounter() {
  // Dato simulado por ahora
  const count = 124;

  return (
    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-white/10 p-4 rounded-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-300 text-sm font-medium">Usuarios cerca</h3>
        <Users className="text-blue-400 w-5 h-5" />
      </div>
      <div className="text-3xl font-bold text-white">
        {count}
      </div>
      <p className="text-xs text-blue-300 mt-1">
        +12 en los últimos 15 min
      </p>
    </div>
  );
}