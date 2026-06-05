// =============================================================================
// src/worker.js — Main entry point for the deflockalamo-site Worker
// =============================================================================
// This Worker has two responsibilities:
//   1. Serve static files (HTML, CSS, JS, PDFs) from the assets directory
//   2. Handle dynamic /api/* routes via the Functions modules
//
// The Cloudflare "assets" binding handles the static-file case. Anything that
// isn't a static file and starts with /api/ is routed to the appropriate
// Functions module by URL path.
// =============================================================================

import { onRequestPost as surveyPost, onRequestOptions as surveyOptions } from "../api-handlers/survey.js";
import { onRequestPost as standingPost, onRequestGet as standingGet } from "../api-handlers/standing.js";
import { onRequestPost as subscribePost } from "../api-handlers/subscribe.js";
import { onRequestGet as countsGet } from "../api-handlers/counts.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS preflight (cheap, no DB)
    if (request.method === "OPTIONS" && path.startsWith("/api/")) {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // Dynamic API routes — handle in this Worker
    if (path === "/api/community/survey" && request.method === "POST") {
      return surveyPost({ request, env });
    }
    if (path === "/api/community/standing" && request.method === "POST") {
      return standingPost({ request, env });
    }
    if (path === "/api/community/standing" && request.method === "GET") {
      return standingGet({ request, env });
    }
    if (path === "/api/community/subscribe" && request.method === "POST") {
      return subscribePost({ request, env });
    }
    if (path === "/api/community/counts" && request.method === "GET") {
      return countsGet({ request, env });
    }

    // Everything else — defer to static assets binding
    // env.ASSETS is automatically provided when wrangler.jsonc has
    // `"assets": { "directory": "." }`
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    // Fallback: 404
    return new Response("Not found", { status: 404 });
  },
};
