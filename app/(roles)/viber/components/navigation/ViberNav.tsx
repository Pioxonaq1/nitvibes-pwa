"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Zap, LayoutDashboard } from "lucide-react";

export default function ViberNav() {
  const pathname = usePathname();
  
  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Mapa", icon: Map, path: "/mapa" },
    { label: "Flash", icon: Zap, path: "/viber/flash-actions" },
    { label: "Panel", icon: LayoutDashboard, path: "/viber/dashboard" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/5 pb-8 pt-4 px-8 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.label === "Panel" && pathname.includes("/viber/dashboard"));
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex flex-col items-center gap-1.5 transition-all ${
                isActive ? "text-blue-400 scale-110" : "text-zinc-600 hover:text-white"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
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
