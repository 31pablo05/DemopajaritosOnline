import { createContext, useContext, useState, useEffect, useRef } from "react";
import { buildWhatsAppURL, formatARS } from "../../data/products.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addItem = (product, size, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && i.selectedSize === size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.selectedSize === size
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          emoji: product.emoji,
          image: product.image ?? null,
          bgColor: product.bgColor || (product.category === "remeras" || product.category === "cubrecamas" ? "#fb8a01" : "#c1b3fc"),
          selectedSize: size,
          qty,
        },
      ];
    });
  };

  // Listen for cart:add events from ProductGrid island (cross-island communication)
  const addItemRef = useRef(addItem);
  useEffect(() => { addItemRef.current = addItem; });
  useEffect(() => {
    const handler = (e) => addItemRef.current(e.detail.product, e.detail.size, e.detail.qty || 1);
    window.addEventListener("cart:add", handler);
    return () => window.removeEventListener("cart:add", handler);
  }, []);

  const removeItem = (id, size) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.selectedSize === size))
    );
  };

  const updateQty = (id, size, delta) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id && i.selectedSize === size
            ? { ...i, qty: i.qty + delta }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((s, i) => s + i.qty, 0);
  const cartTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const isEmpty = items.length === 0;

  const buildCheckoutWhatsAppURL = (cartItems, customerData) => {
    const WA_NUMBER = "5492804370444";
    const pagoLabels = {
      efectivo: "Efectivo / Débito",
      transferencia: "Transferencia bancaria",
      credito3: "Crédito 3 cuotas sin interés",
      patagonia: "Patagonia 365 (6 cuotas)",
    };
    const envioLabels = {
      retiro: "Retiro en tienda (Brown 21, Local 2 — Trelew)",
      trelew: "Envío a domicilio en Trelew (gratis)",
      interior: `Envío al interior — ${customerData.ciudad}`,
    };
    const lines = cartItems.map(
      (i) =>
        `• ${i.name}${i.selectedSize && i.selectedSize !== "Único" ? ` (Talle: ${i.selectedSize})` : ""} x${i.qty} → ${formatARS(i.price * i.qty)}`
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
      "👤 *MIS DATOS:*",
      `Nombre: ${customerData.nombre}`,
      `Pago: ${pagoLabels[customerData.pago] || customerData.pago}`,
      `Envío: ${envioLabels[customerData.envio] || customerData.envio}`,
      "",
      "📦 ¿Me confirman disponibilidad?",
      "",
      "¡Gracias! 😊",
    ].join("\n");
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartOpen,
        setCartOpen,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
        isEmpty,
        buildWhatsAppURL,
        buildCheckoutWhatsAppURL,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
