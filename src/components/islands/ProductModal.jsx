import { useState } from "react";
import { formatARS } from "../../data/products.js";

// Communicates with CartWidget island via custom DOM event (cross-island pattern)
export default function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [showToast, setShowToast] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    if (!selectedSize) return;
    window.dispatchEvent(
      new CustomEvent("cart:add", { detail: { product, size: selectedSize } })
    );
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-fade"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-5 pt-5 pb-8 max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-5" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition text-lg"
        >
          ✕
        </button>

        {/* Product image area */}
        <div
          className="w-full rounded-2xl flex items-center justify-center text-7xl mb-5"
          style={{ backgroundColor: product.bgColor, height: "180px" }}
        >
          {product.emoji}
        </div>

        {/* Info */}
        <div className="mb-4">
          {product.tag && (
            <span
              className="inline-block text-white text-xs font-black px-3 py-1 rounded-full mb-2"
              style={{ backgroundColor: "#fb8a01" }}
            >
              {product.tag}
            </span>
          )}
          <h2 className="text-2xl text-gray-900 mb-1">{product.name}</h2>
          <p className="text-brand-orange text-2xl font-black mb-2">{formatARS(product.price)}</p>
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
        </div>

        {/* Size selector */}
        <div className="mb-6">
          <p className="font-bold text-gray-700 mb-3">Elegí tu talle:</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-full border-2 font-bold text-sm transition ${
                  selectedSize === size
                    ? "border-brand-orange bg-brand-orange text-white"
                    : "border-gray-200 text-gray-700 hover:border-brand-orange hover:text-brand-orange"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleAdd}
          disabled={!selectedSize}
          className={`w-full py-4 rounded-full font-black text-lg transition ${
            selectedSize
              ? "bg-brand-orange hover:bg-brand-orange-dark text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {selectedSize ? "Agregar al carrito 🛒" : "Elegí un talle primero"}
        </button>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 z-[60] bg-brand-orange text-white px-6 py-3 rounded-full font-bold shadow-lg animate-toast whitespace-nowrap"
          style={{ transform: "translateX(-50%)" }}
        >
          ✅ ¡Agregado al carrito!
        </div>
      )}
    </>
  );
}
