// Build labeled contact sheets from the Landing Images folder.
// Run from elevate-brand-shell (so it finds the unsaved `sharp`): node scripts/contact-sheet.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "C:/Users/direc/Dropbox/Ambiente Home LLC/Website/rebrand1/Landing Images";
const OUT = "C:/Users/direc/Dropbox/Ambiente Home LLC/Website/rebrand1";

const COLS = 6;
const THUMB = 260;
const LABEL = 30;
const PAD = 8;
const cellW = THUMB + PAD * 2;
const cellH = THUMB + LABEL + PAD;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const num = (f) => parseInt(f, 10) || 0;

async function sheet(files, name) {
  const rows = Math.ceil(files.length / COLS);
  const W = COLS * cellW;
  const H = rows * cellH;
  const composites = [];
  const labels = [];
  for (let i = 0; i < files.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = col * cellW + PAD;
    const y = row * cellH + PAD;
    const buf = await sharp(path.join(SRC, files[i]))
      .resize(THUMB, THUMB, { fit: "cover" })
      .jpeg({ quality: 78 })
      .toBuffer();
    composites.push({ input: buf, left: x, top: y });
    const id = esc(files[i].replace(/\.png$/i, ""));
    labels.push(
      `<text x="${x + THUMB / 2}" y="${y + THUMB + 21}" font-family="Arial" font-size="17" fill="#2a2a2a" text-anchor="middle">${id}</text>`,
    );
  }
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${labels.join("")}</svg>`;
  await sharp({ create: { width: W, height: H, channels: 3, background: "#faf4e8" } })
    .composite([...composites, { input: Buffer.from(svg), left: 0, top: 0 }])
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, name));
  console.log(`${name}  ${W}x${H}  (${files.length} images)`);
}

const all = fs.readdirSync(SRC).filter((f) => /\.png$/i.test(f));
const life = all.filter((f) => /LIFESTYLE/i.test(f)).sort((a, b) => num(a) - num(b));
const hero = all.filter((f) => /HERO/i.test(f)).sort((a, b) => num(a) - num(b));

await sheet(life, "_contact-LIFESTYLE.jpg");
await sheet(hero, "_contact-HERO.jpg");
console.log("done");
