"use client";
export default function VibeManager() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
      <h3 className="text-white font-black text-xs uppercase tracking-widest mb-4">🎥 Gestión de Vibes</h3>
      <button 
        onClick={() => window.open('/studio', '_blank')}
        className="w-full bg-white text-black text-[10px] font-black py-4 rounded-2xl uppercase hover:bg-zinc-200 transition-all"
      >
        Abrir Sanity Studio
      </button>
    </div>
  );
}
