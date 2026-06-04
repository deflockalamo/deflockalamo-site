# Deflock Alamogordo — Publishing Plan (revised for heavy modification)

## ✅ Decision matrix for "heavily modified over months"

| Need | Direct Upload | GitHub + Pages | Self-hosted git |
|---|---|---|---|
| Version history (what changed, when) | ❌ None | ✅ Every commit | ✅ Yes |
| Rollback if a change breaks the site | ⚠️ Re-upload last good copy | ✅ One click in dashboard | ⚠️ Manual |
| Preview a change before going live | ❌ No | ✅ Branch → preview URL | ⚠️ Manual |
| No third-party code host | ✅ | ❌ GitHub owns the repo | ✅ |
| Edit from any device, anywhere | ❌ Need the Pi | ✅ Any browser via github.com | ⚠️ Need Pi |
| Audit trail for a contested public site | ❌ None | ✅ Public git log | ✅ Private git log |
| Effort to set up | 🟢 10 min | 🟡 30 min | 🔴 2+ hours |
| Effort per change after that | 🔴 Manual deploy | 🟢 `git push` | 🟡 Depends |

**Verdict: GitHub + Cloudflare Pages.**

## 📁 What the repo looks like

A new git repo, just for the site:

```
~/.../projects/deflockalamo-site/    ← already a folder, becomes a repo
├── .git/                            ← new, initialized
├── .gitignore                       ← ignores editor temp files etc.
├── README.md                        ← what this is, how to deploy
├── index.html                       ← disclaimer/landing
├── home.html                        ← real home
├── about.html
├── documents.html
├── news.html
├── privacy.html
├── resources.html
├── take-action.html
├── _config.js
└── assets/
    ├── layout.js
    └── style.css
```

Documents (PDFs) stay on the USB stick — they're not part of the deploy.
The site is small (~50KB total). The `documents.html` page links to
either external URLs (already does) or to paths on the USB (we'd serve
those separately if you want them on the public site).

## 🔐 Privacy / public repo

- `_config.js` contains: site name, area, contact email, articles list.
- Recommended: **make the repo public** but move the contact email to
  `_config.private.js` (gitignored) or to a Cloudflare Pages environment
  variable injected at build time. The site reads from
  `window.SITE_CONFIG` so this is a one-line change.
- Alternatively: **private repo**, Cloudflare still works. Loses the
  "anyone can submit a typo fix" angle but keeps the contact private by
  default. Slightly less transparent for an advocacy site.

**My pick: public repo + sanitize the contact email.**

## 🚀 Concrete next steps (one-time setup)

1. **Sanitize `_config.js`** — move `contactEmail` to a separate file
   that is gitignored, OR to a Cloudflare Pages env var. I'll do this
   and the rest.
2. **Initialize git in the site folder**:
   ```bash
   cd ~/.../projects/deflockalamo-site
   git init
   git add .
   git commit -m "Initial site: disclaimer landing + 7 pages"
   ```
3. **You create the GitHub repo** (one click at github.com/new — name
   `deflockalamo-site`, public, no README/license/gitignore). I can't
   create repos on your behalf; you do this once and tell me the URL.
4. **You create a Cloudflare Pages project** (one click in dashboard,
   connect to the GitHub repo, accept defaults — no build command, output
   dir = `/`). I can't create CF projects without a token, but this is
   5 minutes of clicking.
5. **You add the custom domain** `deflockalamo.org` in the Pages project
   settings. Cloudflare handles the rest via your existing DNS.

## 🔄 Day-to-day editing workflow (after setup)

```bash
# edit a file in the site
nano ~/.../projects/deflockalamo-site/about.html

# commit + push (one terminal command, ~5 seconds)
cd ~/.../projects/deflockalamo-site
git add -A
git commit -m "clarify the cancellation section"
git push

# → Cloudflare builds + deploys in ~30 seconds
# → site is live at deflockalamo.org
```

That's it. From any device, anywhere. No Pi needed for routine edits —
you can also use github.com's web editor and skip the local Pi entirely.

## 🆚 What you give up vs A (Direct Upload)

- One-time ~30 min of setup (vs 10 min)
- A GitHub account (you may already have one)
- A public commit log of all your changes (this is a feature, see above)

What you gain:
- Rollback
- Preview deploys
- Edit from anywhere
- Audit trail
- PR-based review if you ever want a second pair of eyes

## ❓ Two things I need from you

1. **GitHub username / repo URL** — once you've created the repo, give
   me the URL. I can write the `.gitignore` + `README.md` and the rest.
2. **Auth for Cloudflare Pages** — when you create the Pages project,
   you connect it to the GitHub repo via OAuth in the dashboard. After
   that, Cloudflare auto-deploys on every push. I don't need a CF API
   token for the publishing pipeline itself; the token would only be
   useful if you want me to *create* the Pages project from the CLI.

The "do everything yourself" path is also viable if you'd rather not
involve me in the GitHub/CF setup: I write the deploy script + README,
you do the one-time cloud config, then `git push` from the Pi.
