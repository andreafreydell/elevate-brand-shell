import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MEMBERSHIP_CHECKOUT_URLS } from "@/lib/membershipCheckout";
import {
  Ban,
  CalendarPlus,
  Check,
  Feather,
  Hand,
  Heart,
  Package,
  RefreshCw,
  Scale,
  Shield,
  Shuffle,
  Sparkles,
  Truck,
  Zap,
  Gift,
} from "lucide-react";
import { CircleEmphasis } from "@/components/craft/CircleEmphasis";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { ScriptNumber } from "@/components/craft/ScriptNumber";
import { TrustStrip } from "@/components/shared/TrustStrip";

const steps = [
  {
    number: "01",
    title: "Choose",
    description: "Browse our curated vault and select the pieces that speak to your moment.",
    icon: Hand,
  },
  {
    number: "02",
    title: "Receive",
    description: "Your selections typically arrive within 2-5 business days, sealed in signature packaging — with a little gift inside, every time: earring backs and comfort patches for happy, beautiful lobes.",
    icon: Package,
  },
  {
    number: "03",
    title: "Wear",
    description: "Style them for your life - the event, the meeting, the dinner, the everyday.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Keep",
    description: "One piece per cycle is yours to keep. Want more? Members save 40% on any additional piece.",
    icon: Heart,
  },
  {
    number: "05",
    title: "Refresh",
    description: "Return the pieces you are not keeping. Your Monthly Code arrives by email and unlocks your next set.",
    icon: RefreshCw,
  },
];

const tiers = [
  {
    name: "Stacking Membership",
    label: "10 Pieces",
    price: "$85",
    detail: "10 curated pieces per cycle",
    highlighted: true,
  },
  {
    name: "Starter Membership",
    label: "5 Pieces",
    price: "$65",
    detail: "5 curated pieces per cycle",
    highlighted: false,
  },
];

const assurances = [
  { icon: Shield, text: "Sanitized & Sealed" },
  { icon: Truck, text: "Free Shipping Both Ways" },
  { icon: Ban, text: "Cancel Anytime" },
  { icon: CalendarPlus, text: "One 30-Day Cycle" },
  { icon: Gift, text: "A Gift Every Delivery" },
];

const freedomBlocks = [
  {
    label: "Explore",
    title: "Freedom to Experiment",
    text: "Try bold statement pieces without the commitment of ownership. If it doesn't feel right, refresh your selection at the end of your cycle. No risk. No regret.",
    icon: Shuffle,
  },
  {
    label: "Discover",
    title: "Always Something New",
    text: "Your collection evolves as you do. New drops enter the vault monthly. Early access for members means you're always first.",
    icon: CalendarPlus,
  },
  {
    label: "Bloom",
    title: "Beauty Without Burden",
    text: "No storage anxiety. No depreciation. No buyer's remorse. Just beautiful jewelry, worn with intention, returned with ease — so there's always room to grow.",
    icon: Feather,
  },
];

const geaWorldFullQualityCdnVideoSrc =
  "https://cdn.jsdelivr.net/gh/andreafreydell/elevate-brand-shell@b5bb60ec360fcc233d1892d67d8b8abd58c8a7c0/public/videos/geaworld.mp4";
const geaWorldMobileVideoSrc = geaWorldFullQualityCdnVideoSrc;
const geaWorldMobileFallbackVideoSrc = "/videos/geaworld.mp4?v=20260511";
const geaWorldDesktopVideoSrc = geaWorldFullQualityCdnVideoSrc;
const geaWorldFrameCount = 24;
const getGeaWorldFrameSrc = (index: number) =>
  `/videos/geaworld-frames/frame-${String(index + 1).padStart(2, "0")}.webp`;
const geaWorldPosterSrc = getGeaWorldFrameSrc(0);

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const getVideoProgressMultiplier = () => (window.innerWidth < 768 ? 1.45 : 1);
const shouldUseMobileVideo = () => window.innerWidth < 768;

export const LandingScrollVideoHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const durationRef = useRef(0);
  const targetTimeRef = useRef(0);
  const [activeFrame, setActiveFrame] = useState(0);
  const [useMobileVideo, setUseMobileVideo] = useState(() => shouldUseMobileVideo());
  const [useLocalMobileVideo, setUseLocalMobileVideo] = useState(false);
  const [videoHasError, setVideoHasError] = useState(false);
  const useVideoScrub = !videoHasError;
  const geaWorldVideoSrc =
    useMobileVideo && useLocalMobileVideo
      ? geaWorldMobileFallbackVideoSrc
      : useMobileVideo
        ? geaWorldMobileVideoSrc
        : geaWorldDesktopVideoSrc;

  const getScrollProgress = useCallback(() => {
    const section = sectionRef.current;

    if (!section) return 0;

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const sectionHeight = section.offsetHeight;
    const scrollRange = Math.max(1, sectionHeight - window.innerHeight);

    return clamp((window.scrollY - sectionTop) / scrollRange);
  }, []);

  const switchToLocalMobileVideo = useCallback(() => {
    if (!useMobileVideo || useLocalMobileVideo) return false;

    setUseLocalMobileVideo(true);
    return true;
  }, [useLocalMobileVideo, useMobileVideo]);

  const applyTargetTime = useCallback(() => {
    const video = videoRef.current;

    if (!video || !durationRef.current || video.seeking) return;

    const targetTime = targetTimeRef.current;

    if (Math.abs(video.currentTime - targetTime) < 0.04) return;

    try {
      video.currentTime = targetTime;
    } catch {
      switchToLocalMobileVideo();
      // Some mobile browsers briefly reject seeks while metadata settles.
    }
  }, [switchToLocalMobileVideo]);

  const updateMedia = useCallback(() => {
    const mediaProgress = clamp(getScrollProgress() * getVideoProgressMultiplier());

    if (useVideoScrub) {
      targetTimeRef.current = Math.max(0, durationRef.current - 0.05) * mediaProgress;
      applyTargetTime();
      return;
    }

    const nextFrame = Math.round(mediaProgress * (geaWorldFrameCount - 1));
    setActiveFrame((currentFrame) => (currentFrame === nextFrame ? currentFrame : nextFrame));
  }, [applyTargetTime, getScrollProgress, useVideoScrub]);

  const requestUpdate = useCallback(() => {
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updateMedia();
    });
  }, [updateMedia]);

  const markVideoReady = useCallback(
    (video: HTMLVideoElement) => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }

      video.pause();
      requestUpdate();
    },
    [requestUpdate],
  );

  useEffect(() => {
    const syncMediaMode = () => setUseMobileVideo(shouldUseMobileVideo());

    syncMediaMode();
    window.addEventListener("resize", syncMediaMode);

    return () => window.removeEventListener("resize", syncMediaMode);
  }, []);

  useEffect(() => {
    durationRef.current = 0;
    targetTimeRef.current = 0;
    setVideoHasError(false);
    setUseLocalMobileVideo(false);
    requestUpdate();
  }, [requestUpdate, useMobileVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !useVideoScrub) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.load();

    const fallbackTimeoutId =
      useMobileVideo && !useLocalMobileVideo
        ? window.setTimeout(() => {
            const hasMetadata =
              video.readyState >= HTMLMediaElement.HAVE_METADATA &&
              Number.isFinite(video.duration) &&
              video.duration > 0;

            if (!hasMetadata) {
              setUseLocalMobileVideo(true);
            }
          }, 4200)
        : null;

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      markVideoReady(video);
    }

    const playAttempt = video.play();

    if (playAttempt && typeof playAttempt.then === "function") {
      playAttempt
        .then(() => markVideoReady(video))
        .catch(() => requestUpdate());
    } else {
      requestUpdate();
    }

    return () => {
      if (fallbackTimeoutId !== null) {
        window.clearTimeout(fallbackTimeoutId);
      }
    };
  }, [geaWorldVideoSrc, markVideoReady, requestUpdate, useLocalMobileVideo, useMobileVideo, useVideoScrub]);

  useEffect(() => {
    if (useVideoScrub) return;

    const preloadFrames = () => {
      Array.from({ length: geaWorldFrameCount }, (_, index) => {
        const image = new Image();
        image.src = getGeaWorldFrameSrc(index);
        return image;
      });
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preloadFrames, { timeout: 1800 });
      return;
    }

    const timeoutId = setTimeout(preloadFrames, 600);
    return () => clearTimeout(timeoutId);
  }, [useVideoScrub]);

  useEffect(() => {
    requestUpdate();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [requestUpdate]);

  return (
    <section ref={sectionRef} className="relative bg-foreground text-background">
      <div className="sticky top-0 h-screen overflow-hidden">
        {useVideoScrub ? (
          <video
            key={geaWorldVideoSrc}
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={geaWorldPosterSrc}
            aria-label="GEA jewelry styling video"
            onLoadedMetadata={(event) => {
              setVideoHasError(false);
              markVideoReady(event.currentTarget);
            }}
            onLoadedData={(event) => {
              setVideoHasError(false);
              markVideoReady(event.currentTarget);
            }}
            onCanPlay={(event) => {
              setVideoHasError(false);
              markVideoReady(event.currentTarget);
            }}
            onError={() => {
              if (!switchToLocalMobileVideo()) {
                setVideoHasError(true);
              }
            }}
            onStalled={() => {
              switchToLocalMobileVideo();
            }}
            onSeeked={applyTargetTime}
            className="absolute inset-0 h-full w-full transform-gpu object-cover [backface-visibility:hidden]"
          >
            <source src={geaWorldVideoSrc} type="video/mp4" />
          </video>
        ) : (
          <img
            src={getGeaWorldFrameSrc(activeFrame)}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full transform-gpu object-cover [backface-visibility:hidden]"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(30_12%_10%_/_0.74),hsl(30_12%_10%_/_0.26),hsl(30_12%_10%_/_0.62))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(30_12%_10%_/_0.18),transparent_34%,hsl(30_12%_10%_/_0.64))]" />
      </div>

      <div
        className="relative z-[1] -mt-[100vh] transform-gpu isolate px-5 sm:px-6 md:px-12 lg:px-16 [backface-visibility:hidden]"
        style={{ textShadow: "0 2px 28px hsl(30 12% 10% / 0.72)" }}
      >
        <section className="mx-auto flex min-h-screen max-w-[760px] flex-col items-center justify-center py-24 text-center">
          <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.4em] text-[hsl(36,33%,93%)] md:mb-8">
            Jewelry Membership for Women in Bloom
          </p>
          <h1 className="hero-display mb-4 whitespace-pre-line text-[hsl(36,33%,93%)] md:mb-6">
            Wear Who{"\n"}
            <ScribbleUnderline color="var(--brass)" delay={0.2}>
              You're Becoming.
            </ScribbleUnderline>
          </h1>
          <p className="mx-auto mb-3 max-w-[440px] font-sans text-[12px] leading-relaxed text-[hsl(36,28%,88%)] md:text-[13px]">
            High-design jewelry you access, not own.
            <br />
            Because you were never meant to stay the same.
          </p>
          <p className="mx-auto mb-7 max-w-[460px] text-[1.3rem] md:text-[1.5rem]" style={{ fontFamily: "var(--font-script)", color: "var(--rose)" }}>
            wear more. try everything. keep becoming ✿
          </p>
          <Link
            to="/browse"
            className="inline-block border px-8 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#faf4e8] transition-transform hover:-translate-y-0.5 md:px-10 md:py-3.5 md:text-[11px]"
            style={{ background: "var(--poppy)", borderColor: "var(--poppy-deep)", boxShadow: "4px 4px 0 hsl(30 12% 10% / 0.45)" }}
          >
            Browse the Collection ✿
          </Link>
          <p className="mx-auto mt-5 max-w-[420px] font-sans text-[11px] leading-relaxed text-[hsl(36,25%,86%)] md:text-[12px]">
            Membership from $65/mo. Choose 5 or 10 pieces each cycle. Keep 1 favorite.
          </p>
          <TrustStrip
            variant="compact"
            className="mt-4 text-[hsl(36,25%,86%)] [&_*]:text-[hsl(36,25%,86%)]"
          />
        </section>

        <section className="mx-auto max-w-[1180px] py-12 md:py-16">
          <div className="mb-8 text-center">
            <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.35em] text-[hsl(36,33%,93%)]">
              The Process <span aria-hidden="true" style={{ color: "var(--rose)" }}>✿</span>
            </p>
            <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-[hsl(36,33%,93%)] md:text-4xl">
              How It Works
            </h2>
            <p className="mt-2 text-[1.25rem]" style={{ fontFamily: "var(--font-script)", color: "var(--rose)" }}>
              five little steps, zero burden ✿
            </p>
          </div>
          <ol className="mx-auto grid max-w-[620px] gap-2.5 md:gap-3.5">
            {steps.map((step) => (
              <li key={step.number} className="flex items-baseline gap-3">
                <span
                  className="shrink-0 text-[1.45rem] leading-none"
                  style={{ fontFamily: "var(--font-script)", color: "var(--rose)" }}
                >
                  {step.number}
                </span>
                <p className="text-[13px] leading-snug text-[hsl(36,30%,90%)] md:text-[14px]">
                  <span className="font-serif font-semibold text-[hsl(36,42%,95%)]">{step.title}.</span>{" "}
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-7 text-center">
            <Link
              to="/how-it-works"
              className="inline-block border-b border-[hsl(36,25%,86%)] pb-1 font-sans text-[10px] uppercase tracking-[0.25em] text-[hsl(36,25%,86%)] transition-opacity hover:opacity-75 md:text-[11px]"
            >
              Learn More ✿
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-[1040px] py-12 md:py-16">
          <div className="mb-8 text-center">
            <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.35em] text-[hsl(36,33%,93%)]">
              Membership <span aria-hidden="true" style={{ color: "var(--rose)" }}>✿</span>
            </p>
            <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-[hsl(36,33%,93%)] md:text-4xl">
              Your Tier of Access
            </h2>
            <p className="mt-2 text-[1.25rem]" style={{ fontFamily: "var(--font-script)", color: "var(--rose)" }}>
              choose 5 or 10 pieces — one favorite is always yours to keep ✿
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {tiers.map((tier) => (
              <a
                key={tier.name}
                href={MEMBERSHIP_CHECKOUT_URLS[tier.name] ?? "/how-it-works#tiers"}
                className={`group relative block border p-6 shadow-[0_18px_50px_hsl(30_12%_10%_/_0.18)] transition-transform hover:-translate-y-1 md:p-8 ${
                  tier.highlighted ? "border-dashed bg-foreground text-background" : "border-border bg-background text-foreground"
                }`}
                style={{ textShadow: "none", ...(tier.highlighted ? { borderColor: "var(--poppy)" } : {}) }}
              >
                {tier.highlighted && (
                  <span
                    className="absolute -top-4 left-6 inline-block border border-dashed px-3 py-0.5 text-[1rem]"
                    style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)", background: "var(--rose-soft)", borderColor: "var(--poppy)", transform: "rotate(-2deg)" }}
                  >
                    most loved ✿
                  </span>
                )}
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`mb-2 font-sans text-[10px] uppercase tracking-[0.3em] ${
                        tier.highlighted ? "text-background/65" : "text-muted-foreground"
                      }`}
                    >
                      {tier.label}
                    </p>
                    <h3 className="font-serif text-xl font-semibold tracking-[0.02em] md:text-2xl">
                      {tier.name}
                    </h3>
                  </div>
                  <Check
                    className={`h-5 w-5 stroke-[1.4] ${
                      tier.highlighted ? "text-background/70" : "text-foreground"
                    }`}
                  />
                </div>
                <p className="font-serif text-3xl font-medium md:text-4xl">
                  {tier.price}
                  <span
                    className={`ml-2 font-sans text-[11px] tracking-[0.15em] ${
                      tier.highlighted ? "text-background/65" : "text-muted-foreground"
                    }`}
                  >
                    /month
                  </span>
                </p>
                <p
                  className="mt-2 text-[1.15rem]"
                  style={{ fontFamily: "var(--font-script)", color: tier.highlighted ? "var(--rose)" : "var(--poppy-deep)" }}
                >
                  one favorite is always yours to keep ✿
                </p>
                <p
                  className={`mt-4 font-sans text-[12px] leading-relaxed ${
                    tier.highlighted ? "text-background/80" : "text-muted-foreground"
                  }`}
                >
                  {tier.detail}. Full vault access, protection coverage, sanitation, and free shipping both ways.
                </p>
              </a>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 auto-rows-fr md:grid-cols-5">
            {assurances.map((item) => (
              <div
                key={item.text}
                className="flex h-full items-center justify-center gap-2 border border-[hsl(36_25%_86%_/_0.48)] bg-foreground px-3 py-2 text-center font-sans text-[9px] uppercase tracking-[0.14em] text-[hsl(36,25%,88%)] md:text-[10px]"
              >
                <item.icon className="h-3.5 w-3.5 shrink-0 stroke-[1.4]" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1120px] py-12 md:py-16">
          <div className="mb-8 text-center">
            <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.35em] text-[hsl(36,33%,93%)]">
              Freedom <span aria-hidden="true" style={{ color: "var(--rose)" }}>✿</span>
            </p>
            <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-[hsl(36,33%,93%)] md:text-4xl">
              Wear More. Spend Smarter.
            </h2>
            <p className="mt-2 text-[1.25rem]" style={{ fontFamily: "var(--font-script)", color: "var(--rose)" }}>
              this is what blooming feels like ✿
            </p>
          </div>
          <ul className="mx-auto grid max-w-[640px] gap-3 md:gap-4">
            {freedomBlocks.map((block) => (
              <li key={block.title} className="flex items-baseline gap-3">
                <span aria-hidden="true" className="shrink-0 text-[1.1rem] leading-none" style={{ color: "var(--poppy)" }}>✿</span>
                <p className="text-[13px] leading-snug text-[hsl(36,30%,90%)] md:text-[14px]">
                  <span className="font-serif font-semibold text-[hsl(36,42%,95%)]">{block.title}.</span>{" "}
                  {block.text}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-[1120px] py-12 md:py-16">
          <div className="mb-8 text-center">
            <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.35em] text-[hsl(36,33%,93%)]">
              Philosophy <span aria-hidden="true" style={{ color: "var(--rose)" }}>✿</span>
            </p>
            <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-[hsl(36,33%,93%)] md:text-4xl">
              You're Allowed to Evolve
            </h2>
            <p className="mt-2 text-[1.25rem]" style={{ fontFamily: "var(--font-script)", color: "var(--rose)" }}>
              you were never meant to stay the same ✿
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              className="border border-border bg-card p-8 text-foreground shadow-[0_18px_50px_hsl(30_12%_10%_/_0.18)] md:p-10"
              style={{ textShadow: "none" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  The Old Model
                </p>
                <Scale className="h-5 w-5 stroke-[1.3] text-foreground" />
              </div>
              <h3 className="mb-4 font-serif text-xl font-semibold tracking-[0.02em] md:text-2xl">
                Ownership Is a <CircleEmphasis color="var(--tag-red)">Standstill</CircleEmphasis>
              </h3>
              <p className="font-sans text-[12px] leading-relaxed text-muted-foreground">
                The average woman wears each piece of fine jewelry fewer than <ScriptNumber>5</ScriptNumber> times before it sits forgotten. One frozen identity. Inches of drawer space consumed. Beauty standing still while you keep evolving.
              </p>
            </div>
            <div
              className="border border-border bg-foreground p-8 text-background shadow-[0_18px_50px_hsl(30_12%_10%_/_0.18)] md:p-10"
              style={{ textShadow: "none" }}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-background/60">
                  The GEA Model
                </p>
                <Zap className="h-5 w-5 stroke-[1.3] text-background/70" />
              </div>
              <h3 className="mb-4 font-serif text-xl font-semibold tracking-[0.02em] text-background md:text-2xl">
                Access Is <ScribbleUnderline color="var(--seafoam)" delay={0.5}>Evolution</ScribbleUnderline>
              </h3>
              <p className="font-sans text-[12px] leading-relaxed text-background/70">
                Access the full vault. Wear who you're becoming this cycle. Keep the piece you love most, return the rest, and keep growing.{" "}
                <ScriptNumber className="text-background/90">10+</ScriptNumber> pieces per year. Because staying the same was never the plan.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
