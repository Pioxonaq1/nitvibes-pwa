"use client";
export default function WeeklyBrain() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4">🧠 Cerebro Semanal</h3>
      <div className="h-32 flex items-center justify-center border border-dashed border-zinc-700 rounded-2xl">
        <p className="text-zinc-500 text-[10px] uppercase font-bold">Gráficas de Proyección Semanal - Solo Admin</p>
      </div>
    </div>
  );
}
