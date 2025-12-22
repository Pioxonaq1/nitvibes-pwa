import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Componentes Visuales
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";

// 2. Providers (Contextos)
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext"; // <--- NUEVO: Importamos el Auth

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nitvibes",
  description: "Descubre el pulso nocturno de Barcelona",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {/* 3. ENVOLVEMOS CON EL AUTH PROVIDER */}
        <AuthProvider>
          <LanguageProvider>
            
            {/* Contenido de la página */}
            {children}

            {/* Elementos Fijos */}
            <BottomNav />
            <Footer />
            
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}