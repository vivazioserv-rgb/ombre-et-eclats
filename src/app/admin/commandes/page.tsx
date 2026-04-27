"use client";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

const STATUSES = [
  { key: "pending", label: "En attente", color: "bg-amber-100 text-amber-700" },
  { key: "confirmed", label: "Confirmée", color: "bg-blue-100 text-blue-700" },
  { key: "ready", label: "Prête", color: "bg-purple-100 text-purple-700" },
  { key: "delivered", label: "Livrée", color: "bg-green-100 text-green-700" },
  { key: "cancelled", label: "Annulée", color: "bg-red-100 text-red-700" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    const qs = filter ? `?status=${filter}` : "";
    const data = await adminFetch(`/api/orders${qs}`);
    setOrders(data.orders || []);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    await adminFetch(`/api/orders/${id}`, { method: "PUT", body: JSON.stringify({ status }) });
    load();
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl">Commandes</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("")}
          className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider ${!filter ? "bg-[#6c5ce7] text-white" : "border border-[#6c5ce7] text-[#6c5ce7]"}`}
        >
          Toutes
        </button>
        {STATUSES.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-wider ${filter === s.key ? "bg-[#6c5ce7] text-white" : "border border-[#6c5ce7] text-[#6c5ce7]"}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Chargement…</p>
      ) : orders.length === 0 ? (
        <p className="py-20 text-center text-gray-500">Aucune commande</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const st = STATUSES.find((s) => s.key === o.status);
            return (
              <div key={o._id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{o.client}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] ${st?.color}`}>{st?.label}</span>
                      {o.paymentStatus && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] ${o.paymentStatus === "paid" ? "bg-green-100 text-green-700" : o.paymentStatus === "failed" ? "bg-red-100 text-red-700" : "bg-gray-50 text-gray-500"}`}>
                          {o.paymentStatus === "paid" ? "Payée" : o.paymentStatus === "failed" ? "Échec paiement" : "Non payée"}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {o.email} · {o.phone || "—"} · {new Date(o.createdAt).toLocaleString("fr-FR")}
                    </p>
                    {o.pickupDate && (
                      <p className="mt-1 text-xs text-gray-500">
                        Retrait : {o.pickupDate} à {o.slot}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg text-[#6c5ce7]">{o.total?.toFixed(2)}€</span>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="rounded-lg border border-gray-300 bg-white text-gray-900 px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => setExpanded(expanded === o._id ? null : o._id)} className="text-xs text-[#6c5ce7]">
                      {expanded === o._id ? "Masquer" : "Détails"}
                    </button>
                  </div>
                </div>
                {expanded === o._id && (
                  <div className="mt-4 border-t border-gray-200 pt-4 text-sm">
                    <ul className="space-y-1">
                      {o.items?.map((i: any, idx: number) => (
                        <li key={idx} className="flex justify-between">
                          <span>
                            {i.quantity}× {i.name}
                            {(i.flavor || i.size) && <span className="text-gray-500"> — {[i.flavor, i.size].filter(Boolean).join(" · ")}</span>}
                          </span>
                          <span>{(i.price * i.quantity).toFixed(2)}€</span>
                        </li>
                      ))}
                    </ul>
                    {o.note && (
                      <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs">
                        <strong>Note :</strong> {o.note}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
