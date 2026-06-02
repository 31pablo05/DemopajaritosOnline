// src/lib/sanity.js
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production";

// Sanity projectId must be lowercase a-z, 0-9 and dashes only.
// If not configured yet (placeholder value), skip client creation.
const isConfigured = projectId && /^[a-z0-9-]+$/.test(projectId);

export const sanityClient = isConfigured
  ? createClient({ projectId, dataset, useCdn: true, apiVersion: "2024-01-01" })
  : null;

const builder = isConfigured ? imageUrlBuilder(sanityClient) : null;

export function urlFor(source) {
  if (!builder) return { url: () => null };
  return builder.image(source);
}

// Trae todos los productos ordenados por el campo "order"
export async function getProducts() {
  if (!sanityClient) return [];
  return sanityClient.fetch(`
    *[_type == "product"] | order(order asc, _createdAt desc) {
      "id": _id,
      name,
      "category": category->slug.current,
      "categoryTitle": category->title,
      "categoryEmoji": category->emoji,
      price,
      description,
      hasSizes,
      sizes,
      tag,
      inStock,
      featured,
      "image": image.asset->url,
      "imageRef": image
    }
  `);
}

// Trae solo los productos marcados como destacados (para la home)
export async function getFeaturedProducts() {
  if (!sanityClient) return [];
  return sanityClient.fetch(`
    *[_type == "product" && featured == true] | order(order asc, _createdAt desc) {
      "id": _id,
      name,
      "category": category->slug.current,
      "categoryTitle": category->title,
      "categoryEmoji": category->emoji,
      price,
      description,
      hasSizes,
      sizes,
      tag,
      inStock,
      featured,
      "image": image.asset->url,
      "imageRef": image
    }
  `);
}

// Trae las categorías dinámicas para los filtros de la tienda
export async function getCategories() {
  if (!sanityClient) return [{ id: "todos", label: "Todos", emoji: "🛍️" }];
  const cats = await sanityClient.fetch(`
    *[_type == "category"] | order(order asc) {
      "id": slug.current,
      "label": title,
      emoji
    }
  `);
  return [{ id: "todos", label: "Todos", emoji: "🛍️" }, ...cats];
}
