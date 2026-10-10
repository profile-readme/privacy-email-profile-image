// SPDX-FileCopyrightText: 2026 Aesthetic Vulpes (github.com/didvc)
// SPDX-License-Identifier: AGPL-3.0-only
// Parse /email/<token>/<token>/... into validated badge options. Only whitelisted keywords are accepted.
export const STYLES = ["pill", "card", "plain"];
export const THEMES = ["auto", "light", "dark", "transparent"];
export const CAPTIONS = { "caption-email": "Email", "caption-contact": "Contact", "caption-mail-me": "Mail me" };
export const ACCENT = "f08a3c";
const bounded = (v, min, max) => Math.min(max, Math.max(min, v));

export function parseOptions(segments) {
  const opts = { style: "pill", palette: "github", theme: "auto", size: 16, border: 0, accent: ACCENT, icon: true, ears: false, caption: null, jitter: 1, noise: 1 };
  if (segments.length > 16 || segments.join("/").length > 512) return { error: "too many options" };
  for (let i = 0; i < segments.length; i++) {
    let t = String(segments[i]).toLowerCase();
    if (i === segments.length - 1) t = t.replace(/\.svg$/, "");
    if (!t) continue;
    let m;
    if (STYLES.includes(t)) opts.style = t;
    else if (THEMES.includes(t)) opts.theme = t;
    else if (t in CAPTIONS) opts.caption = CAPTIONS[t];
    else if (t === "noicon") opts.icon = false;
    else if (t === "warm") opts.palette = "warm";
    else if (t === "ears") opts.ears = true;
    else if (t === "px") opts.px = true;
    else if ((m = t.match(/^size-(\d{1,4}(?:\.\d{1,3})?)(rem)?$/))) opts.size = bounded(Math.round(+m[1] * (m[2] ? 16 : 1)), 10, 40);
    else if ((m = t.match(/^border-(\d{1,2})$/))) opts.border = bounded(+m[1], 0, 8);
    else if ((m = t.match(/^jitter-(\d)$/))) opts.jitter = bounded(+m[1], 0, 3);
    else if ((m = t.match(/^noise-(\d)$/))) opts.noise = bounded(+m[1], 0, 3);
    else if ((m = t.match(/^accent-([0-9a-f]{3}|[0-9a-f]{6})$/))) opts.accent = m[1];
    else return { error: `unknown option #${i + 1}` };
  }
  return { opts };
}
