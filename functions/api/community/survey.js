// =============================================================================
// /functions/api/community/survey.js
// POST { answer: "yes"|"some"|"no"|"learn", source?: "home-poll"|"survey-page" }
// 204 No Content on success
// =============================================================================

const VALID_ANSWERS = new Set(["yes", "some", "no", "learn"]);
const VALID_SOURCES = new Set(["home-poll", "survey-page"]);

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const answer = String(body.answer || "").toLowerCase();
  if (!VALID_ANSWERS.has(answer)) {
    return new Response("Invalid answer", { status: 400 });
  }

  const source = VALID_SOURCES.has(body.source) ? body.source : "survey-page";

  try {
    await env.DB.prepare(
      "INSERT INTO survey_responses (answer, source) VALUES (?1, ?2)"
    ).bind(answer, source).run();
  } catch (e) {
    return new Response("DB error", { status: 500 });
  }

  return new Response(null, { status: 204 });
}

// CORS preflight (not strictly needed if forms post same-origin, but harmless)
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
