import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { Order } from "@/lib/models";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await connectDb();
  const { id } = await params;
  const o = await Order.findById(id);
  if (!o) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  return NextResponse.json(o);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await connectDb();
  const { id } = await params;
  try {
    const body = await req.json();
    const o = await Order.findByIdAndUpdate(id, { status: body.status }, { new: true, runValidators: true });
    if (!o) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    return NextResponse.json(o);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Erreur" }, { status: 400 });
  }
}
