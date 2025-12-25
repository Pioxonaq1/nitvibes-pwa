"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, PlusCircle, LayoutDashboard } from "lucide-react";

export default function PartnerNav() {
  const pathname = usePathname();
  const navItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Local", icon: Store, path: "/partner/venue" },
    { label: "Promo", icon: PlusCircle, path: "/partner/flash-setup" },
    { label: "Panel", icon: LayoutDashboard, path: "/partner/dashboard" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-pink-500/20 pb-8 pt-4 px-8 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <Link key={item.label} href={item.path} className={`flex flex-col items-center gap-1.5 ${pathname.includes(item.path) && item.path !== "/" ? "text-pink-500" : "text-zinc-600"}`}>
            <item.icon size={20} />
            <span className="text-[9px] font-black uppercase italic">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
