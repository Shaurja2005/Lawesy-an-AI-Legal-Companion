# DESIGN SYSTEM — Wood & Paper

> Read before any UI work, together with the installed UI skills (**taste**, **impeccable**, and any others found in the repo). The skills govern craft quality; this file governs the identity, tokens, and accessibility floor.

---

## 1. Concept

The app is **a calm lawyer's desk**. The background is a warm wooden surface; documents and results are sheets of paper, index cards, file folders, sticky notes, and a wax seal placed on it. It should feel **trustworthy, tactile, and quiet** — like sitting with a patient advisor — never like a costume.

**Two moods**
- **Day Desk (light):** honey-oak desk in daylight, cream paper, dark brown ink.
- **Lamplit Study (dark):** dark walnut desk under a warm lamp, deep aged-parchment sheets, soft cream ink. Not pure black; warm and low-glare.

**Guardrails against kitsch**
- Texture is *felt, not seen*: subtle grain at low opacity; reading surfaces stay clean and flat.
- No torn-paper edges on content, no fake handwriting fonts for body text, no photographic wood images.
- Skeuomorphism appears at the edges (surfaces, shadows, stamps, tabs); content areas prioritize legibility.
- Apply the taste/impeccable skills to avoid generic, templated "AI app" looks (default gradients, oversized rounded cards, emoji-heavy UI, identical card grids).

---

## 2. Layout metaphor

| Region | Metaphor | Component |
|--------|----------|-----------|
| App background | Desk surface | `DeskSurface` |
| Document viewer | Stacked paper sheets with margin clause IDs | `Paper variant="stacked"` |
| Workspace tabs (Plain, Summary, Clauses, Ask, Next Steps) | File-folder divider tabs | `FolderTabs` |
| Summary | Pinned index card | `IndexCard pinned` |
| Tips, inconsistencies | Sticky notes (muted yellow) | `StickyNote` |
| Risk labels | Rubber stamps | `Stamp` |
| Overall verdict | Wax seal | `WaxSeal` |
| Library | Drawer of papers | `Drawer` |
| Chat | Lined notepad | `Paper variant="lined"` |
| Lawyer brief | Typed memo on letterhead | print layout |

Desktop: three columns (library drawer · paper stack · margin tools). Tablet: drawer collapses to an overlay. Mobile: single column; bottom folder-tab bar.

---

## 3. Tokens

Define as CSS custom properties on `:root` (Day Desk) and `.dark` (Lamplit Study); expose via Tailwind theme. **Agent: compute and record actual contrast ratios (§3.4) in F05 and adjust values if any pair fails.**

### 3.1 Color

| Token | Day Desk | Lamplit Study | Use |
|-------|----------|---------------|-----|
| `--desk` | `#B98B5E` | `#1A120C` | App background base |
| `--desk-grain` | `#A67A4F` | `#24190F` | Grain overlay tone |
| `--desk-edge` | `#8C6239` | `#0F0A06` | Header/footer strip |
| `--paper` | `#F8F2E4` | `#2A2119` | Primary sheets |
| `--paper-alt` | `#F1E8D4` | `#332820` | Nested sheets, inputs |
| `--paper-line` | `#D9CBB0` | `#46382C` | Rules, borders |
| `--card` | `#FFFBF2` | `#302519` | Index cards |
| `--sticky` | `#F3E3A2` | `#4A4125` | Sticky notes |
| `--ink` | `#2B2118` | `#EFE5D2` | Body text |
| `--ink-muted` | `#5C4A3A` | `#C2B39C` | Secondary text |
| `--ink-faint` | `#7A6652` | `#9C8C76` | Captions (≥ 4.5:1 required) |
| `--ink-on-desk` | `#FFF8EA` | `#EFE5D2` | Text directly on wood (use sparingly, bold/large) |
| `--accent` (fountain-pen blue) | `#2C4A6E` | `#9DB8DA` | Links, primary actions, focus |
| `--brass` | `#8A6A2F` | `#D8B46A` | Highlights, selected tab edge |
| `--risk-high` (seal red) | `#9B2C2C` | `#E4887C` | High risk |
| `--risk-medium` (amber) | `#8A5A12` | `#E0B060` | Medium risk |
| `--risk-low` (forest) | `#2F5D3A` | `#8DC49A` | Low risk / favorable |
| `--risk-info` | `#4A5568` | `#B5BFCC` | Informational |
| `--highlight` | `#F6E27A66` | `#D8B46A40` | Clause highlight (marker pen) |
| `--focus-ring` | `#2C4A6E` | `#9DB8DA` | 2px ring + 2px offset |

### 3.2 Typography

- **Headings:** a characterful text serif with good legibility (e.g., Fraunces, Newsreader, or Literata — pick per taste skill guidance).
- **Body / document text:** highly legible serif (e.g., Source Serif 4 or Literata), 17–18px base, line-height 1.6, measure 60–75ch.
- **UI labels / controls:** a humanist sans (e.g., IBM Plex Sans or Source Sans 3).
- **Clause IDs, citations, stamps:** monospace or small caps (e.g., IBM Plex Mono), letter-spaced uppercase for stamps.
- **Scripts:** include fonts covering Devanagari and Tamil (e.g., Noto Serif Devanagari / Noto Serif Tamil) for F37.
- Scale (rem): 0.8125 · 0.875 · 1 · 1.125 · 1.375 · 1.75 · 2.25 · 3. Self-host via `next/font`; `font-display: swap`.

### 3.3 Spacing, radius, elevation, motion

- Spacing: 4px base (`4, 8, 12, 16, 24, 32, 48, 64`).
- Radius: paper `2px`, cards `4px`, buttons `6px`, stamps `3px`. Avoid large pill shapes except toggles.
- Elevation (paper on wood): soft, warm shadows.
  - `--shadow-sheet: 0 1px 2px rgb(40 25 10 / .18), 0 6px 16px rgb(40 25 10 / .12)`
  - `--shadow-lifted: 0 2px 4px rgb(40 25 10 / .2), 0 14px 28px rgb(40 25 10 / .18)`
  - Dark mode: deeper shadows plus a faint warm lamp glow (radial gradient) toward the top-center of the desk.
- Motion: 150–250 ms, ease-out. Papers slide/settle in (translateY 6px → 0 + fade); tabs slide like dividers; stamps "press" (scale 1.08 → 1). **All motion disabled under `prefers-reduced-motion` or the app's reduced-motion setting.**

### 3.4 Contrast table (agent fills in during F05)

| Pair | Day ratio | Lamplit ratio | Pass AA? |
|------|-----------|---------------|----------|
| ink / paper | | | |
| ink-muted / paper | | | |
| ink-faint / paper | | | |
| accent / paper | | | |
| risk-high / paper | | | |
| risk-medium / paper | | | |
| risk-low / paper | | | |
| ink-on-desk / desk-edge | | | |
| focus-ring / paper (≥ 3:1) | | | |

---

## 4. Textures

- **Wood grain:** CSS layered `repeating-linear-gradient` + inline SVG `feTurbulence` noise at 4–8% opacity over `--desk`. Horizontal grain direction. Total texture payload < 30 KB.
- **Paper fiber:** very faint noise (2–3% opacity) on `--paper`; none inside long reading areas if it reduces clarity.
- **Lined notepad:** `repeating-linear-gradient` using `--paper-line`, aligned to body line-height; red margin line at 10% opacity.
- High-contrast mode removes textures and shadows, strengthens borders to 1.5px `--ink-muted`.

---

## 5. Components (visual specs)

| Component | Spec |
|-----------|------|
| `Paper` | `--paper` bg, `--shadow-sheet`, 2px radius; variants: `flat`, `stacked` (two offset sheets behind at 3px/6px), `pinned` (small brass pin at top), `lined` |
| `Button` primary ("ink") | `--accent` bg, paper-colored text, subtle inset bottom border; hover darkens 6%; active presses 1px |
| `Button` secondary | transparent, 1px `--ink-muted` border, ink text |
| `Button` danger ("seal") | `--risk-high` bg |
| `FolderTabs` | tabs look like manila divider tabs with angled edges; selected tab joins the sheet below and gains a `--brass` top edge; full Radix Tabs keyboard support |
| `Stamp` | uppercase mono label + icon (e.g., `ShieldAlert` high, `AlertTriangle` medium, `CheckCircle` low, `Info` info), 1.5px border in risk color, slight -2° rotation (0° under reduced motion); text always present |
| `WaxSeal` | circular seal in risk color with icon + short verdict text next to it (not inside only) |
| `IndexCard` | `--card`, top rule in `--risk-high` at 30% (classic index card), `--shadow-sheet` |
| `StickyNote` | `--sticky`, tiny tape strip at top, slight shadow; used for tips and "worth a second look" |
| `Disclaimer` | small caps footnote style at the bottom of every AI output panel |
| `Skeleton` | paper-colored blocks with a slow shimmer (static under reduced motion) |
| Citation chip | mono `S3.2` in `--accent`, underline on hover, navigates + highlights clause with `--highlight` |
| Empty states | a single illustrative line drawing (SVG, ink-colored) + one clear action |

---

## 6. Accessibility floor (non-negotiable)

- WCAG 2.2 AA contrast for all text; 3:1 for UI boundaries and focus indicators.
- Visible focus ring on every interactive element (`--focus-ring`, 2px, offset 2px) in both themes.
- Never color-only meaning: risk = icon + word + color.
- Hit targets ≥ 24×24px (prefer 44×44 on touch).
- Text resizes to 200% without loss; layout works at 320px width.
- Theme choice, text size, reduced motion, and high contrast are all user-controllable.
- Rotated/decorative elements are `aria-hidden`; stamps expose text to screen readers.

---

## 7. Theme QA checklist (per UI feature)

- [ ] Looks intentional in Day Desk and Lamplit Study
- [ ] Contrast verified for any new color usage
- [ ] Focus visible on all controls in both themes
- [ ] Reduced motion honored
- [ ] Mobile (360px) and desktop (1440px) checked
- [ ] High-contrast mode checked
- [ ] Taste/impeccable skill checks applied (record any conflict in the Decision Log)
