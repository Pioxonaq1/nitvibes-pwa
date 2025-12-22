import { createClient } from "next-sanity";

export const client = createClient({
  // CAMBIO IMPORTANTE: Quitamos los guiones bajos del fallback.
  // "dummyid123" cumple las reglas (a-z, 0-9) y no romperá el build.
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "dummyid123",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});
