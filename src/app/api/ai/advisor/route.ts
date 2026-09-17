import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { connectDb } from "@/lib/mongoose";
import { Product, Category } from "@/lib/models";
import { siteConfig } from "@/site.config";

const client = new Anthropic();

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const { messages } = await req.json().catch(() => ({ messages: [] }));

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages requis" }, { status: 400 });
  }
  // Basic sanity limits to keep the widget cheap and safe
  const history: ChatMessage[] = messages
    .slice(-12)
    .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

  if (history.length === 0) {
    return NextResponse.json({ error: "messages invalides" }, { status: 400 });
  }

  try {
    await connectDb();
    const [products, categories] = await Promise.all([
      Product.find({ status: { $ne: "unavailable" } })
        .populate("category")
        .select("name shortDesc basePrice category isNew")
        .limit(120)
        .lean(),
      Category.find({ active: true }).select("name").lean(),
    ]);

    const catalogText = products
      .map((p: any) => {
        const cat = p.category?.name ? ` [${p.category.name}]` : "";
        const price = typeof p.basePrice === "number" ? `${p.basePrice.toFixed(2)}€` : "";
        const nouveau = p.isNew ? " (nouveauté)" : "";
        return `- ${p.name}${cat} — ${price}${nouveau}${p.shortDesc ? " — " + p.shortDesc : ""} (id: ${p._id})`;
      })
      .join("\n");

    const categoryText = categories.map((c: any) => c.name).join(", ");

    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 700,
      system: [
        {
          type: "text",
          text: `Tu es le conseiller virtuel de "${siteConfig.brand.name}", une bijouterie d'homme française en argent massif 925 (bagues, chevalières, gourmettes, pièces sur-mesure). Réponds en français, ton chaleureux, précis et haut de gamme, jamais familier.

Règles strictes :
- Ne recommande QUE des pièces présentes dans le catalogue ci-dessous. N'invente jamais de produit, de prix ou de stock.
- Si le catalogue ne contient rien de pertinent, propose la demande sur-mesure (${siteConfig.contact.email}) plutôt que d'inventer.
- Sois concis : 2 à 4 phrases, puis éventuellement une courte liste de 1 à 3 pièces recommandées avec leur prix.
- Tu peux conseiller sur la taille de bague, l'entretien de l'argent massif, les délais (${siteConfig.contact.zone}), mais reste dans le rôle d'un conseiller boutique, jamais de sujet hors bijouterie.
- N'affiche jamais les identifiants techniques (id) au client.

Catégories disponibles : ${categoryText || "aucune"}

Catalogue disponible (nom [catégorie] — prix — description — id) :
${catalogText || "(catalogue vide pour le moment)"}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: history.map((m) => ({ role: m.role, content: m.content })),
    });

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ reply: text || "Désolé, je n'ai pas pu formuler de réponse. Pouvez-vous reformuler votre demande ?" });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Erreur IA" }, { status: 500 });
  }
}
