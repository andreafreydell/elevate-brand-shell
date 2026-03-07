import { type ReactNode, Children, useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MobileArrowCarouselProps {
  children: ReactNode;
  desktopClassName?: string;
  cardWidth?: string;
}

export const MobileArrowCarousel = ({
  children,
  desktopClassName = "grid grid-cols-3 gap-[2px]",
  cardWidth = "min-w-[75vw]",
}: MobileArrowCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const items = Children.toArray(children);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile: horizontal scroll with arrows */}
      <div className="md:hidden relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-background/80 border border-border p-1.5 backdrop-blur-sm"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-background/80 border border-border p-1.5 backdrop-blur-sm"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
        )}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-5 px-5 scrollbar-hide"
        >
          {items.map((child, i) => (
            <div key={i} className={`${cardWidth} flex-shrink-0 snap-start`}>
              {child}
            </div>
          ))}
        </div>
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
