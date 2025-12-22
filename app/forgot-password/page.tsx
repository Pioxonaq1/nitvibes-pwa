"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const handle = async (e:any) => { e.preventDefault(); try { await sendPasswordResetEmail(auth, email); setMsg("Enviado."); } catch(e) { setErr("Error."); } };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-[#111] p-8 rounded-3xl border border-gray-800">
        <h2 className="text-2xl font-black mb-4">Recuperar</h2>
        {!msg ? <form onSubmit={handle} className="space-y-4"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white" placeholder="Email" /><button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl">ENVIAR</button></form> : <div className="text-green-400">{msg}</div>}
        <Link href="/perfil" className="block text-center mt-6 text-xs text-gray-500">Volver</Link>
      </div>
    </div>
  );
}