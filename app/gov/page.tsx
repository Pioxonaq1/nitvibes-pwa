"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

export default function GovDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      // Protección estricta: Si es anónimo o null -> Login Gov
      if (!user || user.isAnonymous) {
        router.push("/gov/login");
        return;
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500"></div></div>;

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans text-center">
      <h1 className="text-3xl font-black text-yellow-500 mb-4">PANEL DE GOBIERNO</h1>
      <p className="text-gray-400 mb-8">Bienvenido al área de gestión pública.</p>
      <button onClick={() => auth.signOut()} className="bg-gray-800 px-6 py-2 rounded-full text-xs font-bold hover:bg-gray-700">CERRAR SESIÓN</button>
    </div>
  );
}