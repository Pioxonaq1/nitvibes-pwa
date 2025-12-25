"use client";
import React from "react";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ViberHeader({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  return (
    <div className="flex justify-between items-start mb-10 pr-4">
      <div className="flex-1">
        <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 mb-1 leading-none">NITVIBES</h2>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 leading-none pb-2">
          PANEL VIBER
        </h1>
        <p className="text-[11px] text-zinc-400 font-bold mt-2 italic lowercase">
          hola {user?.nombre || user?.email?.split('@')[0] || "viber"}
        </p>
      </div>
      <div className="flex gap-2 shrink-0 pt-1">
        <Link href="/viber/settings" className="bg-zinc-900 border border-white/10 p-3 rounded-full text-zinc-400 hover:text-white transition-colors">
          <Settings size={20} />
        </Link>
        <button onClick={onLogout} className="bg-zinc-900 border border-white/10 p-3 rounded-full text-zinc-400 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
