"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

// Componentes
import FlashPromoList from "@/components/FlashPromoList"; // Ya lo tenías
import UGCVibesList from "@/components/UGCVibesList"; // El nuevo componente

export default function ViberDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Protección de Ruta
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      if (!u || u.isAnonymous) {
        router.push("/login"); // Si no es viber registrado, fuera
      } else {
        setUser(u);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  // 2. Función Logout (Específica para este panel)
  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.clear();
    router.push("/login");
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div></div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-28 font-sans">
      
      {/* HEADER DASHBOARD */}
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            VIBER <span className="text-white not-italic">HUB</span>
          </h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            {user?.email?.split('@')[0]}
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="text-[10px] font-bold bg-red-900/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-full hover:bg-red-900/40 transition-colors"
        >
          CERRAR SESIÓN
        </button>
      </header>

      <main className="space-y-8">
        
        {/* SECCIÓN 1: ACCIONES FLASH (Lo más importante) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">⚡</span>
            <h2 className="font-bold text-lg text-white">Flash Actions Activas</h2>
          </div>
          {/* Tu componente existente que busca promos por GPS */}
          <FlashPromoList />
        </section>

        {/* SECCIÓN 2: MIS VIBES (UGC Creado por mí) */}
        <section>
          <div className="flex justify-between items-end mb-4">
             <div className="flex items-center gap-2">
                <span className="text-xl">👤</span>
                <h2 className="font-bold text-lg text-white">Mis Vibes</h2>
             </div>
             <button className="text-[10px] bg-white text-black px-3 py-1 rounded-full font-bold hover:bg-gray-200">
               + CREAR
             </button>
          </div>
          {/* Lista filtrada por mi ID */}
          <UGCVibesList userId={user.uid} />
        </section>

        {/* SECCIÓN 3: COMUNIDAD (UGC de otros) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🌍</span>
            <h2 className="font-bold text-lg text-white">Nuevos Vibes (Comunidad)</h2>
          </div>
          {/* Lista filtrada excluyendo mi ID */}
          <UGCVibesList excludeUserId={user.email} />
        </section>

      </main>
    </div>
  );
}