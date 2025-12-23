"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Zap, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Cast del usuario para acceder al rol según la lógica de partners
  const userData = user as any; 

  const isBusinessUser = userData?.role === 'partner' || userData?.role === 'gov' || userData?.role === 'admin' || userData?.role === 'colaborador';

  const navItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Mapa', href: '/mapa', icon: Map },
    { name: 'Vibes', href: '/vibes', icon: Zap },
    { 
      name: isBusinessUser ? 'Panel' : 'Perfil', 
      href: '/perfil', 
      icon: isBusinessUser ? LayoutDashboard : User 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col">
      {/* 1. Menú de Navegación Principal */}
      <nav className="bg-black/95 backdrop-blur-lg border-t border-white/10">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 transition-all active:scale-95">
                <Icon size={20} className={isActive ? 'text-yellow-400' : 'text-zinc-500'} />
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'text-yellow-400' : 'text-zinc-500'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* 2. Footer Legal por debajo del Menú */}
      <div className="bg-black py-2 px-6 border-t border-white/5 pb-safe">
        <div className="max-w-md mx-auto flex justify-between items-center text-[7px] text-zinc-600 uppercase font-black tracking-[0.2em]">
          <span>© 2025 NITVIBES</span>
          <a 
            href="https://konnektwerk.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-yellow-400 transition-colors"
          >
            DEV BY KONNEKTWERK
          </a>
        </div>
      </div>
    </div>
  );
}