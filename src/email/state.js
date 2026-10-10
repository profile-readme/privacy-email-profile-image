// SPDX-FileCopyrightText: 2026 Aesthetic Vulpes (github.com/didvc)
// SPDX-License-Identifier: AGPL-3.0-only
// Which address is currently shown. Stored in a KV namespace bound as EMAIL_STATE.
// Without KV, the optional EMAIL_INDEX variable (1-based) picks a fixed address.
// Each instance ({ prefix, key }) keeps its own position and its own EMAIL_INDEX fallback.
const keyFor = (ns) => (ns.key ? `${ns.key}:current-index` : "current-index");
const wrap = (i, n) => ((i % n) + n) % n;

export async function getIndex(env, n, ns = {}) {
  if (env.EMAIL_STATE) {
    const v = parseInt(await env.EMAIL_STATE.get(keyFor(ns)), 10);
    if (!Number.isNaN(v)) return wrap(v, n);
  }
  const fixed = parseInt(env[(ns.prefix ?? "") + "EMAIL_INDEX"] ?? "1", 10);
  return Number.isNaN(fixed) ? 0 : wrap(fixed - 1, n);
}

export async function setIndex(env, i, ns = {}) {
  await env.EMAIL_STATE.put(keyFor(ns), String(i));
}
