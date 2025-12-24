"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Store, Loader2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";

export default function PartnerLogin() {
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
      router.push("/partner/dashboard");
    } catch (err: any) {
      // Si falla Firebase Auth, miramos en Firestore (Rowy)
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
        try {
          // CORRECCIÓN: Buscamos en "venues" (minúscula)
          const q = query(collection(db, "venues"), where("b2b_email", "==", email));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            setError("No existe una Venue con este email.");
            setLoading(false);
            return;
          }

          const venueData = querySnapshot.docs[0].data();
          if (venueData.b2b_password === pass) {
            // Crear usuario puente
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(db, "users", userCredential.user.uid), {
              email: email,
              role: 'partner',
              venueId: querySnapshot.docs[0].id,
              createdAt: new Date().toISOString()
            });
            router.push("/partner/dashboard");
          } else {
            setError("Contraseña incorrecta.");
          }
        } catch (rowyErr: any) {
          console.error(rowyErr);
          setError("Error técnico: " + rowyErr.message);
        }
      } else {
        setError("Error: " + err.code);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6 text-pink-500"><Store size={48} /></div>
        <h1 className="text-3xl font-black italic text-center mb-2 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Partner Hub</h1>
        <form onSubmit={handleLogin} className="space-y-4 bg-zinc-900/50 p-8 rounded-[2rem] border border-pink-500/20">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none" placeholder="Email Corporativo" required />
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-pink-500 outline-none" placeholder="Contraseña" required />
          {error && <p className="text-red-500 text-xs text-center font-bold">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-xl font-black uppercase italic tracking-wider flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Acceder Panel"}
          </button>
        </form>
      </div>
    </div>
  );
}
