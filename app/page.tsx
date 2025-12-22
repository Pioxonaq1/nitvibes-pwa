"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Zap } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  // Estado para la ciudad seleccionada (por ahora solo visual)
  const [city, setCity] = useState("barcelona");

  return (
    <main className="relative min-h-screen flex flex-col">

      {/* --- IMAGEN DE FONDO --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=2070&auto=format&fit=crop" // Puedes cambiar esta imagen si quieres
          alt="Nightlife vibes"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
      </div>

      {/* --- NUEVO HEADER SUPERIOR (Logo Centro + Selector Derecha) --- */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6 flex justify-between items-center">

        {/* 1. Espaciador izquierdo para equilibrar */}
        <div className="flex-1 hidden md:block"></div>

        {/* 2. Logo Centrado */}
        <div className="flex-1 flex justify-start md:justify-center">
            <div className="flex items-center gap-2">
                <div className="bg-yellow-400 text-black p-1 rounded font-bold">N</div>
                <span className="text-yellow-400 font-black tracking-tighter italic text-xl">NITVIBES</span>
            </div>
        </div>

        {/* 3. Selector de Ciudad (Derecha) */}
        <div className="flex-1 flex justify-end">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-[180px] bg-black/50 border-white/20 text-white backdrop-blur-sm font-medium">
              <MapPin className="mr-2 h-4 w-4 text-yellow-400" />
              <SelectValue placeholder="Selecciona ciudad" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white backdrop-blur-md">
              <SelectItem value="barcelona" className="focus:bg-white/10 focus:text-white">Barcelona</SelectItem>
              <SelectItem value="madrid" disabled className="opacity-50 cursor-not-allowed focus:bg-transparent">
                Madrid (próximamente)
              </SelectItem>
              <SelectItem value="valencia" disabled className="opacity-50 cursor-not-allowed focus:bg-transparent">
                Valencia (próximamente)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL (Textos y Botones) --- */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 mt-16 md:mt-0">

        {/* TÍTULO ACTUALIZADO */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
          La Noche en Tu Ciudad
        </h1>

        {/* SUBTÍTULO ACTUALIZADO */}
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
          Siente el Vibe de tu ciudad y descubre los mejores bares, clubes y eventos.
        </p>

        {/* BOTONES (Sin cambios) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md sm:w-auto">
          <Link href="/mapa" className="group flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
            <MapPin size={20} className="group-hover:animate-bounce" />
            <span>Ir al Mapa</span>
          </Link>
          <Link href="/vibes" className="group flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white font-bold py-3 px-8 rounded-full border-2 border-yellow-400 transition-all duration-300 w-full sm:w-auto">
            <Zap size={20} className="text-yellow-400 group-hover:rotate-12 transition-transform" />
            <span>Ver Vibes</span>
          </Link>
        </div>
      </div>
    </main>
  );
}