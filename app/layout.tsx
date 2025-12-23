import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NITVIBES | Tu noche comienza aquí",
  description: "Descubre los mejores bares, clubes y eventos en tiempo real.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-black text-white`}>
        <AuthProvider>
          {children}
          {/* El Navbar se renderiza aquí para todas las páginas [cite: 2025-12-23] */}
          <Navbar />
        </AuthProvider>
      </body>
    </html>
  );
}