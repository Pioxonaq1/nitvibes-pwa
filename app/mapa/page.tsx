import MapboxMap from '@/components/MapboxMap';
import BottomNav from '@/components/BottomNav';

export default function MapaGeneralPage() {
  return (
    <main className="h-screen w-full bg-black relative overflow-hidden">
      <MapboxMap />
      <BottomNav />
    </main>
  );
}
