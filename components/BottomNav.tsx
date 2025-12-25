"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicNav from "./navigation/PublicNav";
import ViberNav from "./navigation/ViberNav";
import PartnerNav from "./navigation/PartnerNav";
import TeamNav from "./navigation/TeamNav";

export default function BottomNav() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <PublicNav />;

  switch (user.role) {
    case 'viber':
      return <ViberNav />;
    case 'partner':
      return <PartnerNav />;
    case 'admin':
    case 'collaborator':
      return <TeamNav />;
    default:
      return <PublicNav />;
  }
}
