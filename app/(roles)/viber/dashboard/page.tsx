"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ViberHeader from "../components/ViberHeader";
import MainActions from "../components/MainActions";
import FlashSlider from "../components/FlashSlider";
import SocialModule from "../components/SocialModule";
import TuVibeSelector from "../components/TuVibeSelector";

export default function ViberDashboard() {
  const { user, logout } = useAuth();
  const [isVibeOpen, setIsVibeOpen] = useState(false);
  const [activeVibes, setActiveVibes] = useState<string[]>([]);
  const [isMoodEnabled, setIsMoodEnabled] = useState(false);

  const toggleVibe = (id: string) => {
    setActiveVibes(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-32">
      <ViberHeader onLogout={logout} />
      <MainActions 
        onOpenVibe={() => setIsVibeOpen(true)} 
        isMoodActive={isMoodEnabled && activeVibes.length > 0} 
      />
      <FlashSlider />
      <SocialModule />
      <TuVibeSelector 
        isOpen={isVibeOpen} 
        onClose={() => setIsVibeOpen(false)}
        activeVibes={activeVibes}
        isMoodEnabled={isMoodEnabled}
        onToggleVibe={toggleVibe}
        onToggleMood={setIsMoodEnabled}
      />
    </main>
  );
}
