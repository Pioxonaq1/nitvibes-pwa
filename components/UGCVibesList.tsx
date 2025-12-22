"use client";

import React from 'react';

// 👇 Definimos que este componente acepta un userId (opcional)
interface UGCVibesListProps {
  userId?: string;
}

export default function UGCVibesList({ userId }: UGCVibesListProps) {
  // Datos simulados
  const dummyVibes = [
    { id: 1, user: "Alex", text: "¡Increíble noche en Marina!", time: "Hace 2h" },
    { id: 2, user: "Sarah", text: "El DJ de Opium está on fire 🔥", time: "Hace 15m" },
  ];

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">
        {userId ? "Mis Vibes Publicados" : "Vibes Recientes"}
      </h3>
      
      {dummyVibes.map((vibe) => (
        <div key={vibe.id} className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-yellow-400">{vibe.user}</span>
            <span className="text-xs text-gray-400">{vibe.time}</span>
          </div>
          <p className="text-gray-200">{vibe.text}</p>
        </div>
      ))}
      
      {/* Mensaje de debug para verificar que llega el ID */}
      {userId && (
        <p className="text-[10px] text-gray-500 text-center">
          Mostrando vibes del usuario: {userId}
        </p>
      )}
    </div>
  );
}