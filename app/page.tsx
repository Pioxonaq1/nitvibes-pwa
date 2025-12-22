"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { HeroCarousel } from "@/components/HeroCarousel"; // ✅ Importamos el carrusel

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative overflow-hidden bg-black">
      
      {/* 🖼️ FONDO: Carrusel dinámico (Reemplaza a la imagen estática) */}
      <HeroCarousel />

      {/* 📝 CONTENIDO: Texto Traducido (Mantenido intacto) */}
      <div className="z-10 relative text-center space-y-6 max-w-4xl px-4 animate-in fade-in zoom-in duration-1000">
        
        {/* Logo Marca */}
        <div className="mb-6 inline-flex items-center justify-center">
           <span className="bg-[#FFD700] text-black font-black px-2 py-1 text-2xl uppercase tracking-tighter shadow-[0_0_15px_rgba(255,215,0,0.5)]">N</span>
           <span className="text-[#FFD700] font-black text-3xl tracking-tighter ml-2 italic drop-shadow-md">NITVIBES</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight drop-shadow-xl">
          {t('hero_title')}
        </h1>
        
        {/* Subtítulo */}
        <p className="text-xl md:text-3xl text-gray-100 font-bold italic drop-shadow-lg max-w-2xl mx-auto">
          {t('hero_subtitle')}
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center mt-10">
          <Link href="/mapa">
            <button className="group bg-green-600/20 hover:bg-green-500 text-white border-2 border-green-500 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] active:scale-95">
              <span>🗺️</span> {t('btn_map')}
            </button>
          </Link>
          <Link href="/vibes">
            <button className="group bg-yellow-500/20 hover:bg-yellow-400 text-white hover:text-black border-2 border-yellow-400 px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 w-full sm:w-auto shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] active:scale-95">
               <span>✨</span> {t('btn_vibes')}
            </button>
          </Link>
        </div>
      </div>
      
    </main>
  );
}