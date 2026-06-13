# Health Journey

A personal health-journey tracker — weight, measurements, food (with Liv's
AI feedback), training, daily steps, sleep, weight-loss medication and
supplements — installable to your phone. Built with React, served as a static
site with one small serverless function for Liv's AI.

**Your data stays on your device.** Everything you log is saved in the browser
on the device you log it on (localStorage). There is no account and no
server-side database, so even though the address is reachable, anyone who
opened it would see an empty app — never your data. The Cloudflare Access login
(below) means no one but you can open it at all.

## Files

| File | What it is |
|------|------------|
| `index.html` | Page shell that loads the app. |
| `app.js` | The whole app, pre-built (React + charts bundled). |
| `manifest.json` | Makes it installable (name, icons, colours). |
| `sw.js` | Service worker — offline caching + update control. |
| `functions/liv.js` | Serverless proxy that holds your Anthropic API key and talks to Liv. |
| `icons/` | App icons (white heart on wine). |
| `make_icons.py` | Regenerates the icons (needs Pillow). Not served. |

## How it's hosted

Everything runs on **Cloudflare** (all free except Anthropic API usage):

- **Cloudflare Pages** serves the static app and auto-deploys on every `git push`.
- **A Pages Function** (`functions/liv.js`) keeps your Anthropic API key secret
  and forwards Liv's requests — the key is never in the browser.
- **Cloudflare Access** puts a login in front of the whole site, so only you can
  open it. This also protects the `/liv` proxy, so no one else can use your key.

---

## Deploy, step by step

### 1. Put the files in a GitHub repo
Create a repo (e.g. `health-journey`) and put **the contents of this folder at
the root** — so `index.html`, `app.js`, `manifest.json`, `sw.js`, the `icons/`
folder and the `functions/` folder all sit at the top level. Commit and push.

### 2. Connect it to Cloudflare Pages
In the Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to
Git** → pick the repo. Build settings:
- **Framework preset:** None
- **Build command:** *(leave empty)*
- **Build output directory:** `/`

Deploy. It goes live at `https://<project>.pages.dev`. Cloudflare automatically
picks up the `functions/` folder and serves `/liv`.

### 3. Add your Anthropic API key
Get a key at console.anthropic.com (add billing — Liv's calls cost per use).
In the Pages project → **Settings → Variables and secrets** → add:
- Name: `ANTHROPIC_API_KEY`  Value: your key  → **Encrypt** → Save.
Then **re-deploy** so the function picks it up. Liv now works on your site.

### 4. Your own domain (optional but nice)
To use e.g. `health.krogh-hansen.net` instead of the `pages.dev` address, the
domain needs to be on Cloudflare (this is what makes Access possible too):
- Add `krogh-hansen.net` to Cloudflare (free). Cloudflare imports your existing
  DNS records, so your main site and `tripkit` keep working unchanged. Then
  change the nameservers at your registrar to the two Cloudflare gives you.
- In the Pages project → **Custom domains → Set up a domain** → enter your
  subdomain. Cloudflare creates the record and the HTTPS certificate.

Prefer not to move the domain? You can stay on the `pages.dev` address — Access
still works there. (Note: the address you install from is permanent — your saved
data is tied to it — so pick the final address before you start logging for real.)

### 5. Lock the front door with Cloudflare Access
Cloudflare dashboard → **Zero Trust → Access → Applications → Add application →
Self-hosted**. Set the application domain to your site's hostname (your custom
domain or the `pages.dev` one). Add a policy: **Action: Allow**, **Include:
Emails → your email address**. Save. Now opening the site asks for your email
and a one-time code; only you get in — and the same gate protects `/liv`.

### 6. Install it on your phone
Open the site, sign in once. Android Chrome shows an "Install app" prompt;
iPhone Safari → Share → **Add to Home Screen**. It runs full-screen with the
heart icon and works offline (the AI features need a connection).

---

## Publishing an update
The app is pre-built, so changes to features come from a fresh `app.js`. When
you have a new build:
1. Replace `app.js` (and any changed files).
2. **Bump the cache version** in `sw.js`: `healthjourney-v1` → `healthjourney-v2`,
   etc. This forces your installed copy to pick up the new version.
3. Commit and push — Cloudflare redeploys automatically.

## A note on cost
Liv's AI runs on your own Anthropic API key, so the food-photo feedback and
check-ins cost a small amount per use. Keep an eye on usage at
console.anthropic.com. Cloudflare Access keeps the proxy private, so only your
own use is ever billed.

## Backups
Use the in-app **Export** (Today tab → Back up & restore) to save a copy of all
your data, and **Import** to move it to another device — handy because the data
lives on each device separately.
