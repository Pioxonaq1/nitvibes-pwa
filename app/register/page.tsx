"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';

export default function RegisterViberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados del Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Limpiar errores al escribir
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Validaciones
    if (formData.email !== formData.confirmEmail) {
      setError("❌ Los emails no coinciden.");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("❌ Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("⚠️ La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      // 2. Crear Usuario en Firebase Auth (Seguridad)
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 3. Guardar datos en Firestore (Colección 'viber')
      // Usamos el UID de autenticación como ID del documento para que estén vinculados
      await setDoc(doc(db, "viber", user.uid), {
        uid: user.uid,
        email: formData.email,
        nombre: formData.nombre,
        role: 'viber', // Etiqueta de rol
        createdAt: serverTimestamp(),
        // Campos opcionales inicializados vacíos para Rowy
        apellido1: '',
        apellido2: '',
        bio: '',
        movil: '',
        ciudad: '',
        intereses: [] 
      });

      // 4. Éxito
      // Opcional: Podrías redirigir a un "Onboarding" para completar perfil, 
      // pero por ahora vamos al Perfil principal.
      router.push('/perfil');

    } catch (err: any) {
      console.error("Error registro:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este email ya está registrado. Intenta iniciar sesión.");
      } else {
        setError("Ocurrió un error al registrarse. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans pb-24">
      
      {/* Cabecera */}
      <div className="w-full max-w-md mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            <Sparkles className="text-white" size={30} />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wider">Únete a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 italic">NITVIBES</span></h1>
        <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest">Crea tu cuenta Viber Gratuita</p>
      </div>

      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Tu Nombre</label>
            <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="text" 
                  name="nombre" 
                  required
                  placeholder="¿Cómo te llaman?"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-12 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-all placeholder:text-zinc-600"
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email 1 */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input 
                      type="email" name="email" required placeholder="tu@email.com"
                      value={formData.email} onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-all placeholder:text-zinc-600"
                    />
                </div>
              </div>

              {/* Email 2 */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Confirmar Email</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input 
                      type="email" name="confirmEmail" required placeholder="Repite tu email"
                      value={formData.confirmEmail} onChange={handleChange}
                      className={`w-full bg-black/50 border rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none transition-all placeholder:text-zinc-600 ${formData.confirmEmail && formData.email !== formData.confirmEmail ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                    />
                </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password 1 */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Contraseña</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input 
                      type="password" name="password" required placeholder="Mínimo 6 caracteres"
                      value={formData.password} onChange={handleChange}
                      className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-all placeholder:text-zinc-600"
                    />
                </div>
              </div>

              {/* Password 2 */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Confirmar Contraseña</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input 
                      type="password" name="confirmPassword" required placeholder="Repite la contraseña"
                      value={formData.confirmPassword} onChange={handleChange}
                      className={`w-full bg-black/50 border rounded-xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none transition-all placeholder:text-zinc-600 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-purple-500'}`}
                    />
                </div>
              </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg shadow-purple-900/20 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? 'CREANDO CUENTA...' : 'REGISTRARME AHORA'}
          </button>

        </form>

        <div className="mt-6 flex flex-col items-center gap-4 border-t border-white/5 pt-6">
           <Link href="/forgot-password">
              <span className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer">
                ¿Olvidaste tu contraseña?
              </span>
           </Link>
           
           <button onClick={() => router.push('/perfil')} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold">
            <ArrowLeft size={14} /> VOLVER
          </button>
        </div>

      </div>
    </div>
  );
}