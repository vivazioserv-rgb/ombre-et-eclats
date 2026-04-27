import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import OrderForm from "@/components/OrderForm";
import { connectDb } from "@/lib/mongoose";
import { Settings } from "@/lib/models";

export const dynamic = "force-dynamic";

export default async function CommanderPage() {
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
            <h1 className="font-serif text-5xl tracking-wider">COMMANDER</h1>
            <div className="mt-3 h-px w-16 bg-[var(--primary)]" />
            <p className="mt-4 text-center text-sm text-[var(--foreground)]/60">
              Retrait uniquement à notre atelier · Délai minimum {settings.minDelay || 2}h
            </p>
          </div>
          <OrderForm settings={settings} />
        </div>
      </main>
      <Footer brandName={settings.brandName} />
    </>
  );
}
