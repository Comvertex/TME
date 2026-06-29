# PROGRESS.md — TME website worklog

> Append-only. Newest entries at the top. One block per working session. This is how the TME OS orchestrator (and Matteo) track what's been done. Read `CLAUDE.md` first.

**Format per entry:**
```
## YYYY-MM-DD — <short title> — <Claude Code | orchestrator>
- Did: …
- Branch / PR: …  Preview: deploy-preview-N--taximerciexpress.netlify.app
- Status: shipped / in review / blocked
- Needs from Matteo: … (or none)
```

---

## Open threads / next up
- [x] **Self-host fonts (redo properly).** Done in PR #4 — real woff2 committed via git, verified loaded on preview. See 2026-06-26 entry.
- [x] Add `.gitattributes` (`* text=auto eol=lf`) — shipped in PR #4 (with explicit binary rules for fonts/media).
- [ ] **Phase A** — extract design system (tokens + component inventory) from current site.
- [ ] **Phase B** — build Figma library + redesign (Figma MCP / figma-* skills); use the orange/blue brand range + OBC plane motif.
- [ ] **Phase C** — implement Figma → code, ship via branch→preview→merge.
- [ ] Decision (Matteo): Netlify **Prerender extension** — keep or remove (redundant on a static site).
- [ ] Decision (Matteo): hero video on mobile (data cost) — keep / poster image.
- [ ] Close abandoned PR #3 and delete branch `improvements/self-host-fonts` (corrupt fonts).

---

## 2026-06-26 — Phase B: Figma library + redesign — COMPLETE, FOR REVIEW — Claude Code
- Did: finished the full Figma delivery in `ZEvbN43GQHR6pHCbQ4aMAd` (Professional plan, limit lifted). Fixed the padding bug. Structured the file as **🎨 Design System** (tokens + components) + **🏠 Homepage** (composed page).
- Token library: variable collection "TME Tokens" (9 colour / 9 spacing / 4 radii), 4 elevation effect styles, 9 Montserrat text styles.
- Reusable, **token-variable-bound components**: `Button` (variant set: Primary/Secondary/Outline), `PromiseChip`, `ServiceCard` (variant set: Featured No/Yes), `ReviewCard`, `Nav`, `Footer`. Colours + radii bound to variables → a token edit propagates to every instance and to future surfaces.
- Composed homepage (1440) from instances: Nav · hero (real video **poster** still extracted via ffmpeg + blue legibility scrim, white text legible) · promise/trust strip (un solo referente · 30 min · 24/7/365 · monitoraggio · notifiche · prezzo tutto compreso) · **dual-register services** led by the featured "Privati & urgenze quotidiane / NESSUN INCARICO TROPPO PICCOLO" card, then aziende & negozi, moda & lusso (OBC), arte & allestimenti, eventi & hospitality, urgenze & spedizioni critiche — capability/sector language, **no client names** · **Google reviews** block (★5,0 / 63 badge + static curated carousel of placeholder reviews) · coverage "Da Firenze, ovunque serva" (Firenze · Toscana · Italia · Europa + plane/OBC motif) · why-TME mission-control band (owner-led, un solo referente) · footer (full NAP + placeholder legal line).
- Guardrails honored: single page, NAP exact, no prices, no client names, no unheld certs; reviews stay zero-third-party (static).
- Known minor: hero CTAs/chips kept as bespoke hero treatment (translucent on dark) rather than Button/PromiseChip instances — can be linked to components if central control there is wanted.
- Status: **complete, for review.** Screenshots captured per section; full page in Figma. No Phase C code yet.
- Needs from Matteo: review the composed page; refine the legal-line wording; provide the **Google Place ID** (for Phase C reviews wiring). Phase C will sync Figma variables → `tokens.css` via the MCP and translate the page to code via branch→preview.

## 2026-06-26 — Phase B: Figma library + redesign — STARTED, BLOCKED (Figma rate limit) — Claude Code
- Did: read `docs/content-brief.md` + `docs/design-system.md`. Created Figma file **"TME — Website Redesign (Phase B)"** (key `ZEvbN43GQHR6pHCbQ4aMAd`, https://www.figma.com/design/ZEvbN43GQHR6pHCbQ4aMAd). Stood up the **token library** from the approved set: variable collection "TME Tokens" (9 colour, 9 spacing, 4 radii vars), 4 elevation effect styles, 9 Montserrat text styles. Built the **two-tier header + hero** with lifted dual-register copy (eyebrow FIRENZE·TOSCANA·ITALIA·EUROPA; H1 "Affidabilità che conta, velocità che sorprende."; subline "dal singolo capo alla collezione intera…"; promise chips 30min/24·7·365/un solo referente/prezzo tutto compreso; CTAs Richiedi Preventivo + Chiama ora; ★5,0·63 Google badge). Hero looks strong (screenshot captured).
- Decisions taken (Matteo): legal footer line = include as placeholder, wording to be refined by him; reviews block = **static curated carousel** (no third-party JS, keeps GTM-only profile).
- **BLOCKED:** hit the **Figma MCP tool-call limit on the Starter plan** mid-build. Remaining sections (dual-register services, Google-reviews block, coverage + plane motif, why-TME/mission-control, footer w/ legal line) are designed but not yet built in Figma. Also a known 1-call fix pending: a frame-helper bug left buttons/chips/header bars without padding (patch written, not yet applied — blocked by the same limit).
- Housekeeping done: deleted stale `improvements/seo-deglobal` branch (repo now only `main`).
- Status: **in progress, blocked.** No Phase C code. Figma direction presented to Matteo for review (header+hero + full written spec).
- Needs from Matteo: (1) raise the Figma plan / confirm when the MCP call budget resets so I can finish the build; (2) review the hero + direction. Hero-video compression = planned (ffmpeg recipe ready), to run in Phase C via branch→preview.

## 2026-06-26 — Phase A: design-system extraction — FOR REVIEW — Claude Code
- Did: read the shipped code in full (`index.html`, `dist/style.css` @ 1210 lines, `dist/script.js`) and extracted a faithful design system → `docs/design-system.md`. Covers colour tokens (6 defined + 9 hardcoded literals catalogued), type scale, spacing, radii, shadows, z-index, motion/keyframes, breakpoints, an 11-component inventory, dead CSS, and a numbered debt list. Each "current" value is taken from code; a "Proposed" normalized token set is included and clearly marked (not applied).
- Key debt surfaced: invalid `darken()`/`lighten()` SASS in plain CSS → consent-button hovers silently dead; `@keyframes fadeIn` defined 5×; conflicting hero-video display on mobile (`display:none` then `:block` both at ≤768); 7 inconsistent breakpoints; hardcoded colours; `.feature.highlight` has no visual treatment; dead selectors (`.contact-banner`, `.slogan`, `.logo`).
- Branch / PR: committed to `main` (docs only, no site impact). No Figma started — per instruction.
- Status: **for review — Figma NOT started.** Awaiting Matteo's sign-off on the foundation before Phase B.
- Needs from Matteo: review `docs/design-system.md`; confirm the proposed token scales (esp. the colour additions + the hero-video-on-mobile decision) before it becomes the Figma library.

## 2026-06-26 — PR #4 self-host fonts + .gitattributes — SHIPPED — Claude Code
- **Pre-flight catch:** local `main` was silently 7 commits behind origin (git reported "up to date" falsely; tree still had the Font Awesome CDN + 0 inline SVGs, i.e. pre-PR#2). Fast-forwarded to `8882160` before branching, else this PR would have regressed the shipped SEO/de-Google work. Also cleared a stale `.git/index.lock` (Jun 25).
- Did: committed real Montserrat 400/600/700 woff2 (Fontsource, MIT) to `assets/fonts/` — validated `wOF2` magic + canonical sizes (18780/18688/18824 B); wired `@font-face` (font-display:swap) in `dist/style.css`; removed the Google Fonts `<link>` from `index.html`. Added `.gitattributes` (`* text=auto eol=lf`) + explicit `binary` rules for font/media so woff2 are never EOL-normalized.
- Tooling note: real `git` used (not the GitHub connector — it corrupts binaries, the PR #3 failure). Push needed the `id_ed25519_comvertex` SSH key (the default `kora` key + the `gh` token both lack/loststore access); pinned via repo-local `core.sshCommand`. PR opened via GitHub connector (text-only, safe).
- Branch / PR: `improvements/self-host-fonts-v2` / **PR #4**.  Preview: **deploy-preview-4--taximerciexpress.netlify.app**
- Verified on preview (not just HTTP 200): `document.fonts` → all 3 faces `status:"loaded"`, `document.fonts.check` true for 400/600/700, body computes to Montserrat. Fonts served first-party `font/woff2` at exact committed byte sizes, `wOF2` magic intact end-to-end. No `googleapis`/`gstatic`/Font Awesome in served HTML. Resource audit: only third-parties are `www.googletagmanager.com` (GTM, by design) and `app.netlify.com` (Netlify preview drawer — preview-only, absent in production). Visual: renders in Montserrat, correct NAP `+39 351 376 8842`, no regression.
- Status: **SHIPPED to production.** Matteo approved; merged to `main` (merge commit `6008f79`, PR #4 marked merged). Live site re-verified: 3 Montserrat faces `loaded`, body Montserrat, only third-party host is `www.googletagmanager.com` (GTM) — `app.netlify.com` was preview-only and is gone in prod. No Google Fonts / Font Awesome.
- Housekeeping same session: `CLAUDE.md` + `PROGRESS.md` committed to the repo (own commit on `main`); abandoned PR #3 closed + its `improvements/self-host-fonts` branch deleted; merged `improvements/self-host-fonts-v2` branch deleted.
- Needs from Matteo: none for this item. Next: Phase A (design-system extraction) — see below.

## 2026-06-25 — Handoff to Claude Code — orchestrator (TME OS session)
- Did: Wrote `CLAUDE.md` (project brief) + this file. Established Claude Code as owner of website development.
- Context: website was repatriated long ago — already local → GitHub `Comvertex/TME` → Netlify → live. Orchestrator did two PRs via the GitHub connector before handing off.
- Status: handoff ready.
- Needs from Matteo: direct Claude Code to this folder; relay the first prompt.

## 2026-06-25 — PR #3 self-host fonts — ABANDONED — orchestrator
- Did: tried to self-host Montserrat via the GitHub connector's file-URL feature. The connector **corrupts binaries** (text-decodes → 33.7KB vs real 18.8KB; valid `wOF2` header but mangled body → OpenType sanitizer rejects → font falls back to system sans-serif on the preview).
- Branch / PR: `improvements/self-host-fonts` / PR #3 (closed, not merged). Preview built green but fonts broken.
- Status: blocked by tooling → handed to Claude Code (has real git/filesystem, can commit valid binaries).
- Lesson: after committing a font, verify `document.fonts` status (not just HTTP 200) and compare bytes to the canonical file.

## 2026-06-25 — PR #2 SEO + de-Google — SHIPPED — orchestrator
- Did: meta description + OG + Twitter + `LocalBusiness` JSON-LD; removed Font Awesome CDN → inline SVG icons; fixed phone icon (was malformed/cropped) + flex-centered; `sitemap.xml` single-URL; new `_headers` (noindex `/test.html` + security headers); pinned `NODE_VERSION=20`.
- Branch / PR: `improvements/seo-deglobal` / merged via PR #2 (supersedes closed #1). Preview was green, Lighthouse: Performance 79, Accessibility 93, Best Practices 100, **SEO 100**.
- Status: shipped to production.
- Note: first build in ~19 months exposed that the Netlify Prerender extension needs Node 20 (hence the pin).

## 2026-06-27 — Phase C: homepage redesign implemented in code — IN REVIEW — Claude Code
- Did: reimplemented the new homepage design (from `Taxi Merci Express Homepage/design_handoff_homepage/`) as plain vanilla HTML/CSS/JS in the live codebase. Full new section flow: two-tier sticky header → hero (video + L→R scrim) → trust strip (count-up stats + promise chips) → dual-register services (everyday + premium, plane only on Moda/OBC card) → static Google reviews → coverage (driving van watermark) → "Perché TME" mission-control panel → orange CTA band → 3-col footer w/ legal line → WhatsApp float + restyled cookie banner.
- Translated the prototype's inline-style spec into external CSS on a normalized token set (`dist/style.css` fully rewritten, `@font-face` kept); behaviors rewritten vanilla (`dist/script.js`): nav collapse w/ 470ms anti-stutter lock, scroll-reveal via IntersectionObserver + guaranteed timeout fallback + `prefers-reduced-motion`, count-up, hero video crossfade, mobile hamburger menu.
- Preserved unchanged: `<head>` SEO/canonical/OG/Twitter/JSON-LD, single `<h1>`, theme-color/geo; the `gtag('consent','default',…denied)` block, GTM `GTM-KCVV7X9L` (head + noscript), `consentGranted()/consentRefused()`, `cookieConsent` key, `gtagSendEvent()` on every tel:/mailto: CTA. NAP exact. Footer legal entity line included (owner-confirmed).
- Verified locally (browser, localhost:8731): consent stays denied by default + banner shows; Accetta → consent update granted + banner hides; `gtagSendEvent` fires & returns true; no console errors; only external request is googletagmanager.com (self-hosted fonts load, zero other third-party); single H1; desktop nav + mobile hamburger + responsive grids all correct.
- Branch: `redesign/homepage-v2` (off synced `main` = ab680a2). 5 commits. **NOT pushed** — awaiting Matteo's local review before pushing for a Netlify deploy preview.
- Gitignored the `Taxi Merci Express Homepage/` handoff bundle so Netlify (`publish = "."`) won't serve it.
- Open items: (1) footer legal line confirmed but flag once more before merge; (2) review quotes are placeholders (await curated set + Place ID); (3) gate on the deploy preview (Node-20 build, document.fonts, SEO/JSON-LD, consent) before merge.

## 2026-06-27 — Phase C cont.: curated reviews wired + branch pushed for preview — Claude Code
- Did: replaced the 3 placeholder reviews with Matteo's curated real Google reviews (verbatim from `docs/reviews.md`): Fawne Thomas (8 mesi fa, EN), Martini Creative Team (3 mesi fa), Chiara Longo (5 mesi fa) — Title Case, ★★★★★. Verified the longer quotes fit the card cleanly (no overflow/clamp; cards grow 180–230px).
- Swapped both Google links (top-bar rating + reviews badge) from the expiring `sxsrf` session URL to the stable Maps CID `https://www.google.com/maps?cid=5689742111578371114` (target=_blank rel=noopener).
- Footer legal line approved by Matteo → shipping as-is.
- Versioned the project-brief docs (`docs/content-brief.md`, `docs/design-direction.md`, `docs/reviews.md`); gitignored `.claude/launch.json` (local preview helper).
- Pushed `redesign/homepage-v2` and opened **PR #5** (NOT merged) → triggers Netlify deploy preview. Gate before merge: Node-20 build, `document.fonts` Montserrat loaded, zero third-party beyond GTM, SEO/JSON-LD intact, consent gates GTM. Awaiting Matteo's preview review.

## 2026-06-27 — Mobile horizontal-overflow fix (real root cause) — Claude Code
- Matteo confirmed on a physical device that the mobile horizontal overflow was REAL (not a preview artifact). It pushed the fixed right-anchored WhatsApp float off-screen and broke the "Pronti a partire?" CTA-band spacing. (Claude Preview eval was unusable here — it reported 375 while laying out at ~609; that mismatch was the tell.)
- Real offenders found & fixed: (1) trust strip "24/7/365" is an unbreakable token in a 2-col grid whose tracks default to min-width:auto → widened the page; fixed with `repeat(2,minmax(0,1fr))` + min-width:0 + reduced number font on mobile. (2) `.register-note` had `white-space:nowrap` with long text in a non-wrapping flex row → hidden on mobile. (3) `.container` used the `padding` shorthand, so the ≤620 `.container{padding:0 20px}` clobbered `.hero__inner` / `.cta-band__inner` vertical padding → switched container to `padding-left/right` longhand (this restored the CTA-band spacing). (4) Nav row (logo + full CTA + hamburger) didn't fit ≤~410px and the toggle got clipped → inline nav CTA now hidden ≤620 and surfaced inside the hamburger menu.
- Verified with headless system Chrome (puppeteer-core) at TRUE 375 AND 390px, both banner states: `scrollWidth===clientWidth` (zero horizontal scroll), zero offenders, WhatsApp float in-viewport + tappable (lifted above banner when shown, back at corner when dismissed), CTA-band padding 48/20 + gap 22, no console errors (only GTM DNS in sandbox). Desktop 1280 regression-checked: no scroll, inline CTA/links shown, hamburger/menu hidden.
- Commit `32a3c84` pushed to `redesign/homepage-v2` → updates PR #5 preview. Still NOT merged — gate on the preview.

## 2026-06-27 — Mobile header polish + asset compression/poster swap — Claude Code
- Mobile header (≤620px): (1) restored the nav CTA as a compact button with a short "Preventivo" label (full "Richiedi Preventivo" stays desktop) so logo+CTA+hamburger fit at 375px with zero horizontal scroll; in-menu CTA kept. (2) Taller blue top bar (column, min-height 66px) with "Disponibili 24/7/365" stacked below the phone (was hidden on mobile). Reused the existing status element → text reads "24/7/365" (matches desktop), not the "24/7 · 365" spelling — can switch separators if Matteo wants.
- Added `scripts/check-overflow.mjs`: reusable headless guard (system Chrome via puppeteer-core) asserting zero horizontal overflow + header/float invariants at true 375/390/1280. puppeteer-core intentionally NOT a repo dep (keeps node_modules out of Netlify's publish='.' root; run via global install or NODE_PATH). Guard run: PASS.
- Matteo compressed the 3 brand logos out-of-band (tme-logo-blue 472KB→16KB, white 222KB→21KB, plane 192KB→18KB; filenames unchanged, verified valid WebP) → committed. Added `taxi_merci_express_corriere_dedicato.webp` (same hero photo as herobanner.jpg, webp) and pointed the hero poster at it (verified references new file, decodes 6000×4000, served 200). `herobanner.jpg` kept in assets, unreferenced.
- Commits `ed7e85b` (header) + `6f02c97` (assets) pushed to `redesign/homepage-v2` → PR #5 preview. Still NOT merged — gate on the preview.

## 2026-06-27 — Hero scrim/brand + full mobile CTA + bigger top bar — Claude Code
- Hero scrim strengthened on mobile to a near-full white banner mask (180deg .96→.92→.84) so eyebrow/H1/subline stay legible over the photo; desktop scrim unchanged.
- Added visible brand wordmark "Taxi Merci Express" in the hero (separate <p class="hero__brand">, NOT a 2nd <h1>) — fixes that the name appeared nowhere as on-page text; helps brand SEO.
- Reverted the mobile nav CTA to the full "Richiedi Preventivo": header now stacks on mobile (logo + hamburger top row, full-width CTA beneath) so the full label fits at 375px; navbar max-height raised to 170px for the second row. Dropped the "Preventivo" short-label approach.
- Bigger mobile top bar: phone 20px, "Disponibili 24/7/365" 14px, min-height 80px.
- Extended scripts/check-overflow.mjs (full CTA label assert + CTA-not-clipped-by-navbar + hero brand present + phone >=18px). Guard PASS at true 375/390 (both banner states) + desktop 1280; zero horizontal scroll throughout. Eyeballed a headless 375 screenshot: scrim legible, brand visible, full CTA on its own row, bigger top bar.
- Commit `71c94b5` pushed to `redesign/homepage-v2` → PR #5 preview. Still NOT merged — gate on the preview.

## 2026-06-27 — Header CTA inline+compact; stronger gradient scrim; tighter hero top — Claude Code
- Top blue bar left as-is (Matteo: good). Three changes:
  1. Reverted the two-row header → one row: logo + compact full-label "Richiedi Preventivo" (12.5px / 9×12 padding) + hamburger. Label NOT shortened. Measured 35px free space at 360px (logo 106 + CTA 153 + toggle 38 of 332 available) — comfortable, not borderline.
  2. Hero scrim back to a VISIBLE gradient but stronger than the original: 105deg .99→.97 50%→.85 74%→.45 90%→.20 100% — near-opaque white over the text, image revealing on the right; lighter subline stays legible. Desktop scrim unchanged.
  3. Tighter hero top gap on mobile (min-height 70vh, align flex-start, padding-top 30) + larger/bolder brand wordmark (23px) lifted toward the top.
- Extended scripts/check-overflow.mjs to also test 360px. Guard PASS @360/375/390 (both banner states) + desktop 1280; zero horizontal scroll throughout. Eyeballed headless 360 + 375 screenshots: one-row header no clip, visible gradient with legible subline, brand bigger/higher, reduced top gap.
- Commit `2b3c96b` pushed to `redesign/homepage-v2` → PR #5 preview. Still NOT merged — gate on the preview.

## 2026-06-27 — Hero vertical-center + ~20% bigger header CTA — Claude Code
- From Matteo's real mobile screenshot: hero content was top-aligned leaving a tall empty image band below the CTAs. Fixed: mobile hero align-items center + symmetric 28px padding in a 70vh hero → content vertically centred (verified gapAbove==gapBelow=28 at 412px).
- Header CTA enlarged ~20% (font 12.5→15px). Tightened row (gap 6, navbar padding 8, toggle 36) so the full "Richiedi Preventivo" still fits one row at 360px with 24px free (12px slack after gaps) — not borderline. Guard PASS @360/375/390 (both banner states) + desktop 1280; zero horizontal scroll. Eyeballed 375 + 412 screenshots.
- Commit `37e3921` pushed to `redesign/homepage-v2` → PR #5 preview. Still NOT merged — gate on the preview.

## 2026-06-27 — SEO: JPG social share card (WhatsApp/iMessage link preview) — Claude Code
- Problem: link previews on WhatsApp/iMessage were blank because og:image was a WebP, which those crawlers (and Meta's) don't render.
- Fix (branch `seo/og-share-card` off main, separate from the homepage redesign): repointed og:image + twitter:image to a real JPEG `assets/og-image.jpg` (1200×630, ~51KB, verified valid JPEG + dimensions); added og:image:type/width/height/alt + twitter:image:alt; twitter:card → summary_large_image. Committed with real git (the GitHub connector corrupts binaries — same failure as the abandoned self-host-fonts attempt).
- The og:image URL is the absolute production path, so the card only fully validates POST-MERGE. Deploy-preview checks: page intact, /assets/og-image.jpg returns 200, Lighthouse SEO still 100.
- AFTER MERGE: run the Facebook Sharing Debugger on https://www.taximerciexpress.it/ → "Scrape Again" to refresh Meta's crawler cache (WhatsApp shares it), then re-share in WhatsApp to confirm the card.
- Note: this is a small SEO fix that went straight off main (PR #5 redesign was already merged to main as commit 8477305, so main now carries the redesigned index.html; this branch edits that same head).

## 2026-06-28 — Ship post-launch batch: social card + share.google link + reviews refresh — Claude Code
- Branch `seo/og-share-card` (native git, no connector — it corrupts the JPG). Verified branch integrity first (HEAD valid, index.html ends </html>, OG meta has og-image.jpg); the warned overnight corruption was not present.
- Changes (commit 0aedb50): reviews links (top-bar + badge) → `https://share.google/TM6yVnWtl6CSpvnss`; review count `63 → 65` in top-bar + badge AND the trust-strip count-up (so all three are consistent — flagged as one extra beyond the two named); reviews refreshed → Michelangelo Guzzardi (Giugno 2026, long quote) / Fawne Thomas (Ottobre 2025) / Martini Creative Team (Marzo 2026), Chiara Longo removed, dates as month/year; `docs/reviews.md` updated. Social card (og-image.jpg + OG/Twitter meta) was already on this branch.
- Verified headless (system Chrome): page intact, no console errors, reviews render Guzzardi/Fawne/Martini with the 340-char Guzzardi quote NOT clipped, both counts "65 recensioni", month/year dates, both links → share.google, og:image=/assets/og-image.jpg, twitter:card=summary_large_image, GTM/consent/gtagSendEvent intact (consent denied by default + banner shows). JPG still valid (FF D8 FF, 51171B).
- PR: `seo/og-share-card` → main is **PR #6** (updated to full scope). **NOT merged.** Cannot verify the Netlify deploy preview or Lighthouse from this environment (no outbound internet here), so the preview-gate can't be completed by me — left for Matteo.
- ⚠️ PR #7 (`fix/reviews-google-link`, the earlier sxsrf reviews-link change) is SUPERSEDED by the share.google change here and should be CLOSED (its links would conflict with #6). Note: the PR-update connector mis-targeted #7 once (ignored pull_number) — its title/body were corrected and it should be closed.
- TODO for Matteo (needs internet): verify deploy-preview-6 (page, /assets/og-image.jpg 200, Lighthouse SEO 100), merge PR #6, close PR #7, then Facebook Sharing Debugger → "Scrape Again" on prod + re-share in WhatsApp, click both review links live.

## 2026-06-28 — Perché TME: remove founder name from the note — Claude Code
- Per the founder's request, removed "Ferdinando Martire — Titolare e Responsabile Operativo" from the `why__note` line, keeping the concept (continuity + ethic) without restating the single-referente role (already stated 3× in the section: heading, lead twice). New note: "Dietro ogni corsa, sempre la stessa persona e la stessa etica: arrivare fin dove serve per fare la cosa giusta."
- Confirmed the name appears nowhere else on the page (not in JSON-LD); only other repo hit is the internal `docs/content-brief.md` (not deployed) — left as-is, flagged for Matteo.
- On `seo/og-share-card` (PR #6). Verified: page ends `</html>`, name gone, counts still 65 (top-bar + badge + trust-strip), links still share.google. NOT merged — Matteo verifies deploy-preview-6 and merges.

## 2026-06-28 — SHIPPED: post-launch batch merged to main (production) — Claude Code
- Matteo verified deploy-preview-6 (preview gate cleared). Merged `seo/og-share-card` → `main` with `--no-ff` (merge commit `fe975ea`) and pushed (`8477305..fe975ea`) → Netlify auto-deploys. PR #6 auto-closes as merged.
- Pre-push sanity on merged index.html — all green: GTM-KCVV7X9L ×2 (head+noscript), gtagSendEvent present, consent default-denied present, og-image.jpg ×2 in OG meta (valid JPEG), twitter:card summary_large_image, both review links share.google (0 maps?cid), "65 recensioni" ×2 + trust-strip count-up 65, 0 "Ferdinando/Martire", ends </html>.
- Closed PR #7 by deleting its superseded branch `fix/reviews-google-link` (sxsrf reviews link, obsolete) — `git push origin --delete`. GitHub auto-closes #7.
- Native git only (connector has no merge endpoint + mis-targets PRs). Live-site verification (Facebook Sharing Debugger → Scrape Again, WhatsApp re-share, click both review links) is the orchestrator's post-deploy step — no internet from here.

## 2026-06-29 — Revert social image to logo + better share text — Claude Code
- Branch `seo/og-revert-logo` off main → PR #8 (native git for the edits/cleanup; connector used only to OPEN the PR — it has no merge endpoint and mis-targets PR updates, so merge stays native git for Matteo).
- index.html <head>: og:image + twitter:image → `assets/tme-logo-white.webp` (original square logo, verified 1200×1200); og:image:type → image/webp; width/height → 1200/1200; twitter:card → summary; og:description AND twitter:description → "Affidabilità che conta, velocità che sorprende. ★ 5,0 · 65 recensioni su Google. Partenza entro 30 minuti, 24/7." SEO <meta name=description> (services) left unchanged.
- Cleanup: `git rm assets/og-image.jpg` (landscape card, no longer referenced — grep confirmed only PROGRESS history mentions it); deleted the untracked `assets/og-card.jpg` (not committed).
- Verified locally: ends </html>, GTM ×2 intact, 0 og-image.jpg refs in index.html, twitter:card=summary, both descriptions carry the new text, logo asset present. Commit `3e39651`.
- Preview: deploy-preview-8--taximerciexpress.netlify.app. NOT merged — Matteo verifies the preview then merges via git, then Facebook Sharing Debugger → "Scrape Again" + re-share.
