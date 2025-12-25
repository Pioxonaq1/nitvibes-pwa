"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicNav from "./navigation/PublicNav";
import ViberNav from "@/app/(roles)/viber/components/navigation/ViberNav";
import PartnerNav from "@/app/(roles)/partner/components/navigation/PartnerNav";
import TeamNav from "@/app/(roles)/team/components/navigation/TeamNav";
import GovNav from "@/app/(roles)/gov/components/navigation/GovNav";

export default function BottomNav() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // REGLA: Si no hay usuario, menú público [cite: 2025-12-25]
  if (!user) return <PublicNav />;

  // REGLA: Cada rol usa el menú de su propia carpeta [cite: 2025-12-25]
  switch (user.role) {
    case 'viber':
      return <ViberNav />;
    case 'partner':
      return <PartnerNav />;
    case 'admin':
    case 'collaborator':
      return <TeamNav />;
    case 'gov':
      return <GovNav />;
    default:
      return <PublicNav />;
  }
}
