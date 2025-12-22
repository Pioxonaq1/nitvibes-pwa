"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Loader2, Store } from 'lucide-react';

export default function BusinessLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ AHORA SÍ: Usamos la función login correctamente (email, password)
      await login(email, password);
      
      // Redirigimos al Dashboard de Business
      router.push(ROUTES.PARTNER_DASHBOARD || '/business'); 
    } catch (err: any) {
      console.error(err);
      setError('Error de acceso. Verifica tus credenciales de Partner.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* HEADER */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <Store className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">
            NITVIBES <span className="text-blue-500">PARTNER</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">Gestión de Venues y Eventos</p>
        </div>

        {/* FORMULARIO */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email del Negocio"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 py-6"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 py-6"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/20 border border-red-900/50">
                <p className="text-red-400 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl transition-all"
            disabled={loading}
          >
            {loading ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Accediendo...
                </span>
            ) : "ENTRAR AL DASHBOARD"}
          </Button>
          
          <div className="text-center mt-4">
            <p className="text-xs text-zinc-500">
              ¿No tienes cuenta? <a href="/register" className="text-blue-400 hover:text-blue-300">Regístrate aquí</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
