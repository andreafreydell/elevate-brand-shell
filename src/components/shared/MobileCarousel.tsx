import { type ReactNode, Children } from "react";

interface MobileCarouselProps {
  children: ReactNode;
  /** Desktop grid classes (applied at md+) */
  desktopClassName?: string;
  /** Width of each card on mobile */
  cardWidth?: string;
}

/**
 * On mobile: horizontal snap-scroll carousel.
 * On md+: renders children in the provided desktop grid layout.
 */
export const MobileCarousel = ({
  children,
  desktopClassName = "grid grid-cols-2 gap-4",
  cardWidth = "min-w-[72vw]",
}: MobileCarouselProps) => {
  const items = Children.toArray(children);

  return (
    <>
      {/* Mobile: horizontal scroll */}
      <div className="md:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-5 px-5 scrollbar-hide">
        {items.map((child, i) => (
          <div key={i} className={`${cardWidth} flex-shrink-0 snap-start`}>
            {child}
          </div>
        ))}
      </div>

      {/* Desktop: original grid */}
      <div className={`hidden md:grid ${desktopClassName}`}>
        {items.map((child, i) => (
          <div key={i}>{child}</div>
        ))}
      </div>
    </>
  );
};
