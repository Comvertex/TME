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
