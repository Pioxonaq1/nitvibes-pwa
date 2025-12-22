"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Loader2 } from 'lucide-react';

export default function AdminLogin() {
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
      await login(email, password);
      // REGLA CUMPLIDA: "Inicia Sesión y entra directamente en el Panel"
      router.push(ROUTES.ADMIN_DASHBOARD); 
    } catch (err: any) {
      setError('Credenciales de Team inválidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-600" />
          <h2 className="mt-6 text-3xl font-black text-white tracking-tighter">
            NITVIBES <span className="text-red-600">TEAM</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">Acceso restringido a personal autorizado</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email Corporativo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-bold">{error}</p>}

          <Button 
            type="submit" 
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-6 rounded-xl"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "ACCEDER AL PANEL"}
          </Button>
        </form>
      </div>
    </div>
  );
}