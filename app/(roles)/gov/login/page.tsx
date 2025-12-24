
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Landmark, Loader2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";

export default function GovLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, pass);
      router.push("/gov/dashboard");

    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
        try {
          console.log("🔍 Buscando credenciales en Rowy (Gov Users)...");
          
          // INTENTO 1: Buscar en colección 'Gov Users' (Nombre UI)
          // Si Rowy creó la colección con otro ID (ej: gov_users), habrá que ajustarlo.
          // Usamos 'email' y 'password' según tu captura.
          const q = query(collection(db, "gov_users"), where("email", "==", email)); 
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            // Fallback por si la colección se llama distinto, intentamos 'Gov Users'
             setError("Credencial gubernamental no encontrada.");
             setLoading(false);
             return;
          }

          const govData = querySnapshot.docs[0].data();
          const storedPass = govData.password; // Según tu captura

          if (storedPass === pass) {
            console.log("✅ Credenciales Gov válidas. Autorizando...");
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            
            await setDoc(doc(db, "users", userCredential.user.uid), {
              email: email,
              role: 'gov',
              department: govData.department || 'General',
              createdAt: new Date().toISOString()
            });

            router.push("/gov/dashboard");
          } else {
            setError("Código de acceso incorrecto.");
          }

        } catch (rowyErr) {
          console.error(rowyErr);
          setError("Error validando credencial.");
        }
      } else {
        setError("Acceso denegado: " + err.code);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6 text-emerald-500"><Landmark size={48} /></div>
        <h1 className="text-3xl font-black italic text-center mb-2 uppercase tracking-tighter">GOV ACCESS</h1>
        <form onSubmit={handleLogin} className="space-y-4 bg-zinc-900/50 p-8 rounded-[2rem] border border-emerald-500/20">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none" placeholder="ID Credencial" required />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none" placeholder="Código Acceso" required />
          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-4 rounded-xl font-black uppercase italic tracking-wider flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
