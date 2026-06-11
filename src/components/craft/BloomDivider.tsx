/**
 * BloomDivider — Digital Garden companion system
 * A sweet ❀ ✿ ❀ divider with hairline rules, replacing heavier section breaks
 * where a softer, garden-toned transition is wanted.
 */
export const BloomDivider = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`mx-auto my-10 flex w-[140px] items-center justify-center gap-2.5 text-[0.85rem] text-[var(--meadow)] ${className}`}
  >
    <span className="h-px flex-1 bg-border/60" />
    <span>❀</span>
    <span className="text-[var(--poppy)]">✿</span>
    <span>❀</span>
    <span className="h-px flex-1 bg-border/60" />
  </div>
);
