"use client";
import { useMemo, useState } from "react";
import { useCart } from "@/context/CartProvider";
import { siteConfig } from "@/site.config";

const V1 = siteConfig.product.variant1;
const V2 = siteConfig.product.variant2;

export default function ProductOrderForm({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [flavor, setFlavor] = useState(product.flavors?.[0] || null);
  const [size, setSize] = useState(product.sizes?.[0] || null);
  const [qty, setQty] = useState(1);

  const price = useMemo(() => {
    const base = Number(product.basePrice) || 0;
    const fs = Number(flavor?.surcharge) || 0;
    const ss = Number(size?.surcharge) || 0;
    return base + fs + ss;
  }, [product.basePrice, flavor, size]);

  // Use flavor image if selected, else main product image
  const displayImage = flavor?.imageUrl || product.imageUrl;

  if (product.status === "unavailable") {
    return (
      <div className="mt-6 rounded-lg bg-[var(--accent)] p-4 text-sm text-[var(--primary-dark)]">
        Ce produit est actuellement indisponible.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-5">
      {product.flavors?.length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
            {V1.labelSingular.charAt(0).toUpperCase() + V1.labelSingular.slice(1)} {flavor && <span className="text-[var(--primary)]">· {flavor.name}</span>}
          </label>
          <div className="flex flex-wrap gap-3">
            {product.flavors.map((f: any) => {
              const active = flavor?._id === f._id;
              return (
                <button
                  key={f._id}
                  type="button"
                  onClick={() => setFlavor(f)}
                  className={`group flex flex-col items-center gap-1 ${active ? "" : "opacity-70 hover:opacity-100"}`}
                >
                  <div
                    className={`h-16 w-16 overflow-hidden rounded-full border-2 transition-colors ${
                      active ? "border-[var(--primary)]" : "border-transparent group-hover:border-[var(--accent)]"
                    }`}
                  >
                    {f.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={f.imageUrl} alt={f.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[var(--accent)] text-xs font-semibold text-[var(--primary)]">
                        {f.name?.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className={`text-xs ${active ? "font-semibold text-[var(--primary)]" : "text-[var(--foreground)]/70"}`}>
                    {f.name}
                    {f.surcharge > 0 && <span className="block text-[10px]">+{f.surcharge}€</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {product.sizes?.length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">
            {V2.label} {size && <span className="text-[var(--primary)]">· {size.name}</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s: any) => (
              <button
                key={s._id}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded-full px-4 py-2 text-xs transition-colors ${
                  size?._id === s._id
                    ? "bg-[var(--primary)] text-[var(--background)]"
                    : "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--background)]"
                }`}
              >
                {s.name}
                {s.surcharge > 0 && ` (+${s.surcharge}€)`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider">Quantité</label>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="h-9 w-9 rounded-full bg-[var(--muted)]">
            −
          </button>
          <span className="w-8 text-center">{qty}</span>
          <button type="button" onClick={() => setQty(qty + 1)} className="h-9 w-9 rounded-full bg-[var(--muted)]">
            +
          </button>
        </div>
      </div>

      {product.delay > 0 && (
        <p className="text-xs text-[var(--foreground)]/60">
          {siteConfig.product.delayLabel} : <strong>{product.delay}{siteConfig.product.delayUnit === "days" ? " jour(s)" : "h"}</strong> minimum
        </p>
      )}

      <div className="flex items-center justify-between border-t border-[var(--accent)] pt-4">
        <div className="text-2xl font-semibold text-[var(--primary)]">{(price * qty).toFixed(2)}€</div>
        <button
          type="button"
          onClick={() =>
            addToCart({
              productId: product._id,
              name: product.name,
              price,
              imageUrl: displayImage,
              flavor: flavor?.name,
              size: size?.name,
              quantity: qty,
            })
          }
          className="rounded-sm bg-[var(--primary)] px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)]"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
