"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Chrome, ArrowLeft, Sparkles } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: ""
  });

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
      router.push("/viber/dashboard");
    } catch (error) {
      console.error("Error en registro con Google", error);
    }
  };

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email !== formData.confirmEmail) return alert("Los emails no coinciden");
    if (formData.password !== formData.confirmPassword) return alert("Las contraseñas no coinciden");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Crear el documento del usuario en Firestore con rol 'viber' [cite: 2025-12-25]
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        nombre: formData.nombre,
        email: formData.email,
        role: "viber",
        createdAt: new Date().toISOString()
      });

      router.push("/viber/dashboard");
    } catch (error) {
      console.error("Error en registro manual", error);
      alert("Error al crear la cuenta");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-32">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-full shadow-lg shadow-purple-500/20">
            <Sparkles size={28} className="text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-center mb-2">
          Únete a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">NITVIBES</span>
        </h1>

        <div className="space-y-6 mt-8">
          <button 
            onClick={handleGoogleSignup}
            className="w-full bg-white text-black h-14 rounded-2xl font-black uppercase italic flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-xl"
          >
            <Chrome size={20} /> Registrarse con Google
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] bg-white/10 flex-1"></div>
            <span className="text-[10px] font-black uppercase text-zinc-500 italic tracking-widest">O con Email</span>
            <div className="h-[1px] bg-white/10 flex-1"></div>
          </div>

          <form onSubmit={handleManualRegister} className="space-y-3">
            <input 
              type="text" 
              placeholder="Tu Nombre" 
              required
              className="w-full h-14 bg-black border border-white/5 rounded-xl px-4 text-sm font-bold focus:border-purple-500 outline-none transition-all"
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
            <input 
              type="email" 
              placeholder="Email" 
              required
              className="w-full h-14 bg-blue-50 border border-white/5 rounded-xl px-4 text-sm font-bold text-black outline-none" 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              type="email" 
              placeholder="Confirmar Email" 
              required
              className="w-full h-14 bg-black border border-white/5 rounded-xl px-4 text-sm font-bold outline-none" 
              onChange={(e) => setFormData({...formData, confirmEmail: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="password" 
                placeholder="Contraseña" 
                required
                className="h-14 bg-blue-50 border border-white/5 rounded-xl px-4 text-sm font-bold text-black outline-none" 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <input 
                type="password" 
                placeholder="Confirmar" 
                required
                className="h-14 bg-black border border-white/5 rounded-xl px-4 text-sm font-bold outline-none" 
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
            
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 h-16 rounded-2xl font-black uppercase italic text-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all mt-4">
              REGISTRARME
            </button>
          </form>

          <button 
            onClick={() => router.push("/perfil")}
            className="w-full flex items-center justify-center gap-2 text-zinc-500 text-[10px] font-black uppercase italic hover:text-white transition-colors"
          >
            <ArrowLeft size={14} /> Volver al login
          </button>
        </div>
      </div>
    </div>
  );
}
