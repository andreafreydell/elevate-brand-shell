// Convert the hand-picked "feature" banner photos (close-ups / simpler shots)
// into the same square WebP format the moving banner uses, keyed by the leading
// number in each filename (which maps to the product handle ending in that
// number). Masters land in public/landing/<n>.webp; run responsive-images.mjs
// afterward to emit the 256/512 srcset variants. Run: node scripts/add-banner-features.mjs
import sharp from "sharp";
import { readdirSync } from "fs";
import { join } from "path";

const SRC = "C:/Users/direc/Dropbox/Ambiente Home LLC/Website/rebrand1/Landing Images/landing_highres";
const OUTDIR = "public/landing";

const files = readdirSync(SRC).filter((f) => /\.jpe?g$/i.test(f));
let made = 0;
for (const file of files) {
  const m = file.match(/^(\d+)/);
  if (!m) {
    console.log("skip (no leading number):", file);
    continue;
  }
  const png = m[1];
  const out = join(OUTDIR, `${png}.webp`);
  // Square cover-crop to match the banner tiles; 1000px master so retina slots
  // stay crisp, then responsive-images.mjs makes the 256/512 candidates.
  await sharp(join(SRC, file)).resize(1000, 1000, { fit: "cover" }).webp({ quality: 82 }).toFile(out);
  made += 1;
  console.log(`${file} -> ${png}.webp`);
}
console.log(`Done — ${made} feature masters written to ${OUTDIR}.`);
