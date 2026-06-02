import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemas/index'

export default defineConfig({
  name: 'pajaritos-tienda',
  title: 'Pajaritos en la Cabeza',
  projectId: 'kh37zdbj',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
