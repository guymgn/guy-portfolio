import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const width = 1200;
const height = 630;
const spacing = 80;
const hornbill = (await readFile(new URL("../public/fonts/hornbill-variable.ttf", import.meta.url))).toString("base64");
const dmSans = (await readFile(new URL("../public/fonts/DMSans-Variable.ttf", import.meta.url))).toString("base64");

const verticalLines = Array.from({ length: Math.ceil(width / spacing) + 1 }, (_, index) =>
  `<line x1="${index * spacing + .5}" y1="0" x2="${index * spacing + .5}" y2="${height}"/>`,
).join("");
const horizontalLines = Array.from({ length: Math.ceil(height / spacing) + 1 }, (_, index) =>
  `<line x1="0" y1="${index * spacing + .5}" x2="${width}" y2="${index * spacing + .5}"/>`,
).join("");
const nodes = Array.from({ length: Math.ceil(width / spacing) + 1 }, (_, column) =>
  Array.from({ length: Math.ceil(height / spacing) + 1 }, (_, row) =>
    `<circle cx="${column * spacing + .5}" cy="${row * spacing + .5}" r="1.65"/>`,
  ).join(""),
).join("");

const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face { font-family: Hornbill; src: url(data:font/ttf;base64,${hornbill}); }
      @font-face { font-family: DM Sans; src: url(data:font/ttf;base64,${dmSans}); }
      .wordmark { font-family: Hornbill, Georgia, serif; font-size: 116px; font-weight: 850; letter-spacing: -5px; }
      .label, .role { font-family: DM Sans, Arial, sans-serif; }
    </style>
    <radialGradient id="glow" cx="50%" cy="44%" r="42%">
      <stop offset="0" stop-color="#7776FF" stop-opacity=".11"/>
      <stop offset="1" stop-color="#7776FF" stop-opacity="0"/>
    </radialGradient>
    <filter id="softGlow" x="-30%" y="-50%" width="160%" height="200%">
      <feGaussianBlur stdDeviation="11"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="#0d0d0d"/>
  <g stroke="rgba(255,255,255,.035)" stroke-width="1">${verticalLines}${horizontalLines}</g>
  <g fill="rgba(255,255,255,.32)">${nodes}</g>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>
  <g stroke="#7776FF" stroke-width="1.5" opacity=".62">
    <line x1="80" y1="80" x2="146" y2="80"/>
    <line x1="1040" y1="480" x2="1118" y2="480"/>
    <line x1="880" y1="160" x2="880" y2="220"/>
  </g>
  <text class="label" x="600" y="177" fill="#92928c" font-size="13" font-weight="600" letter-spacing="2.6" text-anchor="middle">HEY THERE, I’M</text>
  <text class="wordmark" x="600" y="316" fill="#7776FF" opacity=".2" text-anchor="middle" filter="url(#softGlow)">Guy Magen</text>
  <text class="wordmark" x="600" y="316" fill="#e8e7e2" text-anchor="middle">Guy Magen</text>
  <text class="role" x="600" y="376" fill="#7776FF" font-size="28" font-weight="550" letter-spacing="-.35" text-anchor="middle">Senior Product Designer &amp; Builder</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ quality: 100 }).toFile(fileURLToPath(new URL("../public/og-2026-09-15.png", import.meta.url)));
