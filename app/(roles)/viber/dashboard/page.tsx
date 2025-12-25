"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ViberHeader from "../components/ViberHeader";
import MainActions from "../components/MainActions";
import FlashSlider from "../components/FlashSlider";
import SocialModule from "../components/SocialModule";
import { Play } from "lucide-react";

export default function ViberDashboard() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/"); 
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-28 font-sans">
      <ViberHeader onLogout={handleLogout} />
      <MainActions />
      <FlashSlider />
      <SocialModule />
      
      {/* Botones sin definir (Componente temporal in-page) */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="aspect-square bg-zinc-900/30 border border-dashed border-white/10 rounded-2xl flex items-center justify-center text-zinc-700">
            <Play size={20} className="opacity-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
