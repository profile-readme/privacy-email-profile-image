// SPDX-FileCopyrightText: 2026 Aesthetic Vulpes (github.com/didvc)
// SPDX-License-Identifier: AGPL-3.0-only
import { status } from "../../../src/email/handler.js";

export function onRequest({ request, env, params }) {
  const p = params.params;
  return status(request.method, env, Array.isArray(p) ? p : p ? [p] : []);
}
