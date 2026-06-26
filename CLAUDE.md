# CLAUDE.md — Taxi Merci Express website

> You (Claude Code) own the development of this website. This file is your brief. Read it fully before acting. Keep it current. Log every working session in `PROGRESS.md`.

## Mission

Build a proper **design system** from the current live site, **redesign the site in Figma** using TME's full brand range, then **implement and ship** it through the existing pipeline — **without losing the site's existing SEO or breaking its lead funnel**.

Phases:
1. **Inspect & extract** — derive a real design system (tokens + component inventory) from the current code.
2. **Figma** — build the design system as a Figma library, then design the new site there. Use the Figma MCP / `figma-*` skills.
3. **Implement & ship** — translate Figma → code, deploy via branch → preview → merge.

This site belongs to **Taxi Merci Express** (TME) — a Florence (Firenze) courier/freight SRL. It is the public face of a family business with real, hard-won search ranking. Treat it accordingly: **evolve, don't endanger.**

## The pipeline (how this site goes live)

```
local repo (this folder)  →  git push  →  GitHub Comvertex/TME (branch: main)  →  Netlify auto-deploy  →  https://www.taximerciexpress.it
```

- **Host:** Netlify, project `taximerciexpress` (site id `2cb9b992-2f49-4e4c-8752-170b1a501bf4`). Auto-publishes `main`.
- **Workflow — ALWAYS:** new branch → open PR → Netlify builds a **deploy preview** (`deploy-preview-N--taximerciexpress.netlify.app`) → verify there → merge to `main` → production. **Never push experimental work straight to `main`.** Deploy previews are enabled for all PRs.
- **`netlify.toml`:** `publish = "."` and **`NODE_VERSION = "20"`**. Do NOT remove the Node pin — the build runs the Netlify **Prerender extension**, which crashes on Node 18.
- **Prerender extension** is installed but **redundant** for a static HTML site (bots already get full HTML). It adds build time + an edge function for no SEO gain. Leave it unless Matteo decides to remove it; just don't let it break builds.
- **No build step today.** `dist/style.css` and `dist/script.js` are hand-edited plain CSS/JS. There is **no `src/` and no bundler.** If you introduce a build (e.g. SCSS, a framework), update `netlify.toml` accordingly and verify the preview.

## Current state (2026-06-25)

**Shipped to production (PR #2, merged):**
- SEO: meta description, canonical, Open Graph, Twitter cards, `LocalBusiness` JSON-LD (was: none).
- De-Google part 1: removed the Font Awesome CDN; the 3 icons (phone, envelope, WhatsApp) are now **inline SVG**.
- Fixed a malformed phone-icon SVG; flex-centered it with the number.
- `sitemap.xml` → single real URL (was: useless `#fragment` entries + stale 2023 dates).
- New `_headers`: `X-Robots-Tag: noindex` on `/test.html` + baseline security headers.
- GTM (`GTM-KCVV7X9L`) + Consent Mode (default denied) + `gtagSendEvent()` click-tracking on every mailto/tel CTA — **all preserved. Do not break these.**

**Abandoned (PR #3, closed):** an attempt to self-host the Montserrat fonts failed because the tool used (a GitHub API connector) **corrupts binary files** — it text-decodes them, so the committed woff2 were invalid (33.7KB vs the real 18.8KB). The page currently still loads **Montserrat from Google Fonts**. **YOUR job to redo this correctly:** you have real git + filesystem, so you can commit valid binaries.
- Download Montserrat 400/600/700 woff2 (e.g. Fontsource: `@fontsource/montserrat` files `montserrat-latin-{400,600,700}-normal.woff2`, MIT) into `assets/fonts/`, add `@font-face`, remove the Google Fonts `<link>`. The `@font-face` block already exists from PR #3's attempt as a reference. Goal: **zero third-party requests** (only GTM remains, by design).
- The abandoned branch `improvements/self-host-fonts` has corrupt fonts — ignore or delete it.

## Repo map

- `index.html` — the live page. SEO + GTM + inline icons + self-hosted-font `@font-face` (fonts currently still Google-loaded; see above).
- `dist/style.css` — hand-edited plain CSS (~900 lines). `dist/script.js` — vanilla JS (header scroll, cookie consent + GTM consent mode, WhatsApp float).
- `assets/` — media. **Keep everything** (Matteo's instruction): only 3 are live (`favicon.webp`, `herovideo.mp4`, `tme-logo-white.webp`); the rest are **brand range for the redesign** — logo variants (`tme-logo-blue.webp`, `tme-logo-orange.webp`, `tme-logo-white.png`, `logo/logo2/logo3.webp`), `plane-logo.webp` (OBC / air-courier iconography), `herobanner.jpg` (8MB static hero alt), `logo-wa.jpg`. The design system should make use of this orange/blue identity and the plane motif.
- `robots.txt`, `sitemap.xml`, `netlify.toml`, `_headers`.
- **Leftover variants — keep, don't surface:** `index - nowhatsap.html` + `dist/{script,style} - nowhattsap.*` (no-WhatsApp variant); `test.html` + `dist/test.{css,js}` (a stale experiment, now noindexed — it carries a DIFFERENT phone `+39 351 604 7387` and its own GA4 `G-NQEND47CGQ` + Google Ads `AW-16765276917`; the live site uses only GTM).

## Design tokens already present (your starting point)

```css
--primary:  #1a4b84;  /* deep blue — trust */
--secondary:#e8f1f8;  /* light blue */
--accent:   #f39c12;  /* warm orange — CTAs */
--text:     #2c3e50;  /* dark slate */
--light:    #ffffff;
--gray:     #ecf0f1;
```
Type: **Montserrat** 400/600/700. Radii 4–8px. Shadow `0 2px 15px rgba(0,0,0,.1)`.

Component inventory (current): two-tier fixed header (phone bar + nav), hero (video bg + typewriter + CTAs), service cards (`.feature`, `.primary-service` "Servizio Principale", `.feature.highlight`), coverage block, footer, cookie consent banner, WhatsApp float.

Known CSS debt to clean up in the redesign: `darken()`/`lighten()` SASS functions used in plain CSS (broken consent-button hovers — invalid, silently ignored); duplicated/override blocks; inconsistent breakpoints (375/480/500/767/768/1024); hero video plays on mobile (data/battery cost — decide intentionally).

## Content & business facts (don't get these wrong)

- **Services:** (1) dedicated vans for special/urgent transport — the primary service; (2) **On Board Courier (OBC)** hand-carry by air (high-value, fashion sector); (3) baggage transfer (Firenze station/airport). Base: **Firenze, Toscana**. Serves Toscana / Italia / Europa. "Partenza entro 30 minuti", "24/7, 365".
- **Phone (correct, current): `+39 351 376 8842`.** NAP must match the Google Business Profile. (`test.html`'s `351 604 7387` is stale — ignore.)
- **Lead funnel today = `mailto:` only** (`preventivi@taximerciexpress.it` for quotes, `info@taximerciexpress.it` for info). The redesign should make **"Richiedi Preventivo"** prominent and be built so the CTA can later point at an **Airtable intake form** (TME OS Pilot 1) without a rebuild. Keep `mailto:` as fallback.

## Guardrails (cardinal rules — these override convenience)

1. **Never endanger SEO.** Keep the domain and URL structure. Preserve (or improve) the meta/canonical/`LocalBusiness` JSON-LD and the H1/copy that carries ranking. Never ship an accidental `noindex` on the homepage. Verify SEO on the deploy preview (Lighthouse SEO was **100** — keep it there).
2. **Never claim credentials TME doesn't hold.** No certifications at present (ISO/AEO/etc.) — may reference "partner certificati" only. Don't invent awards, numbers, or guarantees.
3. **Never commit a price.** Pricing is the family's call (relational: volume · recurrence · cargo value · contract length). The site shows "preventivo su richiesta", not rates.
4. **Branch → preview → merge.** Production is a live family business. Confirm visually + Lighthouse on the preview before any merge.
5. **Keep `NODE_VERSION=20`** in `netlify.toml`. Keep all assets/variants.
6. **Verify your own work.** Render icons/fonts and check they load (the last bug was a font that 200'd but failed OpenType sanitization — check `document.fonts` status, not just HTTP 200). Confirm zero broken third-party calls.

## Working with the orchestrator

Matteo relays prompts from a separate Claude session (the "TME OS" orchestrator) that tracks this work. To keep it in sync:
- **Append to `PROGRESS.md` every session** — date, what you did, branch/PR, preview URL, status, and any decision needed from Matteo.
- Surface blockers and choices explicitly (don't silently pick on irreversible/branding calls).
- When a phase completes, note it so the orchestrator can update the TME OS plan.

## First moves (suggested)
1. Read `PROGRESS.md`. Confirm local `main` is synced with origin; add a `.gitattributes` (`* text=auto eol=lf`) to stop CRLF churn.
2. Do the **font self-hosting** fix (quick, unblocks "zero third-party calls") as your first real PR — it's a clean way to prove the pipeline end-to-end with binaries.
3. Then start **Phase A**: extract the design system (tokens + components) and stand up the Figma library.
