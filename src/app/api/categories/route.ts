import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/mongoose";
import { Category } from "@/lib/models";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDb();
  const all = req.nextUrl.searchParams.get("all") === "true";
  const cats = await Category.find(all ? {} : { active: true }).sort("name");
  return NextResponse.json(cats);
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await connectDb();
  try {
    const body = await req.json();
    const c = await Category.create(body);
    return NextResponse.json(c, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Erreur" }, { status: 400 });
  }
}
