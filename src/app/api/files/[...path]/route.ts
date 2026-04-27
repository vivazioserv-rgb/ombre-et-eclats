import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const key = path.join("/");
  try {
    const obj = await r2.send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }));
    const body = obj.Body as ReadableStream | undefined;
    if (!body) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return new NextResponse(body as any, {
      headers: {
        "Content-Type": obj.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
