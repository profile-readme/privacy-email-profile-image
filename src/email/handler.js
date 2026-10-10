// SPDX-FileCopyrightText: 2026 Aesthetic Vulpes (github.com/didvc)
// SPDX-License-Identifier: AGPL-3.0-only
// Badge, swap and status endpoints. GET only; nothing from the request body is read.
// Every endpoint takes an optional instance ns = { prefix, key } so one deployment can serve
// several independent lists on different routes (prefix: env var prefix, key: KV key prefix).
import { parseOptions } from "./options.js";
import { readList, maskAddress } from "./list.js";
import { getIndex, setIndex } from "./state.js";
import { rasterize, encodePng, toBase64 } from "./raster.js";
import { renderBadge, renderNotice } from "./render.js";

const NO_STORE = "no-cache, no-store, max-age=0, must-revalidate";
const SVG_HEADERS = {
  "Content-Type": "image/svg+xml; charset=utf-8",
  "Content-Security-Policy": "default-src 'none'; img-src data:; style-src 'unsafe-inline'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": NO_STORE,
  Pragma: "no-cache",
  Expires: "0",
};
const TEXT_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": NO_STORE,
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
  "Referrer-Policy": "no-referrer",
};
const MIN_TOKEN = 32;

const methodNotAllowed = (allow) => new Response("Method Not Allowed", { status: 405, headers: { Allow: allow } });
const notFound = () => new Response("Not Found", { status: 404, headers: TEXT_HEADERS });

export async function badge(method, env, segments, ns = {}) {
  if (method !== "GET" && method !== "HEAD") return methodNotAllowed("GET, HEAD");
  const svg = (body, extra = {}) => new Response(method === "HEAD" ? null : body, { headers: { ...SVG_HEADERS, ...extra } });
  const { opts, error } = parseOptions(segments);
  if (error) return svg(renderNotice(`${error} (see help)`), { "X-Email-Error": error });

  const { list } = readList(env, ns.prefix);
  if (!list.length) return svg(renderNotice("no address configured", "info"), { "X-Email-Error": "not configured" });
  const addr = list[await getIndex(env, list.length, ns)];
  const raster = await rasterize(addr, { jitter: opts.jitter, noise: opts.noise });
  return svg(renderBadge(opts, raster, toBase64(await encodePng(raster))));
}

async function sha256(text) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}
// Constant-time comparison of digests, so response timing does not leak how much of a guess matched.
async function tokenOk(env, given, ns) {
  const secret = env[(ns.prefix ?? "") + "EMAIL_SWAP_TOKEN"];
  if (typeof secret !== "string" || secret.length < MIN_TOKEN || typeof given !== "string") return false;
  const [a, b] = await Promise.all([sha256(secret), sha256(given)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function describe(i, list, skipped) {
  const extra = skipped ? `\n${skipped} invalid entr${skipped === 1 ? "y was" : "ies were"} ignored.` : "";
  return `showing address ${i + 1} of ${list.length}: ${maskAddress(list[i])}${extra}\n`;
}

// GET /email/swap/<token>        advance to the next address
// GET /email/swap/<token>/<n>    show address n (1-based)
export async function swap(method, env, segments, ns = {}) {
  if (method !== "GET") return methodNotAllowed("GET");
  const [token, target, ...rest] = segments;
  if (rest.length || !(await tokenOk(env, token, ns))) return notFound();
  const listVar = (ns.prefix ?? "") + "EMAILS";
  const text = (status, body) => new Response(body, { status, headers: TEXT_HEADERS });

  const { list, skipped } = readList(env, ns.prefix);
  if (!list.length) return text(409, `no addresses configured (set the ${listVar} variable)\n`);
  if (!env.EMAIL_STATE) return text(503, "swapping needs a KV namespace bound as EMAIL_STATE\n");
  let next;
  if (target === undefined) next = ((await getIndex(env, list.length, ns)) + 1) % list.length;
  else if (/^\d{1,4}$/.test(target) && +target >= 1 && +target <= list.length) next = +target - 1;
  else return text(400, `target must be a number from 1 to ${list.length}\n`);
  await setIndex(env, next, ns);
  return text(200, "ok, " + describe(next, list, skipped) + "Changes reach every edge location within about a minute.\n");
}

// GET /email/status/<token>
export async function status(method, env, segments, ns = {}) {
  if (method !== "GET") return methodNotAllowed("GET");
  const [token, ...rest] = segments;
  if (rest.length || !(await tokenOk(env, token, ns))) return notFound();
  const p = ns.prefix ?? "";
  const { list, skipped } = readList(env, p);
  const body = list.length
    ? describe(await getIndex(env, list.length, ns), list, skipped) + `state store: ${env.EMAIL_STATE ? "KV (EMAIL_STATE)" : `none, using ${p}EMAIL_INDEX`}\n`
    : `no addresses configured (set the ${p}EMAILS variable)\n`;
  return new Response(body, { headers: TEXT_HEADERS });
}
