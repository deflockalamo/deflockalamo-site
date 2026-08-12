// =============================================================================
// /functions/api/community/subscribe.js
// POST { email, first_name? } — adds to private email subscriber list
// 201 on success, 400 on bad input, 200 with {already:true} on duplicate
//
// On successful NEW signups, fires off a fire-and-forget Telegram ping to Jack
// via ctx.waitUntil() — the response is returned to the visitor without waiting
// for the Telegram API. If Telegram is down, the signup still succeeds.
//
// Required env vars (set with `wrangler secret put`):
//   TELEGRAM_BOT_TOKEN   — bot to send from (e.g. openclaw main, or a deflock bot)
//   TELEGRAM_CHAT_ID     — Jack's Telegram user_id (numeric, as string)
// Optional env vars:
//   TELEGRAM_NOTIFY_ENABLED — "false" disables the ping without removing the secret
//   AUTO_REPLY_ENABLED      — "true" calls notifyAutoReply() hook (see bottom)
//
// To rotate the bot: `wrangler secret put TELEGRAM_BOT_TOKEN`
// To change the chat: `wrangler secret put TELEGRAM_CHAT_ID`
// =============================================================================

function sanitize(s, max) {
  if (typeof s !== "string") return "";
  return s.replace(/\s+/g, " ").trim().slice(0, max);
}

// Fire-and-forget Telegram notification.
// Best-effort: any error is logged but does NOT block the subscriber's response.
// We do NOT include the visitor's IP address in the message (privacy-respecting).
async function notifyJack({ email, firstName, alreadySubscribed }, env) {
  if (env.TELEGRAM_NOTIFY_ENABLED === "false") return;
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[subscribe] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping ping");
    return;
  }

  const when = new Date().toISOString();
  const name = firstName ? ` (${firstName})` : "";
  const status = alreadySubscribed ? "already subscribed (re-add)" : "NEW signup";
  const text = `📬 deflockalamo.org — ${status}\n` +
               `Email: ${email}${name}\n` +
               `When: ${when} UTC`;

  try {
    const resp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });
    if (!resp.ok) {
      const body = await resp.text().catch(() => "");
      console.warn(`[subscribe] telegram notify failed: ${resp.status} ${body.slice(0, 200)}`);
    }
  } catch (e) {
    console.warn(`[subscribe] telegram notify error: ${e}`);
  }
}

// Hook for future auto-reply to the subscriber (e.g., a confirmation email,
// a Telegram DM if they have one linked, etc.). Disabled by default.
// To enable, set env AUTO_REPLY_ENABLED="true" and implement the channel
// of choice. The privacy page currently says "we will not share your email
// with anyone" and emails are sent "if there's a real next step" — so don't
// enable this without a real reason to email people.
async function notifyAutoReply({ email, firstName }, env) {
  if (env.AUTO_REPLY_ENABLED !== "true") return;
  // TODO: pick a channel and implement. Suggestions:
  //   - Proton Mail SMTP via Bridge (Pi-side daemon, TLS, app password)
  //   - MailChannels HTTP API (free, no third-party auth setup, needs DNS)
  //   - Telegram DM (only works if subscriber has linked their Telegram ID)
  console.log(`[subscribe] auto-reply hook called for ${email} — not implemented yet`);
}

export async function onRequestPost(context) {
  const { request, env, ctx } = context;

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

  let alreadySubscribed = false;
  try {
    await env.DB.prepare(
      "INSERT INTO email_subscribers (email, first_name) VALUES (?1, ?2)"
    ).bind(email, firstName).run();
  } catch (e) {
    // UNIQUE constraint violation = already subscribed
    if (String(e).includes("UNIQUE")) {
      alreadySubscribed = true;
      // Don't re-notify on duplicates — just return success
      return new Response(JSON.stringify({ ok: true, already: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("DB error", { status: 500 });
  }

  // Fire-and-forget: notify Jack + (if enabled) auto-reply to subscriber.
  // ctx.waitUntil lets the response go back to the visitor without waiting.
  if (ctx && typeof ctx.waitUntil === "function") {
    ctx.waitUntil(Promise.all([
      notifyJack({ email, firstName, alreadySubscribed: false }, env),
      notifyAutoReply({ email, firstName }, env),
    ]));
  } else {
    // Fallback for environments without ctx (shouldn't happen on Pages)
    notifyJack({ email, firstName, alreadySubscribed: false }, env).catch(() => {});
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
