/**
 * Client-side image resize + compression before upload.
 * Keeps aspect ratio, fits within maxDim, re-encodes as JPEG.
 */
export type ProcessOptions = {
  maxDim?: number; // max width or height
  quality?: number; // 0..1
  square?: boolean; // center-crop to square (for round thumbs)
};

export async function processImage(file: File, opts: ProcessOptions = {}): Promise<File> {
  const { maxDim = 1200, quality = 0.85, square = false } = opts;

  // SVG or GIF: pass through unchanged
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

  const bitmap = await createBitmap(file);
  let srcW = bitmap.width;
  let srcH = bitmap.height;
  let sx = 0;
  let sy = 0;

  if (square) {
    const side = Math.min(srcW, srcH);
    sx = Math.floor((srcW - side) / 2);
    sy = Math.floor((srcH - side) / 2);
    srcW = side;
    srcH = side;
  }

  const scale = Math.min(1, maxDim / Math.max(srcW, srcH));
  const destW = Math.round(srcW * scale);
  const destH = Math.round(srcH * scale);

  const canvas = document.createElement("canvas");
  canvas.width = destW;
  canvas.height = destH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non supporté");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, sx, sy, srcW, srcH, 0, 0, destW, destH);

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/jpeg", quality)
  );

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
}

async function createBitmap(file: File): Promise<CanvasImageSource & { width: number; height: number }> {
  if (typeof (window as any).createImageBitmap === "function") {
    return await createImageBitmap(file);
  }
  return await new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img as any);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };
    img.src = url;
  });
}
