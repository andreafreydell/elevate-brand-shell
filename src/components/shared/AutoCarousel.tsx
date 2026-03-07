import { type ReactNode, Children, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface AutoCarouselProps {
  children: ReactNode;
  /** Interval in ms */
  interval?: number;
  /** Card width class */
  cardWidth?: string;
}

/**
 * Horizontal carousel with auto-advance. Always carousel on all screen sizes.
 */
export const AutoCarousel = ({
  children,
  interval = 2000,
  cardWidth = "min-w-[72vw] md:min-w-[260px] lg:min-w-[240px]",
}: AutoCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    skipSnaps: false,
  });

  const autoplay = useCallback(() => {
    if (!emblaApi) return;
    const id = setInterval(() => {
      emblaApi.scrollNext();
    }, interval);
    return () => clearInterval(id);
  }, [emblaApi, interval]);

  useEffect(() => {
    const cleanup = autoplay();
    return cleanup;
  }, [autoplay]);

  const items = Children.toArray(children);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-3">
        {items.map((child, i) => (
          <div key={i} className={`${cardWidth} flex-shrink-0`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};
