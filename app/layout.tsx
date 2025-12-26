import React from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "NITVIBES",
  description: "Tu noche comienza aquí",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/logo-nitvibes.png" />
      </head>
      <body className="bg-black antialiased selection:bg-yellow-400 selection:text-black">
        <AuthProvider>
          {children}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
