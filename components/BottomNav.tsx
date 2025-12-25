
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Sparkles, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Determinar la ruta del Dashboard según el rol del usuario [cite: 2025-12-24]
  const getDashboardLink = () => {
    if (!user) return "/perfil";
    
    switch (user.role) {
      case 'admin':
      case 'collaborator':
        return "/team/dashboard";
      case 'partner':
        return "/partner/dashboard";
      case 'gov':
        return "/gov/dashboard";
      case 'viber':
        return "/viber/dashboard";
      default:
        return "/viber/dashboard";
    }
  };

  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Map", icon: Map, path: "/mapa" },
    { label: "Vibes", icon: Sparkles, path: "/vibes" },
    { 
      label: user ? "Panel" : "Perfil", 
      icon: user ? LayoutDashboard : User, 
      path: getDashboardLink() 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 pb-6 pt-3 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (user && item.label === "Panel" && pathname.includes("dashboard"));
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive ? "text-blue-500 scale-110" : "text-gray-500 hover:text-white"
              }`}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-black uppercase tracking-tighter italic">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
