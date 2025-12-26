"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Map, Ticket, Settings, User } from "lucide-react";

export default function ViberNav() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: "MAPA", icon: Map, path: "/mapa" },
    { label: "FLASH", icon: Ticket, path: "/viber/flash-actions" },
    { label: "AJUSTES", icon: Settings, path: "/settings" },
    { label: "PANEL", icon: User, path: "/perfil" },
  ];

  return (
    <div className="flex justify-around items-center h-16 max-w-md mx-auto">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? "text-yellow-400 scale-110" : "text-zinc-500"
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
  );
}
