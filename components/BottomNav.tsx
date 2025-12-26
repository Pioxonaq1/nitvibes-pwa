"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicNav from "./navigation/PublicNav";
import ViberNav from "./navigation/ViberNav";
import PartnerNav from "./navigation/PartnerNav";
import TeamNav from "./navigation/TeamNav";

export default function BottomNav() {
  const { user, loading } = useAuth();

  if (loading) return null;

  const renderNav = () => {
    const role = user?.role || "visitor";

    switch (role) {
      case "admin":
      case "team":
      case "colaborador":
        return <TeamNav />;
      case "partner":
      case "gov":
        return <PartnerNav />;
      case "viber":
        return <ViberNav />;
      default:
        return <PublicNav />;
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10">
      {renderNav()}
      
      {/* Footer Legal Unificado [cite: 2025-12-23] */}
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
