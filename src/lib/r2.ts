import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function getUploadUrl(key: string): Promise<string> {
  const cmd = new PutObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key });
  return getSignedUrl(r2, cmd, { expiresIn: 300 });
}

export function publicUrl(key: string): string {
  const pub = process.env.R2_PUBLIC_URL;
  if (pub) return `${pub.replace(/\/$/, "")}/${key}`;
  // fallback: proxy through our app's /api/files route which redirects to signed URL
  return `/api/files/${key}`;
}
