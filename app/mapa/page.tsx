import MapboxMap from "@/components/MapboxMap";

export default function MapaPage() {
  return (
    <div className="relative w-full h-screen bg-black">
      {/* El Mapa ocupa toda la pantalla detrás */}
      <MapboxMap />

      {/* Título flotante encima del mapa (Overlay) */}
      <div className="absolute top-4 left-0 w-full z-10 text-center pointer-events-none">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-white drop-shadow-lg italic tracking-tighter">
          VIBE MAP
        </h1>
      </div>
    </div>
  );
}
