// =============================================================================
// /functions/api/flock-stats.js
// GET — returns the live count of cities that have rejected Flock Safety
// cameras, sourced from deflock.org (the community-run ALPR map).
//
// Source: https://cdn.deflock.me/alpr-counts.json
//   - Updated by deflock.org's locator pipeline (last-modified header is the
//     source of truth; we just proxy what they publish).
//   - Their CDN sends `Cache-Control: max-age=300`. We mirror that.
//
// We edge-cache the response for 5 minutes via the Cloudflare Cache API, so
// the cost is ~1 upstream fetch per edge POP every 5 min instead of one per
// page load. Falls back to 503 if the upstream is unreachable — the front-end
// JS keeps the static "70+" in that case.
//
// Response shape:
//   { wins: 100, cameras_us: 129539, source: "deflock.org",
//     fetched_at: "2026-08-13T13:46:25.000Z" }
//
// CORS: not added — the only consumer is deflockalamo.org itself (same origin).
// =============================================================================

const UPSTREAM = "https://cdn.deflock.me/alpr-counts.json";
const CACHE_TTL = 300; // seconds — match upstream's max-age

export async function onRequestGet(context) {
  const { request, env } = context;
  const cache = caches.default;

  // Build a normalizable URL for the cache key. Query string is not part of
  // the resource identity, so we strip it; re-add via Vary if needed later.
  const cacheKey = new Request(UPSTREAM, { method: "GET" });

  // Try edge cache first.
  const cached = await cache.match(cacheKey);
  if (cached) {
    // Forward the cached body but let CF layer add a HIT header for our debugging.
    const out = new Response(await cached.text(), cached);
    out.headers.set("X-Cache", "HIT");
    return out;
  }

  // Cache miss — fetch upstream.
  let upstream;
  try {
    upstream = await fetch(UPSTREAM, {
      headers: { "Accept": "application/json" },
      // Cloudflare's subrequest defaults are 100ms CPU / 50 subrequests per request.
      // The upstream is on Cloudflare so this is sub-200ms anywhere.
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "upstream_unreachable", detail: String(e) }),
      { status: 503, headers: { "Content-Type": "application/json", "X-Cache": "BYPASS" } }
    );
  }

  if (!upstream.ok) {
    return new Response(
      JSON.stringify({ error: "upstream_error", status: upstream.status }),
      { status: 502, headers: { "Content-Type": "application/json", "X-Cache": "BYPASS" } }
    );
  }

  const raw = await upstream.json();

  // Validate the shape — deflock.org's schema is small and known.
  const wins = Number.isFinite(Number(raw.wins)) ? Number(raw.wins) : null;
  const cameras = Number.isFinite(Number(raw.us)) ? Number(raw.us) : null;
  if (wins === null) {
    return new Response(
      JSON.stringify({ error: "upstream_schema", got: raw }),
      { status: 502, headers: { "Content-Type": "application/json", "X-Cache": "BYPASS" } }
    );
  }

  const body = JSON.stringify({
    wins,
    cameras_us: cameras,
    source: "deflock.org",
    fetched_at: new Date().toISOString(),
  });

  const response = new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${CACHE_TTL}`,
      "X-Cache": "MISS",
    },
  });

  // Best-effort cache write. If it fails (e.g. cache API unavailable), we
  // still return the response to the client — uncached is fine, just slower.
  try {
    await cache.put(cacheKey, response.clone());
  } catch (e) {
    console.warn("[flock-stats] cache.put failed:", e);
  }

  return response;
}
