'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'

const vibeSchema = {
  name: 'post',
  title: 'Vibe (Post)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'mainImage',
      title: 'Imagen Principal',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'body',
      title: 'Contenido',
      type: 'array',
      of: [{type: 'block'}]
    },
    {
      name: 'publishedAt',
      title: 'Fecha de Publicación',
      type: 'datetime'
    }
  ]
}

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  schema: {
    types: [vibeSchema],
  },

  plugins: [
    structureTool(),
    visionTool(),
  ],
})
