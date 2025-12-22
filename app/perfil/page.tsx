"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";
import { User, Briefcase, Shield, Building2, ChevronRight, Loader2 } from "lucide-react";

export default function PerfilPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // LÓGICA DE REDIRECCIÓN AUTOMÁTICA (El "Trampolín")
  useEffect(() => {
    if (!loading && user) {
      setIsRedirecting(true);
      
      // 1. Lógica para TEAM (Admin/Colaboradores)
      // Usamos los mismos emails que definimos en el Dashboard
      const isTeam = user.email === 'pioxonaq@gmail.com' || user.email?.includes('@nitvibes.com') || user.email === 'admin@nitvibes.com';
      
      if (isTeam) {
        router.push(ROUTES.ADMIN_DASHBOARD); // Te manda a /admin
      } 
      // 2. Lógica para PARTNER (Negocios)
      // (Por ahora simplificada, luego usaremos Claims de Firebase)
      else if (window.location.href.includes('business')) {
        router.push(ROUTES.PARTNER_DASHBOARD);
      }
      // 3. Por defecto: VIBER (Usuario Normal)
      else {
        // Si no es Team ni Partner identificado, se queda aquí o va a su perfil de usuario
        setIsRedirecting(false); // Cancelamos redirect para mostrar perfil de usuario
      }
    }
  }, [user, loading, router]);

  // Pantalla de Carga mientras decide
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-purple-500 mb-4" size={40} />
        <p className="text-xs text-gray-500 animate-pulse">Verificando credenciales...</p>
      </div>
    );
  }

  // --- SI YA ESTÁ LOGUEADO (Y es Viber/Usuario) ---
  if (user) {
    return (
      <div className="min-h-screen bg-black text-white p-6 pb-24">
        <h1 className="text-2xl font-bold mb-4">Mi Perfil Viber</h1>
        <p className="text-gray-400">Bienvenido, {user.email}</p>
        {/* Aquí iría el contenido del perfil de usuario normal */}
      </div>
    );
  }

  // --- SI ES ANÓNIMO: PANTALLA DE SELECCIÓN DE ID (ID SCREEN) ---
  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24 flex flex-col justify-center">
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
          IDENTIDAD
        </h1>
        <p className="text-gray-400 text-sm">Selecciona tu nivel de acceso</p>
      </div>

      <div className="grid gap-4 max-w-md mx-auto w-full">
        
        {/* 1. OPCIÓN VIBER (Usuario) */}
        <button 
          onClick={() => router.push(ROUTES.LOGIN)}
          className="group relative bg-[#111] hover:bg-[#161616] border border-gray-800 p-5 rounded-2xl flex items-center justify-between transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-900/20 p-3 rounded-full text-purple-400 group-hover:scale-110 transition-transform">
              <User size={24} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-white text-lg">Viber</span>
              <span className="text-xs text-gray-500">Usuario Free & Social</span>
            </div>
          </div>
          <ChevronRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>

        {/* 2. OPCIÓN PARTNER (Negocio) */}
        <button 
          onClick={() => router.push('/business/login')}
          className="group relative bg-[#111] hover:bg-[#161616] border border-gray-800 p-5 rounded-2xl flex items-center justify-between transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-900/20 p-3 rounded-full text-blue-400 group-hover:scale-110 transition-transform">
              <Briefcase size={24} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-white text-lg">Partner</span>
              <span className="text-xs text-gray-500">Gestión de Venue</span>
            </div>
          </div>
          <ChevronRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>

        {/* 3. OPCIÓN TEAM (Admin/Colab) - ESTA ES LA REGLA QUE PEDISTE */}
        <button 
          onClick={() => router.push(ROUTES.ADMIN_LOGIN)} // Manda al Login de Admin
          className="group relative bg-[#111] hover:bg-[#161616] border border-red-900/20 p-5 rounded-2xl flex items-center justify-between transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-red-900/20 p-3 rounded-full text-red-500 group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-white text-lg">Team</span>
              <span className="text-xs text-gray-500">Acceso Corporativo</span>
            </div>
          </div>
          <ChevronRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>

        {/* 4. OPCIÓN GOV */}
        <button 
          onClick={() => router.push('/gov/login')}
          className="group relative opacity-50 hover:opacity-100 bg-[#111] hover:bg-[#161616] border border-gray-800 p-5 rounded-2xl flex items-center justify-between transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-900/20 p-3 rounded-full text-green-400 group-hover:scale-110 transition-transform">
              <Building2 size={24} />
            </div>
            <div className="text-left">
              <span className="block font-bold text-white text-lg">Gov</span>
              <span className="text-xs text-gray-500">Ayuntamiento / Entidad</span>
            </div>
          </div>
          <ChevronRight className="text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </button>

      </div>
    </div>
  );
}