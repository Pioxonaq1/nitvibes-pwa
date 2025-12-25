"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Store, Zap, Users, BarChart3, LogOut, MapPin } from "lucide-react";
import PartnerMapbox from "../components/PartnerMapbox";

export default function VenueDashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [venueData, setVenueData] = useState<any>(null);

  useEffect(() => {
    async function fetchVenue() {
      if (user) {
        const docRef = doc(db, "venues", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVenueData(docSnap.data());
        }
      }
    }
    if (!loading && !user) router.push("/perfil");
    if (user) fetchVenue();
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center bg-zinc-900/50 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              PANEL <span className="text-pink-500 italic">VENUE</span>
            </h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1 italic">
              {venueData?.name || user?.nombre || "Partner Venue"}
            </p>
          </div>
          <button onClick={() => { logout(); router.push("/"); }} className="p-3 bg-zinc-800 rounded-full text-zinc-500 hover:text-red-500 transition-all">
            <LogOut size={20} />
          </button>
        </div>

        {/* Stats y Mapa se mantienen igual, ahora alimentados por el estado venueData [cite: 2025-12-25] */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <Users size={18} className="text-blue-400" />
            <p className="text-lg font-black leading-none">{venueData?.currentVibes || "0"}</p>
            <p className="text-[7px] font-black uppercase text-zinc-500">Vibers</p>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <Zap size={18} className="text-yellow-500" />
            <p className="text-lg font-black leading-none">{venueData?.activeFlashes || "0"}</p>
            <p className="text-[7px] font-black uppercase text-zinc-500">Flash</p>
          </div>
          <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-1">
            <BarChart3 size={18} className="text-pink-500" />
            <p className="text-lg font-black leading-none">{venueData?.reach || "0"}</p>
            <p className="text-[7px] font-black uppercase text-zinc-500">Alcance</p>
          </div>
        </div>

        <button className="w-full h-20 bg-gradient-to-r from-pink-600 to-purple-700 rounded-2xl flex items-center justify-between px-6 shadow-lg active:scale-95 transition-all group">
          <Zap size={24} />
          <span className="text-sm font-black uppercase italic">Lanzar Flash Action</span>
          <div className="w-6" />
        </button>

        <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden h-64 relative">
          <PartnerMapbox />
          <div className="absolute bottom-4 left-6 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
            <MapPin size={14} className="text-pink-500" />
            <span className="text-[10px] font-black uppercase italic">
               {venueData?.address || "Ubicación del Local"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
