# Deflock Alamo — deflockalamo.org

Static site for [deflockalamo.org](https://deflockalamo.org) — community
information about Flock ALPRs in Alamogordo, NM.

## Stack

- **Pure static HTML/CSS/JS** + a Cloudflare Worker (Functions-style
  handlers under `api-handlers/`) for the community-data endpoints.
- **Hosted on Cloudflare Pages**, source on GitHub.
- **Config** in `_config.js` (public, committed) and `_config.private.js`
  (committed no-op; uncomment to set a real contact email).
- **D1 database** (`deflock-db`) backs the survey, standing list, and
  email subscribers tables.

## Repo layout

```
.
├── _config.js                  public site config (committed)
├── _config.private.js          no-op placeholder; uncomment to set contactEmail
├── index.html                  real home page (was home.html, consolidated)
├── about.html
├── documents.html
├── learning.html
├── privacy.html
├── resources.html
├── take-action.html
├── flock.html                  About Flock Safety
├── survey.html                 "Have your say" (survey + standing + email)
├── paper-letter.html           Mail-in letter template
├── muckrock.html               FOIA request template
├── assets/
│   ├── layout.js               shared header/footer
│   └── style.css
├── api-handlers/               Cloudflare Pages Functions (Worker code)
│   ├── survey.js               POST /api/community/survey
│   ├── standing.js             GET/POST /api/community/standing
│   ├── subscribe.js            POST /api/community/subscribe
│   └── counts.js               GET  /api/community/counts
├── src/
│   └── worker.js               Main Worker entry, routes /api/* to handlers
└── documents/                  PDFs and public reference materials (DEPLOYED)
```

## Local development

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000 --directory /home/pi/.openclaw/workspace/deflock
# → http://localhost:8000/
```

The private config file (`_config.private.js`) is loaded via a
`<script>` tag injected at the bottom of `_config.js`. A no-op placeholder
is committed (contains no real data) so the browser never sees a 404. To
set a real contact email, uncomment the `contactEmail` line in your local
clone and redeploy.

## Editing workflow

```bash
# 1. Make changes in this folder
nano index.html

# 2. Commit + push
git add -A
git commit -m "clarify the cancellation section"
git push
```

Cloudflare Pages auto-builds and deploys in ~30 seconds. Preview URLs
are generated for every branch.

## API endpoints (Worker)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/community/survey` | Record a 1-question vote (yes / some / no / learn) |
| `GET`  | `/api/community/standing` | List public Community Standing entries |
| `POST` | `/api/community/standing` | Add a name to Community Standing |
| `POST` | `/api/community/subscribe` | Add an email to the private subscribers list |
| `GET`  | `/api/community/counts`   | Aggregate counts for the home page / survey page |

The D1 binding is exposed as `env.DB` inside each handler. The schema is
in `schema.sql`.

## Worker secrets (Cloudflare dashboard)

The subscribe handler fires a Telegram notification on every new signup.
Set these in the Cloudflare dashboard after each push:

**Cloudflare Dashboard → Workers & Pages → deflockalamo-site → Settings →
Variables & Secrets → Add**

| Name | Type | Value | Required? |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Secret | Bot token from @BotFather (or reuse an existing openclaw bot) | yes |
| `TELEGRAM_CHAT_ID`   | Secret | Your numeric Telegram user_id (e.g. `8704809525`) | yes |
| `TELEGRAM_NOTIFY_ENABLED` | Variable | `"false"` to mute the ping without removing secrets | optional |
| `AUTO_REPLY_ENABLED` | Variable | `"true"` to call the auto-reply hook (currently a no-op — see `subscribe.js` for channels to wire up) | optional |

If either required secret is missing, the worker logs a warning and
returns success to the visitor — the signup is never blocked by Telegram
being down.

To find your chat_id, message @userinfobot on Telegram.

## Publishing plan

See `PUBLISH-PLAN.md` in the workspace for the decision matrix that
landed on GitHub + Cloudflare Pages.
