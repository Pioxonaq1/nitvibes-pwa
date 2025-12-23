"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, Zap, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-t border-white/10 pb-safe">
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
  );
}