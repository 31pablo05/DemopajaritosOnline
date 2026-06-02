import { useState } from "react";
import { createPortal } from "react-dom";
import { useCart } from "./CartProvider.jsx";
import { formatARS } from "../../data/products.js";

const PAGOS = [
  { id: "efectivo", label: "Efectivo / Débito", icon: "💵" },
  { id: "transferencia", label: "Transferencia", icon: "🏦" },
  { id: "credito3", label: "Crédito 3 cuotas s/i", icon: "💳" },
  { id: "patagonia", label: "Patagonia 365 (6 cuotas)", icon: "🦅" },
];

const ENVIOS = [
  { id: "retiro", label: "Retiro en tienda", detail: "Brown 21, Local 2 — Trelew", icon: "🏪", free: true },
  { id: "trelew", label: "Envío en Trelew", detail: "Envío gratis a domicilio", icon: "🚚", free: true },
  { id: "interior", label: "Envío al interior", detail: "Correo / encomienda — a coordinar", icon: "📦", free: false },
];

export default function CartDrawer() {
  const { items, cartOpen, setCartOpen, removeItem, updateQty, cartTotal, isEmpty, buildCheckoutWhatsAppURL } = useCart();
  const [step, setStep] = useState("cart");
  const [form, setForm] = useState({ nombre: "", pago: "", envio: "", ciudad: "" });
  const [errors, setErrors] = useState({});

  if (!cartOpen) return null;

  const handleClose = () => {
    setCartOpen(false);
    setStep("cart");
    setForm({ nombre: "", pago: "", envio: "", ciudad: "" });
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresá tu nombre";
    if (!form.pago) e.pago = "Elegí un medio de pago";
    if (!form.envio) e.envio = "Elegí una opción de envío";
    if (form.envio === "interior" && !form.ciudad.trim()) e.ciudad = "Ingresá tu ciudad";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    const url = buildCheckoutWhatsAppURL(items, form);
    window.open(url, "_blank");
    handleClose();
  };

  const STEPS = ["Carrito", "Datos", "WhatsApp"];

  return createPortal(
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade"
        onClick={handleClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl animate-slide-right">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {step === "checkout" && (
              <button
                onClick={() => setStep("cart")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500 text-lg"
              >
                ←
              </button>
            )}
            <h2 className="text-xl font-black" style={{ color: "#2d1f5e" }}>
              {step === "cart" ? "🛒 Mi Carrito" : "📋 Datos del pedido"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-xl transition"
          >✕</button>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-1 px-5 py-3 border-b border-gray-100 bg-gray-50">
          {STEPS.map((s, i) => {
            const active = (step === "cart" && i === 0) || (step === "checkout" && i === 1);
            const done = (step === "checkout" && i === 0);
            return (
              <div key={s} className="flex items-center gap-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: done ? "#16a34a" : active ? "#fb8a01" : "#e5e7eb", color: (done || active) ? "white" : "#9ca3af" }}
                  >
                    {done ? "✓" : i + 1}
                  </div>
                  <span className="text-xs font-bold" style={{ color: active ? "#fb8a01" : done ? "#16a34a" : "#9ca3af" }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <span className="text-gray-300 mx-1 text-xs">›</span>}
              </div>
            );
          })}
        </div>

        {/* STEP 1: CARRITO */}
        {step === "cart" && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {isEmpty ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <span className="text-6xl">🛍️</span>
                  <p className="text-gray-500 font-semibold">Tu carrito está vacío</p>
                  <button onClick={handleClose} className="text-white font-bold py-3 px-6 rounded-full transition" style={{ background: "#fb8a01" }}>Ver productos</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: "#f5f3ff" }}>
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden" style={{ backgroundColor: item.bgColor || "#c1b3fc" }}>
                        {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <span className="text-2xl">{item.emoji ?? "📦"}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm leading-tight truncate" style={{ color: "#2d1f5e" }}>{item.name}</p>
                        {item.selectedSize && item.selectedSize !== "Único" && <p className="text-xs text-gray-500">Talle: {item.selectedSize}</p>}
                        <p className="font-black text-sm" style={{ color: "#fb8a01" }}>{formatARS(item.price * item.qty)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.id, item.selectedSize, -1)} className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 transition">−</button>
                        <span className="w-6 text-center font-black text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.selectedSize, 1)} className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold transition" style={{ background: "#fb8a01" }}>+</button>
                      </div>
                      <button onClick={() => removeItem(item.id, item.selectedSize)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 transition text-lg shrink-0">🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {!isEmpty && (
              <div className="border-t border-gray-100 px-5 py-4 flex flex-col gap-3 bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-700">Total:</span>
                  <span className="text-2xl font-black" style={{ color: "#fb8a01" }}>{formatARS(cartTotal)}</span>
                </div>
                <button onClick={() => setStep("checkout")} className="w-full text-white font-black py-4 rounded-2xl text-lg transition" style={{ background: "#fb8a01" }}>
                  Continuar con el pedido →
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT */}
        {step === "checkout" && (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5">

              {/* Resumen */}
              <div className="rounded-2xl p-4" style={{ background: "#f5f3ff" }}>
                <p className="font-black text-sm mb-3" style={{ color: "#2d1f5e" }}>Tu pedido</p>
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.name}{item.selectedSize && item.selectedSize !== "Único" ? ` (${item.selectedSize})` : ""} x{item.qty}</span>
                    <span className="font-bold">{formatARS(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-black mt-2 pt-2 border-t border-purple-200">
                  <span style={{ color: "#2d1f5e" }}>Total</span>
                  <span style={{ color: "#fb8a01" }}>{formatARS(cartTotal)}</span>
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label className="block font-black text-sm mb-2" style={{ color: "#2d1f5e" }}>Nombre completo</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Tu nombre y apellido"
                  className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition"
                  style={{ borderColor: errors.nombre ? "#ef4444" : "#e5e7eb" }}
                  onFocus={(e) => (e.target.style.borderColor = "#fb8a01")}
                  onBlur={(e) => (e.target.style.borderColor = errors.nombre ? "#ef4444" : "#e5e7eb")}
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>

              {/* Pago */}
              <div>
                <label className="block font-black text-sm mb-2" style={{ color: "#2d1f5e" }}>¿Cómo vas a pagar?</label>
                <div className="flex flex-col gap-2">
                  {PAGOS.map((p) => (
                    <label key={p.id} className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition"
                      style={{ borderColor: form.pago === p.id ? "#fb8a01" : "#e5e7eb", background: form.pago === p.id ? "#fff7ed" : "white" }}>
                      <input type="radio" name="pago" value={p.id} checked={form.pago === p.id} onChange={() => setForm({ ...form, pago: p.id })} className="accent-orange-500" />
                      <span className="text-lg">{p.icon}</span>
                      <span className="text-sm font-bold text-gray-700">{p.label}</span>
                    </label>
                  ))}
                </div>
                {errors.pago && <p className="text-red-500 text-xs mt-1">{errors.pago}</p>}
              </div>

              {/* Envío */}
              <div>
                <label className="block font-black text-sm mb-2" style={{ color: "#2d1f5e" }}>¿Cómo recibís el pedido?</label>
                <div className="flex flex-col gap-2">
                  {ENVIOS.map((en) => (
                    <label key={en.id} className="flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition"
                      style={{ borderColor: form.envio === en.id ? "#fb8a01" : "#e5e7eb", background: form.envio === en.id ? "#fff7ed" : "white" }}>
                      <input type="radio" name="envio" value={en.id} checked={form.envio === en.id} onChange={() => setForm({ ...form, envio: en.id, ciudad: "" })} className="mt-0.5 accent-orange-500" />
                      <span className="text-lg">{en.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-700">{en.label}</p>
                        <p className="text-xs text-gray-500">{en.detail}</p>
                        {en.free && <span className="text-xs font-bold" style={{ color: "#16a34a" }}>✓ Sin costo extra</span>}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.envio && <p className="text-red-500 text-xs mt-1">{errors.envio}</p>}
              </div>

              {/* Ciudad interior */}
              {form.envio === "interior" && (
                <div>
                  <label className="block font-black text-sm mb-2" style={{ color: "#2d1f5e" }}>Ciudad y provincia</label>
                  <input
                    type="text"
                    value={form.ciudad}
                    onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                    placeholder="Ej: Comodoro Rivadavia, Chubut"
                    className="w-full border-2 rounded-xl px-4 py-3 text-sm outline-none transition"
                    style={{ borderColor: errors.ciudad ? "#ef4444" : "#e5e7eb" }}
                    onFocus={(e) => (e.target.style.borderColor = "#fb8a01")}
                    onBlur={(e) => (e.target.style.borderColor = errors.ciudad ? "#ef4444" : "#e5e7eb")}
                  />
                  {errors.ciudad && <p className="text-red-500 text-xs mt-1">{errors.ciudad}</p>}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-4 bg-white flex flex-col gap-2">
              <button
                onClick={handleSend}
                className="w-full text-white font-black py-4 rounded-2xl text-lg transition flex items-center justify-center gap-2"
                style={{ background: "#25d366" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Enviar pedido por WhatsApp
              </button>
              <p className="text-center text-xs text-gray-400">Se abre WhatsApp con tu pedido completo</p>
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  );
}