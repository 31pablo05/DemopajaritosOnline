import { useCart } from "./CartProvider.jsx";
import { formatARS } from "../../data/products.js";

export default function CartButton() {
  const { cartCount, cartTotal, isEmpty, setCartOpen } = useCart();

  return (
    <button
      onClick={() => setCartOpen(true)}
      className="flex items-center gap-2 bg-white border-2 border-brand-orange rounded-full px-4 py-2 font-bold text-sm transition hover:bg-brand-orange-light"
    >
      <span className="text-lg">🛒</span>
      {isEmpty ? (
        <span className="text-brand-orange font-bold">Mi carrito</span>
      ) : (
        <>
          <span className="bg-brand-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">
            {cartCount}
          </span>
          <span className="text-brand-orange font-black">{formatARS(cartTotal)}</span>
        </>
      )}
    </button>
  );
}
