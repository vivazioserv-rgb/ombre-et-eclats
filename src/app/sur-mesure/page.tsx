import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import CustomOrderForm from "@/components/CustomOrderForm";
import { connectDb } from "@/lib/mongoose";
import { Settings } from "@/lib/models";
import { siteConfig } from "@/site.config";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SurMesurePage() {
  if (!siteConfig.features.customOrders) notFound();
  await connectDb();
  const s = await Settings.findOne().lean();
  const settings: any = JSON.parse(JSON.stringify(s || {}));

  return (
    <>
      <Navbar brandName={settings.brandName} />
      <Cart />
      <main className="min-h-screen bg-[var(--background)] py-16">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-10 flex flex-col items-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">Pièce sur-mesure</p>
            <h1 className="text-center font-serif text-4xl leading-tight sm:text-5xl">
              UNE PIÈCE UNIQUE ?<br />
              <span className="text-[var(--primary)]">NOUS LA FAÇONNONS.</span>
            </h1>
            <div className="mt-4 h-px w-16 bg-[var(--primary)]" />
            <p className="mt-6 max-w-xl text-center text-sm text-[var(--foreground)]/70">
              Gravure d&apos;initiales, chevalière aux armoiries, alliance homme, cadeau personnalisé… Décrivez votre projet, nous vous proposons un devis sous 48h ouvrées.
            </p>
          </div>
          <CustomOrderForm settings={settings} />
        </div>
      </main>
      <Footer brandName={settings.brandName} />
    </>
  );
}
