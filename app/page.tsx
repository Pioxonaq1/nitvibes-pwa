"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [city, setCity] = useState("barcelona");
  const [currentImage, setCurrentImage] = useState(0);

  // Array de imágenes locales en /public
  const images = [
    "/hero-1.jpg",
    "/hero-2.jpg",
    "/hero-3.jpg"
  ];

  // Lógica del Slider: Cambia cada 18 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 18000); // 18 segundos

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      
      {/* --- SLIDER DE IMÁGENES DE FONDO --- */}
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[2000s] ease-in-out ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt={`Nightlife vibes ${index + 1}`}
              fill
              className="object-cover brightness-[0.4]"
              priority={index === 0}
            />
          </div>
        ))}
        {/* Overlay gradiente para asegurar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
      </div>

      {/* --- HEADER SUPERIOR --- */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 flex justify-between items-center">
        <div className="flex-1 hidden md:block"></div>
        
        {/* Logo Centrado */}
        <div className="flex-1 flex justify-start md:justify-center">
            <div className="flex items-center gap-2">
                <div className="bg-yellow-400 text-black p-1 rounded font-bold shadow-[0_0_10px_rgba(250,204,21,0.5)]">N</div>
                <span className="text-yellow-400 font-black tracking-tighter italic text-xl drop-shadow-md">NITVIBES</span>
            </div>
        </div>

        {/* Selector de Ciudad */}
        <div className="flex-1 flex justify-end">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-[160px] md:w-[180px] bg-black/40 border-white/10 text-white backdrop-blur-md font-medium">
              <MapPin className="mr-2 h-4 w-4 text-yellow-400" />
              <SelectValue placeholder="Ciudad" />
            </SelectTrigger>
            <SelectContent className="bg-black/95 border-white/10 text-white backdrop-blur-xl">
              <SelectItem value="barcelona">Barcelona</SelectItem>
              <SelectItem value="madrid" disabled className="opacity-40">Madrid (Próximamente)</SelectItem>
              <SelectItem value="valencia" disabled className="opacity-40">Valencia (Próximamente)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4">
        
        <div className="animate-in fade-in zoom-in duration-1000">
            <h1 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-none">
              La Noche en <br className="md:hidden" /> <span className="text-yellow-400">Tu Ciudad</span>
            </h1>

            <p className="text-lg md:text-2xl text-zinc-200 mb-10 max-w-2xl mx-auto font-medium">
              Siente el Vibe de tu ciudad y descubre los mejores bares, clubes y eventos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:w-auto mx-auto">
              <Link href="/mapa" className="group flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-black py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-green-900/20">
                <MapPin size={22} className="group-hover:animate-bounce" />
                <span className="uppercase tracking-wider text-sm">Ir al Mapa</span>
              </Link>
              
              <Link href="/vibes" className="group flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-black py-4 px-10 rounded-full border-2 border-yellow-400 transition-all duration-300 backdrop-blur-sm">
                <Zap size={22} className="text-yellow-400 group-hover:rotate-12 transition-transform" />
                <span className="uppercase tracking-wider text-sm">Ver Vibes</span>
              </Link>
            </div>
        </div>

        {/* Indicadores del Slider (Puntitos abajo) */}
        <div className="absolute bottom-10 flex gap-2">
            {images.map((_, i) => (
                <div 
                    key={i} 
                    className={`h-1 rounded-full transition-all duration-500 ${i === currentImage ? "w-8 bg-yellow-400" : "w-2 bg-white/30"}`}
                />
            ))}
        </div>
      </div>
    </main>
  );
}