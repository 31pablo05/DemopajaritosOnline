// src/data/products.js
// Datos mock — en producción estos vienen de Sanity CMS

export const categories = [
  { id: "todos",       label: "Todos",       emoji: "🛍️" },
  { id: "pijamas",    label: "Pijamas",     emoji: "😴" },
  { id: "remeras",    label: "Remeras",     emoji: "👕" },
  { id: "cubrecamas", label: "Cubrecamas",  emoji: "🛏️" },
  { id: "sets",       label: "Sets",        emoji: "🎁" },
];

export const products = [
  {
    id: "pij-dino",
    name: "Pijama Dinosaurio",
    category: "pijamas",
    price: 9500,
    description: "Suave y cómodo con estampas de dinosaurios. Perfecto para las noches de aventura.",
    sizes: ["2", "4", "6", "8", "10", "12"],
    emoji: "🦕",
    bgColor: "#7B3FA0",
    tag: "Más vendido",
    tagColor: "#F7941D",
    inStock: true,
  },
  {
    id: "pij-unicornio",
    name: "Pijama Unicornio",
    category: "pijamas",
    price: 9500,
    description: "Estampas de unicornios brillantes y coloridas. Ideal para las princesas de la casa.",
    sizes: ["2", "4", "6", "8", "10"],
    emoji: "🦄",
    bgColor: "#7B3FA0",
    tag: "Nuevo",
    tagColor: "#7B3FA0",
    inStock: true,
  },
  {
    id: "pij-bluey",
    name: "Pijama Bluey",
    category: "pijamas",
    price: 10500,
    description: "Con Bluey y Bingo. El favorito absoluto de los más chiquitos de la casa.",
    sizes: ["2", "4", "6", "8", "10"],
    emoji: "🐕",
    bgColor: "#7B3FA0",
    tag: "¡Furor!",
    tagColor: "#F7941D",
    inStock: true,
  },
  {
    id: "pij-messi",
    name: "Pijama Messi",
    category: "pijamas",
    price: 11000,
    description: "Para los fanáticos del 10. Estampa exclusiva con el mejor jugador del mundo.",
    sizes: ["4", "6", "8", "10", "12", "14"],
    emoji: "⚽",
    bgColor: "#7B3FA0",
    tag: "Edición especial",
    tagColor: "#e11d48",
    inStock: true,
  },
  {
    id: "rem-estampada",
    name: "Remera Estampada",
    category: "remeras",
    price: 5500,
    description: "Diseños únicos y coloridos en una gran variedad de estampas para todos los gustos.",
    sizes: ["4", "6", "8", "10", "12", "14", "16"],
    emoji: "👕",
    bgColor: "#fb8a01",
    tag: null,
    inStock: true,
  },
  {
    id: "rem-personalizada",
    name: "Remera Personalizada",
    category: "remeras",
    price: 7000,
    description: "Con tu diseño o foto favorita. Consultanos por WhatsApp para coordinar.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    emoji: "✨",
    bgColor: "#fb8a01",
    tag: "A pedido",
    tagColor: "#7B3FA0",
    inStock: true,
  },
  {
    id: "cub-argentina",
    name: "Cubrecama Argentina",
    category: "cubrecamas",
    price: 18500,
    description: "Edición especial Argentina con el sol celeste y blanco. Ideal para regalo.",
    sizes: ["1 plaza", "2 plazas"],
    emoji: "🇦🇷",
    bgColor: "#fb8a01",
    tag: "Destacado",
    tagColor: "#F7941D",
    inStock: true,
  },
  {
    id: "set-combo",
    name: "Set Pijama + Remera",
    category: "sets",
    price: 14000,
    description: "Pijama a elección + remera estampada coordinada. El combo perfecto a precio especial.",
    sizes: ["4", "6", "8", "10", "12"],
    emoji: "🎁",
    bgColor: "#7B3FA0",
    tag: "¡Combo!",
    tagColor: "#16a34a",
    inStock: true,
  },
];

// Info del local
export const storeInfo = {
  name: "Pajaritos en la Cabeza",
  address: "Brown 21, Local 2 — Trelew, Chubut",
  whatsapp: "5492804370444",
  instagram: "pajaritos.enla.cabeza",
  hours: {
    weekdays: "9:30 a 12:30 hs / 17:30 a 20:30 hs",
    saturday: "10:00 a 13:00 hs / 17:30 a 20:30 hs",
  },
  payments: ["Efectivo y débito", "Transferencia", "Crédito 3 cuotas sin interés", "Patagonia 365 (6 cuotas)"],
  shipping: ["Gratis en Trelew", "A todo el país por correo o encomienda"],
};

// Helpers
export const formatARS = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

export const buildWhatsAppURL = (cartItems) => {
  const lines = cartItems.map(
    (i) => `• ${i.name} (Talle: ${i.selectedSize}) x${i.qty} → ${formatARS(i.price * i.qty)}`
  );
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const msg = [
    "¡Hola Pajaritos! 🐦✨ Quiero hacer el siguiente pedido:",
    "",
    "🛒 *DETALLE DEL PEDIDO:*",
    ...lines,
    "",
    `💰 *TOTAL: ${formatARS(total)}*`,
    "",
    "📦 ¿Me confirman disponibilidad y datos del envío?",
    "",
    "¡Gracias! 😊",
  ].join("\n");
  return `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(msg)}`;
};
