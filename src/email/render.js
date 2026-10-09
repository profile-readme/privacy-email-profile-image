// SPDX-FileCopyrightText: 2026 Aesthetic Vulpes (github.com/didvc)
// SPDX-License-Identifier: AGPL-3.0-only
// Compose the badge SVG. The address is a PNG used as a luminance mask, so the text color
// follows the theme while the SVG source contains no address text at all.
import { SITE } from "./site.generated.js";

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const r1 = (n) => Math.round(n * 10) / 10;

const PALETTE = {
  light: { bg: "#fff8f1", text: "#3b2418", line: "#ecd9c8" },
  dark: { bg: "#241e2b", text: "#f6e7dc", line: "#3a3142" },
};
function themeCss(theme) {
  const vars = (p) => `--bg:${p.bg};--text:${p.text};--line:${p.line};`;
  let css = `svg{${vars(theme === "dark" ? PALETTE.dark : PALETTE.light)}}`;
  if (theme === "auto" || theme === "transparent") css += `@media (prefers-color-scheme:dark){svg{${vars(PALETTE.dark)}}}`;
  return css;
}

const FONT = 'ui-rounded,"Hiragino Maru Gothic ProN","Nunito","Segoe UI",system-ui,sans-serif';
const TITLE = "Email address, shown as an image";

function envelope(x, y, s, color) {
  return `<g transform="translate(${r1(x)} ${r1(y)}) scale(${r1(s / 24 * 100) / 100})" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">` +
    `<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M4.5 7.5l7.5 5.6 7.5-5.6"/></g>`;
}

function ears(x, top, s, h, accent) {
  const w = s * 1.25, gap = s * 0.5;
  const one = (ex) =>
    `<path d="M${r1(ex)} ${r1(top + h)}L${r1(ex + w * 0.5)} ${r1(top)}L${r1(ex + w)} ${r1(top + h)}Z" fill="#${accent}"/>` +
    `<path d="M${r1(ex + w * 0.32)} ${r1(top + h)}L${r1(ex + w * 0.5)} ${r1(top + h * 0.48)}L${r1(ex + w * 0.68)} ${r1(top + h)}Z" fill="#ffd9bf"/>`;
  return one(x) + one(x + w + gap);
}

export function renderBadge(opts, raster, pngBase64) {
  const S = opts.size, b = opts.border, scale = S / 40;
  const tw = r1(raster.width * scale), th = r1(raster.height * scale);
  const padX = r1(S * 0.7), padY = r1(S * 0.28);
  const iconW = opts.icon ? r1(S * 1.3) : 0;
  const capFont = r1(S * 0.78);
  const capW = opts.caption ? r1(opts.caption.length * capFont * 0.6 + S * 0.5) : 0;
  const earH = opts.ears ? r1(S * 0.85) : 0;
  const parts = [];
  let W, H, tx, ty, body = "";

  if (opts.style === "card") {
    const capRow = opts.caption ? r1(capFont * 1.5) : 0;
    W = r1(b * 2 + padX * 2 + iconW + tw);
    H = r1(earH + b * 2 + padY * 2.4 + capRow + th);
    const top = earH, radius = r1(S * 0.6);
    tx = b + padX + iconW; ty = top + b + padY * 1.2 + capRow;
    if (b) body += `<rect y="${top}" width="${W}" height="${r1(H - top)}" rx="${radius}" fill="#${opts.accent}"/>`;
    if (opts.theme !== "transparent" || b) body += `<rect x="${b}" y="${top + b}" width="${r1(W - 2 * b)}" height="${r1(H - top - 2 * b)}" rx="${Math.max(0, radius - b)}" fill="var(--bg)" stroke="var(--line)"/>`;
    if (opts.caption) body += `<text x="${r1(tx + S * 0.15)}" y="${r1(top + b + padY * 1.2 + capFont * 1.05)}" font-family='${FONT}' font-weight="700" font-size="${capFont}" fill="var(--text)" opacity=".72">${esc(opts.caption)}</text>`;
    if (opts.icon) body += envelope(b + padX * 0.75, ty + th / 2 - S * 0.62, S * 1.24, "#" + opts.accent);
  } else if (opts.style === "plain") {
    W = r1(iconW + tw);
    H = r1(earH + th);
    tx = iconW; ty = earH;
    if (opts.icon) body += envelope(0, ty + th / 2 - S * 0.62, S * 1.24, "#" + opts.accent);
  } else {
    const leftW = opts.caption ? r1(padX * 0.7 + iconW + capW) : 0;
    W = r1(b * 2 + leftW + padX * (opts.caption ? 0.6 : 1) + (opts.caption ? 0 : iconW) + tw + padX * 0.6);
    H = r1(earH + b * 2 + padY * 2 + th);
    const top = earH, ph = r1(H - top), radius = r1(ph / 2);
    tx = b + leftW + padX * (opts.caption ? 0.6 : 1) + (opts.caption ? 0 : iconW); ty = top + b + padY;
    parts.push(`<clipPath id="p"><rect x="${b}" y="${top + b}" width="${r1(W - 2 * b)}" height="${r1(ph - 2 * b)}" rx="${Math.max(0, radius - b)}"/></clipPath>`);
    if (b) body += `<rect y="${top}" width="${W}" height="${ph}" rx="${radius}" fill="#${opts.accent}"/>`;
    if (opts.theme !== "transparent" || b || opts.caption) body += `<rect x="${b}" y="${top + b}" width="${r1(W - 2 * b)}" height="${r1(ph - 2 * b)}" rx="${Math.max(0, radius - b)}" fill="var(--bg)"${b ? "" : ' stroke="var(--line)"'}/>`;
    if (opts.caption) {
      body += `<rect x="${b}" y="${top + b}" width="${r1(leftW + b)}" height="${r1(ph - 2 * b)}" fill="#${opts.accent}" clip-path="url(#p)"/>`;
      if (opts.icon) body += envelope(b + padX * 0.55, top + ph / 2 - S * 0.62, S * 1.24, "#3b2418");
      body += `<text x="${r1(b + padX * 0.7 + iconW)}" y="${r1(top + ph / 2 + capFont * 0.36)}" font-family='${FONT}' font-weight="700" font-size="${capFont}" fill="#3b2418">${esc(opts.caption)}</text>`;
    } else if (opts.icon) {
      body += envelope(b + padX * 0.75, top + ph / 2 - S * 0.62, S * 1.24, "#" + opts.accent);
    }
  }
  if (opts.ears) body = ears(r1(Math.min(W * 0.1, S * 1.4) + b), 0, S, earH + 1, opts.accent) + body;

  parts.push(
    `<mask id="m" maskUnits="userSpaceOnUse" x="${r1(tx)}" y="${r1(ty)}" width="${tw}" height="${th}">` +
    `<image x="${r1(tx)}" y="${r1(ty)}" width="${tw}" height="${th}" preserveAspectRatio="none" href="data:image/png;base64,${pngBase64}"/></mask>`,
  );
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">` +
    `<!-- (c) ${esc(SITE.copyrightYear)} ${esc(SITE.copyrightHolder)} (${esc(SITE.copyrightUrl)}) -->` +
    `<title id="t">${TITLE}</title><style>${themeCss(opts.theme)}</style><defs>${parts.join("")}</defs>` +
    body +
    `<rect x="${r1(tx)}" y="${r1(ty)}" width="${tw}" height="${th}" fill="var(--text)" mask="url(#m)"/></svg>`
  );
}

export function renderNotice(message, tone = "error") {
  const text = `email badge: ${message}`;
  const W = Math.round(text.length * 7.2 + 24);
  const [bg, fg] = tone === "error" ? ["#fde2e4", "#9b2c3a"] : ["#fff1d6", "#6b4a00"];
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="28" viewBox="0 0 ${W} 28" role="img" aria-label="${esc(text)}">` +
    `<title>${esc(text)}</title><rect width="${W}" height="28" rx="14" fill="${bg}"/>` +
    `<text x="${W / 2}" y="18.5" text-anchor="middle" fill="${fg}" font-family="ui-monospace,Menlo,Consolas,monospace" font-size="12">${esc(text)}</text></svg>`
  );
}
