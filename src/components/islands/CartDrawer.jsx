import { useCart } from "./CartProvider.jsx";
import { formatARS } from "../../data/products.js";

export default function CartDrawer() {
  const { items, cartOpen, setCartOpen, removeItem, updateQty, cartTotal, isEmpty, buildWhatsAppURL } = useCart();

  if (!cartOpen) return null;

  const whatsappUrl = buildWhatsAppURL(items);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl animate-slide-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-xl text-brand-text">🛒 Mi Carrito</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="text-6xl">🛍️</span>
              <p className="text-gray-500 font-semibold">Tu carrito está vacío</p>
              <button
                onClick={() => setCartOpen(false)}
                className="bg-brand-orange text-white font-bold py-3 px-6 rounded-full hover:bg-brand-orange-dark transition"
              >
                Ver productos
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex items-center gap-3 bg-brand-purple-light rounded-2xl p-3"
                >
                  {/* Emoji thumbnail */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    {item.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm leading-tight truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Talle: {item.selectedSize}</p>
                    <p className="text-brand-orange font-black text-sm">{formatARS(item.price * item.qty)}</p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQty(item.id, item.selectedSize, -1)}
                      className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 font-bold hover:bg-gray-50 transition"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-black text-sm">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.selectedSize, 1)}
                      className="w-7 h-7 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold hover:bg-brand-orange-dark transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id, item.selectedSize)}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 transition text-lg shrink-0"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3 bg-white">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700">Total:</span>
              <span className="text-2xl font-black text-brand-orange">{formatARS(cartTotal)}</span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-brand-whatsapp hover:bg-brand-whatsapp-dark text-white font-black py-4 rounded-full flex items-center justify-center gap-2 text-lg transition"
            >
              <span>💬</span> Pedir por WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}
