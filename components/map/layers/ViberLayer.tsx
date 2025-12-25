"use client";
import React from "react";
// Aquí iría la lógica de Google Maps para mostrar:
// - Marcadores de Flash Actions activas
// - Ubicación real del usuario (Punto Azul)
export default function ViberLayer() {
  return (
    <div className="absolute top-4 left-4 bg-blue-600/90 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase italic animate-pulse">
      Modo Viber: Ubicación Real Activa
    </div>
  );
}
