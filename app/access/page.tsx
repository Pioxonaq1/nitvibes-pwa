"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccessSelector() {
  const router = useRouter();

  const profiles = [
    {
      id: "viber",
      title: "VIBERS",
      desc: "Disfruta de la noche",
      icon: "🎉",
      color: "from-blue-500 to-purple-600",
      link: "/login" // Nueva ruta para usuarios
    },
    {
      id: "partner",
      title: "PARTNERS",
      desc: "Gestión de Venues",
      icon: "🏢",
      color: "from-purple-600 to-pink-600",
      link: "/business"
    },
    {
      id: "gov",
      title: "GOV",
      desc: "Entidades Públicas",
      icon: "⚖️",
      color: "from-emerald-500 to-teal-600",
      link: "/gov" // Nueva ruta GOV
    },
    {
      id: "team",
      title: "TEAM",
      desc: "Admin & Staff",
      icon: "🛡️",
      color: "from-gray-700 to-gray-900",
      link: "/admin"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6 pb-24">
      
      <div className="mt-8 mb-8">
        <h1 className="text-3xl font-black italic tracking-tighter">NITVIBES <span className="text-purple-500">ID</span></h1>
        <p className="text-gray-400 text-sm mt-2">Selecciona tu perfil de acceso</p>
      </div>

      <div className="flex-1 grid gap-4 content-center">
        {profiles.map((profile, index) => (
          <Link 
            key={profile.id} 
            href={profile.link}
            className="group relative overflow-hidden rounded-2xl p-0.5 transition-all active:scale-[0.98]"
          >
            {/* Borde Gradiente */}
            <div className={`absolute inset-0 bg-gradient-to-r ${profile.color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            
            {/* Contenido Tarjeta */}
            <div className="relative bg-gray-900 rounded-xl p-5 flex items-center justify-between h-full">
              <div className="flex items-center gap-4">
                <div className="text-3xl bg-black/30 w-12 h-12 flex items-center justify-center rounded-lg">
                  {profile.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-wide">{profile.title}</h3>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{profile.desc}</p>
                </div>
              </div>
              <div className="text-gray-500 group-hover:text-white transition-colors">
                ➜
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center text-xs text-gray-600 mt-8">
        v1.2.0 • Secure Access Gateway
      </div>
    </div>
  );
}