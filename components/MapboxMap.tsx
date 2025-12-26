"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAuth } from "@/context/AuthContext";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export default function MapboxMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapbox-gl.Map | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [2.1734, 41.3851],
      zoom: 13,
      pitch: 45,
    });

    mapRef.current.on("load", () => {
      if (!mapRef.current) return;

      if (!user || user.role === "visitor") {
        mapRef.current.addSource("cyan-dots", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: Array.from({ length: 50 }).map(() => ({
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: [2.1734 + (Math.random() - 0.5) * 0.05, 41.3851 + (Math.random() - 0.5) * 0.05],
              },
            })),
          },
        });

        mapRef.current.addLayer({
          id: "cyan-layer",
          type: "circle",
          source: "cyan-dots",
          paint: {
            "circle-radius": 4,
            "circle-color": "#00ffff",
            "circle-opacity": 0.6,
            "circle-blur": 1,
          },
        });
      }
    });

    return () => mapRef.current?.remove();
  }, [user]);

  return <div ref={mapContainerRef} className="w-full h-full min-h-[100dvh]" />;
}
