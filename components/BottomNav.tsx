"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Sparkles, User, LayoutDashboard, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return "/perfil";
    switch (user.role) {
      case 'admin': case 'collaborator': return "/team/dashboard";
      case 'partner': return "/partner/dashboard";
      case 'gov': return "/gov/dashboard";
      case 'viber': return "/viber/dashboard";
      default: return "/viber/dashboard";
    }
  };

  // Lógica basada en las notas del bloque
  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Mapa", icon: Map, path: "/mapa" },
    { 
      label: (user && user.role === 'viber') ? "Flash" : "Vibes", 
      icon: (user && user.role === 'viber') ? Zap : Sparkles, 
      path: (user && user.role === 'viber') ? "/viber/flash-actions" : "/vibes" 
    },
    { 
      label: user ? "Panel" : "Perfil", 
      icon: user ? LayoutDashboard : User, 
      path: getDashboardLink() 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/5 pb-8 pt-4 px-8 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (user && item.label === "Panel" && pathname.includes("dashboard"));
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex flex-col items-center gap-1.5 transition-all ${
                isActive ? "text-blue-400 scale-105" : "text-zinc-600 hover:text-white"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-black uppercase tracking-widest italic">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
