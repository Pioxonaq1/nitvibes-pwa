"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Store, ArrowLeft, Loader2, Mail, Lock } from "lucide-react";
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
      // Búsqueda exacta por b2BEmail [cite: 2025-12-25]
      const q = query(collection(db, "venues"), where("b2BEmail", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Venue no encontrado.");
        setLoading(false);
        return;
      }

      const venueDoc = querySnapshot.docs[0];
      const venueData = venueDoc.data();

      if (venueData.b2BPassword === password) {
        setExternalUser({
          uid: venueDoc.id,
          email: venueData.b2BEmail,
          name: venueData.name,
          ...venueData
        });
        router.push("/partner/venues/dashboard");
      } else {
        alert("Contraseña incorrecta.");
        setLoading(false);
      }
    } catch (err) {
      alert("Error de conexión.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-32">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-pink-600 p-4 rounded-full text-white"><Store size={28} /></div>
        </div>
        <h1 className="text-3xl font-black italic uppercase text-center mb-8 tracking-tighter leading-none">VENUES <span className="text-pink-500 italic">LOGIN</span></h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input type="email" placeholder="apolo@test.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-16 bg-blue-50 border-none rounded-2xl pl-12 pr-4 text-black font-bold outline-none" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-16 bg-blue-50 border-none rounded-2xl pl-12 pr-4 text-black font-bold outline-none" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic flex items-center justify-center gap-2 active:scale-95 transition-all">
            {loading ? <Loader2 className="animate-spin text-pink-500" /> : "ENTRAR AL PANEL"}
          </button>
        </form>
        <button onClick={() => router.push("/perfil")} className="w-full text-zinc-400 text-[10px] font-black uppercase italic mt-8 flex items-center justify-center gap-2"><ArrowLeft size={12} /> Volver</button>
      </div>
    </div>
  );
}
