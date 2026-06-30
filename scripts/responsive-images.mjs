// Generates right-sized WebP variants of the landing imagery so the browser can
// download a size that matches the slot instead of the full 1000px master.
// This is purely additive (originals are kept as the largest srcset candidate)
// and lossless in practice — we never upscale and never serve a smaller file
// than the slot needs. Run: node scripts/responsive-images.mjs
import sharp from "sharp";
import { readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

const QUALITY = 84; // visually transparent for these decorative WebPs

// dir -> widths to emit (skipped when >= source width)
// Widths are kept below the smallest master in each folder so every variant
// always exists (no 404s in a fixed srcset); the untouched master stays as the
// largest candidate for big slots.
const TARGETS = [
  { dir: "public/landing", widths: [256, 512] },
  { dir: "public/images", widths: [360, 600] },
];

// A master is any .webp that isn't one of OUR generated variants. Match only
// our exact variant widths so masters whose names legitimately end in "-N"
// (e.g. edit-1.webp) aren't mistaken for variants.
const isMaster = (f) => /\.webp$/i.test(f) && !/-(256|512|360|600)\.webp$/i.test(f);

let made = 0;
let savedKb = 0;

for (const { dir, widths } of TARGETS) {
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir).filter(isMaster);
  for (const file of files) {
    const src = join(dir, file);
    const base = file.replace(/\.webp$/i, "");
    const meta = await sharp(src).metadata();
    for (const w of widths) {
      if (!meta.width || w >= meta.width) continue; // never upscale
      const out = join(dir, `${base}-${w}.webp`);
      await sharp(src).resize({ width: w }).webp({ quality: QUALITY }).toFile(out);
      made += 1;
      savedKb += Math.round((statSync(src).size - statSync(out).size) / 1024);
    }
  }
  console.log(`${dir}: processed ${files.length} masters`);
}

console.log(`Done — generated ${made} variants.`);
