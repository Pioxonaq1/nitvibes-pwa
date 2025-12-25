"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import ViberMapbox from "../(roles)/viber/components/ViberMapbox";
import PartnerMapbox from "../(roles)/partner/components/PartnerMapbox";

// Podríamos crear un PublicMapbox en components/map/ para anónimos
export default function MapaPage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="w-full h-screen overflow-hidden">
      {user?.role === 'viber' && <ViberMapbox />}
      {user?.role === 'partner' && <PartnerMapbox />}
      {/* Por defecto o si es admin/anónimo, puedes redirigir o mostrar uno base */}
      {!user && <div className="h-full bg-zinc-900 flex items-center justify-center text-zinc-500 uppercase font-black italic">Mapa Público (Simulador)</div>}
    </div>
  );
}
