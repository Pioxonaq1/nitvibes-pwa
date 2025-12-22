import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import BottomMenu from "@/components/BottomMenu"; // Usamos el BUENO

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nitvibes",
  description: "Descubre el vibe de tu ciudad",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen pb-16">
              {children}
            </div>
            {/* El menú de navegación inteligente */}
            <BottomMenu />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}