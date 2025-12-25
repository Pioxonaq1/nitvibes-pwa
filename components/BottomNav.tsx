"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicNav from "./navigation/PublicNav";
import ViberNav from "@/app/(roles)/viber/components/navigation/ViberNav";
import PartnerNav from "@/app/(roles)/partner/components/navigation/PartnerNav";

export default function BottomNav() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Lógica de inyección por rol [cite: 2025-12-21, 2025-12-25]
  if (!user) return <PublicNav />;

  switch (user.role) {
    case 'viber':
      return <ViberNav />;
    case 'partner':
      return <PartnerNav />;
    default:
      return <PublicNav />;
  }
}
