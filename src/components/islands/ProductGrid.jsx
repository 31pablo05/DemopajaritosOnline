import { useState } from "react";
import { formatARS } from "../../data/products.js";
import ProductModal from "./ProductModal.jsx";

export default function ProductGrid({ products, categories }) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filtered =
    activeCategory === "todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Category tabs */}
      <div className="overflow-x-auto no-scrollbar mb-6">
        <div className="flex gap-2 min-w-max px-1 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm border-2 transition whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-brand-orange border-brand-orange text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:border-brand-orange hover:text-brand-orange"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product) => {
          const isOrangeTheme = product.category === "remeras" || product.category === "cubrecamas";
          const imageAreaBg = isOrangeTheme ? "#fb8a01" : "#c1b3fc";
          const badgeBg = isOrangeTheme ? "rgba(0,0,0,0.18)" : "#fb8a01";
          const btnBorderColor = isOrangeTheme ? "#fb8a01" : "#c1b3fc";
          const btnTextColor = isOrangeTheme ? "#fb8a01" : "#6a4fc0";
          return (
          <div
            key={product.id}
            className="product-card bg-white rounded-2xl overflow-hidden shadow-md"
            onClick={() => setSelectedProduct(product)}
          >
            {/* Image area */}
            <div
              className="w-full flex items-center justify-center relative"
              style={{ backgroundColor: imageAreaBg, height: "140px", overflow: "hidden" }}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-5xl">{product.emoji ?? "📦"}</span>
              )}
              {product.tag && (
                <span
                  className="absolute top-2 left-2 text-white text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: badgeBg }}
                >
                  {product.tag}
                </span>
              )}
            </div>

            {/* Text area */}
            <div className="p-3 bg-white">
              <h3
                className="font-black text-sm leading-tight mb-1 truncate"
                style={{ color: "#2d1f5e" }}
              >
                {product.name}
              </h3>
              <p className="text-brand-orange font-black text-base">{formatARS(product.price)}</p>
              <button
                className="mt-2 w-full text-xs font-extrabold py-1.5 rounded-full transition"
                style={{ border: `1.5px solid ${btnBorderColor}`, color: btnTextColor, backgroundColor: "white" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = btnBorderColor;
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = btnTextColor;
                }}
              >
                Ver producto
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
