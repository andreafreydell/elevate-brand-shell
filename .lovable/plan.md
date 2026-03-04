

## Plan

Remove the "Your Access Awaits" closing CTA section (lines ~189-207) from `src/pages/HowItWorks.tsx`. This is the brown/beige block at the bottom of the page, which is redundant with the site-wide footer newsletter capture.

**File: `src/pages/HowItWorks.tsx`**
- Delete the entire closing CTA `<section className="bg-[hsl(28,22%,34%)]">` block at the bottom of the page (the "Your Access Awaits" section with the "Apply for Access" link)

