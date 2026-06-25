// Category contact sheets from the resolved landing-image map.
// node scripts/category-sheets.mjs
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "C:/Users/direc/Dropbox/Ambiente Home LLC/Website/rebrand1/Landing Images";
const OUT = "C:/Users/direc/Dropbox/Ambiente Home LLC/Website/rebrand1";
const MAP = JSON.parse(fs.readFileSync("scripts/landing-image-map.json", "utf8"));

const norm = (t) => {
  const s = (t || "").toLowerCase();
  if (s.includes("necklace") || s.includes("pendant")) return "necklaces";
  if (s.includes("earring")) return "earrings";
  if (s.includes("bracelet")) return "bracelets";
  if (s.includes("charm")) return "charms";
  if (s.includes("watch")) return "watches";
  if (s.includes("ring")) return "rings";
  if (s.includes("sunglass")) return "sunglasses";
  if (s.includes("hair")) return "hair";
  return "other";
};

const groups = {};
for (const r of MAP) (groups[norm(r.type)] ??= []).push(r);

const COLS = 6, THUMB = 250, LABEL = 28, PAD = 8;
const cellW = THUMB + PAD * 2, cellH = THUMB + LABEL + PAD;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sheet(items, name) {
  items.sort((a, b) => a.png - b.png);
  const rows = Math.ceil(items.length / COLS);
  const W = COLS * cellW, H = rows * cellH;
  const comps = [], labels = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const x = (i % COLS) * cellW + PAD, y = Math.floor(i / COLS) * cellH + PAD;
    const buf = await sharp(path.join(SRC, it.file)).resize(THUMB, THUMB, { fit: "cover" }).jpeg({ quality: 76 }).toBuffer();
    comps.push({ input: buf, left: x, top: y });
    const tag = `${it.png} ${it.variant === "LIFESTYLE" ? "L" : "H"}`;
    labels.push(`<text x="${x + THUMB / 2}" y="${y + THUMB + 19}" font-family="Arial" font-size="16" fill="#2a2a2a" text-anchor="middle">${esc(tag)}</text>`);
  }
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${labels.join("")}</svg>`;
  await sharp({ create: { width: W, height: H, channels: 3, background: "#faf4e8" } })
    .composite([...comps, { input: Buffer.from(svg), left: 0, top: 0 }])
    .jpeg({ quality: 82 })
    .toFile(path.join(OUT, name));
  console.log(`${name}  ${W}x${H}  (${items.length})`);
}

for (const [cat, items] of Object.entries(groups)) {
  await sheet(items, `_cat-${cat}.jpg`);
}
console.log("done");
