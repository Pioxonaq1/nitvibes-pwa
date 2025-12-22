"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Loader2 } from 'lucide-react';

export default function GovLogin() {
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
      // Login híbrido (email + contraseña)
      await login(email, password);
      router.push('/gov/dashboard'); 
    } catch (err: any) {
      console.error(err);
      setError('Credenciales inválidas. Verifica tu acceso gubernamental.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-900/20 rounded-full flex items-center justify-center mb-4 border border-green-900/30">
            <Building2 className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter">
            NITVIBES <span className="text-green-600">GOV</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">Acceso Institucional y Seguridad</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email Institucional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 py-6"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Código de Acceso"
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
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-6 rounded-xl transition-all"
            disabled={loading}
          >
            {loading ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin" /> Verificando...
                </span>
            ) : "ACCEDER AL PANEL"}
          </Button>
        </form>
      </div>
    </div>
  );
}
