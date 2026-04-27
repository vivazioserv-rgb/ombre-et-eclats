import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { Category } from "@/lib/models";
import { verifyAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await connectDb();
  const { id } = await params;
  try {
    const body = await req.json();
    const c = await Category.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!c) return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
    return NextResponse.json(c);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Erreur" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await connectDb();
  const { id } = await params;
  const c = await Category.findByIdAndDelete(id);
  if (!c) return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
  return NextResponse.json({ message: "Catégorie supprimée" });
}
