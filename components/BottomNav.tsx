"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Map, Zap, User, LayoutDashboard } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const isPartner = user?.role === "partner" || user?.isVenue;

  const navItems = [
    { label: "Mapa", icon: Map, path: "/mapa" },
    { label: "Vibes", icon: Zap, path: "/vibes" },
    { 
      label: isPartner ? "Panel" : "Perfil", 
      icon: isPartner ? LayoutDashboard : User, 
      path: isPartner ? "/partner/venues/dashboard" : "/perfil" 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/5 px-6 pb-8 pt-4">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-pink-500 scale-110" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-black uppercase italic tracking-tighter">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
