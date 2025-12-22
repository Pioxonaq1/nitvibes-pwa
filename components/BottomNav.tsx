"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Map, Zap, User, Home } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  // Ocultar nav en login/registro para que no moleste
  if (pathname === "/login" || pathname === "/register") return null;

  const links = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/mapa", label: "Mapa", icon: Map },
    { href: "/vibes", label: "Vibes", icon: Zap },
    { href: "/perfil", label: "Panel", icon: User }, // Antes Perfil, ahora Panel
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-white/10 pb-safe">
      <div className="flex justify-around items-center h-16">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive ? "text-yellow-400" : "text-gray-400 hover:text-gray-200"
              )}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}