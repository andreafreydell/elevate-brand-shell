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

## 9. OrganicBlobTag

Irregular pooling shape behind labels. Each outfit style has a unique blob path.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | The label text |
| `variant` | `"coastal" \| "statement" \| "modern" \| "classic"` | `"coastal"` | Blob shape & color |
| `className` | `string` | `""` | Additional classes |

**Usage:**
```tsx
import { OrganicBlobTag } from "@/components/craft/OrganicBlobTag";

<OrganicBlobTag variant="coastal">Coastal</OrganicBlobTag>
<OrganicBlobTag variant="statement">Editorial</OrganicBlobTag>
```

---

## 10. SketchyBorderCard

Wobbly SVG border that mimics a hand-drawn box. For curator notes and editorial asides. NOT for product cards.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Card content |
| `label` | `string` | `"EDITOR'S NOTE"` | Top label text |
| `className` | `string` | `""` | Additional classes |
| `pathVariant` | `number` | `0` | Unique wobble variant (0–2) |

**Usage:**
```tsx
import { SketchyBorderCard } from "@/components/craft/SketchyBorderCard";

<SketchyBorderCard label="CURATOR'S NOTE" pathVariant={1}>
  <h3 className="font-serif text-lg">Why We Chose This Piece</h3>
  <p>The weight sits just right...</p>
</SketchyBorderCard>
```

---

## 11. DotGridTexture

CSS-only dot pattern that reads as graph paper. Apply as a section background.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | optional | Content inside the grid |
| `className` | `string` | `""` | Additional classes |
| `dotSize` | `number` | `0.8` | Dot radius in px |
| `spacing` | `number` | `18` | Grid spacing in px |

**Usage:**
```tsx
import { DotGridTexture } from "@/components/craft/DotGridTexture";

<DotGridTexture className="min-h-[200px] p-8">
  {/* Content on dot-grid background */}
</DotGridTexture>
```

---

## 12. TornPaperEdge

Jagged SVG line divider that replaces `<hr>`. Between sections, below hero, above footer.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional classes |
| `color` | `string` | `"hsl(var(--border))"` | Stroke color |

**Usage:**
```tsx
import { TornPaperEdge } from "@/components/craft/TornPaperEdge";

<TornPaperEdge className="my-8" />
```

---

## 13. StitchLineDivider

Dashed line that reads as a sewn seam. Lighter alternative to torn edge.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional classes |
| `color` | `string` | `"hsl(var(--border))"` | Stroke color |

**Usage:**
```tsx
import { StitchLineDivider } from "@/components/craft/StitchLineDivider";

<StitchLineDivider className="my-6" />
```

---

## 14. DiamondChainBorder

Repeating geometric diamond motif using SVG `<pattern>`. For editorial pages and section borders.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional classes |

**Usage:**
```tsx
import { DiamondChainBorder } from "@/components/craft/DiamondChainBorder";

<DiamondChainBorder className="my-10" />
```

---

## 15. WashiTapeNote

Pinned note card with decorative washi tape strip. For curator picks and editorial asides.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Note content |
| `label` | `string` | `"CURATOR'S PICK"` | Top label |
| `tapeColor` | `string` | `"var(--seafoam)"` | Tape strip color |
| `rotation` | `number` | `-1.5` | Note rotation in degrees |
| `className` | `string` | `""` | Additional classes |

**Usage:**
```tsx
import { WashiTapeNote } from "@/components/craft/WashiTapeNote";

<WashiTapeNote label="CURATOR'S PICK" tapeColor="var(--blush-peach)">
  <h3 className="font-serif text-lg">Mara Chain Necklace</h3>
  <p>The asymmetric clasp lets the chain drape off-center...</p>
</WashiTapeNote>
```

---

## 16. HandDrawnRect

SVG rect with feTurbulence + feDisplacementMap for organic edge wobble. For material intel cards and editorial callout boxes.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Card content |
| `className` | `string` | `""` | Additional classes |
| `strokeColor` | `string` | `"hsl(var(--foreground))"` | Border stroke color |

**Usage:**
```tsx
import { HandDrawnRect } from "@/components/craft/HandDrawnRect";

<HandDrawnRect>
  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">MATERIAL INTEL</p>
  <h3 className="font-serif text-lg">Brass-Core Construction</h3>
</HandDrawnRect>
```

---

## 17. MarkerCircle

Double-ellipse marker circle with displacement filter. Mimics a felt-tip pen circle. For pricing and trust emphasis.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | The text to circle |
| `color` | `string` | `"var(--tag-red)"` | Stroke color |
| `className` | `string` | `""` | Additional classes |

**Usage:**
```tsx
import { MarkerCircle } from "@/components/craft/MarkerCircle";

<p>Starting at <MarkerCircle>$69/mo</MarkerCircle></p>
```

---

## 18. HandDrawnFrame

Responsive SVG rect + displacement that stretches with any container. For access comparison sections and philosophy statements.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Frame content |
| `className` | `string` | `""` | Additional classes |
| `strokeColor` | `string` | `"hsl(var(--foreground))"` | Border stroke color |

**Usage:**
```tsx
import { HandDrawnFrame } from "@/components/craft/HandDrawnFrame";

<HandDrawnFrame className="max-w-[600px]">
  <h3 className="font-serif text-xl">Why Rent When You Can Access?</h3>
  <p>Ownership is a 20th-century model...</p>
</HandDrawnFrame>
```

---

## 19. TagRedStamp

Brand signature tag-red square stamp. Place on every SVG infographic and dark panel.

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `""` | Additional classes (use for positioning) |
| `size` | `number` | `16` | Size in pixels |

**Usage:**
```tsx
import { TagRedStamp } from "@/components/craft/TagRedStamp";

<TagRedStamp className="absolute bottom-5 right-5 z-10" />
```

---

## Design Rules

- **ScribbleUnderline**: Max 1 per section headline
- **CircleEmphasis**: Use tag-red for urgency, brass for trust
- **GrainOverlay**: Always inside `relative overflow-hidden` parent; systemic on all dark panels
- **StampBadge**: Always rotate −3° to −8°, opacity kept low (0.4–0.6)
- **ScriptNumber**: Only for numbers, never body copy
- **WavyDivider**: Use between major content sections
- **WaxSeal / MarginNote**: Decorative accents, don't overuse
- **OrganicBlobTag**: Systemic on all product cards for OUTFIT_STYLE
- **SketchyBorderCard**: NOT for product cards — editorial content only
- **TornPaperEdge / StitchLineDivider**: Pick ONE per divider location, never stack
- **DiamondChainBorder**: For editorial and about pages
- **WashiTapeNote**: Rotation −1.5° to +1°, never more than 2°
- **HandDrawnRect / HandDrawnFrame**: One per container, never double-load
- **MarkerCircle**: For pricing emphasis and trust claims
- **TagRedStamp**: Required on every SVG infographic and dark panel
- **Density**: Max 2 artisanal SVG elements visible per screen (grain/stamp don't count)
- **Opacity**: Always 0.2–0.6 — never solid or heavy
- **Corners**: Still `rounded-none` everywhere — these layer on top of the design system
