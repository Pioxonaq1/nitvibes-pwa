"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import NearbyUsersCounter from "@/components/NearbyUsersCounter";
import PartnerPromoStats from "@/components/PartnerPromoStats";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Bell, QrCode } from "lucide-react";

export default function BusinessDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Datos simulados del local (Mock Data)
  // Esto evita el error "venueLat undefined"
  const venue = {
    name: "Opium Barcelona",
    location: {
      latitude: 41.3851,
      longitude: 2.1911 // Ubicación del club
    },
    hasFlashPromo: true
  };

  const handleLogout = async () => {
    await logout();
    router.push(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-black p-4 pb-24">
      {/* Header del Partner */}
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {venue.name}
          </h1>
          <p className="text-gray-400 text-xs uppercase tracking-widest">Partner Dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400">
            <Bell size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-400">
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      <main className="space-y-6 max-w-md mx-auto">
        
        {/* 1. Contador de Usuarios Cerca */}
        <section>
          <NearbyUsersCounter 
            venueLat={venue.location.latitude} 
            venueLng={venue.location.longitude} 
          />
        </section>

        {/* 2. Estadísticas de Promos */}
        <section>
          <PartnerPromoStats />
        </section>

        {/* 3. Panel de Control Rápido */}
        <section className="grid grid-cols-2 gap-4">
           <div className="bg-[#111] border border-gray-800 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#222] transition-colors cursor-pointer">
              <QrCode className="text-purple-500 w-8 h-8" />
              <span className="text-sm font-bold text-gray-200">Escanear QR</span>
           </div>
           <div className="bg-[#111] border border-gray-800 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-[#222] transition-colors cursor-pointer">
              <Settings className="text-gray-500 w-8 h-8" />
              <span className="text-sm font-bold text-gray-200">Ajustes</span>
           </div>
        </section>

      </main>
    </div>
  );
}