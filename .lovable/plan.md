

## Fix: Vertically center the "Gea" logo in the navbar

The logo uses `absolute left-1/2 -translate-x-1/2` for horizontal centering but has no vertical centering — it defaults to the top of the container. The `leading-none` also clips the font's natural descenders/ascenders unevenly.

### Change (single file: `src/components/Navbar.tsx`, line 57)

Add `top-1/2 -translate-y-1/2` to vertically center the logo within the navbar bar. Since we already use `-translate-x-1/2`, we'll combine both into a single translate: `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`. Also switch `leading-none` to `leading-[1]` to ensure the font's vertical metrics are balanced.

