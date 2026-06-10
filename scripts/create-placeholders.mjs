import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = path.join(root, "public/images");
const galleryDir = path.join(imagesDir, "gallery");

const palettes = [
  ["#0f5e4c", "#1a7a62", "#c9a962"],
  ["#4a2c6a", "#6b4d8a", "#e8d5a3"],
  ["#1c1a18", "#0f5e4c", "#d4af37"],
];

async function writePlaceholder(filePath, width, height, paletteIndex = 0) {
  const [a, b, c] = palettes[paletteIndex % palettes.length];
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${a}"/>
        <stop offset="55%" stop-color="${b}"/>
        <stop offset="100%" stop-color="${c}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      font-family="Georgia, serif" font-size="${Math.round(width * 0.05)}"
      fill="rgba(255,255,255,0.55)" font-style="italic">Grâce &amp; Armel</text>
  </svg>`;

  await sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(filePath);
}

fs.mkdirSync(galleryDir, { recursive: true });

await writePlaceholder(path.join(imagesDir, "hero.jpg"), 1600, 1000, 0);
await writePlaceholder(path.join(imagesDir, "story.jpg"), 1200, 1500, 1);
await writePlaceholder(path.join(imagesDir, "story-accent.jpg"), 900, 1200, 2);

for (let i = 1; i <= 6; i += 1) {
  const size = i % 2 === 0 ? [1000, 1250] : [1000, 1000];
  await writePlaceholder(path.join(galleryDir, `${String(i).padStart(2, "0")}.jpg`), size[0], size[1], i);
}

console.log("Placeholder images created.");
