"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Store, ArrowLeft, Loader2 } from "lucide-react";
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
      const venuesRef = collection(db, "venues");
      const q = query(venuesRef, where("b2b_email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Email B2B no encontrado.");
        setLoading(false);
        return;
      }

      const venueDoc = querySnapshot.docs[0];
      const venueData = venueDoc.data();

      if (venueData.b2b_password === password) {
        // Inyectamos el usuario manualmente para saltar el Auth de Firebase estándar [cite: 2025-12-25]
        setExternalUser({
          uid: venueDoc.id,
          email: venueData.b2b_email,
          name: venueData.name,
          role: "partner",
          ...venueData
        });
        router.push("/partner/venues/dashboard");
      } else {
        alert("Contraseña incorrecta.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-32">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative">
        <div className="flex justify-center mb-6">
          <div className="bg-pink-600 p-4 rounded-full text-white shadow-lg shadow-pink-500/20"><Store size={28} /></div>
        </div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-8 leading-none">VENUES <span className="text-pink-500 italic">LOGIN</span></h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="b2b_email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-16 bg-blue-50 border-none rounded-2xl px-6 text-black font-bold outline-none" />
          <input type="password" placeholder="b2b_password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-16 bg-blue-50 border-none rounded-2xl px-6 text-black font-bold outline-none" />
          <button type="submit" disabled={loading} className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic text-lg shadow-xl active:scale-95 transition-all mt-4 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin text-pink-500" /> : "ENTRAR AL PANEL"}
          </button>
        </form>
        <button onClick={() => router.push("/perfil")} className="w-full flex items-center justify-center gap-2 text-zinc-400 text-[10px] font-black uppercase italic pt-8"><ArrowLeft size={12} /> Volver a Access ID</button>
      </div>
    </div>
  );
}
