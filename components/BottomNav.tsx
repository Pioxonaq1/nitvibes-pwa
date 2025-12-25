"use client";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import PublicNav from "./navigation/PublicNav";
import ViberNav from "./navigation/ViberNav";

export default function BottomNav() {
  const { user, loading } = useAuth();

  if (loading) return null;

  // Si hay usuario (registrado o Google), y su rol es viber, mostramos su menú
  if (user && user.role === 'viber') {
    return <ViberNav />;
  }

  // Por defecto el menú público
  return <PublicNav />;
}
