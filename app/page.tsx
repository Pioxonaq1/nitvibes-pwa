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

  // Imágenes en carpeta /public [cite: 2025-12-22]
  const images = [
    "/hero-1.jpg",
    "/hero-2.jpg",
    "/hero-3.jpg"
  ];

  // Cambio de imagen cada 8 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000); 

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-black">
      
      {/* --- SLIDER DE IMÁGENES --- */}
      <div className="absolute inset-0 z-0">
        {images.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
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
        {/* Gradiente para mejorar visibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />
      </div>

      {/* --- HEADER --- */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="bg-yellow-400 text-black px-1.5 py-0.5 rounded font-bold">N</div>
            <span className="text-yellow-400 font-black tracking-tighter italic text-xl drop-shadow-lg">NITVIBES</span>
        </div>

        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="w-[180px] bg-black/40 border-white/10 text-white backdrop-blur-md">
            <MapPin className="mr-2 h-4 w-4 text-yellow-400" />
            <SelectValue placeholder="Ciudad" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-white/10 text-white">
            <SelectItem value="barcelona">Barcelona</SelectItem>
            <SelectItem value="madrid" disabled className="opacity-50">Madrid (Soon)</SelectItem>
          </SelectContent>
        </Select>
      </header>

      {/* --- CONTENIDO HERO --- */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter leading-tight">
              La Noche en <br/> <span className="text-yellow-400 italic">Tu Ciudad</span>
            </h1>

            <p className="text-lg md:text-2xl text-zinc-300 mb-10 max-w-2xl font-medium drop-shadow-md">
              Siente el Vibe de tu ciudad y descubre los mejores bares y clubes en tiempo real.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:w-auto mx-auto">
              <Link href="/mapa" className="bg-green-600 hover:bg-green-500 text-white font-black py-4 px-10 rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2 uppercase text-sm tracking-widest shadow-xl shadow-green-900/20">
                <MapPin size={18} /> Ir al Mapa
              </Link>
              
              <Link href="/vibes" className="bg-transparent border-2 border-yellow-400 text-white font-black py-4 px-10 rounded-full hover:bg-white/5 transition-all flex items-center justify-center gap-2 uppercase text-sm tracking-widest backdrop-blur-sm">
                <Zap size={18} className="text-yellow-400" /> Ver Vibes
              </Link>
            </div>
        </div>

        {/* INDICADORES DEL CARRUSEL */}
        <div className="absolute bottom-12 flex gap-3">
            {images.map((_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`h-1.5 rounded-full transition-all duration-700 ${i === currentImage ? "w-10 bg-yellow-400" : "w-3 bg-white/20"}`}
                    aria-label={`Ir a imagen ${i + 1}`}
                />
            ))}
        </div>
      </div>
    </main>
  );
}