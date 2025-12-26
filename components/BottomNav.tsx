"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Map, Zap, User, Home } from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "INICIO", icon: Home, path: "/" },
    { label: "MAPA", icon: Map, path: "/mapa" },
    { label: "VIBES", icon: Zap, path: "/vibes" },
    { label: "PERFIL", icon: User, path: "/perfil" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50">
      <nav className="bg-black/90 backdrop-blur-xl border-t border-white/5 px-4 pb-6 pt-4">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                  isActive ? "text-yellow-400 scale-110" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] font-black uppercase italic tracking-tighter">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        
        <div className="mt-4 flex flex-col items-center gap-1 border-t border-white/5 pt-3">
          <div className="flex gap-4 text-[7px] font-bold text-zinc-600 uppercase tracking-widest">
            <span>© 2025 NITVIBES</span>
            <span className="text-zinc-800">|</span>
            <span>DEV BY KONNEKTWERK</span>
          </div>
          <div className="flex gap-3 text-[6px] text-zinc-700 uppercase">
            <span>Privacidad</span>
            <span>Cookies</span>
            <span>Legal</span>
          </div>
        </div>
      </nav>
    </footer>
  );
}
