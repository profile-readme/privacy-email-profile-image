// SPDX-FileCopyrightText: 2026 Aesthetic Vulpes (github.com/didvc)
// SPDX-License-Identifier: AGPL-3.0-only
// Server-side "canvas": draw the address into an 8-bit grayscale bitmap and encode it as PNG.
// The address never appears as text in the SVG; it only exists as pixels.
import { FONT, FONT_DATA } from "./font.generated.js";

const b64bytes = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
const pipe = async (bytes, stream) => new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());

let glyphs = null;
async function loadGlyphs() {
  glyphs ??= await pipe(b64bytes(FONT_DATA), new DecompressionStream("deflate"));
  return glyphs;
}

export async function rasterize(text, { jitter = 1, noise = 1, rng = Math.random } = {}) {
  const g = await loadGlyphs();
  const { w: gw, h: gh, chars } = FONT;
  const padX = 6, padY = 2 + jitter * 2;
  const W = padX * 2 + gw * text.length, H = gh + padY * 2;
  const img = new Uint8Array(W * H);
  const rand = (a) => (rng() * 2 - 1) * a;

  [...text].forEach((ch, i) => {
    const gi = chars.indexOf(ch);
    if (gi < 0) return;
    const ox = padX + i * gw + Math.round(rand(jitter * 0.6));
    const oy = padY + Math.round(rand(jitter * 1.6));
    const base = gi * gw * gh;
    for (let y = 0; y < gh; y++) {
      const row = (oy + y) * W;
      for (let x = 0; x < gw; x++) {
        const v = g[base + y * gw + x];
        const p = row + ox + x;
        if (v && p >= 0 && p < img.length && v > img[p]) img[p] = v;
      }
    }
  });

  // Faint specks: invisible at a glance, but they break naive thresholding/OCR pipelines a little.
  const specks = Math.round((noise * W * H) / 1400);
  for (let s = 0; s < specks; s++) {
    const x = Math.floor(rng() * (W - 2)), y = Math.floor(rng() * (H - 2));
    const v = 40 + Math.floor(rng() * 50);
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
      const p = (y + dy) * W + x + dx;
      if (v > img[p]) img[p] = v;
    }
  }
  return { width: W, height: H, data: img };
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

export async function encodePng({ width, height, data }) {
  const raw = new Uint8Array((width + 1) * height);
  for (let y = 0; y < height; y++) raw.set(data.subarray(y * width, (y + 1) * width), y * (width + 1) + 1);
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, width);
  dv.setUint32(4, height);
  ihdr.set([8, 0, 0, 0, 0], 8); // 8-bit grayscale, no interlace
  const parts = [
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", await pipe(raw, new CompressionStream("deflate"))),
    chunk("IEND", new Uint8Array(0)),
  ];
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

export function toBase64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
