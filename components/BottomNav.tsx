"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicNav from "./navigation/PublicNav";
import ViberNav from "@/app/(roles)/viber/components/navigation/ViberNav";
import VenueNav from "@/app/(roles)/partner/venues/components/navigation/VenueNav";

export default function BottomNav() {
  const { user, loading } = useAuth();
  if (loading) return null;
  
  if (user?.role === 'viber') return <ViberNav />;
  if (user?.role === 'partner') return <VenueNav />;
  
  return <PublicNav />;
}
