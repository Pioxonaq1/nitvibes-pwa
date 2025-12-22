"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Zap, User, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext"; // Conectamos con el cerebro

export default function BottomMenu() {
  const pathname = usePathname();
  const { user } = useAuth(); // Leemos si el usuario está logueado

  // No mostramos el menú en login/register
  if (pathname === "/login" || pathname === "/register") return null;

  const menuItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Mapa", href: "/mapa", icon: Map },
    { name: "Vibes", href: "/vibes", icon: Zap },
    { 
      // Lógica dinámica:
      // Si hay usuario -> "Panel" con icono de Dashboard
      // Si es anónimo -> "Perfil" con icono de Usuario
      name: user ? "Panel" : "Perfil", 
      href: "/perfil", 
      icon: user ? LayoutDashboard : User 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10 pb-safe">
      <div className="flex justify-around items-center h-16">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200",
                isActive ? "text-yellow-400 scale-110" : "text-gray-400 hover:text-gray-200"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}