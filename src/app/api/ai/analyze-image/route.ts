import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdmin } from "@/lib/auth";
import { siteConfig } from "@/site.config";

const client = new Anthropic();

const TOOL_NAME = "return_product_listing";

type Listing = {
  name: string;
  shortDesc: string;
  longDesc: string;
  material: string;
  suggestedCategoryName: string | null;
};

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { imageUrl, categories } = await req.json().catch(() => ({}));
  if (!imageUrl) return NextResponse.json({ error: "imageUrl requis" }, { status: 400 });

  const categoryNames: string[] = Array.isArray(categories) ? categories.map((c: any) => c.name) : [];

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: `Tu es assistant e-commerce pour "${siteConfig.brand.name}", une bijouterie d'homme en argent massif (bagues, chevalières, gourmettes). Analyse la photo d'un bijou et propose une fiche produit prête à publier, en français, dans un ton sobre et haut de gamme.

Catégories existantes disponibles (choisis-en une par son nom exact si elle correspond, sinon renvoie null) :
${categoryNames.length ? categoryNames.map((n) => `- ${n}`).join("\n") : "(aucune catégorie disponible)"}`,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: [
            { type: "image", source: { type: "url", url: imageUrl } },
            { type: "text", text: "Analyse ce bijou et propose une fiche produit." },
          ],
        },
      ],
      tools: [
        {
          name: TOOL_NAME,
          description: "Enregistre la fiche produit proposée pour le bijou photographié.",
          input_schema: {
            type: "object",
            properties: {
              name: { type: "string", description: "Nom de vente court et vendeur du bijou, en français" },
              shortDesc: { type: "string", description: "Description courte (1 phrase) pour la fiche produit" },
              longDesc: { type: "string", description: "Description longue et détaillée (2-4 phrases), style boutique de luxe" },
              material: {
                type: "string",
                description: `Matière et entretien du bijou (ex: "Argent massif 925 — éviter le contact avec l'eau et les parfums")`,
              },
              suggestedCategoryName: {
                type: ["string", "null"],
                description: "Le nom exact de la catégorie la plus pertinente parmi la liste fournie, ou null si aucune ne convient",
              },
            },
            required: ["name", "shortDesc", "longDesc", "material", "suggestedCategoryName"],
          },
        },
      ],
      tool_choice: { type: "tool", name: TOOL_NAME },
    });

    const toolUse = response.content.find((b) => b.type === "tool_use" && b.name === TOOL_NAME);
    if (!toolUse || toolUse.type !== "tool_use") {
      return NextResponse.json({ error: "Analyse IA invalide" }, { status: 502 });
    }

    return NextResponse.json(toolUse.input as Listing);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Erreur IA" }, { status: 500 });
  }
}
