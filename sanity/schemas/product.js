// sanity/schemas/product.js
export default {
  name: "product",
  title: "Producto",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Nombre del producto",
      type: "string",
      validation: (Rule) => Rule.required().error("El nombre es obligatorio"),
    },
    {
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          { title: "Pijamas 😴", value: "pijamas" },
          { title: "Remeras 👕", value: "remeras" },
          { title: "Cubrecamas 🛏️", value: "cubrecamas" },
          { title: "Sets 🎁", value: "sets" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required().error("Elegí una categoría"),
    },
    {
      name: "image",
      title: "Foto del producto",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error("La foto es obligatoria"),
    },
    {
      name: "price",
      title: "Precio (en pesos ARS)",
      type: "number",
      validation: (Rule) =>
        Rule.required().min(1).error("El precio debe ser mayor a 0"),
    },
    {
      name: "description",
      title: "Descripción del producto",
      type: "text",
      rows: 3,
    },
    {
      name: "sizes",
      title: "Talles disponibles",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Talle 2", value: "2" },
          { title: "Talle 4", value: "4" },
          { title: "Talle 6", value: "6" },
          { title: "Talle 8", value: "8" },
          { title: "Talle 10", value: "10" },
          { title: "Talle 12", value: "12" },
          { title: "Talle 14", value: "14" },
          { title: "Talle 16", value: "16" },
          { title: "S", value: "S" },
          { title: "M", value: "M" },
          { title: "L", value: "L" },
          { title: "XL", value: "XL" },
          { title: "XXL", value: "XXL" },
        ],
      },
    },
    {
      name: "tag",
      title: "Etiqueta especial",
      type: "string",
      description: 'Ej: "Más vendido", "Nuevo", "¡Furor!" — dejalo vacío si no querés etiqueta',
    },
    {
      name: "inStock",
      title: "¿Tiene stock?",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "featured",
      title: "¿Destacado en la página de inicio?",
      type: "boolean",
      initialValue: false,
      description: "Si está activo, aparece en la sección de destacados de la home",
    },
    {
      name: "order",
      title: "Orden de aparición",
      type: "number",
      description: "Número menor = aparece primero en la tienda",
      initialValue: 99,
    },
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      subtitle: "category",
    },
    prepare({ title, media, subtitle }) {
      const labels = {
        pijamas: "😴 Pijamas",
        remeras: "👕 Remeras",
        cubrecamas: "🛏️ Cubrecamas",
        sets: "🎁 Sets",
      };
      return {
        title,
        media,
        subtitle: labels[subtitle] || subtitle,
      };
    },
  },
};
