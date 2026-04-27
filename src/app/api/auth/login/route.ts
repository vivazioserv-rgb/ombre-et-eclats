import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/mongoose";
import { Settings } from "@/lib/models";
import { signAdminToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({}));
  if (!password) return NextResponse.json({ error: "Mot de passe requis" }, { status: 400 });

  await connectDb();
  const s = await Settings.findOne();
  if (!s) return NextResponse.json({ error: "Configuration introuvable. Lancez /api/seed" }, { status: 500 });

  const valid = await bcrypt.compare(password, s.adminPassword);
  if (!valid) return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });

  return NextResponse.json({ token: signAdminToken(), message: "Connexion réussie" });
}
