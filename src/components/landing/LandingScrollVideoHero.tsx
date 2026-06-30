import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MEMBERSHIP_CHECKOUT_URLS } from "@/lib/membershipCheckout";
import {
  Ban,
  CalendarPlus,
  Check,
  Hand,
  Heart,
  Package,
  RefreshCw,
  Shield,
  Sparkles,
  Truck,
  Gift,
} from "lucide-react";
import { ScribbleUnderline } from "@/components/craft/ScribbleUnderline";
import { ScriptNumber } from "@/components/craft/ScriptNumber";
import { TrustStrip } from "@/components/shared/TrustStrip";

const steps = [
  {
    number: "01",
    title: "Choose",
    description: "Pick the pieces that speak to your moment from the full vault.",
    icon: Hand,
  },
  {
    number: "02",
    title: "Receive",
    description: "It arrives in 2–5 days, sealed — with a little gift inside, every time.",
    icon: Package,
  },
  {
    number: "03",
    title: "Wear",
    description: "Wear them everywhere — the event, the meeting, the everyday.",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "Keep",
    description: "Keep 1 to 3 each cycle, included. Love an extra? Keep it for 60% off list.",
    icon: Heart,
  },
  {
    number: "05",
    title: "Refresh",
    description: "Return the rest. Your next code arrives by email and unlocks your next set.",
    icon: RefreshCw,
  },
];

const tiers = [
  {
    name: "Seed Membership",
    label: "3 Pieces",
    price: "$35",
    was: "$55",
    detail: "3 rentals per cycle.",
    keep: 1,
    highlighted: false,
  },
  {
    name: "Blossom Membership",
    label: "6 Pieces",
    price: "$65",
    was: "$100",
    detail: "6 rentals per cycle.",
    keep: 2,
    highlighted: false,
  },
  {
    name: "Garden Membership",
    label: "10 Pieces",
    price: "$85",
    was: "$130",
    detail: "10 rentals per cycle.",
    keep: 3,
    highlighted: true,
  },
];

const assurances = [
  { icon: Shield, text: "Sanitized & Sealed" },
  { icon: Truck, text: "Free Shipping Both Ways" },
  { icon: Ban, text: "Cancel Anytime" },
  { icon: CalendarPlus, text: "One 30-Day Cycle" },
  { icon: Gift, text: "A Gift Every Delivery" },
];

// TEST BRANCH (flowers-hero-video-test): the tall 9:16 "flowers gently turn" clip.
// The scroll pans the vertical crop from the TOP of the video to the BOTTOM as you
// move down the section, so the embroidered story reveals itself top-to-bottom while
// the footage gently plays. Sources stay local for preview; CDN-host at full quality
// (no re-encode) before merge.
// Optimized, faststart-streamable encodes (~9MB, down from 23MB) — same clip,
// re-encoded at high quality. WebM/VP9 first for modern browsers, H.264 MP4
// fallback for Safari/iOS.
const heroVideoWebm = "/videos/flowers-hero.webm";
const heroVideoMp4 = "/videos/flowers-hero.mp4";
const heroPosterSrc = "/videos/flowers-hero-poster.webp";

// A soft, light cream scrim placed behind text blocks only — keeps the beige feel
// while making the dark copy crystal-clear over the embroidery (no dark gradient).
const scrim =
  "bg-[hsl(36_33%_93%_/_0.8)] supports-[backdrop-filter]:bg-[hsl(36_33%_93%_/_0.62)] backdrop-blur-[4px] rounded-[4px]";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export const LandingScrollVideoHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const frameRef = useRef<number | null>(null);
  const [videoHasError, setVideoHasError] = useState(false);
  // The hero clip is heavy, so we hold off fetching it until the section is
  // near the viewport. The poster shows immediately; the video streams in as
  // you approach — keeping the initial page load (carousel/banner) fast.
  const [videoActive, setVideoActive] = useState(false);

  const getScrollProgress = useCallback(() => {
    const section = sectionRef.current;

    if (!section) return 0;

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const sectionHeight = section.offsetHeight;
    const scrollRange = Math.max(1, sectionHeight - window.innerHeight);

    return clamp((window.scrollY - sectionTop) / scrollRange);
  }, []);

  // Pan the tall video's vertical crop with scroll: top (0%) at the top of the
  // section, bottom (100%) by the end. Written straight to the DOM node each frame
  // to avoid re-render jank.
  const updateMedia = useCallback(() => {
    const progress = getScrollProgress();
    const posY = `${(progress * 100).toFixed(2)}%`;
    const media = videoRef.current ?? imgRef.current;
    if (media) media.style.objectPosition = `50% ${posY}`;
  }, [getScrollProgress]);

  const requestUpdate = useCallback(() => {
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      updateMedia();
    });
  }, [updateMedia]);

  // Defer loading the heavy clip until the hero is approaching the viewport.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || videoActive) return;
    if (typeof IntersectionObserver === "undefined") {
      setVideoActive(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVideoActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [videoActive]);

  // Once active, load + keep the clip gently playing (muted, inline) for the
  // "flowers turn" motion.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoHasError || !videoActive) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.load();
    video.play().catch(() => undefined);
  }, [videoActive, videoHasError]);

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
    <section ref={sectionRef} className="relative bg-background text-foreground">
      <div className="sticky top-0 h-screen overflow-hidden">
        {!videoHasError ? (
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            preload="none"
            poster={heroPosterSrc}
            aria-label="GEA jewelry styling video"
            onError={() => setVideoHasError(true)}
            style={{ objectPosition: "50% 0%" }}
            className="absolute inset-0 h-full w-full transform-gpu object-cover [backface-visibility:hidden]"
          >
            {videoActive && <source src={heroVideoWebm} type="video/webm" />}
            {videoActive && <source src={heroVideoMp4} type="video/mp4" />}
          </video>
        ) : (
          <img
            ref={imgRef}
            src={heroPosterSrc}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            style={{ objectPosition: "50% 0%" }}
            className="absolute inset-0 h-full w-full transform-gpu object-cover [backface-visibility:hidden]"
          />
        )}
      </div>

      <div className="relative z-[1] -mt-[100vh] transform-gpu isolate px-5 sm:px-6 md:px-12 lg:px-16 [backface-visibility:hidden]">
        <section className="mx-auto flex min-h-screen max-w-[760px] flex-col items-center justify-center py-24 text-center">
          <div className={`${scrim} px-6 py-8 md:px-10 md:py-10`}>
            <p className="mb-4 font-sans text-[10px] uppercase tracking-[0.4em] text-foreground md:mb-7">
              Jewelry Membership for Women in Bloom
            </p>
            <h1 className="hero-display mb-4 whitespace-pre-line text-foreground md:mb-6">
              Wear Who{"\n"}
              <ScribbleUnderline color="var(--brass)" delay={0.2}>
                You're Becoming.
              </ScribbleUnderline>
            </h1>
            <p className="mx-auto mb-6 max-w-[440px] font-sans text-[12px] leading-relaxed text-foreground md:text-[13px]">
              High-design jewelry you access, not own.
            </p>
            <p className="mx-auto mb-7 max-w-[460px] text-[1.3rem] md:text-[1.5rem]" style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}>
              wear more. try everything. keep becoming ✿
            </p>
            <Link
              to="/browse"
              className="inline-block border px-8 py-3 font-sans text-[10px] uppercase tracking-[0.2em] text-[#faf4e8] transition-transform hover:-translate-y-0.5 md:px-10 md:py-3.5 md:text-[11px]"
              style={{ background: "var(--poppy)", borderColor: "var(--poppy-deep)", boxShadow: "4px 4px 0 hsl(30 12% 10% / 0.45)" }}
            >
              Browse the Collection ✿
            </Link>
            <p className="mx-auto mt-5 max-w-[440px] font-sans text-[11px] leading-relaxed text-foreground md:text-[12px]">
              Founding price from $35/mo · rent 3, 6, or 10 · keep 1 to 3 · <span className="text-foreground">yours for life</span>.
            </p>
            <TrustStrip
              variant="compact"
              className="mt-4 text-foreground [&_*]:text-foreground"
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] py-12 md:py-16">
          <div className={`mx-auto mb-8 block w-full max-w-[640px] px-6 py-6 text-center ${scrim}`}>
            <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.35em] text-foreground">
              The Process <span aria-hidden="true" style={{ color: "var(--poppy-deep)" }}>✿</span>
            </p>
            <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-foreground md:text-4xl">
              How It Works
            </h2>
            <p className="mt-2 text-[1.25rem]" style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}>
              five little steps, zero burden ✿
            </p>
          </div>
          <ol className={`mx-auto grid max-w-[600px] gap-3 px-6 py-6 md:gap-3.5 ${scrim}`}>
            {steps.map((step) => (
              <li key={step.number} className="flex items-baseline gap-3">
                <span
                  className="shrink-0 text-[1.45rem] leading-none"
                  style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}
                >
                  {step.number}
                </span>
                <p className="text-[13px] leading-snug text-foreground md:text-[14px]">
                  <span className="font-serif font-semibold text-foreground">{step.title}.</span>{" "}
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-7 text-center">
            <Link
              to="/how-it-works"
              className="inline-block border-b border-foreground/40 pb-1 font-sans text-[10px] uppercase tracking-[0.25em] text-foreground/80 transition-opacity hover:opacity-75 md:text-[11px]"
            >
              Learn More ✿
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-[1040px] py-12 md:py-16">
          <div className={`mx-auto mb-8 block w-full max-w-[640px] px-6 py-6 text-center ${scrim}`}>
            <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.35em] text-foreground">
              Membership <span aria-hidden="true" style={{ color: "var(--poppy-deep)" }}>✿</span>
            </p>
            <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-foreground md:text-4xl">
              Your Tier of Access
            </h2>
            <p className="mt-2 text-[1.25rem]" style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}>
              founding pricing — locked in for life ✿
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {tiers.map((tier) => (
              <a
                key={tier.name}
                href={MEMBERSHIP_CHECKOUT_URLS[tier.name] ?? "/how-it-works#tiers"}
                className={`group relative block p-6 shadow-[0_18px_50px_hsl(30_12%_10%_/_0.14)] transition-transform hover:-translate-y-1 md:p-8 ${
                  tier.highlighted ? "border border-dashed bg-foreground text-background" : "card-frosted text-foreground"
                }`}
                style={tier.highlighted ? { borderColor: "var(--poppy)" } : undefined}
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
                    <p className={`mb-2 font-sans text-[10px] uppercase tracking-[0.3em] ${tier.highlighted ? "text-background/70" : "text-foreground"}`}>
                      {tier.label}
                    </p>
                    <h3 className={`font-serif text-xl font-semibold tracking-[0.02em] md:text-2xl ${tier.highlighted ? "text-background" : "text-foreground"}`}>
                      {tier.name}
                    </h3>
                  </div>
                  <Check className={`h-5 w-5 shrink-0 stroke-[1.4] ${tier.highlighted ? "text-background/75" : "text-foreground"}`} />
                </div>
                <p className={`font-serif text-3xl font-medium md:text-4xl ${tier.highlighted ? "text-background" : "text-foreground"}`}>
                  <span className={`mr-2 font-normal line-through ${tier.highlighted ? "text-background/45" : "text-foreground/55"}`}>{tier.was}</span>
                  {tier.price}
                  <span className={`ml-2 font-sans text-[11px] tracking-[0.15em] ${tier.highlighted ? "text-background/65" : "text-foreground"}`}>/month</span>
                </p>
                <p className={`mt-1 font-sans text-[9px] tracking-[0.04em] ${tier.highlighted ? "text-background/70" : "text-foreground/80"}`}>
                  founding member — your price for life
                </p>
                <p
                  className="mt-2 text-[1.15rem]"
                  style={{ fontFamily: "var(--font-script)", color: tier.highlighted ? "var(--rose)" : "var(--poppy-deep)" }}
                >
                  {`keep ${tier.keep} ${tier.keep === 1 ? "favorite" : "favorites"} each cycle ✿`}
                </p>
                <p className={`mt-4 font-sans text-[12px] leading-relaxed ${tier.highlighted ? "text-background/80" : "text-foreground"}`}>
                  {tier.detail} Full vault access, sanitized, free shipping both ways.
                </p>
              </a>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 auto-rows-fr md:grid-cols-5">
            {assurances.map((item) => (
              <div
                key={item.text}
                className="flex h-full items-center justify-center gap-2 border border-foreground/20 bg-[hsl(36_33%_94%_/_0.7)] px-3 py-2 text-center font-sans text-[9px] uppercase tracking-[0.14em] text-foreground backdrop-blur-[2px] md:text-[10px]"
              >
                <item.icon className="h-3.5 w-3.5 shrink-0 stroke-[1.4]" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          <div className={`mx-auto mt-5 block w-full max-w-[700px] px-6 py-5 text-center ${scrim}`} style={{ borderTop: "2px solid var(--poppy)" }}>
            <p className="font-sans text-[10px] uppercase tracking-[0.32em] text-foreground/70">
              We've thought of everything <span aria-hidden="true" style={{ color: "var(--poppy-deep)" }}>✿</span>
            </p>
            <p className="mx-auto mt-2 max-w-[560px] font-sans text-[13px] leading-relaxed text-foreground md:text-[14px]">
              Wear every earring, pain-free. Free <span className="font-semibold">earring patches + lifters</span> in each box prevent allergies, soreness, and stretched lobes — and make heavier pieces sit beautifully. <span style={{ color: "var(--poppy-deep)" }}>A $30 value, included.</span>
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[860px] py-12 md:py-16">
          <div className={`mx-auto mb-7 block w-full max-w-[600px] px-6 py-6 text-center ${scrim}`}>
            <p className="mb-3 font-sans text-[10px] uppercase tracking-[0.35em] text-foreground">
              Philosophy <span aria-hidden="true" style={{ color: "var(--poppy-deep)" }}>✿</span>
            </p>
            <h2 className="font-serif text-2xl uppercase tracking-[0.08em] text-foreground md:text-4xl">
              You're Allowed to Evolve
            </h2>
            <p className="mt-2 text-[1.25rem]" style={{ fontFamily: "var(--font-script)", color: "var(--poppy-deep)" }}>
              you were never meant to stay the same ✿
            </p>
          </div>

          {/* Inline comparison — transparent so the video reads through to the end. */}
          <div className={`mx-auto grid max-w-[640px] gap-4 px-6 py-7 md:grid-cols-2 ${scrim}`}>
            <div>
              <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.3em] text-foreground">
                Built for a Different Era
              </p>
              <p className="font-sans text-[13px] leading-relaxed text-foreground md:text-[14px]">
                A fine piece is worn fewer than <ScriptNumber>5</ScriptNumber> times, then waits in a drawer. Buying one at a time can't keep pace with a life that keeps evolving.
              </p>
            </div>
            <div className="md:border-l md:border-foreground/15 md:pl-4">
              <p className="mb-2 font-sans text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--poppy-deep)" }}>
                The GEA Way
              </p>
              <p className="font-sans text-[13px] leading-relaxed text-foreground md:text-[14px]">
                Access the full vault. Keep what you love, return the rest, and wear{" "}
                <ScriptNumber>36+</ScriptNumber> pieces a year. Because staying the same was never the plan.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
