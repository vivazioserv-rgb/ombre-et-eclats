import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/mongoose";
import { Settings } from "@/lib/models";
import { verifyAdmin } from "@/lib/auth";
import { siteConfig } from "@/site.config";

export async function GET() {
  await connectDb();
  const s = await Settings.findOne();
  if (!s) {
    return NextResponse.json({
      brandName: siteConfig.brand.name,
      brandTagline: siteConfig.brand.tagline,
      heroTitle: siteConfig.hero.defaultTitle,
      heroSubtitle: siteConfig.hero.defaultSubtitle,
      heroImageUrl: siteConfig.hero.defaultImageUrl,
      slots: siteConfig.defaults.slots,
      openWeekdays: siteConfig.defaults.openWeekdays,
      minDelay: siteConfig.defaults.minDelay,
    });
  }
  const obj = s.toObject();
  delete (obj as any).adminPassword;
  return NextResponse.json(obj);
}

export async function PUT(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  await connectDb();
  try {
    const updates: any = await req.json();
    if (updates.adminPassword && updates.adminPassword.length > 0) {
      updates.adminPassword = await bcrypt.hash(updates.adminPassword, 10);
    } else {
      delete updates.adminPassword;
    }
    const s = await Settings.findOneAndUpdate({}, updates, { new: true, upsert: true, runValidators: true });
    const obj = s.toObject();
    delete (obj as any).adminPassword;
    return NextResponse.json(obj);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Erreur" }, { status: 400 });
  }
}
