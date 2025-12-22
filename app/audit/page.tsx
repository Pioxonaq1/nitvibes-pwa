"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AuditPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [envCheck, setEnvCheck] = useState<any>({});

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  useEffect(() => {
    // 1. CHEQUEO DE VARIABLES DE ENTORNO
    const envVars = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ OK" : "❌ FALTANTE",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? `✅ ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}` : "❌ FALTANTE",
      mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? "✅ OK" : "❌ FALTANTE",
    };
    setEnvCheck(envVars);

    // 2. PRUEBA DE CONEXIÓN A FIREBASE
    const testConnection = async () => {
      addLog("📡 Iniciando prueba de conexión a Firestore...");
      try {
        if (!db) throw new Error("La instancia 'db' es null. Revisa lib/firebase.ts");
        
        const querySnapshot = await getDocs(collection(db, "venues"));
        addLog(`✅ ¡CONEXIÓN EXITOSA!`);
        addLog(`📦 Documentos encontrados en 'venues': ${querySnapshot.size}`);
        
        if (querySnapshot.size === 0) {
          addLog("⚠️ La colección existe pero está vacía. ¿Hiciste el import en Rowy?");
        } else {
          const names = querySnapshot.docs.map(d => d.data().name).join(", ");
          addLog(`📝 Nombres recuperados: ${names}`);
        }
      } catch (error: any) {
        addLog(`❌ ERROR FATAL: ${error.message}`);
        console.error(error);
        if (error.code === "permission-denied") {
            addLog("🔒 CAUSA: Reglas de seguridad bloqueadas o mal configuradas.");
        }
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-10 bg-black text-white min-h-screen font-mono">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">🕵️ NITVIBES AUDIT</h1>
      
      <div className="mb-8 border border-gray-700 p-4 rounded bg-gray-900">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">1. Variables de Entorno (Codespace)</h2>
        <ul className="space-y-2">
          <li>API Key: {envCheck.apiKey}</li>
          <li>Project ID: {envCheck.projectId}</li>
          <li>Mapbox Token: {envCheck.mapboxToken}</li>
        </ul>
      </div>

      <div className="border border-gray-700 p-4 rounded bg-gray-900">
        <h2 className="text-xl font-bold text-green-400 mb-2">2. Log de Conexión Firebase</h2>
        <div className="bg-black p-4 rounded border border-gray-800 text-sm h-64 overflow-auto">
          {logs.map((log, i) => (
            <div key={i} className="mb-1 border-b border-gray-800 pb-1">{log}</div>
          ))}
        </div>
      </div>
    </div>
  );
}