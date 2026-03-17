import { useEffect, useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  FOUNDING_ACCESS_EVENT,
  hasRecentFoundingAccessCapture,
  hasRecentFoundingAccessDismissal,
  markFoundingAccessDismissed,
} from "@/lib/foundingAccess";

const DESKTOP_DELAY_MS = 8000;
const MOBILE_SCROLL_THRESHOLD = 0.4;
const EXCLUDED_ROUTE_PREFIXES = ["/checkout", "/welcome", "/account"];

const isExcludedRoute = (pathname: string) =>
  EXCLUDED_ROUTE_PREFIXES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export const useEmailCaptureTrigger = (pathname: string) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [stateVersion, setStateVersion] = useState(0);

  const isSuppressed = useMemo(
    () =>
      isExcludedRoute(pathname) ||
      hasRecentFoundingAccessCapture() ||
      hasRecentFoundingAccessDismissal(),
    [pathname, stateVersion],
  );

  useEffect(() => {
    const handleStateChange = () => {
      setStateVersion((current) => current + 1);
      setIsOpen(false);
    };

    window.addEventListener(FOUNDING_ACCESS_EVENT, handleStateChange);
    return () =>
      window.removeEventListener(FOUNDING_ACCESS_EVENT, handleStateChange);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isSuppressed || isOpen) return;

    if (isMobile) {
      const handleScroll = () => {
        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;

        if (scrollableHeight <= 0) return;

        const progress = window.scrollY / scrollableHeight;
        if (progress >= MOBILE_SCROLL_THRESHOLD) {
          setIsOpen(true);
          window.removeEventListener("scroll", handleScroll);
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    }

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, DESKTOP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [isMobile, isOpen, isSuppressed, pathname, stateVersion]);

  const dismissPopup = () => {
    markFoundingAccessDismissed();
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    dismissPopup,
  };
};
