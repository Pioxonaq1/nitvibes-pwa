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
  const [formData, setFormData] = useState({
    nombre: '', email: '', confirmEmail: '', password: '', confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.email !== formData.confirmEmail) return setError("❌ Los emails no coinciden.");
    if (formData.password !== formData.confirmPassword) return setError("❌ Las contraseñas no coinciden.");
    if (formData.password.length < 6) return setError("⚠️ Contraseña muy corta (min 6).");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // CORRECCIÓN CLAVE: "Viber" con mayúscula para coincidir con Rowy
      await setDoc(doc(db, "Viber", user.uid), {
        uid: user.uid,
        email: formData.email,
        nombre: formData.nombre,
        apellido1: '', apellido2: '', biografia: '', movil: '', foto: '', gustos: [], ciudad: '',
        role: 'viber',
        createdAt: serverTimestamp(),
      });

      router.push('/perfil');
    } catch (err: any) {
      setError(err.code === 'auth/email-already-in-use' ? "Email ya registrado." : "Error al crear cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans pb-24">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Registro <span className="text-purple-500">Viber</span></h1>
        {error && <div className="mb-4 bg-red-900/20 text-red-400 p-3 rounded text-xs">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" name="nombre" required placeholder="Tu Nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          <input type="email" name="email" required placeholder="Email" value={formData.email} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          <input type="email" name="confirmEmail" required placeholder="Confirmar Email" value={formData.confirmEmail} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          <input type="password" name="password" required placeholder="Contraseña" value={formData.password} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          <input type="password" name="confirmPassword" required placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm" />
          
          <button type="submit" disabled={loading} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl mt-4">
            {loading ? '...' : 'REGISTRARME'}
          </button>
        </form>
        <button onClick={() => router.push('/perfil')} className="mt-4 text-zinc-500 text-xs flex items-center gap-2 justify-center w-full"><ArrowLeft size={12}/> Volver</button>
      </div>
    </div>
  );
}
