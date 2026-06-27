# TME redesign — design direction & polish bar

> Sets the **aesthetic target**, the **quality bar**, and the **order of work** for the redesign. Read alongside `design-system.md` (tokens) and `content-brief.md` (copy/positioning). The first pass was structurally right but visually thin — this doc exists to fix that.

## Order of work (do NOT skip)
**Design system FIRST, page SECOND.** Build and *document* a real system, get it signed off, then compose the page from it.
1. **Design language + core components, polished to the reference bar, one at a time** — type rules, colour roles, then `Button` (get this *right* — it's the most-used atom; all variants + states + sizes), then Card, Chip, Nav, Footer. The logo goes in (see below).
2. **Present the Design System page for review** — type scale with usage labels, colour palette with role names, the button in all states. Gate: Matteo approves the *system* before any page composition.
3. **Then compose the page** section by section from the approved components.

A page can only be as polished as its components. The previous attempt composed a full page on top of unpolished atoms — hence the lackluster feel.

## Baseline to evolve (inspect this first)
**The live site — https://www.taximerciexpress.it/ — is the current design we are *evolving*, not replacing.** Inspect it for what to **preserve**: the brand colours as rendered, the hero **video**, the good CTA buttons, the exact Italian copy, the logo, the NAP, and the page/URL structure (SEO). Then lift the *structure, proportion and motion* toward the reference sites below. Same brand + content, higher craft. (Live reflects the shipped PR #2/#4 — fonts, icons and SEO are already the good versions.)

## Reference targets (study these directly) — STRUCTURE/PROPORTION/MOTION, not colour
- **https://exposystemsrl.com/** — dark/premium, huge negative space, animated `0+` count-up stats, uppercase letter-spaced eyebrow labels ("CHI SIAMO"), pill buttons, calm and minimal. (Same industry — even has an "OBC" nav item.)
- **https://dagoexpress.com/it/** — dark, single bold accent (red), big bold H1 ("Ordina oggi, consegna oggi"), **concrete proof in the subline** (99,5% puntualità, 38 paesi), pill CTA with a circular-arrow affordance, a **top trust bar** with ISO + **"Recensioni Google 5,0 ★★★★★"** + phone, fleet imagery cutout.

### Extracted DNA to hit — STRUCTURE/PROPORTION/MOTION ONLY, not colour
Take their **layout craft, not their palette**: generous whitespace + strong vertical rhythm · big bold sans headlines · confident section proportions · **pill buttons** (consider a circular-arrow affordance) · uppercase letter-spaced eyebrow labels · concrete proof-stats (TME: *partenza 30 min · 24/7/365 · ★5,0 · 63 recensioni*) · a **top trust bar** surfacing Google 5.0 + phone · tasteful entrance/scroll **animations** + count-up counters · vehicle/plane imagery used with confidence.
**Both references are dark — TME is NOT. Do not copy their darkness.** TME keeps its light theme + blue/orange identity; the refs inform feel and structure only.

## Theme (DECIDED — do not change)
**Keep TME's existing LIGHT theme and blue/orange identity.** `--primary #1a4b84` (deep blue), `--accent #f39c12` (orange), white/light surfaces, dark-slate text — exactly per `design-system.md`. Light sections, blue hero (with the video), orange CTAs. **Do not go dark.** The references are inspiration for *structure, proportion, whitespace, component patterns and animation only — never palette/theme.* All the uplift comes from craft (spacing rhythm, type hierarchy, polished components, motion), not from changing colours.

## Logo (a plain miss last time — fix it)
Use the actual TME mark from `assets/`, not a text string:
- `tme-logo-white.webp` on dark grounds (nav, footer), `tme-logo-blue.webp` on light.
- The **plane motif** (`plane-logo.webp`) for OBC/air-courier cues — used with intent, not buried.

## Quality bar (what "done" means per component)
- **Button:** proper padding, weight, and a real hover/active/disabled treatment; primary (orange), secondary, outline; sizes; optional leading/trailing icon. It should look deliberate, not default.
- **Type:** a documented scale with usage (H1/H2/H3/eyebrow/body/label), real line-heights, letter-spacing on eyebrows/labels.
- **Colour:** documented *roles* (ground / surface / text / accent / accent-hover / on-accent), not just hex values.
- **Components bound to the token variables** (already the rule) so edits propagate across surfaces.

## Working discipline (avoid token burn — important)
The build has thrashed twice. Per pass:
- **One component (or one section) at a time. Stop and present after each.** No multi-component marathons.
- **Place brand assets AS-IS** — never crop, recolour, re-process, or repeatedly re-upload the logo/plane. They're finished files. (The logo crop/re-upload loop wasted a whole session.)
- **Verify ONCE per component** with a single screenshot at the end — not after every micro-edit. `use_figma` is transactional (a late error rolls back the whole call), so build each component in as few calls as possible.
- **Reuse, don't reinvent.** If a good version already exists (e.g. the hero button), copy its geometry — don't build a new worse one.

## Button (CANONICAL — copy the hero button, do not reinvent)
The hero CTAs are the reference and are *correct*. The Design-System button must match them:
- **Shape:** slightly-rounded rectangle (≈ `--radius-md` 8px) — **NOT a full pill.** Match the hero corner radius exactly.
- **Padding:** generous (≈ 14px vertical / 28px horizontal); label never touches the edge.
- **Styles:** Primary = solid **orange** fill, white label; Secondary = solid **blue**; Outline = blue border on light grounds / white border on dark grounds. Label weight 600.
- **States:** default / hover / active / disabled, bound to tokens.
- **Icon (optional):** if a trailing arrow is used, give it a **real gap (≥ 8px)** from the label — no crammed circular-arrow badge touching the text. Default primary CTA needs **no** arrow (match the hero).
- The small **promise pills** (Partenza entro 30 minuti, 24/7/365, …) are a *separate* Chip component (fully-rounded, thin border, small) — those were good; keep them.

## Logo handling (place as-is — it's a finished asset)
- Use `assets/tme-logo-blue.webp` on **light** grounds, `assets/tme-logo-white.webp` on **dark/blue** grounds. **Check it's not reversed** (last pass had it backwards).
- The mark's **"T" carries a high-contrast outline by design** — it stays legible even same-on-same. Do **not** try to "fix" contrast, recolour, or crop the asset. Place the correct file, scale to fit, done.
- Plane motif: `assets/plane-logo.webp`, placed as-is for OBC/air cues.

## Unchanged guardrails
Single page · dual-register positioning (everyday + premium) · **no client names** · no prices · no unheld certs · reviews stay zero-third-party (static curated) · NAP exact (+39 351 376 8842) · keep the hero **video** (poster + scrim in Figma, compressed in code).
