"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicNav from "./navigation/PublicNav";
import ViberNav from "./navigation/ViberNav";

export default function BottomNav() {
  const { user, loading } = useAuth();

  if (loading) return null;

  const renderNav = () => {
    // Si no hay usuario o es visitante, PublicNav
    if (!user || user.role === "visitor") {
      return <PublicNav />;
    }
    
    // Si es Viber, ViberNav
    if (user.role === "viber") {
      return <ViberNav />;
    }

    // Por defecto mientras estabilizamos el resto
    return <PublicNav />;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10">
      {renderNav()}
      
      <div className="bg-black py-1.5 px-6 border-t border-white/5">
        <div className="max-w-md mx-auto flex justify-between items-center text-[7px] text-zinc-600 uppercase font-black tracking-widest">
          <span>© 2025 NITVIBES</span>
          <a href="https://konnektwerk.com/" target="_blank" className="hover:text-yellow-400 transition-colors">
            DEV BY KONNEKTWERK
          </a>
        </div>
      </div>
    </footer>
  );
}
