# TME Design System — extracted from the current site

> **Phase A deliverable.** This is a faithful extraction of the design system *as it exists in the shipped code today* (`index.html`, `dist/style.css` @ 1210 lines, `dist/script.js`), plus a proposed normalized token set for the redesign. Every "current" value below is taken directly from the code — nothing invented.
>
> Status: **for review.** Figma not started yet. Once Matteo signs off on this foundation, it becomes the basis for the Figma library (Phase B).
>
> Two columns of intent throughout:
> - **Current** = what the code actually does today (may be inconsistent — that's the point of documenting it).
> - **Proposed** = a cleaned, systematized version for the redesign. Clearly marked. Not yet applied.

---

## 1. Brand foundation

TME's identity is a **two-colour system: deep blue (trust) + warm orange (energy/CTA)**, carried by the logo (blue "TM" + orange cargo bars) and reinforced by the OBC plane motif in the asset library. The blue anchors structure (header, footers, slogans); orange drives every action (nav bar, CTAs, accents, the "Servizio Principale" tag).

The current palette is defined as 6 CSS custom properties; the rest of the colour usage is **hardcoded literals scattered through the file** (the main cleanup target).

---

## 2. Colour tokens

### 2.1 Current — defined tokens (`:root`)

| Token | Value | Role in code |
|---|---|---|
| `--primary` | `#1a4b84` | Deep blue. Top header, nav hover, footer, slogan bg, consent banner, all headings (`h2`, `h3`), hero text. |
| `--secondary` | `#e8f1f8` | Light blue. Coverage-section bg, `nav a:hover` bg. |
| `--accent` | `#f39c12` | Warm orange. Nav bar bg, CTA buttons, icons, link colour, checkmarks, primary-service tag, caret. |
| `--text` | `#2c3e50` | Dark slate. Body copy. |
| `--light` | `#ffffff` | White. Text on dark, card bg, section bg. |
| `--gray` | `#ecf0f1` | Light gray. Services-section bg. |

### 2.2 Current — hardcoded colours (NOT tokenised — debt)

| Literal | Where | Note |
|---|---|---|
| `#e67e22` | `.cta-button:hover` | Darker orange — should be a derived `--accent-hover` token. |
| `#25d366` | `.whatsapp-float` bg | WhatsApp brand green. Legitimately external-brand; keep as `--whatsapp`. |
| `#FFF` / `#999` | `.whatsapp-float` text/shadow | Inconsistent casing vs `--light`. |
| `rgba(255,255,255,0.75)` | `.hero-content` bg | Hero text panel scrim (desktop). |
| `rgba(255,255,255,0.85)` | `.hero-content` bg | Same panel, mobile (≤375 / ≤500). |
| `rgba(255,255,255,0.2)` | `.hero-section::before` | Light wash over the hero video. |
| `rgba(0,0,0,0.1)` | `.feature` shadow | Card elevation. |
| `rgba(0,0,0,0.2)` | consent banner / accept-btn shadows | |
| `transparent` | `blink-caret` | Typewriter caret off-state. |

### 2.3 Proposed — normalized colour token set

Keep the existing six as the brand core, add the missing semantic + state tokens so nothing is hardcoded:

```css
:root {
  /* Brand */
  --color-primary:        #1a4b84;  /* deep blue */
  --color-primary-light:  #2a5f9e;  /* PROPOSED — replaces invalid lighten(--primary,10%) */
  --color-secondary:      #e8f1f8;  /* light blue (tints/surfaces) */
  --color-accent:         #f39c12;  /* warm orange */
  --color-accent-hover:   #e67e22;  /* existing literal, now named */

  /* Neutrals */
  --color-text:           #2c3e50;  /* slate body */
  --color-surface:        #ffffff;  /* cards / light sections */
  --color-surface-alt:    #ecf0f1;  /* gray section bg */

  /* External brand */
  --color-whatsapp:       #25d366;

  /* Alpha / overlays */
  --scrim-hero:           rgba(255,255,255,0.75);
  --scrim-hero-mobile:    rgba(255,255,255,0.85);
  --wash-hero:            rgba(255,255,255,0.2);
}
```
> `--color-primary-light` / accent-hover are the **direct fix** for the broken `lighten()/darken()` calls (see §11). Values proposed for review.

---

## 3. Typography

**Family:** Montserrat (self-hosted, weights 400/600/700, `font-display: swap`). Applied globally via `* { font-family: 'Montserrat', sans-serif; }`.
**Base line-height:** `1.6` (body).
**Weights in use:** 400 (body, availability), 600 (nav links, CTA, tags, some headings), 700 (phone number, headings via h-tags default), plus `font-weight: bold` literals (checkmarks, accept button).

### 3.1 Current type scale (as coded — note the responsive sprawl)

| Element | Desktop | Tablet/≤768 | ≤500 / ≤375 |
|---|---|---|---|
| Hero `h1` | `2.5rem` | `2rem` → `1.8rem` | `6vw` / `1.2rem` |
| Phone number | `2rem` | `1.2rem` | `0.9rem` (scrolled) |
| Availability | `1rem` | `0.8rem` | — |
| Section `h2` (services/coverage) | `2rem` → `2.2rem` | `1.75rem` | — |
| Feature `h3` | `1.25rem` → `1.5rem` | — | — |
| Footer `h3` | `1.8rem` | `1.5rem` | — |
| Coverage `h3` (base/areas) | `1.5rem` | `1.25rem` | — |
| Areas list item | `1.2rem` | `1.1rem` | — |
| Contact link | `1.2rem` | `1.1rem` | — |
| Primary-service tag | `0.8rem` → `0.9rem` | — | — |
| Delivery time | `clamp(0.5rem, 3vw, 1rem)` | — | — |
| Slogan | `1.2rem` | — | — |
| Typewriter | inherits | — | `0.8rem` / `4vw` |

Issues: ad-hoc per-element sizing, mixed units (`rem`/`vw`/`clamp`), no shared scale. Several sizes (`1.1`, `1.2`, `1.25`, `1.5`, `1.75`, `1.8`, `2`, `2.2`, `2.5`) are close-but-not-equal.

### 3.2 Proposed type scale (modular, 1.250 major-third, 16px base)

| Token | Size | Use |
|---|---|---|
| `--text-xs` | 0.8rem | tags, fine print |
| `--text-sm` | 0.9rem | availability, captions |
| `--text-base` | 1rem | body |
| `--text-md` | 1.125rem | list items, contact links |
| `--text-lg` | 1.5rem | sub-headings (h3) |
| `--text-xl` | 1.875rem | section headings (h2) |
| `--text-2xl` | 2.5rem | hero (h1) |
| `--leading-tight` | 1.2 | headings |
| `--leading-body` | 1.6 | body |

Use `clamp()` for the hero only; everything else steps at breakpoints off the shared scale.

---

## 4. Spacing

**Current:** rem values used (ascending): `0.2, 0.3, 0.4, 0.5, 0.75, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4, 6`. No system — values picked per-rule. Common patterns: `1rem 2rem` (header/nav padding), `2rem` (section padding), `1.5rem`/`2rem` (card padding), `2rem` grid gap.

**Proposed 4px/0.25rem base scale:**

| Token | rem | px |
|---|---|---|
| `--space-1` | 0.25 | 4 |
| `--space-2` | 0.5 | 8 |
| `--space-3` | 0.75 | 12 |
| `--space-4` | 1 | 16 |
| `--space-6` | 1.5 | 24 |
| `--space-8` | 2 | 32 |
| `--space-10` | 2.5 | 40 |
| `--space-12` | 3 | 48 |
| `--space-16` | 4 | 64 |

Map odd values (`0.2`, `0.3`, `0.4`, `0.8`, `6`) to nearest token during the redesign.

---

## 5. Radii

| Current value | Where | Proposed token |
|---|---|---|
| `4px` | CTA button, nav-a hover, primary-service tag | `--radius-sm: 4px` |
| `5px` | consent buttons | → consolidate to `--radius-sm` (4px) |
| `8px` | hero-content panel, feature cards | `--radius-md: 8px` |
| `50px` / `50%` | whatsapp float (pill/circle) | `--radius-full: 9999px` |

---

## 6. Elevation / shadows

| Current | Where | Proposed token |
|---|---|---|
| `0 2px 15px rgba(0,0,0,0.1)` | feature cards | `--shadow-card` |
| `0 2px 5px rgba(0,0,0,0.2)` | accept button | `--shadow-sm` |
| `0 -2px 10px rgba(0,0,0,0.2)` | consent banner (upward) | `--shadow-top` |
| `2px 2px 3px #999` | whatsapp float | → normalize to `--shadow-float: 0 2px 8px rgba(0,0,0,0.25)` |

---

## 7. Z-index layers (currently ad-hoc — needs a scale)

Current values seen: `0` (video), `1` (hero content & mask), `900` (cta), `999`, `1000`, `1001` (nav / header / top-header / banner / whatsapp). Inflated and overlapping.

**Proposed scale:** `--z-base: 0`, `--z-content: 10`, `--z-overlay: 100`, `--z-header: 1000`, `--z-floating: 1100`, `--z-banner: 1200`.

---

## 8. Motion

**Transitions:** `0.3s ease` is the de-facto standard (colour, transform, background). Propose `--ease: 0.3s ease` token.

**Keyframe animations present:** `videoFadeIn` (5s), `fadeIn` (**defined 5× with conflicting bodies — debt**), `fadeSlideIn` (logo, 1s), `slideIn` (logo, 1s), `typing` (typewriter, 1s steps), `blink-caret` (0.75s). Entrance animations are staggered with hardcoded delays (`0.5s`, `1s`, `2s`).

Recommendation: collapse the duplicate `fadeIn` definitions to one; consider `prefers-reduced-motion` for the typewriter/entrance set.

---

## 9. Breakpoints (currently 7, inconsistent)

Current: `375`, `480`, `500`, `767`, `768`, `1023`, `1024` — with both `max-width:767` and `max-width:768` in use, and `min-width:1024` blocks repeated 4×.

**Proposed 4-tier:**

| Token | Range |
|---|---|
| `--bp-sm` | ≤480 (mobile) |
| `--bp-md` | 481–768 (large mobile / small tablet) |
| `--bp-lg` | 769–1024 (tablet) |
| `--bp-xl` | ≥1025 (desktop) |

---

## 10. Component inventory

| # | Component | Selector(s) | Variants / states | Notes |
|---|---|---|---|---|
| 1 | **Two-tier header** | `.header` → `.top-header` (blue, phone) + `.main-nav` (orange, links) | `.scrolled` hides the nav row (`translateY(-100%)`) | Fixed; JS toggles `.scrolled` past 50px. |
| 2 | **Phone block** | `.phone-number` (icon + `.number` + `.availability`) | hover → number turns orange; mobile stacks column | Inline SVG phone icon. |
| 3 | **Hero** | `.hero-section` (video bg + `::before` wash) → `.hero-content` panel | mobile shows video (conflicting rule — see §11) | Logo, `h1`, 2-line typewriter, delivery-time, CTA pair. |
| 4 | **CTA button** | `.cta-button` | hover (`#e67e22`); `.cta-buttons` wrapper stacks on mobile | Orange, primary action. Used 6×. |
| 5 | **Service card** | `.feature` | `.primary-service` (orange left-border + "Servizio Principale" tag), `.feature.highlight` (**class present but no distinct CSS** — debt) | 3-col → 2-col → 1-col grid. |
| 6 | **Services section** | `.services-section` + `.service-features` grid | responsive column counts | Gray bg. |
| 7 | **Coverage block** | `.coverage-section` → `.base` + `.areas` | — | Light-blue bg, centered. |
| 8 | **Footer** | `footer#contatti` → `.contact-info` → `.contact-link` (icon + text) | hover → orange | Blue bg; tel + 2 mailto, each with inline SVG. |
| 9 | **Consent banner** | `.consent-banner` + `#accept-btn` / `#refuse-btn` | hover (**broken — `darken()`/`lighten()`**, see §11) | Fixed bottom; JS-driven show/hide via `localStorage`. |
| 10 | **WhatsApp float** | `.whatsapp-float` | position adjusts up when banner visible (JS) | Green pill, fixed bottom-right. |
| 11 | **Icons** | inline `<svg class="icon">` | phone, envelope, whatsapp | Replaced Font Awesome (PR #2). Sized via inline `<style>` in `<head>` + `.icon` rules. |

**Dead CSS (selectors styled but absent from `index.html`):** `.contact-banner`, `.slogan`, `.logo` / `.logo-image` (logo animations), `nav` top-level (the markup uses `.main-nav`). Flag for removal in redesign.

---

## 11. Known debt to resolve in the redesign

1. **Invalid SASS in plain CSS** — `darken(var(--accent),10%)` (line 1177) and `lighten(var(--primary),10%)` (line 1188) are SASS functions in a plain stylesheet → silently ignored → **consent-button hovers do nothing.** Fix with the proposed `--color-accent-hover` / `--color-primary-light` tokens.
2. **Duplicate / conflicting rules** — `@keyframes fadeIn` defined 5×; `.feature` block defined 3×; `footer` twice; `.service-features` and `min-width:1024` media blocks repeated. Consolidate.
3. **Conflicting hero video on mobile** — `≤768` sets `.hero-section video { display:none }` (line 285) then a later `≤768` block sets `display:block` (line 521). Net effect: video plays on mobile (data/battery cost). **Decide intentionally** (Matteo's open question — keep vs poster image).
4. **Breakpoint sprawl** — 7 inconsistent breakpoints; both 767 and 768 used. Collapse to the 4-tier scale (§9).
5. **Mixed units** — `rem`, `vw`, `vh`, `%`, `px`, `clamp` interchanged for the same kinds of properties. Standardize.
6. **Z-index inflation** — no scale (§7).
7. **Hardcoded colours** — move all literals (§2.2) into tokens.
8. **`.feature.highlight`** carries semantic weight with no visual treatment — design an actual "advantages" variant.
9. **Icon sizing split** between an inline `<head>` `<style>` and the external stylesheet — unify.

---

## 12. What this enables (next: Phase B)

Once approved, the **Proposed** columns become the Figma library's variables/styles: a 9-colour token set, an 8-step type scale, a 9-step spacing scale, 3 radii, 4 elevations, a z-index scale, and the 11 components above rebuilt cleanly — using the orange/blue identity and the OBC plane motif from the asset range. **No Figma work has started; awaiting review of this foundation.**
