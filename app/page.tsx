"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Zap, ChevronDown } from 'lucide-react';

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedCity, setSelectedCity] = useState('Barcelona');
  const [isCityOpen, setIsCityOpen] = useState(false);

  // Ciudades con flag de desarrollo [cite: 2025-12-23]
  const cities = [
    { name: 'Barcelona', dev: false },
    { name: 'Madrid', dev: true },
    { name: 'Valencia', dev: true }
  ];
  
  const images = [
    "/hero-1.jpg",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1920&auto=format&fit=crop",
    "/hero-2.jpg",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920&auto=format&fit=crop",
    "/hero-3.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex flex-col">
      {/* Background Images */}
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

      {/* Header Optimizado [cite: 2025-12-23] */}
      <header className="relative z-20 w-full p-4 flex flex-col items-center bg-gradient-to-b from-black/90 to-transparent">
        <div className="w-full flex justify-between items-start max-w-5xl mx-auto">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20 shrink-0">
            <span className="text-black font-black text-2xl">N</span>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-2 rounded-full text-white transition-all active:scale-95"
            >
              <MapPin size={12} className="text-yellow-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">{selectedCity}</span>
              <ChevronDown size={10} className={`transition-transform duration-300 ${isCityOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCityOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 z-[60]">
                {cities.map((city) => (
                  <button
                    key={city.name}
                    disabled={city.dev}
                    className={`w-full px-4 py-3 text-left flex flex-col border-b border-white/5 last:border-0 transition-colors ${city.dev ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10'}`}
                    onClick={() => {
                      if (!city.dev) {
                        setSelectedCity(city.name);
                        setIsCityOpen(false);
                      }
                    }}
                  >
                    <span className="text-[10px] font-black text-white uppercase">{city.name}</span>
                    {city.dev && <span className="text-[7px] font-bold text-yellow-400 uppercase tracking-tighter">Próximamente</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 md:mt-2 text-center select-none pointer-events-none">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">
            NIT<span className="text-yellow-400">VIBES</span>
          </h1>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex-grow flex flex-col justify-end items-center px-6 pb-40 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-[0.9] drop-shadow-lg mb-4">
          TU NOCHE <span className="text-yellow-400">COMIENZA AQUÍ</span>
        </h2>
        
        <p className="text-zinc-300 text-sm md:text-base font-medium max-w-xs md:max-w-md leading-relaxed mb-8 drop-shadow-md">
          Siente el Vibe de tu ciudad y descubre los mejores <span className="text-white font-bold">bares, clubes y eventos</span> en tiempo real.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs md:max-w-md">
          <Link href="/mapa" className="flex-1 bg-green-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-400 transition-all active:scale-95 shadow-xl shadow-green-500/20 uppercase text-xs">
            <MapPin size={16} /> Ir al Mapa
          </Link>
          <Link href="/vibes" className="flex-1 bg-zinc-900/80 backdrop-blur-md border border-white/20 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95 shadow-xl uppercase text-xs">
            <Zap size={16} className="text-yellow-400" /> Ver Vibes
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none" />
    </main>
  );
}