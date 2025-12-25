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
      const q = query(collection(db, "venues"), where("b2b_email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        alert("Email no registrado.");
        setLoading(false);
        return;
      }
      const venueDoc = querySnapshot.docs[0];
      const venueData = venueDoc.data();
      if (venueData.b2b_password === password) {
        setExternalUser({ uid: venueDoc.id, email: venueData.b2b_email, name: venueData.name, role: "partner", ...venueData });
        router.push("/partner/venues/dashboard");
      } else {
        alert("Contraseña incorrecta.");
        setLoading(false);
      }
    } catch (e) {
      alert("Error de conexión.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-32">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-center mb-6"><div className="bg-pink-600 p-4 rounded-full"><Store size={28} /></div></div>
        <h1 className="text-3xl font-black italic uppercase text-center mb-8">VENUES <span className="text-pink-500">LOGIN</span></h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" placeholder="b2b_email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-16 bg-blue-50 rounded-2xl px-6 text-black font-bold outline-none border-none" />
          <input type="password" placeholder="b2b_password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-16 bg-blue-50 rounded-2xl px-6 text-black font-bold outline-none border-none" />
          <button type="submit" className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase italic shadow-xl active:scale-95 transition-all mt-4 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin text-pink-500" /> : "ENTRAR"}
          </button>
        </form>
        <button onClick={() => router.push("/perfil")} className="w-full text-zinc-500 text-[10px] font-black uppercase italic pt-8 flex items-center justify-center gap-2"><ArrowLeft size={12} /> Volver</button>
      </div>
    </div>
  );
}
