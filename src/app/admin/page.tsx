"use client";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import { Package, Tag, ClipboardList, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, pending: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [p, c, o] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/categories?all=true", { cache: "no-store" }).then((r) => r.json()),
          adminFetch("/api/orders?limit=100"),
        ]);
        const orders = o.orders || [];
        setStats({
          products: p.length,
          categories: c.length,
          orders: orders.length,
          pending: orders.filter((x: any) => x.status === "pending").length,
          revenue: orders.reduce((s: number, x: any) => s + (x.total || 0), 0),
        });
      } catch {}
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl">Tableau de bord</h1>
      {loading ? (
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat title="Produits" value={stats.products} icon={<Package className="h-5 w-5" />} />
          <Stat title="Catégories" value={stats.categories} icon={<Tag className="h-5 w-5" />} />
          <Stat title="Commandes" value={stats.orders} icon={<ClipboardList className="h-5 w-5" />} hint={`${stats.pending} en attente`} />
          <Stat title="CA total" value={`${stats.revenue.toFixed(2)}€`} icon={<TrendingUp className="h-5 w-5" />} />
        </div>
      )}
    </div>
  );
}

function Stat({ title, value, icon, hint }: { title: string; value: string | number; icon: React.ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="mb-3 flex items-center gap-2 text-[#6c5ce7]">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</p>
      <p className="mt-1 font-serif text-3xl text-gray-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
