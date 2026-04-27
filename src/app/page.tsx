import Link from "next/link";
import { Truck, Award, Gem, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import { connectDb } from "@/lib/mongoose";
import { Product, Category, Settings } from "@/lib/models";
import { siteConfig } from "@/site.config";

export const dynamic = "force-dynamic";

async function loadData() {
  await connectDb();
  const [products, categories, settingsDoc] = await Promise.all([
    Product.find().populate("category").sort({ createdAt: -1 }).lean(),
    Category.find({ active: true }).sort("name").lean(),
    Settings.findOne().lean(),
  ]);
  const settings: any = settingsDoc || {};
  return { products: JSON.parse(JSON.stringify(products)), categories: JSON.parse(JSON.stringify(categories)), settings: JSON.parse(JSON.stringify(settings)) };
}

export default async function HomePage() {
  const { products, categories, settings } = await loadData();
  const newItems = products.filter((p: any) => p.isNew && p.status !== "unavailable").slice(0, 5);
  const displayedNew = newItems.length > 0 ? newItems : products.slice(0, 5);
  // Preview products: up to 8 non-new available items to give shoppers a taste of the catalogue
  const newIds = new Set(displayedNew.map((p: any) => p._id));
  const previewProducts = products.filter((p: any) => p.status !== "unavailable" && !newIds.has(p._id)).slice(0, 8);
  const brandName = settings.brandName || siteConfig.brand.name;
  const heroImage = settings.heroImageUrl || siteConfig.hero.defaultImageUrl;
  const heroTitle = settings.heroTitle || siteConfig.hero.defaultTitle;
  const heroSubtitle = settings.heroSubtitle || siteConfig.hero.defaultSubtitle;

  return (
    <>
      <Navbar brandName={brandName} />
      <Cart />
      <main className="min-h-screen">
        {/* Hero plein écran, fond image sombre + logo */}
        <section className="relative min-h-[85vh] overflow-hidden bg-black">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />

          <div className="relative mx-auto flex min-h-[85vh] max-w-4xl flex-col items-center justify-center px-6 py-24 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={siteConfig.brand.logoUrl}
              alt={brandName}
              className="mx-auto mb-10 w-auto max-w-md md:max-w-lg lg:max-w-xl"
            />
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-[var(--primary)]">
              Spécial Argent 925
            </p>
            <h1 className="font-serif text-4xl leading-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base text-[var(--foreground)]/70">{heroSubtitle}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/catalogue"
                className="rounded-sm bg-[var(--primary)] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black hover:bg-[var(--primary-dark)]"
              >
                Découvrir les collections
              </Link>
              {siteConfig.features.customOrders && (
                <Link
                  href="/sur-mesure"
                  className="rounded-sm border border-[var(--primary)] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-black"
                >
                  Pièce sur-mesure
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Bandeau piliers */}
        <section className="border-y border-[var(--accent)] bg-[var(--muted)]">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 md:grid-cols-3">
            <FeatureItem icon={<Gem className="h-5 w-5 text-[var(--primary)]" />} title="Argent massif 925" text="Poinçonné, garanti à vie" />
            <FeatureItem icon={<Award className="h-5 w-5 text-[var(--primary)]" />} title="Fait main en France" text="Chaque pièce façonnée à l'atelier" divider />
            <FeatureItem icon={<Truck className="h-5 w-5 text-[var(--primary)]" />} title="Livraison offerte" text="Expédition en 48h dès 80€" />
          </div>
        </section>

        {/* Catégories */}
        {categories.length > 0 && (
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-6">
              <SectionHeader title="NOS COLLECTIONS" />
              <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
                {categories.map((cat: any) => (
                  <Link key={cat._id} href={`/catalogue?cat=${cat._id}`} className="group flex flex-col items-center">
                    <div className="relative h-36 w-36 overflow-hidden rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--muted)] shadow-md transition-transform group-hover:scale-105">
                      {cat.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={cat.imageUrl} alt={cat.name} className="h-full w-full object-cover" />
                      ) : cat.emoji ? (
                        <div className="flex h-full w-full items-center justify-center text-6xl">{cat.emoji}</div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-serif text-5xl text-[var(--primary)]/50">
                          {cat.name?.[0]?.toUpperCase() || "?"}
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 font-serif text-sm font-medium uppercase tracking-wider">{cat.name}</h3>
                    <p className="mt-1 text-xs text-[var(--primary)] group-hover:underline">Voir la sélection →</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Nouveautés */}
        {displayedNew.length > 0 && (
          <section className="bg-[var(--muted)] py-20">
            <div className="mx-auto max-w-7xl px-6">
              <SectionHeader title="NOUVEAUTÉS" />
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
                {displayedNew.map((p: any) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Aperçu du catalogue */}
        {previewProducts.length > 0 && (
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-6">
              <SectionHeader title="NOS PIÈCES" />
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                {previewProducts.map((p: any) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/catalogue"
                  className="rounded-sm border border-[var(--primary)] px-8 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--background)]"
                >
                  Voir toutes les collections →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Sur-mesure CTA */}
        {siteConfig.features.customOrders && (
        <section className="py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-inner md:aspect-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1518544866330-95a2bec01dbb?w=1200&auto=format&fit=crop&q=85"
                alt="Atelier de gravure"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
                Pièces sur-mesure
              </p>
              <h2 className="font-serif text-4xl leading-tight">
                UNE PIÈCE UNIQUE ?<br />
                <span className="text-[var(--primary)]">NOUS LA FAÇONNONS.</span>
              </h2>
              <p className="mt-6 max-w-md text-base text-[var(--foreground)]/70">
                Gravure d&apos;initiales, chevalière aux armoiries, alliance sur-mesure… Décrivez votre projet, nous vous proposons un devis sous 48h.
              </p>
              <div className="mt-8">
                <Link
                  href="/sur-mesure"
                  className="inline-block rounded-sm bg-[var(--primary)] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)]"
                >
                  Faire ma demande
                </Link>
              </div>
            </div>
          </div>
        </section>
        )}
      </main>
      <Footer brandName={brandName} />

      {siteConfig.features.whatsappButton && (
        <a
          href={settings.phone ? `https://wa.me/${settings.phone.replace(/\D/g, "")}` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact WhatsApp"
          className="fixed bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-[var(--background)] shadow-lg transition-transform hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      )}
    </>
  );
}

function splitTitle(t: string) {
  const parts = t.split(",");
  if (parts.length >= 2) return [parts[0] + ",", parts.slice(1).join(",").trim()];
  return [t];
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-12 flex flex-col items-center">
      <h2 className="font-serif text-3xl tracking-wider">{title}</h2>
      <div className="mt-3 h-px w-16 bg-[var(--primary)]" />
    </div>
  );
}

function FeatureItem({ icon, title, text, divider }: { icon: React.ReactNode; title: string; text: string; divider?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${divider ? "md:border-x md:border-[var(--accent)] md:px-6" : ""}`}>
      {icon}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">{title}</p>
        <p className="text-xs text-[var(--foreground)]/60">{text}</p>
      </div>
    </div>
  );
}
