

## Fix: Add extra top padding to the logo to compensate for font metrics

The Heiy font likely has uneven ascender/descender metrics, making the visually centered logo appear top-heavy. Adding extra top padding will push it down to look optically centered.

### Change: `src/components/Navbar.tsx` (line ~57)

Add `pt-2 md:pt-3` (or similar) to the logo `<Link>` element to nudge it downward, compensating for the font's visual weight distribution. This keeps the CSS centering intact while adjusting for optical perception.

