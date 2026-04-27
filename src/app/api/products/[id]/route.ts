import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { Product } from "@/lib/models";
import { verifyAdmin } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDb();
  const { id } = await params;
  const p = await Product.findById(id).populate("category");
  if (!p) return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await connectDb();
  const { id } = await params;
  try {
    const body = await req.json();
    const p = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }).populate("category");
    if (!p) return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    return NextResponse.json(p);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Erreur" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await connectDb();
  const { id } = await params;
  const p = await Product.findByIdAndDelete(id);
  if (!p) return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  return NextResponse.json({ message: "Produit supprimé" });
}
