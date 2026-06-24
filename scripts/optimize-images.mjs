// One-time image optimizer: PNG -> resized WebP for public/images.
// Run with: node scripts/optimize-images.mjs
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const DIR = "public/images";

// Per-file max width (px). Default cap if not listed.
const MAX_WIDTH = {
  "founder-portrait.png": 1000,
  "founder-signature.png": 760,
  "edit-1.png": 736,
  "edit-2.png": 736,
  "edit-3.png": 736,
};
const DEFAULT_MAX = 900;
const QUALITY = 82;

const kb = (b) => (b / 1024).toFixed(0) + "KB";

let beforeTotal = 0;
let afterTotal = 0;

const files = readdirSync(DIR).filter((f) => f.toLowerCase().endsWith(".png"));

for (const file of files) {
  const inPath = path.join(DIR, file);
  const outPath = path.join(DIR, file.replace(/\.png$/i, ".webp"));
  const before = statSync(inPath).size;
  const cap = MAX_WIDTH[file] ?? DEFAULT_MAX;

  const img = sharp(inPath);
  const meta = await img.metadata();
  const targetWidth = Math.min(cap, meta.width);

  await img
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);

  const after = statSync(outPath).size;
  beforeTotal += before;
  afterTotal += after;
  console.log(
    `${file.padEnd(26)} ${String(meta.width).padStart(4)}px->${String(targetWidth).padStart(4)}px  ${kb(before).padStart(7)} -> ${kb(after).padStart(7)}  (-${Math.round((1 - after / before) * 100)}%)`,
  );
}

console.log(
  `\nTOTAL  ${kb(beforeTotal)} -> ${kb(afterTotal)}  saved ${kb(beforeTotal - afterTotal)} (-${Math.round((1 - afterTotal / beforeTotal) * 100)}%)`,
);
