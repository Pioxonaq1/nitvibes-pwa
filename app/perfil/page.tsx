"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

export default function AccessSelector() {
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6 pb-24">
      
      <div className="mt-8 mb-6">
        <h1 className="text-3xl font-black italic tracking-tighter">NITVIBES <span className="text-purple-500">ID</span></h1>
        <p className="text-gray-400 text-sm mt-2">Selecciona tu perfil de acceso</p>
      </div>

      {/* Grid de Accesos */}
      <div className="flex-1 grid gap-4 content-start">
        {profiles.map((profile) => (
          <Link 
            key={profile.id} 
            href={profile.link}
            className="group relative overflow-hidden rounded-2xl p-0.5 transition-all active:scale-[0.98]"
          >
            {/* Borde Gradiente */}
            <div className={`absolute inset-0 bg-gradient-to-r ${profile.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            
            {/* Contenido Tarjeta */}
            <div className="relative bg-gray-900 rounded-xl p-4 flex items-center justify-between h-full">
              <div className="flex items-center gap-4">
                <div className="text-2xl bg-black/30 w-10 h-10 flex items-center justify-center rounded-lg">
                  {profile.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-wide uppercase">{profile.title}</h3>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{profile.desc}</p>
                </div>
              </div>
              <div className="text-gray-600 group-hover:text-white transition-colors">
                ➜
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* --- SECCIÓN REGISTRO (NUEVA) --- */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-gray-400 text-xs mb-4">¿Aún no tienes tu Nitvibes ID?</p>
        <Link 
          href="/register" 
          className="w-full bg-white text-black py-4 rounded-xl font-black uppercase italic tracking-wider flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <UserPlus size={18} />
          Crear Cuenta Gratis
        </Link>
        <p className="text-[10px] text-gray-600 mt-4 px-4 leading-tight">
          El registro está habilitado para usuarios (Vibers). Partners y Gobierno deben contactar con administración.
        </p>
      </div>

    </div>
  );
}
