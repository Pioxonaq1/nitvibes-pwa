"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Shield, Users, LayoutDashboard } from "lucide-react";

export default function TeamNav() {
  const pathname = usePathname();
  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Gestión", icon: Shield, path: "/team/admin" },
    { label: "Usuarios", icon: Users, path: "/team/users" },
    { label: "Panel", icon: LayoutDashboard, path: "/team/dashboard" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-blue-500/20 pb-8 pt-4 px-8 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Link key={item.label} href={item.path} className={`flex flex-col items-center gap-1.5 ${pathname === item.path ? "text-blue-500" : "text-zinc-600"}`}>
            <item.icon size={20} />
            <span className="text-[9px] font-black uppercase italic">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
