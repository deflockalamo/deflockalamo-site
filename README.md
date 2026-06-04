# Deflock Alamo — deflockalamo.org

Static site for [deflockalamo.org](https://deflockalamo.org) — community
information about Flock ALPRs in Alamogordo, NM.

## Stack

- **Pure static HTML/CSS/JS** — no build step, no framework, no Node
  dependencies. Each page is a standalone `.html` file with `<script>`
  tags pulling in `assets/layout.js` and `_config.js`.
- **Hosted on Cloudflare Pages**, source on GitHub.
- **Config** in `_config.js` (public, committed) and `_config.private.js`
  (gitignored, deployed per-environment).

## Repo layout

```
.
├── _config.js                  public site config (committed)
├── _config.private.js.example  template for private config (committed)
├── _config.private.js          private config (gitignored, deployed per-env)
├── index.html                  landing / disclaimer
├── home.html                   real home page
├── about.html
├── documents.html
├── news.html
├── privacy.html
├── resources.html
├── take-action.html
├── assets/
│   ├── layout.js               shared header/footer
│   └── style.css
└── documents/                  PDFs (NOT deployed — kept on USB stick)
```

## Local development

Open `home.html` in a browser, or:

```bash
python3 -m http.server 8000 --directory /home/pi/.openclaw/workspace/projects/deflockalamo-site
# → http://localhost:8000/home.html
```

The private config file (`_config.private.js`) is loaded via a
`<script>` tag injected at the bottom of `_config.js`. If the file
isn't present, the public placeholder is used.

## Editing workflow

```bash
# 1. Make changes in this folder
nano home.html

# 2. Commit + push
git add -A
git commit -m "clarify the cancellation section"
git push
```

Cloudflare Pages auto-builds and deploys in ~30 seconds. Preview URLs
are generated for every branch.

## Publishing plan

See `PUBLISH-PLAN.md` in the workspace for the decision matrix that
landed on GitHub + Cloudflare Pages.
