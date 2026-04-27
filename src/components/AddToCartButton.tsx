"use client";
import { useCart } from "@/context/CartProvider";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product, size = "sm" }: { product: any; size?: "sm" | "md" }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const hasOptions = (product.flavors?.length ?? 0) > 0 || (product.sizes?.length ?? 0) > 0;
  const unavailable = product.status === "unavailable";

  if (unavailable) {
    return <span className="text-[10px] font-medium uppercase text-[var(--primary)]">Indisponible</span>;
  }

  const onClick = () => {
    if (hasOptions) {
      router.push(`/produit/${product._id}`);
      return;
    }
    addToCart({
      productId: product._id,
      name: product.name,
      price: product.basePrice,
      imageUrl: product.imageUrl,
    } as any);
  };

  if (size === "md") {
    return (
      <button
        onClick={onClick}
        className="rounded-sm bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)]"
      >
        Ajouter
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label="Ajouter au panier"
      className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--background)] hover:bg-[var(--primary-dark)]"
    >
      <ShoppingBag className="h-3.5 w-3.5" />
    </button>
  );
}
