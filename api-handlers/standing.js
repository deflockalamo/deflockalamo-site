// =============================================================================
// /functions/api/community/standing.js
// POST: add an entry to the public Community Standing list
//   { first_name, last_name, email?, comment?, residency: "alamogordo"|"regional" }
//   201 Created on success
//   400 on validation error
//
// GET: fetch the public list (most recent first)
//   optional ?residency=alamogordo|regional to filter
//   returns: { count, entries: [{first_name, last_name, comment, residency, created_at}] }
//   (no email in the public payload — emails are private to operators)
// =============================================================================

const MAX_NAME = 80;
const MAX_COMMENT = 500;
const VALID_RESIDENCY = new Set(["alamogordo", "regional"]);

function sanitize(s, max) {
  if (typeof s !== "string") return "";
  // Trim, collapse whitespace, cap length
  return s.replace(/\s+/g, " ").trim().slice(0, max);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const firstName = sanitize(body.first_name, MAX_NAME);
  const lastName  = sanitize(body.last_name, MAX_NAME);

  if (!firstName || !lastName) {
    return new Response("Name required", { status: 400 });
  }

  const residency = String(body.residency || "").toLowerCase();
  if (!VALID_RESIDENCY.has(residency)) {
    return new Response("Residency must be 'alamogordo' or 'regional'", { status: 400 });
  }

  const email = body.email ? sanitize(body.email, 254).toLowerCase() : null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response("Invalid email", { status: 400 });
  }

  const comment = body.comment ? sanitize(body.comment, MAX_COMMENT) : null;

  try {
    await env.DB.prepare(
      `INSERT INTO standing_list (first_name, last_name, email, comment, residency)
       VALUES (?1, ?2, ?3, ?4, ?5)`
    ).bind(firstName, lastName, email, comment, residency).run();
  } catch (e) {
    return new Response("DB error", { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const residencyFilter = url.searchParams.get("residency");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "200", 10) || 200, 500);

  let query;
  let bindArgs;
  if (residencyFilter && VALID_RESIDENCY.has(residencyFilter)) {
    query = `SELECT first_name, last_name, comment, residency, created_at
             FROM standing_list
             WHERE residency = ?1
             ORDER BY created_at DESC
             LIMIT ?2`;
    bindArgs = [residencyFilter, limit];
  } else {
    query = `SELECT first_name, last_name, comment, residency, created_at
             FROM standing_list
             ORDER BY created_at DESC
             LIMIT ?1`;
    bindArgs = [limit];
  }

  let rows, totalRow;
  try {
    const result = await env.DB.prepare(query).bind(...bindArgs).all();
    rows = result.results || [];
    const totalResult = await env.DB.prepare("SELECT COUNT(*) AS n FROM standing_list").first();
    totalRow = totalResult ? totalResult.n : 0;
  } catch (e) {
    return new Response("DB error", { status: 500 });
  }

  return new Response(
    JSON.stringify({ count: totalRow, entries: rows }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache for 30s — public list, doesn't need to be perfectly fresh
        "Cache-Control": "public, max-age=30",
      },
    }
  );
}
