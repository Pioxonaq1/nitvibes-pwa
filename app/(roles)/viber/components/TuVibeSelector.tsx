"use client";
import React, { useState } from "react";
import { X, Heart, Users, Beer, Target, Briefcase, UserPlus, Sparkles, CheckCircle2 } from "lucide-react";

interface TuVibeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeVibes: string[];
  isMoodEnabled: boolean;
  onToggleVibe: (id: string) => void;
  onToggleMood: (enabled: boolean) => void;
}

export default function TuVibeSelector({ isOpen, onClose, activeVibes, isMoodEnabled, onToggleVibe, onToggleMood }: TuVibeSelectorProps) {
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

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">¿Cuál es tu vibe?</h2>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-zinc-500"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 no-scrollbar">
          {vibes.map((vibe) => {
            const isSelected = activeVibes.includes(vibe.id);
            return (
              <button
                key={vibe.id}
                onClick={() => onToggleVibe(vibe.id)}
                className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all ${
                  isSelected ? "bg-white/10 border-white/20" : "bg-black/40 border-white/5 opacity-60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <vibe.icon className={vibe.color} size={20} />
                  <span className="text-[11px] font-black uppercase tracking-widest italic text-white">{vibe.label}</span>
                </div>
                {isSelected && <CheckCircle2 size={16} className="text-green-400" />}
              </button>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <button 
            onClick={() => onToggleMood(!isMoodEnabled)}
            className={`w-full py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all ${
              isMoodEnabled ? "bg-red-500/20 text-red-500 border border-red-500/50" : "bg-green-500 text-black shadow-lg shadow-green-500/20"
            }`}
          >
            {isMoodEnabled ? "Desactivar Mood" : "Activar Mood"}
          </button>
        </div>
      </div>
    </div>
  );
}
