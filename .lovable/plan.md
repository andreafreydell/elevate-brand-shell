
# Pre-Launch Access Gate

## What Gets Built

A full-screen passcode gate that blocks the entire site before launch. Visitors see a minimal, brand-aligned screen and must enter a code to proceed. Below the passcode input, a small inquiry line provides a contact email for press, investors, and other inquiries.

## Gate Screen Layout (top to bottom, centered)

1. **Brand mark** -- "Gea" in serif italic (matching the existing navbar/footer wordmark)
2. **Headline** -- "This experience is not yet public." (serif, uppercase, tracked)
3. **Passcode input** -- single text field, square corners, warm border
4. **Enter button** -- outline style, uppercase micro-label
5. **Micro-copy** -- "Founding members and press: check your inbox for the access code."
6. **Inquiry line** -- "For press, investor & partnership inquiries:" followed by a clickable mailto link to `maria.freydell.v@gmail.com`, styled as a subtle underline CTA in muted foreground

## How It Works

- Correct passcode (`GEA2026`) stores `gea_access_granted = true` in localStorage
- On subsequent visits, the gate is bypassed automatically
- Wrong code shows a brief inline error: "Code not recognized."
- The gate wraps the entire app so no route is accessible without the code

## Files Changed

1. **`src/components/LaunchGate.tsx`** (new)
   - Self-contained component with `useState` for input and error state
   - Reads/writes `localStorage` key `gea_access_granted`
   - Full-viewport height, centered flex layout
   - All styling follows design system: zero radius, warm neutrals, Inter for UI text, Playfair for headline
   - The inquiry email rendered as: `text-[11px] tracking-[0.15em] text-muted-foreground` with a `mailto:` link styled as `cta-underline`

2. **`src/App.tsx`**
   - Import `LaunchGate` and wrap the existing JSX so the gate renders before any routes
   - When access is granted, renders the normal app content unchanged

## Removal at Launch

Delete the `LaunchGate` wrapper from `App.tsx` -- one line change, no other cleanup needed.
