"use client";
import React from "react";
import { Users, UserPlus } from "lucide-react";

export default function SocialModule() {
  const inviteFriends = () => {
    const text = encodeURIComponent("¡Únete a Nitvibes y descubre la noche! https://nitvibes.com");
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      <button className="flex items-center justify-center gap-3 bg-zinc-900 border border-white/5 p-4 rounded-2xl active:scale-95 transition-all">
        <Users size={18} className="text-blue-400" />
        <span className="text-[10px] font-black uppercase italic tracking-widest">Mis Amigos</span>
      </button>
      <button onClick={inviteFriends} className="flex items-center justify-center gap-3 bg-white text-black p-4 rounded-2xl active:scale-95 transition-all">
        <UserPlus size={18} />
        <span className="text-[10px] font-black uppercase italic tracking-widest">Invita Amigos</span>
      </button>
    </div>
  );
}
