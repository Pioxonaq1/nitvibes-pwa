"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function ProfileSelectionPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Timeout de seguridad: Si en 3 seg no decide, muestra el menú para no bloquear
    const safetyTimer = setTimeout(() => {
      setChecking(false);
    }, 3000);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      // 1. Si NO hay usuario o es Anónimo -> Mostramos menú de selección
      if (!user || user.isAnonymous) {
        setChecking(false);
        clearTimeout(safetyTimer);
        return;
      }

      // 2. Si HAY usuario Real -> Redirigimos a su Dashboard correspondiente
      try {
        // A) ¿Es Admin? (Verificamos LocalStorage o Custom Claims)
        if (localStorage.getItem("nitvibes_admin_session") === "true") {
           router.replace("/admin");
           return;
        }

        // B) ¿Es Partner? (Buscamos si tiene venue asignada)
        const qVenue = query(collection(db, "venues"), where("ownerId", "==", user.uid));
        const venueSnap = await getDocs(qVenue);
        if (!venueSnap.empty) {
          router.replace("/business");
          return;
        }
        
        // C) ¿Es Gov? (Podrías añadir lógica similar si tienes colección 'gov_users')
        // ...

        // D) Por defecto: Usuario Free Registrado (Viber)
        // Redirigimos a SU Dashboard propio donde tiene sus promos y botón de salir
        router.replace("/viber"); 
        
      } catch (e) {
        console.error("Error routing user", e);
        setChecking(false); // Ante error, mostrar menú
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, [router]);

  // Pantalla de carga (Spinner Púrpura)
  if (checking) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        <p className="text-xs text-purple-500 animate-pulse font-bold tracking-widest">ACCEDIENDO AL PANEL...</p>
      </div>
    );
  }

  // --- MENÚ DE SELECCIÓN (SOLO SI NO ESTÁ LOGUEADO) ---
  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32 font-sans flex flex-col justify-center max-w-md mx-auto">
      
      <div className="mb-8 mt-4 text-center sm:text-left">
        <h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          NITVIBES <span className="text-white not-italic">ID</span>
        </h1>
        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">
          Selecciona tu perfil de acceso
        </p>
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-center pb-10">
        
        {/* 1. VIBERS -> Login General */}
        <button onClick={() => router.push("/login")} className="group w-full bg-[#111] border border-gray-800 hover:border-purple-500 rounded-3xl p-5 text-left transition-all hover:bg-gray-900 active:scale-95">
          <div className="flex items-center gap-4">
            <div className="text-2xl bg-purple-500/10 p-3 rounded-2xl">🎉</div>
            <div>
              <h3 className="font-black text-lg text-white group-hover:text-purple-400 transition-colors">VIBERS</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Disfruta de la noche</p>
            </div>
          </div>
        </button>

        {/* 2. PARTNERS -> Login B2B */}
        <button onClick={() => router.push("/business/login")} className="group w-full bg-[#111] border border-gray-800 hover:border-blue-500 rounded-3xl p-5 text-left transition-all hover:bg-gray-900 active:scale-95">
          <div className="flex items-center gap-4">
            <div className="text-2xl bg-blue-500/10 p-3 rounded-2xl">🏢</div>
            <div>
              <h3 className="font-black text-lg text-white group-hover:text-blue-400 transition-colors">PARTNERS</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Gestión de Venues</p>
            </div>
          </div>
        </button>

        {/* 3. GOV -> Login Gobierno */}
        <button onClick={() => router.push("/gov/login")} className="group w-full bg-[#111] border border-gray-800 hover:border-yellow-500 rounded-3xl p-5 text-left transition-all hover:bg-gray-900 active:scale-95">
          <div className="flex items-center gap-4">
            <div className="text-2xl bg-yellow-500/10 p-3 rounded-2xl">⚖️</div>
            <div>
              <h3 className="font-black text-lg text-white group-hover:text-yellow-400 transition-colors">GOV</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Entidades Públicas</p>
            </div>
          </div>
        </button>

        {/* 4. TEAM -> Login Admin */}
        <button onClick={() => router.push("/admin/login")} className="group w-full bg-[#111] border border-gray-800 hover:border-green-500 rounded-3xl p-5 text-left transition-all hover:bg-gray-900 active:scale-95">
          <div className="flex items-center gap-4">
            <div className="text-2xl bg-green-500/10 p-3 rounded-2xl">🛡️</div>
            <div>
              <h3 className="font-black text-lg text-white group-hover:text-green-400 transition-colors">TEAM</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Admin & Staff</p>
            </div>
          </div>
        </button>

        {/* 5. REGISTRO -> Destacado abajo */}
        <div className="pt-4 border-t border-gray-900 mt-2">
            <p className="text-center text-xs text-gray-500 mb-3">¿Aún no tienes cuenta?</p>
            <Link href="/register" className="block w-full bg-gradient-to-r from-gray-800 to-black border border-gray-700 hover:border-white rounded-2xl p-4 text-center transition-all hover:scale-[1.02] shadow-lg">
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 uppercase tracking-widest">
                REGÍSTRATE GRATIS AQUÍ
            </span>
            </Link>
        </div>

      </div>
    </div>
  );
}