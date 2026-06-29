# CLAUDE.md — Taxi Merci Express website

> You (Claude Code) own the development of this website. This file is your brief. Read it fully before acting. Keep it current. Log every working session in `PROGRESS.md`.

## Mission

Original mission (build a design system → redesign in Figma → implement & ship without losing SEO or the lead funnel) is **✅ COMPLETE and LIVE** (see Current state). The site is now in **maintenance / iteration**: content tweaks, perf, SEO/share polish — same pipeline, same guardrails.

This site belongs to **Taxi Merci Express** (TME) — a Florence (Firenze) courier/freight SRL. It is the public face of a family business with real, hard-won search ranking. Treat it accordingly: **evolve, don't endanger.**

## The pipeline (how this site goes live)

```
local repo (this folder)  →  git push  →  GitHub Comvertex/TME (branch: main)  →  Netlify auto-deploy  →  https://www.taximerciexpress.it
```

- **Host:** Netlify, project `taximerciexpress` (site id `2cb9b992-2f49-4e4c-8752-170b1a501bf4`). Auto-publishes `main`.
- **Workflow — ALWAYS:** new branch → open PR → Netlify builds a **deploy preview** (`deploy-preview-N--taximerciexpress.netlify.app`) → verify there → merge to `main` → production. **Never push experimental work straight to `main`.** Deploy previews are enabled for all PRs.
- **`netlify.toml`:** `publish = "."` and **`NODE_VERSION = "20"`**. Keep the Node pin (harmless; was originally required by the Prerender extension).
- **Prerender extension: REMOVED** (Matteo disabled it in the Netlify dashboard, 2026-06-29 — it was redundant for static HTML and added ~600ms TTFB). It lived in the Netlify UI, not the repo. Don't re-enable.
- **No build step.** `dist/style.css` and `dist/script.js` are hand-edited plain CSS/JS. There is **no `src/` and no bundler.** If you introduce a build (e.g. SCSS, a framework), update `netlify.toml` accordingly and verify the preview.
- **⚠️ Binaries via git ONLY.** The GitHub/Zapier connector **text-decodes binary files and corrupts them** (bit fonts and a JPG). Always commit images/fonts/video with native `git`. The connector also has **no merge endpoint** and **mis-targets PR updates by content** — use it only to *open* a PR (explicit head/base); do merges/closes/branch-deletes with native git.

## Current state (2026-06-29) — redesign LIVE in production

The homepage is the **new redesigned single page**, fully shipped. Full session history in `PROGRESS.md`. Net feature set now live on `main`:

- **Redesign (PR #5):** sticky two-tier header → hero (video + L→R scrim) → trust strip (count-up stats + promise chips) → dual-register services (everyday + premium; plane motif only on the Moda/OBC card) → static Google reviews → coverage (van watermark) → "Perché TME" mission-control panel → orange CTA band → 3-col footer (+ legal entity line `Taxi Merci Express Group S.R.L. — P.IVA 07484870485`) → WhatsApp float + restyled cookie banner. Built from the handoff in `Taxi Merci Express Homepage/` (gitignored) + `docs/design-system.md` / `design-direction.md` / `content-brief.md`.
- **SEO/GTM preserved throughout:** `<title>`/description/canonical/theme-color/geo, OG/Twitter, `LocalBusiness` JSON-LD, single `<h1>` (the tagline "Affidabilità che conta, velocità che sorprende."). GTM `GTM-KCVV7X9L` + Consent Mode v2 (default-denied) + `consentGranted()/consentRefused()` + `cookieConsent` localStorage + `gtagSendEvent()` on every tel/mailto CTA — **all intact. Do not break these.** (GTM also loads GA4 + Google Ads + **Microsoft Clarity** — Matteo's heatmaps; leave them.)
- **Self-hosted fonts: DONE.** Montserrat 400/600/700 woff2 in `assets/fonts/` via `@font-face` in `dist/style.css`. No Google Fonts link. **Zero third-party requests except `googletagmanager.com`** (by design).
- **Reviews (PR #6/#8):** ★ 5,0 · **65 recensioni**, curated static quotes (Guzzardi → Fawne → Martini, month/year dates) from `docs/reviews.md`. Both review links → `https://share.google/TM6yVnWtl6CSpvnss`. No third-party review widget.
- **Founder name removed** from "Perché TME" per request (concept kept).
- **Social share card (PR #8):** `og:image`/`twitter:image` = `assets/tme-logo-white.webp` (square 1200×1200), `twitter:card=summary`, share descriptions carry the slogan + "★ 5,0 · 65 recensioni". (Earlier landscape `og-image.jpg` was removed.) WhatsApp/Meta need a Facebook Sharing Debugger "Scrape Again" to refresh after changes.
- **Perf (PR #9):** hero video is **poster-only on mobile** (JS loads/plays it only ≥981px, never on reduced-motion/Save-Data; `preload="none"`); LCP poster is `assets/hero-poster.webp` (1600×1067, ~56KB, preloaded via `<link rel=preload as=image>`); preconnects to googletagmanager.com + scripts.clarity.ms. Mobile Lighthouse: **Perf 85, LCP 1.4s, CLS 0.027, SEO 100, Best Practices 100, A11y 98.**

Earlier groundwork (PR #2): inline-SVG icons (no Font Awesome CDN), single-URL `sitemap.xml`, `_headers` (noindex `/test.html` + security headers).

**Open PRs / branches:** none — `origin` has only `main`; all feature branches merged + deleted.

## Repo map

- `index.html` (~558 lines) — the live redesigned page: head shell (SEO/OG/Twitter/JSON-LD + GTM + consent + preconnect/preload) then the new section markup. Inline SVG icons.
- `dist/style.css` (~1000 lines) — hand-edited plain CSS: self-hosted `@font-face`, normalized `:root` tokens, component classes, responsive `@media (≤980px)` + `(≤620px)` + `prefers-reduced-motion`. `dist/script.js` (~220 lines) — vanilla: nav collapse (470ms anti-stutter lock), scroll-reveal (IntersectionObserver + timeout fallback), count-up, hero video gating, mobile hamburger, consent wiring.
- `assets/` — media. **Keep everything** (Matteo's instruction). Live: `favicon.webp`, `tme-logo-white.webp` (header logo, CSS-cropped; also the square social-card image), `tme-logo-blue.webp` (footer), `plane-logo.webp` (OBC card), `hero-poster.webp` (LCP poster, 1600px), `herovideo.mp4` (desktop hero only), Montserrat woff2 in `fonts/`. Unreferenced-but-kept: `herobanner.jpg`, `taxi_merci_express_corriere_dedicato.webp` (full-size hero source), `tme-logo-orange.webp`, `tme-logo-white.png`, `logo/logo2/logo3.webp`, `logo-wa.jpg`.
- `docs/` — `design-system.md`, `design-direction.md`, `content-brief.md`, `reviews.md` (canonical copy/tokens/reviews — keep in sync with the page).
- `scripts/check-overflow.mjs` — reusable headless guard (system Chrome via `puppeteer-core`) asserting zero mobile horizontal overflow + header/float invariants at 360/375/390 + desktop 1280. `puppeteer-core` is **not** a repo dep (keeps node_modules out of `publish="."`); run via a global install or `NODE_PATH`. Re-run after any header/hero/layout change.
- `robots.txt`, `sitemap.xml`, `netlify.toml`, `_headers`, `.gitignore` (ignores `Taxi Merci Express Homepage/` + `.claude/launch.json`).
- **Leftover variants — keep, don't surface:** `index - nowhatsap.html` + `dist/{script,style} - nowhattsap.*`; `test.html` + `dist/test.{css,js}` (stale, noindexed — carries a DIFFERENT phone `+39 351 604 7387` + its own GA4/Ads IDs; the live site uses only GTM).

## Design system (as shipped)

Identity: deep blue `#1a4b84` (+ `#16365e`/`#14365f`/`#0e2a4a`), warm orange `#f39c12` (+ `#e67e22`/`#f7b955`), light-blue tint `#e8f1f8`, slate text `#2c3e50`/`#5b6b7a`. Full normalized token set is the `:root` block in `dist/style.css`; rationale in `docs/design-system.md` + `docs/design-direction.md`. Type **Montserrat** 400/600/700 (self-hosted). Buttons `.tme-btn--{primary,secondary,outline,ghost-light,outline-light}` (radius 8px), cards radius 14px, chips/pills fully rounded.

Component inventory (live): two-tier header (`.topbar` + collapsible `.navbar` + `.mobile-menu` hamburger), hero (`.hero__poster`/`__video`/`__scrim` + brand wordmark + eyebrow + H1 + CTAs), `.trust` strip (`.stat` count-ups + `.chip`s), `.services` dual-register `.service-card`s (`.service-card--dark` = Moda/OBC w/ plane), `.reviews` (`.rating-badge` + `.review-card`s), `.coverage` (`.coverage-card`s + van watermark), `.why` mission-control `.panel`, `.cta-band`, `.site-footer`, `.whatsapp-float`, `#consent-banner`.

The old CSS debt (SASS `darken()`/`lighten()` in plain CSS, duplicate blocks, 7 inconsistent breakpoints, video-on-mobile) was resolved in the redesign. Breakpoints are now just **≤980px** and **≤620px** (+ a 360px overflow check in the guard).

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

## First moves (every session)
1. Read the tail of `PROGRESS.md` for the latest state. `git fetch` and confirm local `main` == `origin/main` before branching (a past session found local main silently behind while git said "up to date").
2. For any change: **new branch → push → open PR (connector OK for *open* only) → verify on the Netlify deploy preview → merge with native git → push `main`**. Production is a live family business; Matteo gates the merge. Re-run `scripts/check-overflow.mjs` after header/hero/layout edits.
3. Commit binaries (images/fonts/video) with **native git only** — never the connector (it corrupts them).
4. Append a session entry to `PROGRESS.md`.

**Next session (per Matteo): SEO + expanding the site** (more pages/content). A solid **tracking + consent structure is a prerequisite** — GTM/Consent Mode v2 + `gtagSendEvent` and the tag stack (GA4/Ads/Clarity) stay **as-is**; **do NOT defer/lazy-load or trim tags** (decided 2026-06-29 — lab TBT is noisy/third-party; field metrics are fine: TTFB 50ms, LCP 1.8s). When adding pages, replicate the head shell (SEO meta + canonical per-page + JSON-LD + GTM + consent + preconnect/preload) and keep one `<h1>` per page.

Also parked: CTA → Airtable intake form (TME OS Pilot 1); optional `.gitattributes` (`* text=auto eol=lf`) for CRLF. **Render-blocking CSS** — PSI mobile: the only blocking request is `/dist/style.css` (6.8 KiB transfer, ~290 ms on throttled mobile; 0 third-party blocking — GTM is async). PSI *Insights* models up to ~1.24 s LCP headroom, but it's theoretical: measured FCP 1.0 s / LCP 1.8 s are already good (the LCP poster is preloaded, so it doesn't wait on CSS). Desktop 98 (no flag). Proper fix = inline critical CSS + load the rest non-blocking, done **with the build step the expansion phase will introduce** (keep `dist/style.css` as the shared cached sheet). The quick no-build alternative is inlining the whole 6.8 KiB sheet into `<head>` (removes the block, no FOUC) — but that re-introduces churn once multi-page, so prefer the build-step route.
