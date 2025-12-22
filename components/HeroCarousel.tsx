"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const heroImages = [
  "/hero-1.jpg",
  "/hero-2.jpg",
  "/hero-3.jpg",
];

export function HeroCarousel() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 34000); // 34 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {heroImages.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={`Hero background ${index + 1}`}
          fill
          priority={index === 0}
          className={`object-cover transition-opacity duration-2000 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
          quality={90}
        />
      ))}
      {/* Capa oscura integrada en el carrusel para que el texto resalte */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}