// =============================================================================
// /functions/api/community/subscribe.js
// POST { email, first_name? } — adds to private email subscriber list
// 201 on success, 400 on bad input, 409 on duplicate email
// =============================================================================

function sanitize(s, max) {
  if (typeof s !== "string") return "";
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

  const email = sanitize(body.email || "", 254).toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response("Invalid email", { status: 400 });
  }

  const firstName = body.first_name ? sanitize(body.first_name, 80) : null;

  try {
    await env.DB.prepare(
      "INSERT INTO email_subscribers (email, first_name) VALUES (?1, ?2)"
    ).bind(email, firstName).run();
  } catch (e) {
    // UNIQUE constraint violation = already subscribed
    if (String(e).includes("UNIQUE")) {
      return new Response(JSON.stringify({ ok: true, already: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("DB error", { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
