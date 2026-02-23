# GEA Design System

> **Aesthetic:** Warm Editorial Craft Modernism with Soft Brutalist Structure

---

## 🎨 Color Palette (HSL)

| Token | Light Mode | Usage |
|-------|-----------|-------|
| `--background` | `37 30% 93%` | Page background (warm cream) |
| `--foreground` | `28 12% 14%` | Primary text (warm black) |
| `--card` | `34 22% 87%` | Card/panel fills (deeper sand) |
| `--secondary` | `33 16% 83%` | Subtle fills (muted oat) |
| `--muted` | `34 14% 86%` | De-emphasized areas |
| `--muted-foreground` | `28 8% 48%` | Secondary text |
| `--accent` | `32 18% 80%` | Hover states (warm taupe) |
| `--border` | `30 12% 40%` | All borders (warm charcoal) |
| `--destructive` | `0 60% 48%` | Error/delete states |

> **Rule:** Never use pure white or pure black. Always use semantic tokens (`bg-background`, `text-foreground`, etc.).

---

## ✏️ Typography

| Role | Font | Weight | Tracking | Line Height |
|------|------|--------|----------|-------------|
| **H1 (Hero)** | Playfair Display | 500 | -0.01em | 1.08 |
| **H2 (Section)** | Playfair Display | 500 | 0.06em | 1.15 |
| **H3 (Card title)** | Playfair Display | 600 | 0.02em | 1.25 |
| **Body** | Inter | 400 | 0.01em | 1.6 |
| **Label/Micro** | Inter | 500 | 0.25em | — |
| **Button/CTA** | Inter | 500 | 0.2em | — |

### Rules
- All headings use `font-serif` (Playfair Display)
- All UI text uses `font-sans` (Inter)
- Labels and CTAs are always `uppercase`, `text-[11px]` or `text-[10px]`
- Body text is `14px`

---

## 📐 Layout

| Property | Value |
|----------|-------|
| Max width | `1440px` |
| Container padding | `3rem` (48px) |
| Section padding | `px-12 lg:px-16` |
| Border radius | `0rem` (always square) |
| Grid | Strict rectangular modules, no overlaps |
| Borders | Visible `border-border` on all containers |

---

## 🔲 Component Patterns

### Buttons

```
Primary:    bg-foreground text-background border border-foreground
            → hover: bg-transparent text-foreground

Outline:    bg-transparent text-foreground border border-foreground
            → hover: bg-foreground text-background

All:        text-[11px] tracking-[0.2em] uppercase font-sans py-3 px-8
```

### Section Headings

```
font-serif text-center uppercase
font-size: clamp(1.25rem, 2.5vw, 1.875rem)
tracking: 0.08em
```

### Cards / Panels

```
bg-card border border-border (no rounded corners)
Image: aspect-square object-cover
Title: font-serif
Price: font-serif text-lg
Label: text-[10px] tracking-[0.25em] uppercase text-muted-foreground
```

### Links / CTAs

```
Underline CTA:  border-b border-current pb-0.5
                text-[11px] tracking-[0.25em] uppercase
                hover:opacity-70

Nav link:       text-[11px] tracking-[0.18em] uppercase
                hover:text-muted-foreground
```

---

## 🧱 Spacing Scale

| Context | Value |
|---------|-------|
| Between sections | `py-12 md:py-20` |
| Card internal padding | `p-8 md:p-12 lg:p-16` |
| Label → content gap | `mb-3` to `mb-4` |
| Icon size (nav) | `h-[18px] w-[18px] stroke-[1.5]` |
| Nav item gap | `gap-8 lg:gap-10` |
| Utility bar height | `h-[44px]` |
| Nav bar height | `h-[42px]` |

---

## 🌑 Dark Mode

Same structure, inverted: backgrounds become `28 10% 7%`, foregrounds become `34 22% 90%`. All tokens auto-swap via the `.dark` class.

---

## ✅ Do / ❌ Don't

| ✅ Do | ❌ Don't |
|-------|---------|
| Use `bg-background`, `text-foreground` | Use `bg-white`, `text-black` |
| Square corners everywhere | Add `rounded-lg` or any radius |
| Uppercase micro-labels with wide tracking | Use sentence-case for UI labels |
| Playfair for headlines only | Use Playfair for body text |
| Generous whitespace between sections | Crowd sections together |
| Visible borders on containers | Use shadows as primary separators |
| Warm neutrals from the palette | Introduce cool grays or saturated colors |

---

## 📁 Source Files

- **Tokens & base styles:** `src/index.css`
- **Tailwind mapping:** `tailwind.config.ts`
- **Button variants:** `src/components/ui/button.tsx`
