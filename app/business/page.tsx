"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";

import NearbyUsersCounter from "@/components/NearbyUsersCounter";
import PartnerPromoStats from "@/components/PartnerPromoStats";

interface DaySchedule { open: string; close: string; closed?: boolean; }
interface Venue {
  id: string; name: string; location: { latitude: number; longitude: number };
  hasFlashPromo?: boolean; flashPromoText?: string; flashPrice?: number; flashEndTime?: any;
  weeklySchedule?: { [key: string]: DaySchedule | undefined; };
}

export default function BusinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [promoText, setPromoText] = useState("");
  const [promoPrice, setPromoPrice] = useState<string>("0");
  const [isUpdating, setIsUpdating] = useState(false);

  const daysMap = [
    { key: 'monday', label: 'Lunes' }, { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' }, { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' }, { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  const handleUnauthorized = () => {
    const storedAttempts = sessionStorage.getItem("access_attempts");
    const attempts = storedAttempts ? parseInt(storedAttempts) : 0;
    const newAttempts = attempts + 1;
    sessionStorage.setItem("access_attempts", newAttempts.toString());
    
    if (newAttempts >= 3) {
      router.push("/register");
    } else {
      router.push("/perfil");
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // 1. Si es ANÓNIMO o NULL -> Fuera
      if (!user || user.isAnonymous) {
        handleUnauthorized();
        return; 
      }

      // 2. Si es Logueado, validamos si tiene Venue (es Partner)
      try {
        const snapshot = await getDocs(collection(db, "venues")); // Demo: Trae 1ra venue
        
        if (!snapshot.empty) {
          // ES PARTNER VÁLIDO
          sessionStorage.removeItem("access_attempts"); 
          const docData = snapshot.docs[0];
          const v = { id: docData.id, ...docData.data() } as Venue;
          setVenue(v);
          setPromoText(v.flashPromoText || "¡Chupito GRATIS entrando ahora!");
          setPromoPrice(v.flashPrice?.toString() || "0");
        } else {
          // ES USUARIO LOGUEADO PERO SIN VENUE (Viber colado) -> Fuera
          handleUnauthorized();
          return;
        }
      } catch (error) {
        console.error("Error cargando:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const toggleFlashPromo = async () => {
    if (!venue) return;
    setIsUpdating(true);
    const newState = !venue.hasFlashPromo;
    const priceNum = parseFloat(promoPrice) || 0;
    try {
      const venueRef = doc(db, "venues", venue.id);
      await updateDoc(venueRef, {
        hasFlashPromo: newState, flashPromoText: promoText, flashPrice: priceNum,
        flashStartTime: newState ? serverTimestamp() : null,
        flashEndTime: newState ? new Date(Date.now() + 15 * 60 * 1000) : null
      });
      setVenue(prev => prev ? ({ ...prev, hasFlashPromo: newState, flashPromoText: promoText, flashPrice: priceNum }) : null);
    } catch (e) { alert("Error al guardar"); } finally { setIsUpdating(false); }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div></div>;
  if (!venue) return null; // Redirección gestionada arriba

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24 font-sans selection:bg-pink-500/30">
      <header className="flex justify-between items-center mb-8 mt-4">
        <div><h1 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">PARTNER <span className="text-white not-italic">HUB</span></h1><p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{venue.name}</p></div>
        <div className="flex items-center gap-3"><button onClick={() => auth.signOut()} className="text-[10px] font-bold text-gray-500 hover:text-white border border-gray-800 px-3 py-1 rounded-full transition-colors">SALIR</button><div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center font-bold text-xs shadow-lg border border-white/20">B2B</div></div>
      </header>
      <main className="space-y-8 max-w-md mx-auto">
        <section><NearbyUsersCounter venueLat={venue.location.latitude} venueLng={venue.location.longitude} /></section>
        <section className={`rounded-3xl border transition-all duration-500 p-6 ${venue.hasFlashPromo ? 'bg-purple-900/10 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.2)]' : 'bg-[#111] border-gray-800'}`}>
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${venue.hasFlashPromo ? 'bg-purple-500 text-white animate-pulse' : 'bg-gray-800 text-gray-500'}`}>⚡</div>
                <div><h3 className="font-bold text-lg leading-none">Flash Action</h3><p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Marketing de Proximidad (25m)</p></div>
             </div>
             <button onClick={toggleFlashPromo} disabled={isUpdating} className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${venue.hasFlashPromo ? 'bg-green-500' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${venue.hasFlashPromo ? 'left-7' : 'left-1'}`}></div>
             </button>
          </div>
          <div className={`space-y-4 transition-all duration-300 ${venue.hasFlashPromo ? 'opacity-100' : 'opacity-50 grayscale'}`}>
             <div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Texto</label><input type="text" value={promoText} onChange={(e) => setPromoText(e.target.value)} disabled={venue.hasFlashPromo} className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none text-sm font-bold" /></div>
             <div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Precio (€)</label><input type="number" value={promoPrice} onChange={(e) => setPromoPrice(e.target.value)} disabled={venue.hasFlashPromo} className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none text-sm font-bold" /></div>
          </div>
        </section>
        <section><PartnerPromoStats venueId={venue.id} /></section>
        <section className="bg-[#111] border border-gray-800 rounded-3xl p-6">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">📅 Agenda Semanal</h3>
            {venue.weeklySchedule ? (
                <div className="space-y-3">
                    {daysMap.map((day) => {
                        const key = day.key;
                        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
                        const schedule = venue.weeklySchedule?.[key] || venue.weeklySchedule?.[capitalizedKey];
                        return (
                            <div key={day.key} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                                <span className="text-gray-400 text-sm font-medium w-24">{day.label}</span>
                                {!schedule || schedule.closed ? <span className="text-xs font-bold text-gray-600 bg-gray-900 px-2 py-1 rounded">CERRADO</span> : <span className="text-white font-mono text-sm">{schedule?.open} - {schedule?.close}</span>}
                            </div>
                        );
                    })}
                </div>
            ) : <div className="text-center py-8 text-gray-500 border border-dashed border-gray-800 rounded-xl"><p className="text-sm">Sin horario disponible.</p></div>}
        </section>
      </main>
    </div>
  );
}