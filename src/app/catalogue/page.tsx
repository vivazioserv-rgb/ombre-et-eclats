import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import ProductCard from "@/components/ProductCard";
import { connectDb } from "@/lib/mongoose";
import { Product, Category, Settings } from "@/lib/models";

export const dynamic = "force-dynamic";

async function loadData() {
  await connectDb();
  const [products, categories, settings] = await Promise.all([
    Product.find().populate("category").sort({ createdAt: -1 }).lean(),
    Category.find({ active: true }).sort("name").lean(),
    Settings.findOne().lean(),
  ]);
  return {
    products: JSON.parse(JSON.stringify(products)),
    categories: JSON.parse(JSON.stringify(categories)),
    settings: JSON.parse(JSON.stringify(settings || {})),
  };
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const sp = await searchParams;
  const { products, categories, settings } = await loadData();
  const filtered = sp.cat
    ? products.filter((p: any) => p.category?._id === sp.cat)
    : products;

  return (
    <>
      <Navbar brandName={settings.brandName} />
      <Cart />
      <main className="min-h-screen bg-[var(--background)] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-col items-center">
            <h1 className="font-serif text-5xl tracking-wider">NOTRE BOUTIQUE</h1>
            <div className="mt-3 h-px w-16 bg-[var(--primary)]" />
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/catalogue"
              className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
                !sp.cat
                  ? "bg-[var(--primary)] text-[var(--background)]"
                  : "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--background)]"
              }`}
            >
              Tout
            </Link>
            {categories.map((c: any) => (
              <Link
                key={c._id}
                href={`/catalogue?cat=${c._id}`}
                className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${
                  sp.cat === c._id
                    ? "bg-[var(--primary)] text-[var(--background)]"
                    : "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--background)]"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="py-20 text-center text-[var(--foreground)]/60">Aucun produit dans cette catégorie</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((p: any) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer brandName={settings.brandName} />
    </>
  );
}
