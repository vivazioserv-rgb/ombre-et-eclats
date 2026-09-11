"use client";
import { useEffect, useRef, useState } from "react";
import { adminFetch, uploadImage, IMAGE_PRESETS } from "@/lib/adminClient";
import { UploadCloud, Sparkles, Check, X, Loader2, Trash2 } from "lucide-react";
import { siteConfig } from "@/site.config";

type Status = "uploading" | "analyzing" | "ready" | "error" | "creating" | "created";

type Card = {
  id: string;
  previewUrl: string;
  status: Status;
  errorMsg?: string;
  imageUrl?: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  allergens: string;
  category: string;
  basePrice: number | "";
};

export default function ImportIaPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/categories?all=true", { cache: "no-store" })
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  function updateCard(id: string, patch: Partial<Card>) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  async function handleFiles(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;

    const newCards: Card[] = images.map((f) => ({
      id: Math.random().toString(36).slice(2),
      previewUrl: URL.createObjectURL(f),
      status: "uploading",
      name: "",
      shortDesc: "",
      longDesc: "",
      allergens: "",
      category: "",
      basePrice: "",
    }));
    setCards((prev) => [...newCards, ...prev]);

    newCards.forEach((card, i) => processCard(card.id, images[i]));
  }

  async function processCard(id: string, file: File) {
    try {
      const imageUrl = await uploadImage(file, IMAGE_PRESETS.product);
      updateCard(id, { imageUrl, status: "analyzing" });

      const result = await adminFetch("/api/ai/analyze-image", {
        method: "POST",
        body: JSON.stringify({ imageUrl, categories: categories.map((c) => ({ name: c.name })) }),
      });

      const matched = categories.find(
        (c) => c.name.toLowerCase() === (result.suggestedCategoryName || "").toLowerCase()
      );

      updateCard(id, {
        status: "ready",
        name: result.name || "",
        shortDesc: result.shortDesc || "",
        longDesc: result.longDesc || "",
        allergens: result.material || "",
        category: matched?._id || "",
      });
    } catch (err: any) {
      updateCard(id, { status: "error", errorMsg: err.message || "Erreur" });
    }
  }

  async function validateCard(card: Card) {
    if (!card.name || !card.basePrice || Number(card.basePrice) <= 0) return;
    updateCard(card.id, { status: "creating" });
    try {
      await adminFetch("/api/products", {
        method: "POST",
        body: JSON.stringify({
          name: card.name,
          shortDesc: card.shortDesc,
          longDesc: card.longDesc,
          basePrice: Number(card.basePrice),
          status: "available",
          isNew: true,
          imageUrl: card.imageUrl,
          images: [],
          category: card.category || null,
          delay: 2,
          allergens: card.allergens,
          flavors: [],
          sizes: [],
        }),
      });
      updateCard(card.id, { status: "created" });
    } catch (err: any) {
      updateCard(card.id, { status: "error", errorMsg: err.message || "Erreur" });
    }
  }

  function removeCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  const readyCount = cards.filter((c) => c.status === "ready" && c.name && Number(c.basePrice) > 0).length;

  async function validateAllReady() {
    const targets = cards.filter((c) => c.status === "ready" && c.name && Number(c.basePrice) > 0);
    for (const c of targets) {
      await validateCard(c);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">Import IA</h1>
          <p className="mt-1 text-sm text-gray-500">
            Déposez des photos de bijoux — {siteConfig.brand.name} génère une fiche produit par photo à valider.
          </p>
        </div>
        {readyCount > 0 && (
          <button
            onClick={validateAllReady}
            className="flex items-center gap-2 rounded-sm bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)]"
          >
            <Check className="h-4 w-4" /> Valider tout ({readyCount})
          </button>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(Array.from(e.dataTransfer.files || []));
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-8 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
          dragOver ? "border-[var(--primary)] bg-[var(--accent)]" : "border-gray-300 bg-white"
        }`}
      >
        <UploadCloud className="mb-3 h-8 w-8 text-gray-400" />
        <p className="text-sm font-medium">Glissez-déposez vos photos ici, ou cliquez pour parcourir</p>
        <p className="mt-1 text-xs text-gray-400">Une photo = un produit. L&apos;IA propose nom, description et catégorie.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(Array.from(e.target.files || []));
            e.target.value = "";
          }}
        />
      </div>

      {cards.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <CardView key={card.id} card={card} categories={categories} onChange={(patch) => updateCard(card.id, patch)} onValidate={() => validateCard(card)} onRemove={() => removeCard(card.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function CardView({
  card,
  categories,
  onChange,
  onValidate,
  onRemove,
}: {
  card: Card;
  categories: any[];
  onChange: (patch: Partial<Card>) => void;
  onValidate: () => void;
  onRemove: () => void;
}) {
  const busy = card.status === "uploading" || card.status === "analyzing" || card.status === "creating";
  const canValidate = card.status === "ready" && !!card.name && Number(card.basePrice) > 0;

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="relative aspect-square bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.previewUrl} alt="" className="h-full w-full object-cover" />
        {card.status === "created" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-green-700">
              <Check className="h-4 w-4" /> Créé
            </span>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
            <span className="text-xs font-medium uppercase tracking-widest text-white">
              {card.status === "uploading" ? "Envoi…" : card.status === "analyzing" ? "Analyse IA…" : "Création…"}
            </span>
          </div>
        )}
        {card.status !== "created" && (
          <button
            onClick={onRemove}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 hover:bg-white"
            title="Retirer"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-600" />
          </button>
        )}
      </div>

      <div className="space-y-3 p-4">
        {card.status === "error" && (
          <div className="rounded-lg bg-red-50 p-2 text-xs text-red-600">{card.errorMsg}</div>
        )}

        {(card.status === "ready" || card.status === "creating" || card.status === "error") && (
          <>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--primary)]">
              <Sparkles className="h-3 w-3" /> Proposition IA
            </div>
            <input
              value={card.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Nom du produit *"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--primary)] focus:outline-none"
            />
            <input
              value={card.shortDesc}
              onChange={(e) => onChange({ shortDesc: e.target.value })}
              placeholder="Description courte"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--primary)] focus:outline-none"
            />
            <textarea
              value={card.longDesc}
              onChange={(e) => onChange({ longDesc: e.target.value })}
              placeholder="Description longue"
              rows={3}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--primary)] focus:outline-none"
            />
            <input
              value={card.allergens}
              onChange={(e) => onChange({ allergens: e.target.value })}
              placeholder={siteConfig.product.allergensLabel}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--primary)] focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={card.category}
                onChange={(e) => onChange({ category: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--primary)] focus:outline-none"
              >
                <option value="">Sans catégorie</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={card.basePrice}
                onChange={(e) => onChange({ basePrice: e.target.value === "" ? "" : parseFloat(e.target.value) })}
                placeholder="Prix (€) *"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[var(--primary)] focus:outline-none"
              />
            </div>
            <button
              onClick={onValidate}
              disabled={!canValidate || card.status === "creating"}
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--primary)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--background)] hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check className="h-4 w-4" /> Valider
            </button>
            {!canValidate && card.status === "ready" && (
              <p className="text-center text-[11px] text-gray-400">Renseignez un nom et un prix pour valider.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
