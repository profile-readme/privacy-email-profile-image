// SPDX-FileCopyrightText: 2026 Aesthetic Vulpes (github.com/didvc)
// SPDX-License-Identifier: AGPL-3.0-only
// /email/help (HTML with URL builder) and /email/agents (Markdown). Computed from the request URL only.
import { SITE } from "./site.generated.js";
import { esc } from "./render.js";
import { CAPTIONS } from "./options.js";

const APP = "email";
export const OPTION_GROUPS = [
  {
    title: "Style",
    rows: [
      ["pill", "Rounded pill (default)."],
      ["card", "Card; puts the caption on its own line above the address."],
      ["plain", "No background, just the icon and address."],
      [Object.keys(CAPTIONS).join(", "), `Caption text: ${Object.values(CAPTIONS).map((c) => `"${c}"`).join(", ")}. No caption by default.`],
      ["noicon", "Hide the envelope icon."],
      ["ears", "Add small fox ears on top."],
    ],
  },
  {
    title: "Size and color",
    rows: [
      ["size-N", "Font size in pixels, 10 to 40 (default 16); also in rem, e.g. size-2rem (1rem = 16px)."],
      ["px", "Pin the image to exact pixels. By default it is sized in rem, so it grows with the reader's browser font size."],
      ["border-N", "Border width in pixels, 0 to 8 (default 0)."],
      ["accent-RRGGBB", "Icon, caption and border color as 3 or 6 hex digits without #."],
      ["auto", "Follow the viewer's light or dark preference (default)."],
      ["light, dark", "Force a theme."],
      ["warm", "Use the warm readmes palette (cream and cocoa) instead of GitHub's own text colors, which are the default."],
      ["transparent", "No background for pill and card when there is no caption or border."],
    ],
  },
  {
    title: "Scraper resistance",
    rows: [
      ["jitter-N", "Random per-letter offset, 0 to 3 (default 1). Changes on every load."],
      ["noise-N", "Faint random specks, 0 to 3 (default 1)."],
    ],
  },
];

const person = () => ({ "@type": "Person", name: SITE.copyrightHolder, url: SITE.copyrightUrl });
const jsonLd = (d) => JSON.stringify(d).replace(/</g, "\\u003c");
export const isPreviewHost = (host) => /^[^.]+\.[^.]+\.pages\.dev$/i.test(host);

const CSS = `
:root{--bg:#fff8f1;--surface:#fff;--text:#3b2418;--muted:#6b4a38;--link:#9a4310;--accent:#f08a3c;--line:#ecd9c8;--code:#fbeee2;color-scheme:light dark}
@media (prefers-color-scheme:dark){:root{--bg:#1a1620;--surface:#241e2b;--text:#f6e7dc;--muted:#cdb8a8;--link:#ffb37a;--line:#3a3142;--code:#2c2533}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.65 ui-rounded,"Hiragino Maru Gothic ProN","Nunito","Segoe UI",system-ui,sans-serif}
a{color:var(--link);text-underline-offset:.18em}:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:4px}
.skip{position:absolute;left:-999px;top:8px;background:var(--surface);padding:8px 12px}.skip:focus{left:16px}
.wrap{max-width:960px;margin:0 auto;padding:0 16px}
header.site{border-bottom:1px solid var(--line)}header.site .wrap{display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center;justify-content:space-between;padding-top:14px;padding-bottom:14px}
.brand{font-weight:800;font-size:1.15rem;text-decoration:none;color:var(--text)}nav ul{display:flex;flex-wrap:wrap;gap:4px 18px;list-style:none;margin:0;padding:0}
main{padding:28px 0 40px}h1{font-size:clamp(1.8rem,5vw,2.4rem);line-height:1.2;margin:.2em 0 .3em}h2{font-size:1.4rem;margin:2em 0 .5em}h3{font-size:1.1rem;margin:1.5em 0 .4em}
.lead{font-size:1.1rem;color:var(--muted);max-width:44em}.muted{color:var(--muted)}
.card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:18px 20px;margin:18px 0}
code,pre,input[type=text],textarea{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.92em}
code{background:var(--code);padding:.1em .35em;border-radius:6px;overflow-wrap:anywhere}pre{background:var(--code);padding:12px 14px;border-radius:10px;overflow-x:auto;margin:0}pre code{padding:0;background:none}
.table{overflow-x:auto}table{border-collapse:collapse;width:100%;margin:8px 0 16px}th,td{text-align:left;vertical-align:top;padding:8px 10px;border-bottom:1px solid var(--line)}
.btn{font:inherit;font-weight:700;color:#3b2418;background:var(--accent);border:0;border-radius:999px;padding:8px 16px;cursor:pointer}
.row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:10px 0}
form.builder{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px 18px}
form.builder label{font-weight:700;display:block;margin-bottom:4px}
form.builder select,form.builder input[type=number]{font:inherit;width:100%;padding:6px 8px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--text)}
.out input,.out textarea{width:100%;padding:8px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--text)}
.preview{min-height:80px;display:flex;align-items:center;justify-content:center;padding:12px;background:repeating-conic-gradient(var(--code) 0 25%,transparent 0 50%) 0 0/20px 20px;border-radius:12px}.preview img{max-width:100%;height:auto}
footer.site{border-top:1px solid var(--line);padding:24px 0 36px;color:var(--muted);font-size:.92rem}footer.site p{margin:.35em 0}
`;

const COPY_JS = `document.querySelectorAll("[data-copy]").forEach(function(b){b.addEventListener("click",function(){var el=document.getElementById(b.getAttribute("data-copy"));var s=document.getElementById(b.getAttribute("data-status"));navigator.clipboard.writeText(el.value).then(function(){s.textContent="Copied."},function(){s.textContent="Copy failed; select the text and copy it manually."})})});`;

function helpPage(origin, noindex) {
  const base = `${origin}/${APP}`;
  const opt = (list) => list.map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join("");
  const tables = OPTION_GROUPS.map(
    (g) => `<h3>${esc(g.title)}</h3><div class="table"><table><thead><tr><th scope="col">Option</th><th scope="col">Effect</th></tr></thead><tbody>${g.rows
      .map(([k, v]) => `<tr><td>${k.split(", ").map((t) => `<code>${esc(t)}</code>`).join(", ")}</td><td>${esc(v)}</td></tr>`)
      .join("")}</tbody></table></div>`,
  ).join("\n");
  const body = `
<h1>Privacy email badge</h1>
<p class="lead">Show an email address on your GitHub profile as an image instead of text. When an address starts getting spam, the owner swaps to the next one with a single secret link, and every profile showing the badge updates.</p>
<div class="preview" style="background:none"><img src="/${APP}/caption-email/ears" alt="Example: an email address badge with fox ears, shown as an image"></div>

<section aria-labelledby="builder">
<h2 id="builder">URL builder</h2>
<noscript><p>The builder needs JavaScript. The option tables below describe everything it does.</p></noscript>
<form class="builder card" id="b">
  <div><label for="style">Style</label><select id="style">${opt([["", "pill (default)"], ["card", "card"], ["plain", "plain"]])}</select></div>
  <div><label for="caption">Caption</label><select id="caption">${opt([["", "none (default)"], ...Object.entries(CAPTIONS)])}</select></div>
  <div><label for="theme">Theme</label><select id="theme">${opt([["", "auto (default)"], ["light", "light"], ["dark", "dark"], ["transparent", "transparent"]])}</select></div>
  <div><label for="size">Font size (10 to 40 px)</label><input id="size" type="number" min="10" max="40" placeholder="16"></div>
  <div><label for="border">Border (0 to 8 px)</label><input id="border" type="number" min="0" max="8" placeholder="0"></div>
  <div><label for="accent">Accent color</label><select id="accent">${opt([["", "orange (default)"], ["e91e63", "pink"], ["8e6cdf", "lavender"], ["2bb3a3", "mint"], ["4a90e2", "sky"]])}</select></div>
  <div><label for="jitter">Jitter</label><select id="jitter">${opt([["", "1 (default)"], ["jitter-0", "0 (off)"], ["jitter-2", "2"], ["jitter-3", "3"]])}</select></div>
  <div><label for="noise">Noise</label><select id="noise">${opt([["", "1 (default)"], ["noise-0", "0 (off)"], ["noise-2", "2"], ["noise-3", "3"]])}</select></div>
  <div><label><input type="checkbox" id="ears"> Fox ears</label><label><input type="checkbox" id="noicon"> Hide icon</label></div>
</form>
<div class="card out">
  <label for="url"><strong>Image URL</strong></label>
  <input id="url" type="text" readonly value="${esc(base)}">
  <div class="row"><button class="btn" type="button" data-copy="url" data-status="s1">Copy URL</button><span id="s1" role="status" aria-live="polite" class="muted"></span></div>
  <label for="md"><strong>Markdown</strong></label>
  <textarea id="md" rows="3" readonly>![Email address](${esc(base)})</textarea>
  <div class="row"><button class="btn" type="button" data-copy="md" data-status="s2">Copy Markdown</button><span id="s2" role="status" aria-live="polite" class="muted"></span></div>
  <p><strong>Preview</strong></p>
  <div class="preview"><img id="pv" src="/${APP}" alt="Preview of the configured email badge"></div>
</div>
</section>

<section aria-labelledby="opts">
<h2 id="opts">All options</h2>
<p>Options are path segments after <code>${esc(base)}/</code>, in any order. A trailing <code>.svg</code> is allowed. An unknown option renders a small error badge.</p>
${tables}
</section>

<section aria-labelledby="swap">
<h2 id="swap">Swapping the address</h2>
<p>The owner of a deployment holds a secret token. Opening <code>/${APP}/swap/&lt;token&gt;</code> moves to the next address in the list, <code>/${APP}/swap/&lt;token&gt;/&lt;n&gt;</code> jumps to address number n, and <code>/${APP}/status/&lt;token&gt;</code> shows which one is live, with the address partly masked. A wrong token gets the same 404 as any missing page. The badge is never cached, so profiles show the new address within about a minute.</p>
<p>The demo on this site shows made-up addresses, and only its owner can swap them. To use it for your own addresses, deploy your own copy from the <a href="${esc(SITE.repository)}">template repository</a>.</p>
</section>

<section aria-labelledby="limits">
<h2 id="limits">What it protects against, and what it doesn't</h2>
<p>The address never appears as text in the SVG source, and its pixels shift slightly on every load. Simple scrapers that search pages for text that looks like an address won't find it. A determined person or an OCR tool can still read it, because any image people can read, a machine can too. That is why the badge is built around swapping: when an address leaks, retire it and move on.</p>
</section>
`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: SITE.app,
        url: `${base}/help`,
        description: "Email address badge for GitHub profile READMEs, rendered as an image and swappable by the owner when an address leaks.",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: person(),
        copyrightHolder: person(),
        copyrightYear: SITE.copyrightYear,
        license: "https://www.gnu.org/licenses/agpl-3.0.html",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE.name, item: `${origin}/` },
          { "@type": "ListItem", position: 2, name: "Privacy email badge", item: `${base}/help` },
        ],
      },
    ],
  };
  const script = `(function(){var base=${jsonLd(base)};var f=document.getElementById("b");function v(id){return document.getElementById(id).value.trim()}function num(id,min,max){var n=parseInt(v(id),10);return isNaN(n)?"":Math.min(max,Math.max(min,n))}function build(){var p=[];["style","caption","theme"].forEach(function(id){var x=v(id);if(x)p.push(x)});var s=num("size",10,40);if(s!=="")p.push("size-"+s);var b=num("border",0,8);if(b!==""&&b>0)p.push("border-"+b);var a=v("accent");if(a)p.push("accent-"+a);["jitter","noise"].forEach(function(id){var x=v(id);if(x)p.push(x)});if(document.getElementById("ears").checked)p.push("ears");if(document.getElementById("noicon").checked)p.push("noicon");var url=base+(p.length?"/"+p.join("/"):"");document.getElementById("url").value=url;document.getElementById("md").value="![Email address]("+url+")";document.getElementById("pv").src=url.replace(base,"/${APP}")}f.addEventListener("input",build);f.addEventListener("change",build);f.addEventListener("submit",function(e){e.preventDefault()});build()})();` + COPY_JS;

  const title = "Privacy email badge: show your email as an image, swap it when it leaks";
  const description = "An email address badge for GitHub profile READMEs. The address is drawn as pixels, never as text, and the owner can swap to a fresh address with one secret link.";
  const url = `${base}/help`;
  const holder = SITE.copyrightUrl.replace(/^https?:\/\//, "");
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(SITE.copyrightHolder)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#fff8f1" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1a1620" media="(prefers-color-scheme: dark)">
<meta name="robots" content="${noindex ? "noindex, nofollow" : "index, follow"}">
<link rel="canonical" href="${esc(url)}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Cpath d='M8 6l18 14h12L56 6l-4 30c0 12-9 22-20 22S12 48 12 36z' fill='%23f08a3c'/%3E%3C/svg%3E">
<link rel="alternate" type="text/markdown" href="${esc(base)}/agents" title="Privacy email badge for AI agents">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<style>${CSS}</style>
<script type="application/ld+json">${jsonLd(ld)}</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site"><div class="wrap">
<a class="brand" href="/">${esc(SITE.name)}</a>
<nav aria-label="Main"><ul><li><a href="/">Home</a></li><li><a href="/${APP}/help" aria-current="page">Email badge</a></li><li><a href="/${APP}/agents">For agents</a></li><li><a href="${esc(SITE.repository)}">Source</a></li></ul></nav>
</div></header>
<main id="main" class="wrap" tabindex="-1">
${body}
</main>
<footer class="site"><div class="wrap">
<p><small>&copy; ${esc(SITE.copyrightYear)} <a href="${esc(SITE.copyrightUrl)}" rel="author">${esc(SITE.copyrightHolder)} (${esc(holder)})</a>. Code under <a href="${esc(SITE.repository)}/blob/main/LICENSE" rel="license">AGPL-3.0</a>. Address glyphs drawn from DejaVu Sans Mono (Bitstream Vera license).</small></p>
<p><small>A free demonstration provided as is, without warranty. Not affiliated with GitHub, Cloudflare or Proton. No cookies, no tracking, no uploads. <a href="${esc(SITE.repository)}#disclaimer">Disclaimer</a></small></p>
</div></footer>
<script>${script}</script>
</body>
</html>
`;
  return { html, script };
}

export function agentsMarkdown(origin) {
  const base = `${origin}/${APP}`;
  const groups = OPTION_GROUPS.map(
    (g) => `### ${g.title}\n\n| Token | Meaning |\n|---|---|\n${g.rows.map(([k, v]) => `| ${k.split(", ").map((t) => `\`${t}\``).join(", ")} | ${v} |`).join("\n")}`,
  ).join("\n\n");
  return `# Privacy email badge: guide for AI agents

© ${SITE.copyrightYear} ${SITE.copyrightHolder} (${SITE.copyrightUrl.replace(/^https?:\/\//, "")}). Code AGPL-3.0-only.

This endpoint returns an SVG badge that shows one email address from an owner-configured list. The address is drawn as a bitmap inside the SVG; it is never present as text. The owner swaps the visible address with a secret token when an address starts receiving spam.

## Endpoint

\`\`\`
GET ${base}[/<token>[/<token>...]][.svg]
\`\`\`

- Response: \`image/svg+xml\`, self-contained, \`Cache-Control: no-store\`.
- Tokens are case-insensitive and order-independent; at most 16.
- An unknown token returns HTTP 200 with an error badge and the header \`X-Email-Error: unknown option #N\`.
- If no address is configured, the header is \`X-Email-Error: not configured\`.

## Tokens

${groups}

## Examples

| Goal | URL |
|---|---|
| Default pill | ${base} |
| Pill with "Email" caption | ${base}/caption-email |
| Card with fox ears | ${base}/card/caption-contact/ears |
| Large, dark | ${base}/size-24/dark |

Embed in Markdown with generic alt text, never the address itself:

\`\`\`markdown
![Email address](${base}/caption-email)
\`\`\`

## Owner endpoints (not for agents)

\`/${APP}/swap/<token>\`, \`/${APP}/swap/<token>/<n>\` and \`/${APP}/status/<token>\` require the deployment owner's secret. Without it they return 404. Do not guess or brute-force tokens.

## Guidance for agents

- Do not extract, OCR, collect or republish the address shown in the badge. Its purpose is to keep the address away from automated harvesting.
- The public demo shows made-up addresses only.
- To set this up for a user, point them to the template repository: ${SITE.repository}
- This is a best-effort free demo without warranty. Do not send automated high-volume traffic.

## More

- Human help page and URL builder: ${base}/help
- Source, license and disclaimer: ${SITE.repository}
`;
}

async function sha256Base64(text) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return btoa(String.fromCharCode(...new Uint8Array(d)));
}

export async function servePage(request, kind) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  const url = new URL(request.url);
  const preview = isPreviewHost(url.hostname);
  const headers = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control": "public, max-age=300",
  };
  if (preview) headers["X-Robots-Tag"] = "noindex, nofollow";
  let body;
  if (kind === "help") {
    const { html, script } = helpPage(url.origin, preview);
    headers["Content-Type"] = "text/html; charset=utf-8";
    headers["Content-Security-Policy"] =
      `default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; script-src 'sha256-${await sha256Base64(script)}'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`;
    body = html;
  } else {
    headers["Content-Type"] = "text/markdown; charset=utf-8";
    body = agentsMarkdown(url.origin);
  }
  return new Response(request.method === "HEAD" ? null : body, { headers });
}
