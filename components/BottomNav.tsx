"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Map, Zap, User, LayoutDashboard, Settings, PlusCircle, Ticket } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const getNavItems = () => {
    const role = user?.role || "visitor";

    switch (role) {
      case "admin":
      case "team":
        return [
          { label: "Mapa", icon: Map, path: "/mapa" },
          { label: "Vibes", icon: Zap, path: "/vibes" },
          { label: "Ajustes", icon: Settings, path: "/settings" },
          { label: "Panel", icon: LayoutDashboard, path: "/admin/panel" },
        ];
      case "partner":
        return [
          { label: "Mapa", icon: Map, path: "/mapa" },
          { label: "Lanzar", icon: PlusCircle, path: "/partner/venues/lanzar" },
          { label: "Ajustes", icon: Settings, path: "/settings" },
          { label: "Panel", icon: LayoutDashboard, path: "/partner/venues/dashboard" },
        ];
      case "viber":
        return [
          { label: "Mapa", icon: Map, path: "/mapa" },
          { label: "Flash", icon: Ticket, path: "/viber/flash-actions" },
          { label: "Ajustes", icon: Settings, path: "/settings" },
          { label: "Panel", icon: LayoutDashboard, path: "/perfil" },
        ];
      default: // Visitante
        return [
          { label: "Home", icon: Zap, path: "/" },
          { label: "Mapa", icon: Map, path: "/mapa" },
          { label: "Vibes", icon: Zap, path: "/vibes" },
          { label: "Perfil", icon: User, path: "/perfil" },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/5 px-4 pb-8 pt-4">
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
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[9px] font-black uppercase italic tracking-tighter">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
