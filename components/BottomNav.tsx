"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicNav from "./navigation/PublicNav";
import ViberNav from "@/app/(roles)/viber/components/navigation/ViberNav";

export default function BottomNav() {
  const { user, loading } = useAuth();
  if (loading) return null;

  // REGLA: Si hay rastro de rol viber, siempre usar ViberNav [cite: 2025-12-25]
  if (user && user.role === 'viber') {
    return <ViberNav />;
  }
  return <PublicNav />;
}
