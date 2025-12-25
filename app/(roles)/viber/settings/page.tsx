"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ArrowLeft, Save, User, Mail, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserSettings() {
  const { user } = useAuth();
  const router = useRouter();
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        nombre: nombre
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-24">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 mb-8 uppercase text-[10px] font-black italic">
        <ArrowLeft size={16} /> Volver al Panel
      </button>

      <h1 className="text-2xl font-black italic uppercase mb-8">Mis Datos</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-zinc-900/50 p-6 rounded-3xl border border-white/5 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 mb-2">
              <User size={12} /> Nombre Público
            </label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold"
              placeholder="Tu nombre..."
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 mb-2">
              <Mail size={12} /> Email (No editable)
            </label>
            <input 
              type="text" 
              value={user?.email || ""} 
              disabled
              className="w-full bg-black/50 border border-white/5 p-4 rounded-2xl text-zinc-600 font-bold"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 mb-2">
              <Shield size={12} /> Rol de Acceso
            </label>
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl text-blue-400 text-xs font-black uppercase italic">
              {user?.role}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-white text-black p-4 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {loading ? "Guardando..." : success ? "¡Datos Actualizados!" : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
