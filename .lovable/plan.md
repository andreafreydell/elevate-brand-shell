

## Plan: Integrate Heiy Font for Brand Wordmark

The uploaded `.woff2` file is the Heiy typeface. Here's the plan:

### 1. Copy font file to project
- Copy `user-uploads://CQZXXCSBaIDPP1bTc4AphMiAVv8zppKdoUGgpTDz2qGLX7BeB9jAaeQeUA1rHTBR.woff2` → `public/fonts/Heiy.woff2`

### 2. Register @font-face in `src/index.css`
- Add `@font-face` declaration for "Heiy" pointing to `/fonts/Heiy.woff2`

### 3. Add CSS custom property and Tailwind mapping
- Add `--font-brand: 'Heiy', sans-serif` to `:root` in `index.css`
- Add `brand: ["var(--font-brand)"]` to `fontFamily` in `tailwind.config.ts`

### 4. Apply to navbar logo
- In `src/components/Navbar.tsx`, change the "Gea" `<Link>` from `font-serif` to `font-brand` and adjust styling (remove italic, tweak tracking/size to match the logo aesthetic)

No other components, markup, colors, or craft elements will be changed.

