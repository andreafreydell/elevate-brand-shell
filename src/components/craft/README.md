# GEA Craft Components Library

Artisanal, hand-coded design elements for luxurious editorial feel. Located at `src/components/craft/`.

---

## 1. ScribbleUnderline

Hand-drawn wavy SVG underline that animates on scroll. **Use sparingly — one per section headline.**

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | The text to underline |
| `color` | `string` | `"var(--brass)"` | Stroke color |
| `className` | `string` | `""` | Additional classes |
| `delay` | `number` | `0.3` | Animation delay in seconds |

**Usage:**
```tsx
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";

<h2>The Art of <ScribbleUnderline>Access</ScribbleUnderline></h2>
```

---

## 2. CircleEmphasis

Loose hand-drawn ellipse around a word — like an editor's circle mark. Animates on scroll.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | The word(s) to circle |
| `color` | `string` | `"var(--tag-red)"` | Stroke color |
| `className` | `string` | `""` | Additional classes |
| `delay` | `number` | `0.4` | Animation delay in seconds |

**Usage:**
```tsx
import { CircleEmphasis } from "@/components/craft/CircleEmphasis";

<p>Wear <CircleEmphasis>3+ pieces</CircleEmphasis> every month</p>
```

---

## 3. GrainOverlay

Subtle paper-grain texture overlay using SVG feTurbulence. **Place inside a `relative` parent.**

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `opacity` | `number` | `0.04` | Grain opacity (0.03–0.06 recommended) |

**Usage:**
```tsx
import { GrainOverlay } from "@/components/craft/GrainOverlay";

<section className="relative overflow-hidden">
  <GrainOverlay opacity={0.05} />
  {/* content */}
</section>
```

---

## 4. WavyDivider

Organic wavy SVG line divider with turbulence filter. Replaces plain `<hr>` elements.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional classes |
| `color` | `string` | `"hsl(var(--border))"` | Stroke color |
| `variant` | `"single" \| "double"` | `"single"` | Single or double line |
| `delay` | `number` | `0` | Animation delay in seconds |

**Usage:**
```tsx
import { WavyDivider } from "@/components/craft/WavyDivider";

<WavyDivider variant="double" className="my-12" />
```

---

## 5. WaxSeal

Wax seal SVG badge with initial letter. For hero panels and membership sections.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `letter` | `string` | `"G"` | Letter inside the seal |
| `size` | `number` | `48` | Size in pixels |
| `className` | `string` | `""` | Additional classes |

**Usage:**
```tsx
import { WaxSeal } from "@/components/craft/WaxSeal";

<WaxSeal size={56} className="absolute -top-4 -right-6" />
```

---

## 6. StampBadge

Imperfect rubber-stamp badge with SVG turbulence texture. Always slightly rotated.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Upper text (small caps) |
| `subtext` | `string` | optional | Lower text (serif italic) |
| `className` | `string` | `""` | Additional classes |
| `rotation` | `number` | `-6` | Rotation in degrees |

**Usage:**
```tsx
import { StampBadge } from "@/components/craft/StampBadge";

<StampBadge text="AUTHENTICATED" subtext="GEA" rotation={-4} />
```

---

## 7. MarginNote

Editorial margin note with hand-drawn SVG bracket. For curator quotes and asides.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | The note text |
| `attribution` | `string` | `"GEA Curator"` | Attribution line |
| `className` | `string` | `""` | Additional classes |

**Usage:**
```tsx
import { MarginNote } from "@/components/craft/MarginNote";

<MarginNote attribution="GEA Stylist">
  The brass finish will develop a subtle patina — that's the beauty of it.
</MarginNote>
```

---

## 8. ScriptNumber

Script-font (Caveat) wrapper for warm, human-feeling metrics. **Numbers only — never body copy.**

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | The number/metric |
| `className` | `string` | `""` | Additional classes |

**Usage:**
```tsx
import { ScriptNumber } from "@/components/craft/ScriptNumber";

<ScriptNumber className="text-3xl">18"</ScriptNumber>
<span className="text-xs uppercase tracking-widest">Chain Length</span>
```

---

## Design Rules

- **ScribbleUnderline**: Max 1 per section headline
- **CircleEmphasis**: Use tag-red for urgency, brass for trust
- **GrainOverlay**: Always inside `relative overflow-hidden` parent
- **StampBadge**: Always rotate −3° to −8°, opacity kept low (0.4–0.6)
- **ScriptNumber**: Only for numbers, never body copy
- **WavyDivider**: Use between major content sections
- **WaxSeal / MarginNote**: Decorative accents, don't overuse
