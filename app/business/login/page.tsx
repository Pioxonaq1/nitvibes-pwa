'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ArrowLeft, Lock, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES } from '@/lib/constants';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function BusinessLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const venuesRef = collection(db, "venues");
      // Buscamos coincidencia exacta de credenciales
      const q = query(
        venuesRef, 
        where("b2BEmail", "==", email),
        where("b2BPassword", "==", password)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // DATOS ENCONTRADOS
        const venueDoc = querySnapshot.docs[0];
        const venueData = venueDoc.data();
        const realVenueId = venueDoc.id;

        // 1. MEMORIA OBLIGATORIA (LocalStorage)
        // Esto asegura que aunque navegue fuera, el sistema sepa quién es.
        localStorage.setItem('nitvibes_partner_id', realVenueId);

        // 2. Actualizar estado de la App
        login({
          id: realVenueId,
          name: venueData.name || 'Partner',
          role: USER_ROLES.PARTNER,
          email: venueData.b2BEmail
        });

        // 3. Ir al Panel
        router.push(`/business/dashboard/${realVenueId}`);
        
      } else {
        alert("❌ Credenciales incorrectas.");
        setLoading(false);
      }

    } catch (error) {
      console.error("Error login:", error);
      alert("Error de conexión.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative z-50 font-sans">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-purple-900/20 rounded-full flex items-center justify-center mb-4 border border-purple-500/30">
                <Building2 className="text-purple-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
                <span className="text-purple-500 italic">NITVIBES</span> PARTNER
            </h1>
            <p className="text-zinc-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                Acceso Exclusivo Propietarios
            </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Email Corporativo</label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ej: local@nitvibes.com" className="w-full bg-zinc-950 text-white px-12 py-3 rounded-lg text-sm font-medium border border-zinc-800 focus:outline-none focus:border-purple-500 transition-all placeholder:text-zinc-600"/>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider ml-1">Contraseña</label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="•••••••••••••" className="w-full bg-zinc-950 text-white px-12 py-3 rounded-lg text-sm font-medium border border-zinc-800 focus:outline-none focus:border-purple-500 transition-all placeholder:text-zinc-600"/>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-zinc-200 transition-all duration-200 mt-4 flex justify-center items-center gap-2">
            {loading ? 'VERIFICANDO...' : 'ENTRAR AL PANEL'}
          </button>
        </form>
        <div className="mt-8 flex justify-center">
          <button onClick={() => router.push('/perfil')} className="flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors text-xs">
            <ArrowLeft size={14} /><span>Volver a Plataforma</span>
          </button>
        </div>
      </div>
    </div>
  );
}