import { type ReactNode, Children, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight } from "lucide-react";

interface AutoCarouselProps {
  children: ReactNode;
  /** Interval in ms */
  interval?: number;
  /** Card width class */
  cardWidth?: string;
}

/**
 * Horizontal carousel with auto-advance, swipe, and next arrow.
 */
export const AutoCarousel = ({
  children,
  interval = 4000,
  cardWidth = "min-w-[72vw] md:min-w-[260px] lg:min-w-[240px]",
}: AutoCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
    containScroll: false,
  });

  const [isPaused, setIsPaused] = useState(false);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || isPaused) return;
    const id = setInterval(() => {
      emblaApi.scrollNext();
    }, interval);
    return () => clearInterval(id);
  }, [emblaApi, interval, isPaused]);

  const items = Children.toArray(children);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map((child, i) => (
            <div key={i} className={`${cardWidth} flex-shrink-0`}>
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Next arrow */}
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-foreground/80 text-background hover:bg-foreground transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 stroke-[1.5]" />
      </button>
    </div>
  );
};
