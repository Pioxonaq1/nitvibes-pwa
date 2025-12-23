export default function MapaPage() {
  return (
    <main className="fixed inset-0 flex flex-col bg-black overflow-hidden">
      {/* Header flotante para no ocupar espacio real [cite: 2025-12-23] */}
      <div className="absolute top-10 w-full text-center z-20 pointer-events-none">
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-green-400 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          VIBE <span className="text-white">MAP</span>
        </h1>
      </div>

      {/* Componente de Mapa [cite: 2025-12-18] */}
      <div className="relative w-full h-full">
        <MapboxMap />
      </div>
      
      {/* El Navbar ya se carga desde el layout.tsx global [cite: 2025-12-21] */}
    </main>
  );
}