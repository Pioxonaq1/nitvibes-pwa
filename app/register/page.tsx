"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Link from 'next/link';

export default function RegisterViberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado del Formulario Email
  const [formData, setFormData] = useState({
    nombre: '', email: '', confirmEmail: '', password: '', confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // --- OPCIÓN A: REGISTRO CON EMAIL ---
  const handleRegisterEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.email !== formData.confirmEmail) { setLoading(false); return setError("❌ Los emails no coinciden."); }
    if (formData.password !== formData.confirmPassword) { setLoading(false); return setError("❌ Las contraseñas no coinciden."); }
    if (formData.password.length < 6) { setLoading(false); return setError("⚠️ Contraseña muy corta (min 6)."); }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Guardar en Rowy (Colección 'Viber' con Mayúscula)
      await setDoc(doc(db, "Viber", user.uid), {
        uid: user.uid,
        email: formData.email,
        nombre: formData.nombre,
        // Campos vacíos para consistencia
        apellido1: '', apellido2: '', biografia: '', movil: '', foto: '', gustos: [], ciudad: '',
        role: 'viber',
        createdAt: serverTimestamp(),
      });

      router.push('/perfil');
    } catch (err: any) {
      setError(err.code === 'auth/email-already-in-use' ? "Este email ya está registrado." : "Error al crear cuenta.");
    } finally {
      setLoading(false);
    }
  };

  // --- OPCIÓN B: REGISTRO CON GOOGLE ---
  const handleRegisterGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Comprobar si ya existe en Rowy
      const docRef = doc(db, "Viber", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // ¡Es nuevo! Lo registramos en la base de datos
        await setDoc(doc(db, "Viber", user.uid), {
          uid: user.uid,
          email: user.email,
          nombre: user.displayName || 'Usuario Google',
          foto: user.photoURL || '', // Aprovechamos la foto de Google
          // Resto de campos vacíos
          apellido1: '', apellido2: '', biografia: '', movil: '', gustos: [], ciudad: '',
          role: 'viber',
          createdAt: serverTimestamp(),
        });
      }

      router.push('/perfil');
    } catch (err: any) {
      console.error(err);
      setError("No se pudo registrar con Google. Inténtalo de nuevo.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans pb-24">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold text-white">Únete a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 italic">NITVIBES</span></h1>
        </div>

        {error && <div className="mb-4 bg-red-900/20 text-red-400 p-3 rounded text-xs flex items-center gap-2"><AlertCircle size={14}/> {error}</div>}
        
        {/* BOTÓN GOOGLE */}
        <button 
            onClick={handleRegisterGoogle}
            disabled={googleLoading || loading}
            className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 mb-4"
        >
            {googleLoading ? <Loader2 className="animate-spin" size={18}/> : (
                <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5"/>
                Registrarse con Google
                </>
            )}
        </button>

        <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-black/50 px-2 text-zinc-500 backdrop-blur">O con Email</span></div>
        </div>

        {/* FORMULARIO EMAIL */}
        <form onSubmit={handleRegisterEmail} className="space-y-3">
          <input type="text" name="nombre" required placeholder="Tu Nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none" />
          <input type="email" name="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none" />
          <input type="email" name="confirmEmail" required placeholder="Confirmar Email" value={formData.confirmEmail} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none" />
          <div className="grid grid-cols-2 gap-2">
            <input type="password" name="password" required placeholder="Contraseña" value={formData.password} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none" />
            <input type="password" name="confirmPassword" required placeholder="Confirmar" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-purple-500 outline-none" />
          </div>
          
          <button type="submit" disabled={loading || googleLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 rounded-xl mt-2 hover:opacity-90 transition-all shadow-lg shadow-purple-900/20">
            {loading ? 'Creando cuenta...' : 'REGISTRARME'}
          </button>
        </form>

        <button onClick={() => router.push('/perfil')} className="mt-6 text-zinc-500 text-xs flex items-center gap-2 justify-center w-full hover:text-white transition-colors">
            <ArrowLeft size={12}/> Volver al login
        </button>
      </div>
    </div>
  );
}
