"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicNav from "./navigation/PublicNav";
import ViberNav from "@/app/(roles)/viber/components/navigation/ViberNav";
import VenueNav from "@/app/(roles)/partner/venues/components/navigation/VenueNav";

export default function BottomNav() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Si el rol es Viber (Usuario estándar) [cite: 2025-12-25]
  if (user?.role === 'viber') {
    return <ViberNav />;
  }

  // Si el rol es Partner (Venues) [cite: 2025-12-21, 2025-12-25]
  if (user?.role === 'partner') {
    return <VenueNav />;
  }

  // Menú público para anónimos [cite: 2025-12-25]
  return <PublicNav />;
}
