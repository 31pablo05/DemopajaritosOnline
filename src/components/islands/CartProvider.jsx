import { createContext, useContext, useState, useEffect, useRef } from "react";
import { buildWhatsAppURL } from "../../data/products.js";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addItem = (product, size) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === product.id && i.selectedSize === size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.selectedSize === size
            ? { ...i, qty: i.qty + 1 }
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
          qty: 1,
        },
      ];
    });
  };

  // Listen for cart:add events from ProductGrid island (cross-island communication)
  const addItemRef = useRef(addItem);
  useEffect(() => { addItemRef.current = addItem; });
  useEffect(() => {
    const handler = (e) => addItemRef.current(e.detail.product, e.detail.size);
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
