"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";

const images = [
  "https://images.unsplash.com/photo-1514525253361-bee87184747b?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000"
];

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
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* HERO SLIDER [cite: 2025-12-25] */}
      <div className="absolute inset-0 z-0">
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === currentIdx ? "opacity-40" : "opacity-0"}`}
            style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-screen px-6 text-center">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4 animate-pulse">NITVIBES</h1>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mb-12 italic">Tu noche comienza aquí</p>
        
        <div className="grid grid-cols-1 gap-4 w-full max-w-xs">
          <button onClick={() => router.push("/mapa")} className="h-16 bg-white text-black rounded-2xl font-black uppercase italic active:scale-95 transition-all">Ir al Mapa</button>
          <button onClick={() => router.push("/vibes")} className="h-16 bg-zinc-900 border border-white/10 rounded-2xl font-black uppercase italic active:scale-95 transition-all">Ver Vibes</button>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
