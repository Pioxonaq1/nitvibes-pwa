/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path will be handled by this file using Next.js Rewrites & Layouts.
 */
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config' // 👈 Usamos @ para ir directo a la raíz sin contar puntos

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
