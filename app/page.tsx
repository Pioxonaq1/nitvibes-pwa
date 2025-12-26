"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { MapPin, Zap, ChevronDown } from "lucide-react";

const images = ["/hero-1.jpg", "/hero-2.jpg", "/hero-3.jpg"];

export default function HomePage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* BACKGROUND SLIDER */}
      <div className="absolute inset-0 z-0">
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 bg-center bg-cover ${
              i === currentIdx ? "opacity-50" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      {/* HEADER: LOGO & CITY SELECTOR */}
      <header className="relative z-20 flex justify-between items-center p-6">
        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
          <span className="text-black font-black text-2xl">N</span>
        </div>
        <button className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
          <MapPin size={14} className="text-yellow-400" />
          BARCELONA
          <ChevronDown size={14} />
        </button>
      </header>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-[calc(100vh-160px)] px-6 text-center">
        <div className="mb-8">
          <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none">
            NIT<span className="text-yellow-400">VIBES</span>
          </h1>
          <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tight mt-10">
            TU NOCHE <span className="text-yellow-400 font-black">COMIENZA</span> AQUÍ
          </h2>
          <p className="mt-6 text-sm md:text-base font-medium text-zinc-300 max-w-md mx-auto leading-relaxed">
            Siente el Vibe de tu ciudad y descubre los mejores <span className="font-bold text-white">bares, clubes y eventos</span> en tiempo real.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm md:max-w-md">
          <button 
            onClick={() => router.push("/mapa")} 
            className="flex-1 h-14 bg-green-500 text-black rounded-2xl font-black uppercase italic text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-green-500/20"
          >
            <MapPin size={18} />
            Ir al Mapa
          </button>
          <button 
            onClick={() => router.push("/vibes")} 
            className="flex-1 h-14 bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-2xl font-black uppercase italic text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Zap size={18} className="text-yellow-400" />
            Ver Vibes
          </button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
