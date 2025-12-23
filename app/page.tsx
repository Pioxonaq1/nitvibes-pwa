"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Zap, ChevronDown } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedCity, setSelectedCity] = useState('Barcelona');
  const [isCityOpen, setIsCityOpen] = useState(false);

  const cities = ['Barcelona', 'Madrid', 'Valencia'];
  
  // Lista de imágenes actualizada con el orden solicitado [2025-12-23]
  // Mezclamos archivos de /public con URLs externas
  const images = [
    "/hero-1.jpg", // Asegúrate de que la extensión sea .jpg, .png o .webp según tus archivos
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1920&auto=format&fit=crop",
    "/hero-2.jpg",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920&auto=format&fit=crop",
    "/hero-3.jpg"
  ];

  // Mantenemos el ciclo de 5 segundos [2025-12-23]
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      {/* Background Images with Fade Effect */}
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === currentImage ? 'opacity-40' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Header / Top Bar */}
      <header className="relative z-20 flex justify-between items-center p-6 bg-gradient-to-b from-black/80 to-transparent">
        {/* Logo Icono N */}
        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
          <span className="text-black font-black text-2xl">N</span>
        </div>

        {/* NITVIBES Logo - 35% más grande [2025-12-23] */}
        <div className="absolute left-1/2 -translate-x-1/2 top-7 pointer-events-none text-center w-full">
          <h1 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-2xl">
            NIT<span className="text-yellow-400">VIBES</span>
          </h1>
        </div>

        {/* City Selector Compacto */}
        <div className="relative">
          <button 
            onClick={() => setIsCityOpen(!isCityOpen)}
            className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-white transition-all active:scale-95"
          >
            <MapPin size={12} className="text-yellow-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">{selectedCity}</span>
            <ChevronDown size={10} className={`transition-transform duration-300 ${isCityOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCityOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 z-50">
              {cities.map((city) => (
                <button
                  key={city}
                  className="w-full px-4 py-2.5 text-left text-[10px] font-bold text-white hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors uppercase"
                  onClick={() => {
                    setSelectedCity(city);
                    setIsCityOpen(false);
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero Content - Situado encima del menú inferior [2025-12-23] */}
      <div className="relative z-10 flex-grow flex flex-col justify-end items-center px-6 pb-28 text-center">
        {/* Título - 30% más pequeño [2025-12-23] */}
        <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-[0.9] drop-shadow-lg mb-4">
          TU NOCHE <span className="text-yellow-400">COMIENZA AQUÍ</span>
        </h2>
        
        {/* Subtítulo actualizado: bares, clubes y eventos [2025-12-23] */}
        <p className="text-zinc-300 text-sm md:text-base font-medium max-w-xs md:max-w-md leading-relaxed mb-8 drop-shadow-md">
          Siente el Vibe de tu ciudad y descubre los mejores <span className="text-white font-bold">bares, clubes y eventos</span> en tiempo real.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs md:max-w-md">
          <Link href="/mapa" className="flex-1 bg-green-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-400 transition-all active:scale-95 shadow-xl shadow-green-500/20 uppercase text-xs">
            <MapPin size={16} /> Ir al Mapa
          </Link>
          <Link href="/vibes" className="flex-1 bg-zinc-900/80 backdrop-blur-md border border-white/20 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95 shadow-xl uppercase text-xs">
            <Zap size={16} className="text-yellow-400" /> Ver Vibes
          </Link>
        </div>
      </div>

      {/* Footer / Navigation Bar [2025-12-23] */}
      <Navbar />

      {/* Gradiente para asegurar legibilidad sobre el menú */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-0 pointer-events-none" />
    </main>
  );
}