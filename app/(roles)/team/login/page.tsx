"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, Loader2 } from "lucide-react";
import { verifyTeamCredentials } from "./action";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function TeamLogin() {
  const { login } = useAuth(); // Usamos esto para mantener el estado global
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // PASO 1: Verificar contraseñas contra variables de entorno (Vercel/.env.local)
    // Esto es lo que realmente protege el acceso.
    const result = await verifyTeamCredentials(email, pass);

    if (!result.success) {
      setError("Credenciales incorrectas (Verifica Vercel Vars)");
      setLoading(false);
      return;
    }

    console.log("✅ Credenciales de Vercel válidas. Rol detectado:", result.role);

    // PASO 2: Intentar conectar con Firebase
    try {
      // Intentamos login normal
      await login(email, pass);
      router.push("/team/dashboard");
      
    } catch (err: any) {
      console.log("⚠️ Error en login Firebase:", err.code);

      // PASO 3: AUTO-REGISTRO
      // Si las credenciales de Vercel eran correctas, pero el usuario no existe en Firebase,
      // lo creamos automáticamente para permitir el acceso a los datos.
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
        try {
          console.log("🛠️ Usuario no existe en DB. Creando cuenta puente automáticamente...");
          
          // 1. Crear usuario en Authentication
          const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
          
          // 2. Guardar su rol en Firestore (admin o collab)
          // Esto es crucial para que luego el Dashboard sepa qué mostrar
          await setDoc(doc(db, "users", userCredential.user.uid), {
            email: email,
            role: result.role, // 'admin' o 'collab' (viene de action.ts)
            createdAt: new Date().toISOString()
          });

          console.log("✨ Usuario creado y configurado. Redirigiendo...");
          router.push("/team/dashboard");

        } catch (createErr: any) {
          console.error("❌ Error creando el usuario:", createErr);
          setError("Error crítico al crear usuario: " + createErr.message);
        }
      } else {
        // Otro tipo de error (red, etc.)
        setError("Error de conexión: " + err.code);
      }
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white border-4 border-red-900/10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6 text-gray-500"><ShieldAlert size={48} /></div>
        <h1 className="text-3xl font-black italic text-center mb-2 uppercase tracking-tighter text-white">TEAM ONLY</h1>
        <p className="text-center text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Secure Environment</p>

        <form onSubmit={handleLogin} className="space-y-4 bg-zinc-900 p-8 rounded-[2rem] border border-white/5">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/5 rounded-xl p-3 text-white focus:border-white/50 outline-none font-mono" placeholder="Admin/Collab Email" required />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full bg-black border border-white/5 rounded-xl p-3 text-white focus:border-white/50 outline-none" placeholder="Security Key" required />
          {error && <p className="text-red-500 text-xs text-center font-bold bg-red-900/10 p-2 rounded">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-white text-black p-4 rounded-xl font-black uppercase italic tracking-wider flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <>Auth <Lock size={14} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
