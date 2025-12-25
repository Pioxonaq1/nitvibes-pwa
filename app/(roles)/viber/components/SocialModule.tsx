"use client";
import React from "react";
import { Users, UserPlus } from "lucide-react";

export default function SocialModule() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button className="flex items-center justify-center gap-3 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl hover:bg-zinc-800 transition-all">
        <Users size={18} className="text-blue-400" />
        <span className="text-[10px] font-black uppercase italic tracking-tighter">Mis Amigos</span>
      </button>
      
      <button className="flex items-center justify-center gap-3 p-4 bg-white text-black rounded-2xl hover:bg-zinc-200 transition-all">
        <UserPlus size={18} />
        <span className="text-[10px] font-black uppercase italic tracking-tighter">Invita Amigos</span>
      </button>
    </div>
  );
}
