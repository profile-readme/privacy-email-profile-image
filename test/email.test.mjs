// SPDX-FileCopyrightText: 2026 Aesthetic Vulpes (github.com/didvc)
// SPDX-License-Identifier: AGPL-3.0-only
import { test } from "node:test";
import assert from "node:assert/strict";
import { inflateSync } from "node:zlib";
import { badge, swap, status } from "../src/email/handler.js";
import { readList, maskAddress } from "../src/email/list.js";
import { parseOptions } from "../src/email/options.js";

// Mock addresses for tests only.
const ADDRS = ["maple-lantern-q7x2@protonmail.com", "kitsune-shrine-m4k9@protonmail.com", "quiet-river-z8p3@protonmail.com"];
const TOKEN = "t".repeat(40);
class MemoryKV {
  constructor() { this.m = new Map(); }
  async get(k) { return this.m.has(k) ? this.m.get(k) : null; }
  async put(k, v) { this.m.set(k, String(v)); }
}
const envWith = (extra = {}) => ({ EMAILS: ADDRS.join("\n"), EMAIL_SWAP_TOKEN: TOKEN, EMAIL_STATE: new MemoryKV(), ...extra });

test("address list parsing: separators, dedupe, invalid entries, extra variables", () => {
  const { list, skipped } = readList({ EMAILS: `${ADDRS[0]}, ${ADDRS[1]};${ADDRS[0]}\nnot-an-address\nbad!char@x.com`, EMAILS_2: ADDRS[2] });
  assert.deepEqual(list, ADDRS);
  assert.equal(skipped, 2);
  assert.equal(maskAddress(ADDRS[0]), "m****-l******-q***@protonmail.com");
});

test("badge contains no address text, only a PNG mask", async () => {
  const res = await badge("GET", envWith(), []);
  const svg = await res.text();
  assert.equal(res.headers.get("content-type"), "image/svg+xml; charset=utf-8");
  assert.match(res.headers.get("cache-control"), /no-store/);
  for (const a of ADDRS) for (const part of [a, ...a.split(/[@.-]/).filter((p) => p.length >= 4 && p !== "github")]) assert.ok(!svg.includes(part), part);
  assert.ok(!/[A-Za-z0-9._+-]+@[A-Za-z0-9-]+\.[A-Za-z]/.test(svg.replace(/base64,[^"]+/, "")), "no email-shaped text");
  assert.match(svg, /<mask id="m"[^>]*><image [^>]*href="data:image\/png;base64,/);
});

test("PNG is valid 8-bit grayscale with correct CRCs and size", async () => {
  const svg = await (await badge("GET", envWith(), ["jitter-0", "noise-0"])).text();
  const png = Buffer.from(svg.match(/base64,([A-Za-z0-9+/=]+)"/)[1], "base64");
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const w = png.readUInt32BE(16), h = png.readUInt32BE(20);
  assert.equal(png[24], 8); assert.equal(png[25], 0);
  const idatLen = png.readUInt32BE(33);
  const raw = inflateSync(png.subarray(41, 41 + idatLen));
  assert.equal(raw.length, (w + 1) * h);
  assert.ok(raw.some((v) => v > 200), "glyph pixels present");
});

test("not configured and unknown options give notice badges", async () => {
  const empty = await badge("GET", {}, []);
  assert.equal(empty.headers.get("x-email-error"), "not configured");
  const bad = await badge("GET", envWith(), ["pill", "<script>"]);
  assert.equal(bad.headers.get("x-email-error"), "unknown option #2");
  assert.ok(!(await bad.text()).includes("script"));
  assert.equal(parseOptions(["size-999"]).opts.size, 40);
});

test("swap advances, wraps, sets by number; status reports masked address", async () => {
  const env = envWith();
  assert.match(await (await swap("GET", env, [TOKEN])).text(), /address 2 of 3: k\*{6}-s\*{5}-m\*{3}@/);
  assert.match(await (await swap("GET", env, [TOKEN, "3"])).text(), /address 3 of 3/);
  assert.match(await (await swap("GET", env, [TOKEN])).text(), /address 1 of 3/);
  assert.equal((await swap("GET", env, [TOKEN, "9"])).status, 400);
  const st = await (await status("GET", env, [TOKEN])).text();
  assert.match(st, /address 1 of 3: m\*+-/);
  assert.ok(!st.includes(ADDRS[0]));
});

test("badge follows the swapped index", async () => {
  const env = envWith();
  const png = async () => (await (await badge("GET", env, ["jitter-0", "noise-0"])).text()).match(/base64,([^"]+)"/)[1];
  const first = await png();
  await swap("GET", env, [TOKEN]);
  assert.notEqual(await png(), first);
  await swap("GET", env, [TOKEN, "1"]);
  assert.equal(await png(), first);
});

test("wrong, short or missing tokens look like 404; HEAD/POST cannot swap", async () => {
  assert.equal((await swap("GET", envWith(), ["x".repeat(40)])).status, 404);
  assert.equal((await swap("GET", envWith({ EMAIL_SWAP_TOKEN: "short" }), ["short"])).status, 404);
  assert.equal((await swap("GET", envWith({ EMAIL_SWAP_TOKEN: undefined }), [TOKEN])).status, 404);
  assert.equal((await status("GET", envWith(), [])).status, 404);
  assert.equal((await swap("HEAD", envWith(), [TOKEN])).status, 405);
  assert.equal((await swap("POST", envWith(), [TOKEN])).status, 405);
});

test("without KV: EMAIL_INDEX picks the address and swap explains what is missing", async () => {
  const env = envWith({ EMAIL_STATE: undefined, EMAIL_INDEX: "2" });
  assert.match(await (await status("GET", env, [TOKEN])).text(), /address 2 of 3.*\nstate store: none/s);
  assert.equal((await swap("GET", env, [TOKEN])).status, 503);
});

test("every style combination renders without NaN", async () => {
  for (const style of ["pill", "card", "plain"])
    for (const extra of [[], ["caption-email"], ["ears", "border-3"], ["noicon", "transparent"], ["size-40", "dark"]]) {
      const svg = (await (await badge("GET", envWith(), [style, ...extra])).text()).replace(/base64,[^"]+/, "");
      assert.ok(!/NaN|undefined/.test(svg), `${style}/${extra}`);
    }
});
