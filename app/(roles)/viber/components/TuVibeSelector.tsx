"use client";
import React from "react";
import { X, Heart, Users, Beer, Target, Briefcase, UserPlus, Sparkles } from "lucide-react";

interface TuVibeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TuVibeSelector({ isOpen, onClose }: TuVibeSelectorProps) {
  if (!isOpen) return null;

  const vibes = [
    { id: "conocer", label: "Conocer gente", icon: UserPlus, color: "text-blue-400" },
    { id: "risas", label: "Echar unas risas", icon: Beer, color: "text-yellow-400" },
    { id: "ligoteo", label: "¡Ligoteo!", icon: Sparkles, color: "text-pink-500" },
    { id: "serio", label: "Algo serio", icon: Heart, color: "text-red-500" },
    { id: "networking", label: "Networking", icon: Briefcase, color: "text-indigo-400" },
    { id: "amigos", label: "Salgo con amigos/as", icon: Users, color: "text-green-400" },
    { id: "afinidades", label: "Gente con mis afinidades", icon: Target, color: "text-purple-400" },
  ];

  const handleSelectVibe = (vibeId: string) => {
    console.log("Vibe seleccionado:", vibeId);
    // Próximo paso: updateDoc en Firebase para el campo 'currentMood' [cite: 2025-12-25]
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
            ¿Cuál es tu vibe hoy?
          </h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-zinc-500">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {vibes.map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => handleSelectVibe(vibe.id)}
              className="flex items-center gap-4 w-full p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 hover:border-white/20 transition-all text-left group"
            >
              <vibe.icon className={`${vibe.color} group-hover:scale-110 transition-transform`} size={20} />
              <span className="text-[11px] font-black uppercase tracking-widest italic text-zinc-300 group-hover:text-white">
                {vibe.label}
              </span>
            </button>
          ))}
        </div>
        
        <p className="text-[9px] text-zinc-600 font-bold uppercase text-center mt-6 tracking-tight">
          Tu vibe será visible para otros vibers en el mapa [cite: 2025-12-25]
        </p>
      </div>
    </div>
  );
}
