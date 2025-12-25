"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Store, ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function VenueLoginPage() {
  const router = useRouter();
  const { setExternalUser } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Buscamos el local en la colección 'venues' por su b2b_email [cite: 2025-12-25]
      const venuesRef = collection(db, "venues");
      const q = query(venuesRef, where("b2b_email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Email B2B no encontrado en nuestra base de datos de Venues.");
        setLoading(false);
        return;
      }

      const venueDoc = querySnapshot.docs[0];
      const venueData = venueDoc.data();

      // 2. Validamos la contraseña contra el campo b2b_password [cite: 2025-12-25]
      if (venueData.b2b_password === password) {
        // 3. Seteamos el usuario en el contexto con rol partner para activar el Dashboard [cite: 2025-12-21, 2025-12-25]
        if (setExternalUser) {
          setExternalUser({
            uid: venueDoc.id,
            nombre: venueData.name,
            role: "partner",
            ...venueData
          });
        }
        router.push("/partner/venues/dashboard");
      } else {
        alert("Contraseña B2B incorrecta.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error en login B2B:", error);
      alert("Error de conexión con Firebase Venues.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-32">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex justify-center mb-6">
          <div className="bg-pink-600 p-4 rounded-full shadow-lg shadow-pink-500/20 text-white">
            <Store size={28} />
          </div>
        </div>

        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-2 leading-none">
          VENUES <span className="text-pink-500 italic">LOGIN</span>
        </h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center mb-8 italic">
          Acceso exclusivo para Locales (B2B)
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="email" 
              placeholder="apolo@test.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-16 bg-blue-50 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-bold text-black focus:border-pink-500 outline-none transition-all placeholder:text-zinc-400" 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-16 bg-blue-50 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-bold text-black focus:border-pink-500 outline-none transition-all placeholder:text-zinc-400" 
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic text-lg shadow-xl active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin text-pink-500" /> : "ENTRAR AL PANEL"}
          </button>
        </form>

        <button onClick={() => router.push("/perfil")} className="w-full flex items-center justify-center gap-2 text-zinc-400 text-[9px] font-black uppercase italic pt-8">
          <ArrowLeft size={12} /> Volver a Access ID
        </button>
      </div>
    </div>
  );
}
