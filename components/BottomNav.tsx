"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicNav from "./navigation/PublicNav";
import ViberNav from "@/app/(roles)/viber/components/navigation/ViberNav";
import PartnerNav from "@/app/(roles)/partner/components/navigation/PartnerNav";
import GovNav from "@/app/(roles)/gov/components/navigation/GovNav";
import TeamNav from "@/app/(roles)/team/components/navigation/TeamNav";

export default function BottomNav() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <PublicNav />;

  switch (user.role) {
    case 'viber':
      return <ViberNav />;
    case 'partner':
      return <PartnerNav />;
    case 'gov':
      return <GovNav />;
    case 'admin':
    case 'collaborator':
      return <TeamNav />;
    default:
      return <PublicNav />;
  }
}
