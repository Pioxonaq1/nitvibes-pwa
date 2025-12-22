"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 1. LOGIN CON EMAIL (MAGIC LINK)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // AuthContext real: Si solo pasas email, envía Magic Link
      await login(email); 
      // No redirigimos forzosamente porque el usuario debe ir a su correo
    } catch (error) {
      console.error("Error login email:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. LOGIN CON GOOGLE (REAL)
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // AuthContext real: Abre popup de Google
      await loginWithGoogle();
      router.push('/perfil'); 
    } catch (error) {
      console.error("Error login google:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Fondo Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-20 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-black/80 to-black z-0"></div>

      <div className="w-full max-w-md space-y-8 relative z-10 bg-black/40 p-8 rounded-3xl backdrop-blur-sm border border-white/5">
        
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-yellow-400/10 rounded-full flex items-center justify-center mb-4 border border-yellow-400/20 shadow-[0_0_15px_rgba(250,204,21,0.2)]">
            <Zap className="h-8 w-8 text-yellow-400" fill="currentColor" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter italic">
            NITVIBES
          </h2>
          <p className="mt-2 text-sm text-gray-400">Tu pasaporte a la noche.</p>
        </div>

        <div className="space-y-4 mt-8">
          
          {/* BOTÓN GOOGLE */}
          <Button 
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full bg-white text-black hover:bg-gray-200 font-bold py-6 rounded-xl flex items-center gap-3 transition-transform active:scale-95"
          >
            {googleLoading ? <Loader2 className="animate-spin" /> : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-5 h-5"/>
                Continuar con Google
              </>
            )}
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black/50 px-2 text-zinc-500 backdrop-blur">O usa tu email</span>
            </div>
          </div>

          {/* FORMULARIO EMAIL */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-zinc-900/50 border-zinc-700 text-white placeholder:text-zinc-600 py-6 text-center focus:border-yellow-400 transition-colors"
            />
            <Button 
              type="submit" 
              className="w-full bg-transparent border border-zinc-600 hover:bg-zinc-800 text-white font-bold py-6 rounded-xl transition-all"
              disabled={loading}
            >
               {loading ? <Loader2 className="animate-spin" /> : "Enviar Enlace de Acceso"}
            </Button>
          </form>

          <div className="pt-4 text-center">
             <Link href="/register" className="text-sm text-yellow-400 hover:underline font-bold">
                ¿No tienes cuenta? Regístrate aquí
             </Link>
          </div>

        </div>
      </div>
      
      <div className="relative z-10 mt-8">
         <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold">
            <ArrowLeft size={14} /> VOLVER AL INICIO
         </Link>
      </div>

    </div>
  );
}
