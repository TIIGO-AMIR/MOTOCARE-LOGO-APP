import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Crisp, high-contrast motorcycle service log icon SVG
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
    <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>

  <!-- Subtle grid/accent backdrop circle -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="rgba(249,115,22,0.12)" stroke-width="32" stroke-dasharray="16 12"/>
  <circle cx="256" cy="256" r="160" fill="rgba(15,23,42,0.8)" stroke="rgba(56,189,248,0.2)" stroke-width="3"/>

  <!-- Motorcycle Emblem & Wrench Combo -->
  <g filter="url(#shadow)">
    <!-- Rear Wheel -->
    <circle cx="160" cy="310" r="48" fill="none" stroke="#94a3b8" stroke-width="14"/>
    <circle cx="160" cy="310" r="26" fill="#1e293b" stroke="#f97316" stroke-width="6"/>
    <circle cx="160" cy="310" r="8" fill="#ffffff"/>

    <!-- Front Wheel -->
    <circle cx="352" cy="310" r="48" fill="none" stroke="#94a3b8" stroke-width="14"/>
    <circle cx="352" cy="310" r="26" fill="#1e293b" stroke="#f97316" stroke-width="6"/>
    <circle cx="352" cy="310" r="8" fill="#ffffff"/>

    <!-- Frame & Body -->
    <path d="M160 310 L230 310 L285 240 L340 240 L352 310" fill="none" stroke="#e2e8f0" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M230 310 L250 220 L310 220 L330 180" fill="none" stroke="url(#accentGrad)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Fuel Tank / Body Seat -->
    <path d="M230 220 Q270 200 310 215 Q290 238 230 235 Z" fill="url(#accentGrad)"/>
    <path d="M185 235 Q225 235 240 245 L215 250 Z" fill="#334155"/>

    <!-- Handlebars -->
    <path d="M320 180 L345 170" fill="none" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
    <circle cx="350" cy="168" r="7" fill="#38bdf8"/>

    <!-- Engine block with cooling fins -->
    <rect x="220" y="260" width="46" height="38" rx="6" fill="#475569" stroke="#64748b" stroke-width="3"/>
    <line x1="225" y1="270" x2="261" y2="270" stroke="#94a3b8" stroke-width="3"/>
    <line x1="225" y1="280" x2="261" y2="280" stroke="#94a3b8" stroke-width="3"/>
  </g>

  <!-- Service Wrench Badge Top-Right -->
  <g transform="translate(340, 110) scale(0.9)" filter="url(#shadow)">
    <circle cx="30" cy="30" r="42" fill="#0f172a" stroke="#f97316" stroke-width="5"/>
    <path d="M44 14 C36 12 28 17 24 23 L29 28 L23 34 L17 29 C12 34 11 42 15 48 C18 51 23 52 27 50 L42 65 C45 68 49 68 52 65 L55 62 C58 59 58 55 55 52 L40 37 C43 32 43 25 39 20 C38 19 37 18 36 17 L44 14 Z" fill="url(#accentGrad)"/>
    <circle cx="28" cy="24" r="4" fill="#ffffff"/>
  </g>
</svg>`;

// Maskable icon with safe zone padding (central 80% circle)
const svgMaskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <linearGradient id="accentGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f97316" />
      <stop offset="100%" stop-color="#ea580c" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bgGrad2)" />
  <g transform="translate(51, 51) scale(0.8)">
    <circle cx="256" cy="256" r="190" fill="none" stroke="rgba(249,115,22,0.15)" stroke-width="30" stroke-dasharray="16 12"/>
    <circle cx="256" cy="256" r="160" fill="rgba(15,23,42,0.85)" stroke="rgba(56,189,248,0.25)" stroke-width="4"/>
    
    <!-- Rear Wheel -->
    <circle cx="160" cy="310" r="48" fill="none" stroke="#94a3b8" stroke-width="14"/>
    <circle cx="160" cy="310" r="26" fill="#1e293b" stroke="#f97316" stroke-width="6"/>
    <circle cx="160" cy="310" r="8" fill="#ffffff"/>

    <!-- Front Wheel -->
    <circle cx="352" cy="310" r="48" fill="none" stroke="#94a3b8" stroke-width="14"/>
    <circle cx="352" cy="310" r="26" fill="#1e293b" stroke="#f97316" stroke-width="6"/>
    <circle cx="352" cy="310" r="8" fill="#ffffff"/>

    <!-- Frame & Body -->
    <path d="M160 310 L230 310 L285 240 L340 240 L352 310" fill="none" stroke="#e2e8f0" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M230 310 L250 220 L310 220 L330 180" fill="none" stroke="url(#accentGrad2)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    
    <!-- Fuel Tank / Body Seat -->
    <path d="M230 220 Q270 200 310 215 Q290 238 230 235 Z" fill="url(#accentGrad2)"/>
    <path d="M185 235 Q225 235 240 245 L215 250 Z" fill="#334155"/>

    <!-- Handlebars -->
    <path d="M320 180 L345 170" fill="none" stroke="#f8fafc" stroke-width="12" stroke-linecap="round"/>
    <circle cx="350" cy="168" r="7" fill="#38bdf8"/>

    <!-- Engine block -->
    <rect x="220" y="260" width="46" height="38" rx="6" fill="#475569" stroke="#64748b" stroke-width="3"/>
    
    <!-- Wrench Badge -->
    <g transform="translate(340, 110) scale(0.9)">
      <circle cx="30" cy="30" r="40" fill="#0f172a" stroke="#f97316" stroke-width="5"/>
      <path d="M44 14 C36 12 28 17 24 23 L29 28 L23 34 L17 29 C12 34 11 42 15 48 C18 51 23 52 27 50 L42 65 C45 68 49 68 52 65 L55 62 C58 59 58 55 55 52 L40 37 C43 32 43 25 39 20 C38 19 37 18 36 17 L44 14 Z" fill="url(#accentGrad2)"/>
    </g>
  </g>
</svg>`;

async function build() {
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon);

  const svgBuffer = Buffer.from(svgIcon);
  const maskableBuffer = Buffer.from(svgMaskable);

  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(48, 48).png().toFile(path.join(publicDir, 'favicon.ico'));
  await sharp(maskableBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  console.log('Successfully generated all PWA icons in /public');
}

build().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
