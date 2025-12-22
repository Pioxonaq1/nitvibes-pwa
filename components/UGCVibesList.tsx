"use client";

import React from 'react';

// 👇 Definimos AMBAS propiedades para que no falle nunca más
interface UGCVibesListProps {
  userId?: string;       // Para "Mis Vibes"
  excludeUserId?: string; // Para "Vibes de la Comunidad"
}

export default function UGCVibesList({ userId, excludeUserId }: UGCVibesListProps) {
  // Datos simulados (Mock Data)
  const dummyVibes = [
    { id: 1, user: "Alex", text: "¡Increíble noche en Marina!", time: "Hace 2h" },
    { id: 2, user: "Sarah", text: "El DJ de Opium está on fire 🔥", time: "Hace 15m" },
    { id: 3, user: "Marc", text: "Buscando gente para Sutton", time: "Hace 5m" },
  ];

  // Título dinámico según el filtro
  let title = "Vibes Recientes";
  if (userId) title = "Mis Vibes Publicados";
  if (excludeUserId) title = "Comunidad (Vibes de otros)";

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <h3 className="text-xl font-bold text-white mb-4">
        {title}
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
      
      {/* Mensaje oculto de debug para confirmar que props llegan bien */}
      <div className="hidden">
         Debug: {userId ? `User: ${userId}` : ''} {excludeUserId ? `Exclude: ${excludeUserId}` : ''}
      </div>
    </div>
  );
}
