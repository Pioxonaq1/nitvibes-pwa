"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Chrome, ArrowRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AccessSelector() {
  const router = useRouter();
  const { user, loginWithGoogle, loading } = useAuth();

  // Si el usuario ya está logueado, lo enviamos a su panel correspondiente [cite: 2025-12-21, 2025-12-24]
  if (user && !loading) {
    const dashboardLink = user.role === 'viber' ? '/viber/dashboard' : `/${user.role}/dashboard`;
    router.push(dashboardLink);
    return null;
  }

  const profiles = [
    {
      id: "viber",
      title: "VIBERS",
      desc: "Disfruta de la noche",
      icon: "🎉",
      color: "from-blue-500 to-purple-600",
      link: "/viber/login"
    },
    {
      id: "partner",
      title: "PARTNERS",
      desc: "Gestión de Venues",
      icon: "🏢",
      color: "from-purple-600 to-pink-600",
      link: "/partner/login"
    },
    {
      id: "gov",
      title: "GOV",
      desc: "Entidades Públicas",
      icon: "⚖️",
      color: "from-emerald-500 to-teal-600",
      link: "/gov/login"
    },
    {
      id: "team",
      title: "TEAM",
      desc: "Admin & Staff",
      icon: "🛡️",
      color: "from-gray-700 to-gray-900",
      link: "/team/login"
    }
  ];

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // Tras el login exitoso, el AuthContext se encarga de asignarle 'viber' y compartir ubicación [cite: 2025-12-24]
      router.push("/mapa");
    } catch (error) {
      console.error("Error al acceder con Google", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6 pb-24">
      
      <div className="mt-8 mb-6">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">
          NITVIBES <span className="text-blue-500 font-black">ID</span>
        </h1>
        <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-bold">Selecciona tu perfil de acceso</p>
      </div>

      {/* Grid de Accesos */}
      <div className="flex-1 grid gap-3 content-start">
        {profiles.map((profile) => (
          <Link 
            key={profile.id} 
            href={profile.link}
            className="group relative overflow-hidden rounded-2xl p-[1px] transition-all active:scale-[0.98]"
          >
            {/* Borde Gradiente sutil */}
            <div className={`absolute inset-0 bg-gradient-to-r ${profile.color} opacity-30 group-hover:opacity-100 transition-opacity`}></div>
            
            {/* Contenido Tarjeta */}
            <div className="relative bg-[#0a0a0a] rounded-2xl p-4 flex items-center justify-between h-full border border-white/5">
              <div className="flex items-center gap-4">
                <div className="text-xl bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                  {profile.icon}
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-widest uppercase italic">{profile.title}</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">{profile.desc}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-gray-700 group-hover:text-white transition-colors group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* --- SECCIÓN REGISTRO Y GOOGLE (NUEVA) --- [cite: 2025-12-19] */}
      <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
        
        {/* Acceso Rápido con Google */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 border border-white/10 hover:bg-white hover:text-black transition-all group"
        >
          <Chrome size={18} className="text-blue-500 group-hover:text-black" />
          Acceder con Google
        </button>

        <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] bg-white/10 flex-1"></div>
            <span className="text-[10px] text-gray-600 font-bold uppercase">o también</span>
            <div className="h-[1px] bg-white/10 flex-1"></div>
        </div>

        {/* Registro Manual [cite: 2025-12-19] */}
        <Link 
          href="/register" 
          className="w-full bg-white text-black py-4 rounded-xl font-black uppercase italic text-xs tracking-wider flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <UserPlus size={18} />
          Crear Nitvibes ID Manual
        </Link>
        
        <p className="text-[9px] text-gray-600 mt-4 px-4 text-center leading-tight uppercase font-bold tracking-tight">
          El registro está habilitado para Vibers. <br/>Partners y Staff deben usar sus credenciales asignadas.
        </p>
      </div>

    </div>
  );
}