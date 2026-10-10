// SPDX-FileCopyrightText: 2026 Aesthetic Vulpes (github.com/didvc)
// SPDX-License-Identifier: AGPL-3.0-only
// Read the address list from environment variables (EMAILS, EMAILS_2 ... EMAILS_9).
// Each variable may hold up to 5 KiB; addresses are separated by newlines, commas, semicolons or spaces.
import { FONT } from "./font.generated.js";

export const LIST_VARS = ["EMAILS", ...Array.from({ length: 8 }, (_, i) => `EMAILS_${i + 2}`)];
export const PREFIX_RE = /^[A-Z0-9_]{0,40}$/;
const EMAIL_RE = /^[A-Za-z0-9._+-]{1,64}@[A-Za-z0-9-]{1,63}(\.[A-Za-z0-9-]{1,63})+$/;

// prefix selects an independent list, e.g. "WORK_" reads WORK_EMAILS, WORK_EMAILS_2 ...
export function readList(env = {}, prefix = "") {
  if (!PREFIX_RE.test(prefix)) throw new Error("invalid instance prefix");
  const raw = LIST_VARS.map((k) => (typeof env[prefix + k] === "string" ? env[prefix + k] : "")).join("\n");
  const list = [];
  let skipped = 0;
  for (const addr of raw.split(/[\s,;]+/).filter(Boolean)) {
    const ok = addr.length <= 120 && EMAIL_RE.test(addr) && [...addr].every((c) => FONT.chars.includes(c));
    if (!ok) skipped++;
    else if (!list.includes(addr)) list.push(addr);
  }
  return { list, skipped };
}

// "maple-lantern-q7x2@protonmail.com" -> "m****-l******-q***@protonmail.com"
export function maskAddress(addr) {
  const [local, domain] = addr.split("@");
  return local.replace(/[A-Za-z0-9]+/g, (w) => w[0] + "*".repeat(Math.max(1, w.length - 1))) + "@" + domain;
}
