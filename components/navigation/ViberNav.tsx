"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Zap, LayoutDashboard } from "lucide-react";

export default function ViberNav() {
  const pathname = usePathname();
  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Mapa", icon: Map, path: "/mapa" }, // Ubicación Real [cite: 2025-12-25]
    { label: "Flash", icon: Zap, path: "/viber/flash-actions" }, // Lista Promos [cite: 2025-12-25]
    { label: "Panel", icon: LayoutDashboard, path: "/viber/dashboard" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/5 pb-8 pt-4 px-8 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Link key={item.label} href={item.path} className={`flex flex-col items-center gap-1.5 ${pathname === item.path ? "text-blue-400" : "text-zinc-600"}`}>
            <item.icon size={20} />
            <span className="text-[9px] font-black uppercase italic">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
