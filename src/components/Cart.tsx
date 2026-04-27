"use client";
import { useCart } from "@/context/CartProvider";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, Trash2 } from "lucide-react";

export default function Cart() {
  const { cart, cartOpen, setCartOpen, cartTotal, removeFromCart, updateQty } = useCart();
  const router = useRouter();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
      <aside className="flex h-full w-full max-w-md flex-col bg-[var(--muted)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--accent)] p-5">
          <h2 className="font-serif text-xl">Votre panier</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <p className="mt-10 text-center text-sm text-[var(--foreground)]/60">Votre panier est vide</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.key} className="flex gap-3 rounded-lg border border-[var(--accent)] p-3">
                  {item.imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.imageUrl} alt={item.name} className="h-16 w-16 flex-shrink-0 rounded object-cover" />
                  )}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      {(item.flavor || item.size) && (
                        <p className="text-xs text-[var(--foreground)]/60">
                          {[item.flavor, item.size].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.key, item.quantity - 1)}
                          className="rounded-full bg-[var(--muted)] p-1"
                          aria-label="Moins"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.key, item.quantity + 1)}
                          className="rounded-full bg-[var(--muted)] p-1"
                          aria-label="Plus"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {(item.price * item.quantity).toFixed(2)}€
                        </span>
                        <button onClick={() => removeFromCart(item.key)} aria-label="Supprimer">
                          <Trash2 className="h-4 w-4 text-[var(--primary)]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-[var(--accent)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="font-serif text-xl text-[var(--primary)]">{cartTotal.toFixed(2)}€</span>
            </div>
            <button
              onClick={() => {
                setCartOpen(false);
                router.push("/commander");
              }}
              className="w-full rounded-sm bg-[var(--primary)] py-3 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)]"
            >
              Passer commande
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
