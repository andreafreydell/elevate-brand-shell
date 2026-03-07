# GEA Design System + Piece Profile — Implementation Spec v2.0

> **For:** Lovable / AI builder
> **Stack:** React + Tailwind CSS + shadcn/ui
> **Aesthetic:** Warm Editorial Craft Modernism with Soft Brutalist Structure
> **Brand:** GEA — curated jewelry rental platform (access model, not purchase)

---

## 1. Design Tokens

### 1.1 Color Hierarchy

Three tiers of brown, not one. This is the most important thing to get right.

```
--background   92%  ░░░░░░░░░░░░░░░░░░░░░░  cream
--bar          88%  ░░░░░░░░░░░░░░░░░░░░    light taupe
--card         85%  ░░░░░░░░░░░░░░░░░░░     sand
--secondary    80%  ░░░░░░░░░░░░░░░░        taupe
--border       62%  ░░░░░░░░░░░░            warm mid-tone
--foreground   36%  ░░░░░░░                 CHOCOLATE — buttons, UI, section headings
--hero         34%  ░░░░░░░                 CHOCOLATE — hero panel backgrounds
--bar-text     30%  ░░░░░░                  brown on bars
--ink          22%  ░░░░░                   DARKEST — body text only
--dark-bar     22%  ░░░░░                   footer bg
```

`--foreground` is CHOCOLATE BROWN, not black. `--ink` is the darkest value, used ONLY for body text and card titles. `--hero` is for panel backgrounds (the big chocolate blocks).

### 1.2 CSS Custom Properties — Light Mode

```css
:root {
  --background: hsl(38, 28%, 92%);
  --foreground: hsl(30, 16%, 36%);
  --ink: hsl(30, 12%, 22%);
  --card: hsl(34, 18%, 85%);
  --secondary: hsl(33, 14%, 80%);
  --muted: hsl(34, 12%, 83%);
  --muted-foreground: hsl(30, 8%, 46%);
  --accent: hsl(32, 15%, 78%);
  --accent-highlight: hsl(30, 20%, 70%);
  --hero: hsl(30, 14%, 34%);
  --hero-text: hsl(36, 28%, 90%);
  --border: hsl(32, 12%, 62%);
  --bar: hsl(35, 14%, 88%);
  --bar-text: hsl(30, 12%, 30%);
  --dark-bar: hsl(30, 12%, 22%);
  --dark-bar-text: hsl(36, 22%, 88%);
  --destructive: hsl(0, 55%, 48%);

  --seafoam: #BFD6CF;
  --dusty-teal: #6E8F8B;
  --blush-peach: #E7B9A8;
  --sky: #BFD3E6;
  --brass: #B79B63;
  --tag-red: #C54A3D;

  --font-serif: 'Playfair Display', Georgia, serif;
  --font-sans: 'Inter', -apple-system, sans-serif;
}
```

### 1.3 CSS Custom Properties — Dark Mode

```css
.dark {
  --background: hsl(30, 8%, 7%);
  --foreground: hsl(34, 18%, 65%);
  --ink: hsl(34, 22%, 90%);
  --card: hsl(30, 8%, 12%);
  --secondary: hsl(30, 6%, 16%);
  --muted: hsl(30, 6%, 14%);
  --muted-foreground: hsl(30, 8%, 52%);
  --accent: hsl(30, 10%, 20%);
  --accent-highlight: hsl(30, 14%, 24%);
  --hero: hsl(30, 10%, 22%);
  --hero-text: hsl(34, 18%, 78%);
  --border: hsl(30, 8%, 24%);
  --bar: hsl(30, 6%, 10%);
  --bar-text: hsl(34, 14%, 65%);
  --dark-bar: hsl(30, 8%, 5%);
  --dark-bar-text: hsl(34, 12%, 68%);
}
```

### 1.4 Hard Rules

- NEVER use `#000`, `#FFF`, `bg-white`, `bg-black`, or any pure value.
- NEVER use `rounded-lg` or any border radius. All corners `rounded-none`.
- NEVER use box-shadow as a primary separator. Borders are the structural element.
- ALWAYS use `--foreground` (chocolate) for buttons, UI borders, section headings.
- ALWAYS use `--ink` (dark brown) for body text and card titles.
- ALWAYS use `--hero` (chocolate) for large panel backgrounds.
- ALWAYS use `--hero-text` (bright cream) for text on any chocolate fill — buttons, selection, hero panels. Never use `--background` (page cream) on chocolate; it's too dull.

---

## 2. Typography

| Role | Font | Weight | Tracking | Line Height | Size | Color | Transform |
|------|------|--------|----------|-------------|------|-------|-----------|
| H1 | Playfair Display | 500 | -0.01em | 1.08 | clamp(2.5rem, 5vw, 4.5rem) | `--ink` | none |
| H2 | Playfair Display | 500 | 0.06em | 1.15 | clamp(1.25rem, 2.5vw, 1.875rem) | `--foreground` | uppercase |
| H3 | Playfair Display | 600 | 0.02em | 1.25 | 1.15rem | `--ink` | none |
| Body | Inter | 400 | 0.01em | 1.6 | 14px | `--ink` | none |
| Label | Inter | 500 | 0.25em | — | 10px | `--muted-foreground` | uppercase |
| CTA | Inter | 500 | 0.2em | — | 11px | varies | uppercase |

---

## 3. Layout

| Property | Value |
|----------|-------|
| Max width | `1440px` |
| Container padding | `3rem` (48px) |
| Section spacing | `py-12 md:py-20` |
| Border radius | `0` everywhere |
| Borders | Visible `border-[--border]` on all containers |
| Grid-2 split | `gap-px bg-[--border] border border-[--border]`, children `bg-[--background] p-8` |

---

## 4. Components

### 4.1 Buttons

```
Primary:   bg-[--foreground] text-[--hero-text] border border-[--foreground] rounded-none
           py-3 px-8 font-sans text-[11px] tracking-[0.2em] uppercase
           hover → bg-transparent text-[--foreground]

Outline:   bg-transparent text-[--foreground] border border-[--foreground] rounded-none
           hover → bg-[--foreground] text-[--hero-text]
```

### 4.2 Hero Panel

```
Center:    bg-[--hero] text-[--hero-text]
Label:     font-sans text-[10px] tracking-[0.25em] uppercase opacity-75
Headline:  font-serif font-medium tracking-tight leading-[1.08]
CTA:       border border-[--hero-text] bg-transparent text-[--hero-text] rounded-none
```

### 4.3 Tags

```
Base:  inline-flex px-5 py-2 rounded-none border font-sans text-[10px] font-medium tracking-[0.2em] uppercase

seafoam:  bg-[--seafoam] text-[#2A4A42] border-[#8FB8AD]
sky:      bg-[--sky] text-[#2A4A62] border-[#8FB3CC]
blush:    bg-[--blush-peach] text-[#5A3A2E] border-[#C89A8A]
brass:    bg-[--brass] text-white border-[#9A8250]
red:      bg-[--tag-red] text-white border-[#A03D32]
muted:    bg-[--card] text-[--muted-foreground] border-[--border]
```

OUTFIT_STYLE mapping: Coastal/Playful/Summer → seafoam. Classic/Quiet/Timeless → brass. Statement/Editorial/Layered → blush. Modern/Polished/Professional → sky. Urban → muted.

### 4.4 Cards, Links, Accordion, Tables, Code

```
Card:      bg-[--card] border border-[--border] rounded-none p-8
CTA link:  text-[--foreground] border-b border-[--foreground] text-[11px] tracking-[0.25em] uppercase hover:opacity-70
Explore:   text-[--dusty-teal] text-[11px] tracking-[0.15em] uppercase, arrow hover:translate-x-[3px]
Accordion: border border-[--border] rounded-none, header hover:bg-[--card], chevron rotate-180 on open
Table th:  bg-[--card] text-[10px] tracking-[0.2em] uppercase text-[--muted-foreground]
Code:      bg-[--card] border border-[--border] rounded-none font-mono text-xs text-[--foreground]
```

---

## 5. Illustration System

Informative inline SVG infographics that visualize platform concepts. NOT decorative — each graphic communicates data, process, or structure.

### 5.1 Illustration Rules

| Rule | Value |
|------|-------|
| Palette | Design system colors only. No new hues. |
| Gradients | Soft, 2–3 stops max. Always muted. |
| Shapes | Geometric primitives: arches, rectangles, circles, ellipses. |
| Lines | Thin (0.5–1.5px), low opacity (0.05–0.2). Suggest structure. |
| Opacity | 0.2–0.7. Nothing solid or heavy. |
| Content | Infographic, not decorative. Visualize data, process, or structure. |
| Tag Red stamp | 16×16px, rx:3, positioned at (352, 260) in every illustration. |
| ViewBox | `0 0 400 300` — standard canvas for all. |
| Aspect ratio | 4:3 |

### 5.2 Infographic Categories

**Process** — The access cycle, care ritual, membership flow. Sequential step circles/boxes with connecting lines and arrows. Use pastel fills (seafoam, sky, blush, brass) at 0.25–0.35 opacity per step. Label each step with Inter 7px uppercase.

**Comparison** — Own vs. Access, cost over time. Side-by-side bar charts or split compositions. "Own" bars use blush-peach at 0.3 opacity. "Access" bars use seafoam/sky at 0.4 opacity. Price labels in Inter 9px.

**Structure** — Stacking logic, jewelry anatomy, layering guides. Neck/wrist silhouettes as thin stroke paths (0.06 opacity). Jewelry layers as colored ellipses/lines. Label lines connecting to Inter 6.5px uppercase annotations.

**Data** — Material composition (donut charts with brass/seafoam/sky fills), sizing diagrams (wrist outlines with dimension lines), weight charts. Legend items as small color squares + Inter 7px labels.

### 5.3 Required Infographics (6)

Each is an inline `<svg viewBox="0 0 400 300">` with a soft linear-gradient background and the Tag Red stamp at bottom-right.

1. **Access Cycle** (Process) — 4 circles in a row (seafoam→sky→blush→brass at 0.35), connected by lines, with a dashed return arc below. Labels: CHOOSE, RECEIVE, WEAR, REFRESH. Subtitle: RETURN & REPEAT in dusty-teal.

2. **Stacking Logic** (Structure) — Neck silhouette (stroke 0.06), 3 necklace ellipses at different drops (brass choker, seafoam mid, blush long), pendant circle on middle layer. Label lines pointing to: CHOKER BASE, PENDANT FOCAL, LONG LAYER.

3. **Own vs. Access** (Comparison) — Baseline at y=240. Tall single bar (blush 0.3) labeled OWN / $485 / 1 PIECE. Three shorter bars (seafoam/sky 0.4) labeled ACCESS / $69/mo / 3+ PIECES.

4. **Material Composition** (Data) — Donut chart: 3 segments (brass=base steel, seafoam=plating, sky=stone). Center text: MATERIAL BREAKDOWN. Right-side legend with color squares.

5. **Care Ritual** (Process) — 4 square boxes (seafoam→sky→blush→brass at 0.25), each with a simple icon inside. Connecting arrows between. Labels: CLEAN, INSPECT, SANITIZE, SEAL.

6. **Size & Fit** (Data) — Wrist ellipse outline (stroke 0.05). Bracelet band ellipse (brass 0.3 stroke-width 6). Bead circles along the band (seafoam/white/sky alternating). Dimension line below: "6.5–7.5 STRETCH". Callout line to "8mm BEADS".

---

## 6. Interactions & Motion

Global easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — soft deceleration. No bounce, no elastic, no overshoot.

| Interaction | Behavior | Values |
|---|---|---|
| Scroll reveal | Fade up + translate | `opacity 0→1, translateY 12→0px, 0.5s` |
| Card hover | Tiny lift + border darken | `translateY(-3px), border-opacity 0.08→0.20, 0.35s` |
| Button hover | Lift + soft shadow | `translateY(-1px), box-shadow 0 4px 16px rgba(0,0,0,0.08)` |
| Arrow nudge | Translate right on hover | `translateX(3px), 0.25s` |
| Image gallery swipe | Momentum slide, snap to center | `scroll-snap-type: x mandatory, ease-out 0.4s` |
| Gallery thumbnail | Border highlight on active | `border: 2px solid var(--foreground)` |
| Accordion expand | Height auto + chevron rotate | `0.3s ease, chevron rotate(180deg)` |
| Size selector | Scale pop on select | `scale(1.05), 0.15s` |
| Add to selection CTA | Fill sweep left-to-right | `background-position 0→100%, 0.35s` |
| Trust icon | Subtle pulse on scroll-in | `scale 1→1.08→1, 0.5s, runs once` |
| Cross-sell card | Parallax micro-shift on scroll | `translateY(±8px), 0.01 scroll rate` |
| Page transitions | None or barely perceptible | — |

**Philosophy:** Transitions are slow enough to notice, fast enough to never wait. The only motion that loops is the trust-icon pulse, and even that runs once on scroll-in, not continuously. Everything else feels like turning a page in a fashion editorial.

---

## 7. Graphic Language (Icons)

All icons: stroke-only, `currentColor`, `1.2px` stroke-width, `32×32` viewBox, `stroke-linecap="round"`. Never fill. They inherit container text color.

### 7.1 Navigation & UI Icons

```svg
Tag:     <rect x="5" y="7" width="22" height="18" rx="0"/><line x1="5" y1="12" x2="27" y2="12"/><rect x="8" y="15" width="6" height="4" rx="0"/>
Explore: <line x1="8" y1="16" x2="24" y2="16"/><polyline points="18,10 24,16 18,22"/>
Expand:  <line x1="16" y1="6" x2="16" y2="26"/><line x1="6" y1="16" x2="26" y2="16"/>
Image:   <rect x="5" y="7" width="22" height="18" rx="0"/><polyline points="5,21 12,14 17,19 22,13 27,18"/>
Add:     <circle cx="16" cy="16" r="10"/><line x1="16" y1="11" x2="16" y2="21"/><line x1="11" y1="16" x2="21" y2="16"/>
Divider: <line x1="6" y1="16" x2="26" y2="16"/>
```

### 7.2 Platform Concept Icons

```svg
Member:   <circle cx="16" cy="12" r="5"/><path d="M8 28 Q8 20 16 20 Q24 20 24 28"/>
Access:   <path d="M6 22 L16 8 L26 22"/><line x1="11" y1="22" x2="21" y2="22"/>
Ship:     <rect x="7" y="10" width="18" height="14" rx="0"/><path d="M7 10 L16 4 L25 10"/>
Verified: <polyline points="22,12 14,20 10,16"/><circle cx="16" cy="16" r="11"/>
Review:   <path d="M16 6 L19 12 L26 13 L21 18 L22 25 L16 22 L10 25 L11 18 L6 13 L13 12Z"/>
Refresh:  <path d="M16 6 C10 6 6 10 6 16 C6 22 10 26 16 26 C22 26 26 22 26 16"/><polyline points="26,6 26,16 16,16"/>
Grid:     <rect x="6" y="6" width="20" height="20" rx="0"/><line x1="6" y1="13" x2="26" y2="13"/><line x1="13" y1="6" x2="13" y2="26"/>
Sanitize: <circle cx="16" cy="16" r="4"/><path d="M16 6 V8 M16 24 V26 M6 16 H8 M24 16 H26 M9 9 L10.5 10.5 M21.5 21.5 L23 23 M23 9 L21.5 10.5 M10.5 21.5 L9 23"/>
```

### 7.3 Product Detail Icons

```svg
Weight:   <circle cx="16" cy="16" r="10"/><path d="M16 10 V16 L20 20"/>
Size:     <line x1="8" y1="26" x2="24" y2="26"/><line x1="8" y1="22" x2="8" y2="26"/><line x1="24" y1="22" x2="24" y2="26"/><line x1="8" y1="24" x2="24" y2="24" stroke-dasharray="2 2"/>
Closure:  <path d="M10 26 Q10 16 16 12 Q22 16 22 26"/><line x1="16" y1="6" x2="16" y2="12"/><circle cx="16" cy="6" r="2"/>
Material: <circle cx="16" cy="14" r="8"/><path d="M10 24 L16 20 L22 24"/><circle cx="16" cy="14" r="3"/>
Details:  <rect x="8" y="8" width="16" height="16" rx="0"/><line x1="8" y1="14" x2="24" y2="14"/><line x1="8" y1="20" x2="24" y2="20"/>
Stack:    <ellipse cx="16" cy="18" rx="10" ry="6"/><ellipse cx="16" cy="14" rx="10" ry="6"/><ellipse cx="16" cy="10" rx="10" ry="6"/>
```

### 7.4 Icon Context Colors

| Context | Stroke color |
|---|---|
| PDP trust strip | `var(--dusty-teal)` |
| Accordion headers | `var(--muted-foreground)` |
| Hero panels | `var(--hero-text)` |
| Nav / default | `var(--foreground)` |

### 7.5 Icon Usage Rule

Icons render at `currentColor` so they inherit container text color. In the PDP trust strip they use `stroke: var(--dusty-teal)`. In accordion headers, `stroke: var(--muted-foreground)`. Never fill icons — stroke only, 1.2px weight, 32×32 viewBox. All shapes use `rx="0"` (square corners) except circles.

---

## 8. Piece Profile (PDP)

### 8.1 Product Data Schema

```typescript
interface PieceData {
  ITEM_TYPE: string;
  SILHOUETTE_CATEGORY: string;
  STACKING_ROLE: string;
  PLATING_COLOR_PRIMARY: string;
  OTHER_PREDOMINANT_COLOR: string;
  MATERIAL_CATEGORY: string;
  SIZE_AND_FIT: string;
  WEIGHT_AND_COMFORT: string;
  CLOSURE_AND_SECURITY: string;
  WHATS_INCLUDED: string;
  OCCASIONS_POSSIBLE: string;
  OUTFIT_STYLE: string;
  HERO_DESCRIPTOR_PHRASE: string;
  DIFFERENTIATING_DESCRIPTION: string;
  KEYWORD_TAGS: string;
}
```

### 8.2 Field → PDP Mapping

| Field | Location | Rule |
|---|---|---|
| `ITEM_TYPE` | Type subtitle | `{ITEM_TYPE} · {SILHOUETTE_CATEGORY}` uppercase micro-label |
| `SILHOUETTE_CATEGORY` | Type subtitle | Appended with ` · ` |
| `HERO_DESCRIPTOR_PHRASE` | H1 title | font-serif, text-[--ink]. Never truncated. |
| `DIFFERENTIATING_DESCRIPTION` | Body | text-[13px] text-[--muted-foreground]. No truncation. |
| `OUTFIT_STYLE` | Primary tag | Colored pastel per Section 4.3 mapping |
| `KEYWORD_TAGS` | Secondary tags + meta | Top 3-4 as tag-muted. All in structured data. |
| `SIZE_AND_FIT` | Quick Specs left | Line 1: metric. Line 2: fit range. |
| `WEIGHT_AND_COMFORT` | Quick Specs center | Line 1: weight. Line 2: comfort. |
| `WHATS_INCLUDED` | Quick Specs right | As-is. |
| `MATERIAL_CATEGORY` | Materials accordion | `Material: {value}` |
| `PLATING_COLOR_PRIMARY` | Materials accordion | `Plating: {value}`. If "None" → "Natural finish" |
| `OTHER_PREDOMINANT_COLOR` | Materials accordion | `Colors: {value}`. If "None" → omit entirely |
| `CLOSURE_AND_SECURITY` | Closure accordion | `Closure type: {value}` |
| `OCCASIONS_POSSIBLE` | How to Wear accordion | Split by comma → bold heading + styling tip each |
| `STACKING_ROLE` | Stacking Guide accordion | `Role: {value}` + pairings + "Avoid:" |

### 8.3 PDP Section Order

```
 1. IMAGE GALLERY                         [Authority]
    Desktop: 55% left, sticky. Mobile: 60%+ viewport, swipeable.
    Sequence: Hero → Flat Lay → Detail → Scale → Styling Context
    Grid: hero full-width + 2×2 thumbs, 1px gap

 2. PIECE IDENTITY
    Collection label (dusty-teal) → Type subtitle → H1 title → Body

 3. TAGS
    OUTFIT_STYLE colored + KEYWORD_TAGS muted

 4. ACCESS CTA                            [Conversion]
    "ACCESS THIS PIECE" full-width. "Included in your $69/mo membership"
    NEVER "Add to Cart" / "Buy Now"

 5. QUICK SPECS STRIP                     [Material Intel]
    3-col grid: SIZE_AND_FIT | WEIGHT_AND_COMFORT | WHATS_INCLUDED

 6. TRUST STRIP
    ✓ Free shipping · ✓ Free returns · ✓ Quality guaranteed

 7. PIECE DETAILS — 4 accordions          [Material Intel]
    Materials & Care | Closure & Construction | How to Wear | Stacking Guide

 8. ACCESS COMPARISON                     [Access Framework]
    Own (bg-card, price) vs Access (bg-background, "Included")
    NEVER discount framing

 9. CARE RITUAL                           [Material Intel]
    4-col: Clean → Inspect → Sanitize → Seal
    NEVER "professionally cleaned"

10. COMPLETE YOUR LOOK                    [Authority]
    3-4 complementary STACKING_ROLEs. NEVER random.

11. YOU MAY ALSO LOVE                     [Authority]
    Same ITEM_TYPE + SILHOUETTE. Bottom rail. NEVER random.
```

### 8.4 Layouts

**Desktop:**
```
┌─────────────────────────────────────────┐
│ Gallery (55%, sticky) │ Info Stack (45%)│
│                       │ Sections 2–8    │
└─────────────────────────────────────────┘
│ Care Ritual (4-col) · Complete · Also   │
└─────────────────────────────────────────┘
```

**Mobile:**
```
┌───────────────────┐
│ Gallery (swipe)   │ 60%+ viewport
├───────────────────┤
│ Info Stack 2–8    │ visible above fold
├───────────────────┤
│ Care (2-col)      │
│ Complete · Also   │
└───────────────────┘
```

### 8.5 What Lovable Will Get Wrong

1. **Price as hero** — suppress. Access framing replaces price.
2. **"Add to Cart"** — button says ACCESS THIS PIECE.
3. **Generic copy** — use HERO_DESCRIPTOR_PHRASE and DIFFERENTIATING_DESCRIPTION. No generated text.
4. **Hardcoded materials** — template from schema. Make dynamic.
5. **Random images** — fixed archetype sequence.
6. **"Professionally cleaned"** — always 4-step ritual.
7. **Tiny mobile gallery** — must be 60%+ viewport.
8. **Random cross-sell** — complementary roles for Complete, same silhouette for Also Love.
9. **Discount framing** — "Own: $X. Access: included" not "Save 85%."
10. **Standard e-commerce schema** — use MemberProgram/Subscription, not price.
11. **Black UI** — buttons, borders, headings are CHOCOLATE (`--foreground`), never black.

---

## 9. Do / Don't

### Do
- Buttons and UI in `--foreground` (chocolate). Hero panels in `--hero` (chocolate). Body text in `--ink` (darkest).
- Square corners everywhere. Visible borders on all containers.
- Uppercase micro-labels with wide tracking. Playfair for headlines only.
- Pastel tags from palette only. "Access This Piece." Concrete 4-step Care Ritual.
- All 15 classification fields rendered on PDP. Image archetype sequence.
- Tag Red stamp (16×16, rx:3) in every SVG illustration.

### Don't
- `bg-white`, `text-black`, pure values, `rounded-lg`, shadows as separators.
- Playfair for body. Sentence-case labels. Cool grays. Saturated accents.
- Price as hero. Purchase language. Generic "professionally cleaned."
- Random images, random cross-sell. Hardcoded supplier content.
- Body text in `--foreground`. Heavy/solid illustrations (always 0.2–0.7 opacity).
