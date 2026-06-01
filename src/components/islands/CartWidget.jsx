import { CartProvider } from "./CartProvider.jsx";
import CartButton from "./CartButton.jsx";
import CartDrawer from "./CartDrawer.jsx";

// Self-contained cart island: wraps CartProvider so CartButton and CartDrawer
// share the same React context. Cross-island communication (ProductGrid → here)
// happens via the "cart:add" custom DOM event handled in CartProvider.
export default function CartWidget() {
  return (
    <CartProvider>
      <CartButton />
      <CartDrawer />
    </CartProvider>
  );
}
