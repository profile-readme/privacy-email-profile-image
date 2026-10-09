// SPDX-FileCopyrightText: 2026 Aesthetic Vulpes (github.com/didvc)
// SPDX-License-Identifier: AGPL-3.0-only
import { test } from "node:test";
import assert from "node:assert/strict";
import { servePage } from "../src/email/pages.js";

const O = "https://readmes.pages.dev";
const get = async (kind, origin = O) => {
  const res = await servePage(new Request(`${origin}/email/${kind}`), kind);
  return { res, body: await res.text() };
};
const EMOJI = /[\u{2600}-\u{27BF}\u{1F000}-\u{1FAFF}\u{FE0F}]|%F0%9F/u;

test("help page: metadata, JSON-LD, landmarks, copyright, hash-only script", async () => {
  const { res, body } = await get("help");
  assert.match(body, /<html lang="en">/);
  assert.match(body, /<link rel="canonical" href="https:\/\/readmes\.pages\.dev\/email\/help">/);
  assert.match(body, /property="og:title"/);
  assert.match(body, /<main id="main"/);
  assert.match(body, /Aesthetic Vulpes \(github\.com\/didvc\)/);
  JSON.parse(body.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.match(res.headers.get("content-security-policy"), /script-src 'sha256-[^']+'/);
  for (const img of body.matchAll(/<img [^>]*>/g)) assert.match(img[0], /alt="[^"]+"/);
  assert.ok(!EMOJI.test(body));
});

test("agents page is Markdown with grammar and owner-endpoint warning", async () => {
  const { res, body } = await get("agents");
  assert.match(res.headers.get("content-type"), /text\/markdown/);
  assert.match(body, /GET https:\/\/readmes\.pages\.dev\/email/);
  assert.match(body, /Do not extract, OCR/);
  assert.ok(!EMOJI.test(body));
});

test("preview hosts are noindex", async () => {
  const { res, body } = await get("help", "https://abc123.readmes.pages.dev");
  assert.equal(res.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.match(body, /content="noindex, nofollow"/);
});
