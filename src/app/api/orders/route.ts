import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { Order } from "@/lib/models";
import { verifyAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectDb();
  try {
    const body = await req.json();
    const { client, email, items, total } = body;
    if (!client || !email || !items?.length || total === undefined || total === null) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }
    const o = await Order.create(body);
    return NextResponse.json(o, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Erreur" }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await connectDb();
  const sp = req.nextUrl.searchParams;
  const page = parseInt(sp.get("page") || "1");
  const limit = parseInt(sp.get("limit") || "20");
  const filter: Record<string, any> = {};
  const status = sp.get("status");
  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments(filter),
  ]);
  return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) });
}
