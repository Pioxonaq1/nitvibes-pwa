"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

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
      <div className="absolute inset-0 z-0">
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 bg-center bg-cover ${i === currentIdx ? "opacity-60" : "opacity-0"}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center">
        <div className="space-y-4 mb-16">
          <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            NIT<span className="text-pink-500">VIBES</span>
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-400 italic">
            Tu noche comienza aquí
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
          <button 
            onClick={() => router.push("/mapa")} 
            className="h-16 bg-white text-black rounded-2xl font-black uppercase italic text-sm active:scale-95 transition-all shadow-2xl shadow-white/5"
          >
            Ir al Mapa
          </button>
          <button 
            onClick={() => router.push("/vibes")} 
            className="h-16 bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl font-black uppercase italic text-sm active:scale-95 transition-all"
          >
            Ver Vibes
          </button>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
