// sanity/schemas/category.js
export default {
  name: 'category',
  title: 'Categoría',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Nombre de la categoría',
      type: 'string',
      validation: (Rule) => Rule.required().error('El nombre es obligatorio'),
    },
    {
      name: 'slug',
      title: 'Identificador único',
      type: 'slug',
      description: 'Se genera automáticamente desde el nombre. No lo modifiques una vez creado.',
      options: { source: 'title', maxLength: 50 },
      validation: (Rule) => Rule.required().error('El slug es obligatorio'),
    },
    {
      name: 'emoji',
      title: 'Emoji (opcional)',
      type: 'string',
      description: 'Ej: 😴 🧥 🎒 — aparece junto al nombre en los filtros de la tienda',
    },
    {
      name: 'order',
      title: 'Orden en el menú',
      type: 'number',
      description: 'Número menor = aparece primero en los filtros',
      initialValue: 99,
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'emoji' },
    prepare({ title, subtitle }) {
      return { title: `${subtitle || ''} ${title}`.trim() }
    },
  },
}
