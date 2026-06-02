import { useState } from "react";
import { formatARS } from "../../data/products.js";

export default function ProductModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  if (!product) return null;

  const hasSizes = product.hasSizes !== false && product.sizes && product.sizes.length > 0;
  const canAdd = !hasSizes || selectedSize;

  const handleAdd = () => {
    if (!canAdd) return;
    window.dispatchEvent(
      new CustomEvent("cart:add", {
        detail: { product, size: selectedSize || "Único", qty },
      })
    );
    setShowToast(true);
    setTimeout(() => { setShowToast(false); onClose(); }, 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-fade"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[448px] z-50 bg-white rounded-t-3xl md:rounded-3xl max-h-[92vh] md:max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
        {/* Handle */}
        <div className="sticky top-0 bg-white pt-4 pb-2 px-5 z-10">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-3" />
          <button
            onClick={onClose}
            className="absolute top-4 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition text-lg"
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-8">
          {/* Imagen grande */}
          <div
            className="w-full rounded-2xl overflow-hidden mb-4 flex items-center justify-center"
            style={{ height: "260px", background: "#f5f0ff" }}
          >
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-8xl">{product.emoji ?? "📦"}</span>
            )}
          </div>

          {/* Tag */}
          {product.tag && (
            <span
              className="inline-block text-white text-xs font-black px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: "#fb8a01" }}
            >
              {product.tag}
            </span>
          )}

          {/* Nombre y precio */}
          <h2 className="text-2xl font-black mb-1" style={{ color: "#2d1f5e" }}>
            {product.name}
          </h2>
          <p className="text-3xl font-black mb-1" style={{ color: "#fb8a01" }}>
            {formatARS(product.price)}
          </p>
          <p className="text-xs text-gray-500 mb-4">Precio en efectivo / débito / transferencia</p>

          {/* Badges de envío */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#f0fdf4", color: "#16a34a" }}>
              🚚 Envío gratis en Trelew
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#eff6ff", color: "#2563eb" }}>
              📦 Envíos a todo el país
            </span>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#fff7ed", color: "#ea580c" }}>
              💳 3 cuotas sin interés
            </span>
          </div>

          {/* Descripción */}
          {product.description && (
            <div className="mb-5">
              <p className="font-black text-sm mb-1" style={{ color: "#2d1f5e" }}>Descripción</p>
              <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Selector de talles */}
          {hasSizes && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <p className="font-black text-sm" style={{ color: "#2d1f5e" }}>Elegí tu talle:</p>
                {selectedSize && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#fb8a01" }}>
                    {selectedSize} seleccionado
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="px-4 py-2 rounded-xl border-2 font-black text-sm transition"
                    style={{
                      borderColor: selectedSize === size ? "#fb8a01" : "#e5e7eb",
                      background: selectedSize === size ? "#fb8a01" : "white",
                      color: selectedSize === size ? "white" : "#374151",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de cantidad */}
          <div className="flex items-center gap-4 mb-6">
            <p className="font-black text-sm" style={{ color: "#2d1f5e" }}>Cantidad:</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xl font-black transition"
                style={{ borderColor: "#fb8a01", color: "#fb8a01" }}
              >
                −
              </button>
              <span className="w-8 text-center font-black text-lg">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-black text-white transition"
                style={{ background: "#fb8a01" }}
              >
                +
              </button>
            </div>
            <span className="text-sm font-black ml-auto" style={{ color: "#2d1f5e" }}>
              = {formatARS(product.price * qty)}
            </span>
          </div>

          {/* Botón agregar */}
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="w-full py-4 rounded-2xl font-black text-lg transition"
            style={{
              background: canAdd ? "#fb8a01" : "#e5e7eb",
              color: canAdd ? "white" : "#9ca3af",
              cursor: canAdd ? "pointer" : "not-allowed",
            }}
          >
            {hasSizes && !selectedSize
              ? "Elegí un talle primero"
              : `Agregar al carrito 🛒 · ${formatARS(product.price * qty)}`}
          </button>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div
          className="fixed bottom-6 left-1/2 z-[60] bg-brand-orange text-white px-6 py-3 rounded-full font-bold shadow-lg animate-toast whitespace-nowrap"
          style={{ transform: "translateX(-50%)" }}
        >
          ✅ ¡Agregado al carrito!
        </div>
      )}
    </>
  );
}
