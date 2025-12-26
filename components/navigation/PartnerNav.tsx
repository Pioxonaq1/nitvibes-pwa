"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Map, PlusCircle, Settings, LayoutDashboard } from "lucide-react";

export default function PartnerNav() {
  const router = useRouter();
  const pathname = usePathname();
  const items = [
    { label: "MAPA", icon: Map, path: "/mapa" },
    { label: "LANZAR", icon: PlusCircle, path: "/partner/venues/lanzar" },
    { label: "AJUSTES", icon: Settings, path: "/settings" },
    { label: "PANEL", icon: LayoutDashboard, path: "/partner/venues/dashboard" },
  ];
  return (
    <div className="flex justify-around items-center h-16 max-w-md mx-auto">
      {items.map((item) => (
        <button key={item.label} onClick={() => router.push(item.path)} className={`flex flex-col items-center gap-1 ${pathname === item.path ? "text-yellow-400" : "text-zinc-500"}`}>
          <item.icon size={20} />
          <span className="text-[9px] font-black uppercase italic">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
