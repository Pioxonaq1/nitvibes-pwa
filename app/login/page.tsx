'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES, ROUTES } from '@/lib/constants';

export default function ViberLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // A. LOGICA GOOGLE (Simulada por ahora)
  const handleGoogleLogin = () => {
    login({
        id: 'viber-google-1',
        name: 'Usuario Google',
        role: USER_ROLES.VIBER, // <--- ROL DE VIBER
        email: 'user@gmail.com'
    });
    router.push(ROUTES.DASHBOARD_VIBER); // O '/vibes'
  };

  // B. LOGICA EMAIL
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(email && password) {
        login({
            id: 'viber-email-1',
            name: 'Usuario Email',
            role: USER_ROLES.VIBER,
            email: email
        });
        router.push(ROUTES.DASHBOARD_VIBER);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative z-50">
        <div className="w-full max-w-md space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-white italic">
                    VIBER <span className="text-blue-500 not-italic">ACCESS</span>
                </h1>
                <p className="text-zinc-500 mt-2">Únete a la fiesta.</p>
            </div>

            {/* BOTÓN GOOGLE */}
            <button 
                onClick={handleGoogleLogin}
                className="w-full bg-zinc-200 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-colors"
            >
                {/* Icono G simple */}
                <span className="text-xl">G</span> 
                Continuar con Google
            </button>

            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-zinc-800"></div>
                <span className="flex-shrink-0 mx-4 text-zinc-600 text-xs">O con Email</span>
                <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            {/* FORMULARIO EMAIL */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@konnektwerk.com"
                    className="w-full bg-zinc-100/90 text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="•••••••••••••"
                    className="w-full bg-zinc-100/90 text-black px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-500 transition-colors"
                >
                    Iniciar Sesión
                </button>
            </form>

            <div className="text-center">
                <p className="text-zinc-500 text-sm">
                    ¿Nuevo aquí? <button onClick={() => router.push('/register')} className="text-blue-500 font-bold hover:underline">Regístrate</button>
                </p>
            </div>
        </div>
    </div>
  );
}