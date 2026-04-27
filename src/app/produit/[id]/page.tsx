import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import ProductOrderForm from "@/components/ProductOrderForm";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import { ArrowLeft } from "lucide-react";
import { connectDb } from "@/lib/mongoose";
import { Product, Settings } from "@/lib/models";
import { isValidObjectId } from "mongoose";
import { siteConfig } from "@/site.config";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isValidObjectId(id)) notFound();
  await connectDb();
  const p = await Product.findById(id).populate("category").lean();
  if (!p) notFound();
  const settings = await Settings.findOne().lean();
  const product: any = JSON.parse(JSON.stringify(p));
  const brandName = (settings as any)?.brandName || siteConfig.brand.name;

  // Suggestions: same category first, then anything else (exclude current)
  const sameCatDocs = product.category
    ? await Product.find({ _id: { $ne: product._id }, category: product.category._id, status: { $ne: "unavailable" } })
        .populate("category")
        .limit(4)
        .lean()
    : [];
  let suggestions = sameCatDocs;
  if (suggestions.length < 4) {
    const fillers = await Product.find({ _id: { $ne: product._id, $nin: sameCatDocs.map((s: any) => s._id) }, status: { $ne: "unavailable" } })
      .populate("category")
      .limit(4 - suggestions.length)
      .lean();
    suggestions = [...suggestions, ...fillers];
  }
  const suggestionsJson: any[] = JSON.parse(JSON.stringify(suggestions));

  // Gallery: main + extras, deduplicated
  const galleryImages = [product.imageUrl, ...(product.images || [])]
    .filter(Boolean)
    .filter((url, i, arr) => arr.indexOf(url) === i);

  return (
    <>
      <Navbar brandName={brandName} />
      <Cart />
      <main className="min-h-screen bg-[var(--background)] py-10">
        <div className="mx-auto max-w-6xl px-6">
          <Link href="/catalogue" className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--foreground)]/60 hover:text-[var(--primary)]">
            <ArrowLeft className="h-4 w-4" /> Retour à la boutique
          </Link>
          <div className="grid gap-10 md:grid-cols-2">
            <ProductGallery images={galleryImages} alt={product.name} />
            <div>
              {product.category && (
                <p className="mb-2 text-xs uppercase tracking-widest text-[var(--primary)]">{product.category.name}</p>
              )}
              <h1 className="font-serif text-4xl">{product.name}</h1>
              {product.shortDesc && <p className="mt-3 text-[var(--foreground)]/70">{product.shortDesc}</p>}
              <div className="mt-6 text-3xl font-semibold text-[var(--primary)]">
                {product.basePrice.toFixed(2)}€
              </div>
              {product.longDesc && (
                <div className="mt-6 whitespace-pre-line text-sm text-[var(--foreground)]/80">{product.longDesc}</div>
              )}
              {siteConfig.product.hasAllergens && product.allergens && (
                <p className="mt-4 rounded-lg bg-[var(--muted)] p-3 text-xs text-[var(--foreground)]/70">
                  <strong>{siteConfig.product.allergensLabel} :</strong> {product.allergens}
                </p>
              )}
              <ProductOrderForm product={product} />
            </div>
          </div>

          {suggestionsJson.length > 0 && (
            <section className="mt-20">
              <div className="mb-8 flex flex-col items-center">
                <h2 className="font-serif text-3xl tracking-wider">VOUS AIMEREZ AUSSI</h2>
                <div className="mt-3 h-px w-16 bg-[var(--primary)]" />
              </div>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {suggestionsJson.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer brandName={brandName} />
    </>
  );
}
