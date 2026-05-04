import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type CardItem = { label: string };

type Card = {
  id: string;
  title: string;
  description: string[];
  items: CardItem[];
  panelBg: string;
  panelLabel: string;
};

const STEP_POSITIONS = [16.66, 50, 83.33] as const;

const steps = [
  "Get Insurance advise",
  "End-to end assistance",
  "Lifetime Claim Support",
];

const cards: Card[] = [
  {
    id: "advise",
    title: "Get Insurance advise",
    description: [
      "Talk to IRDAI certified experts instead of pushy salesmen,",
      "with a guaranteed no-spam policy.",
    ],
    items: [
      { label: "30 min consultation" },
      { label: "Zero cost" },
      { label: "Zero spam" },
    ],
    panelBg: "var(--color-card-purple)",
    panelLabel: "Schedule a call",
  },
  {
    id: "assist",
    title: "End-to end assistance",
    description: [
      "Get complete handholding from Ditto — from the moment",
      "you book a call to the moment you receive your policy.",
    ],
    items: [
      { label: "Assist you fill application" },
      { label: "Evaluation of counter offers" },
      { label: "Resolution of any issues" },
    ],
    panelBg: "var(--color-card-cream)",
    panelLabel: "Application timeline",
  },
  {
    id: "support",
    title: "Lifetime Claim Support",
    description: [
      "With Ditto's expert claims team at your disposal 24/7,",
      "you and your family will always receive the support you deserve.",
    ],
    items: [
      { label: "Expert Claim Settlement Support" },
      { label: "Resolution of any issues" },
      { label: "24/7 dedicated claims desk" },
    ],
    panelBg: "var(--color-card-blue)",
    panelLabel: "Claims dashboard",
  },
];

export function ClaimsJourney() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!triggerRef.current || !pinRef.current || !markerRef.current) return;

    const ctx = gsap.context(() => {
      const card1 = cardRefs.current[0];
      const card2 = cardRefs.current[1];
      const card3 = cardRefs.current[2];

      if (!card1 || !card2 || !card3) return;

      // Initial state: only card 1 visible
      gsap.set(card2, { yPercent: 60, opacity: 0 });
      gsap.set(card3, { yPercent: 60, opacity: 0 });

      // Step labels: active is fully opaque + bold; inactive are dim + regular
      stepLabelRefs.current.forEach((el, i) => {
        if (el) {
          gsap.set(el, {
            opacity: i === 0 ? 1 : 0.3,
            fontWeight: i === 0 ? 700 : 400,
          });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top 80px", // start pin right below the sticky navbar
          end: () => `+=${Math.max(window.innerHeight * 2.4, 1800)}`,
          scrub: 1,
          pin: pinRef.current,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // Marker travels left → right across the stepper line
      tl.fromTo(
        markerRef.current,
        { left: `${STEP_POSITIONS[0]}%` },
        { left: `${STEP_POSITIONS[2]}%`, ease: "none", duration: 1 },
        0,
      );

      // Step labels: when marker reaches each step, that label goes bold + bright
      // and the previous one fades back to inactive
      tl.to(stepLabelRefs.current[0], { opacity: 0.3, fontWeight: 400, duration: 0.05 }, 0.42);
      tl.to(stepLabelRefs.current[1], { opacity: 1, fontWeight: 700, duration: 0.05 }, 0.42);
      tl.to(stepLabelRefs.current[1], { opacity: 0.3, fontWeight: 400, duration: 0.05 }, 0.83);
      tl.to(stepLabelRefs.current[2], { opacity: 1, fontWeight: 700, duration: 0.05 }, 0.83);

      // Card 1 → Card 2
      const T1 = 0.4;
      const FADE = 0.12;
      tl.to(card1, { yPercent: -60, opacity: 0, ease: "power1.in", duration: FADE }, T1);
      tl.to(card2, { yPercent: 0, opacity: 1, ease: "power1.out", duration: FADE }, T1);

      // Card 2 → Card 3
      const T2 = 0.78;
      tl.to(card2, { yPercent: -60, opacity: 0, ease: "power1.in", duration: FADE }, T2);
      tl.to(card3, { yPercent: 0, opacity: 1, ease: "power1.out", duration: FADE }, T2);
    }, triggerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={triggerRef}
      className="claims-journey relative w-full"
      style={{ minHeight: "100vh" }}
    >
      <div ref={pinRef} className="claims-journey__pin">
        <div className="mx-auto w-full max-w-[1280px] px-10 pt-14">
          {/* Step labels */}
          <div className="relative h-7 select-none">
            {steps.map((label, i) => (
              <span
                key={label}
                ref={(el) => {
                  stepLabelRefs.current[i] = el;
                }}
                className="absolute -translate-x-1/2 whitespace-nowrap text-[20px] text-[var(--color-ink-soft)]"
                style={{
                  left: `${STEP_POSITIONS[i]}%`,
                  fontWeight: i === 0 ? 700 : 400,
                  transition: "opacity 200ms, font-weight 200ms",
                  letterSpacing: "0.005em",
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Ruler line + tick marks + orange marker */}
          <div className="relative mt-7 h-12">
            <Ruler />
            <div
              ref={markerRef}
              className="claims-journey__marker pointer-events-none absolute top-0 -translate-x-1/2"
              style={{ left: `${STEP_POSITIONS[0]}%` }}
            >
              <Marker />
            </div>
          </div>

          {/* Card stack — only one visible at a time */}
          <div
            className="relative mx-auto mt-12 h-[420px] w-full max-w-[1122px]"
          >
            {cards.map((card, i) => (
              <div
                key={card.id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute inset-0 will-change-transform"
              >
                <JourneyCard card={card} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Ruler() {
  // ~75 tick marks across, with the 3 step positions accented in blue
  const total = 75;
  return (
    <svg
      className="absolute inset-x-0 top-0 h-full w-full"
      viewBox={`0 0 ${total} 40`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {Array.from({ length: total }, (_, i) => {
        const isStep = STEP_POSITIONS.some(
          (p) => Math.abs((i / (total - 1)) * 100 - p) < 0.8,
        );
        return (
          <line
            key={i}
            x1={i + 0.5}
            x2={i + 0.5}
            y1={isStep ? 4 : 16}
            y2={isStep ? 36 : 28}
            stroke={isStep ? "#0c3660" : "#c8c9cc"}
            strokeWidth={isStep ? 0.8 : 0.4}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

function Marker() {
  // Orange diamond head with a thin vertical line dropping down to the ruler
  return (
    <svg
      width="22"
      height="56"
      viewBox="0 0 22 56"
      fill="none"
      aria-hidden
      style={{ transform: "translateY(-6px)" }}
    >
      <path
        d="M11 2 L19 13 L11 24 L3 13 Z"
        fill="var(--color-orange-500)"
      />
      <line
        x1="11"
        y1="24"
        x2="11"
        y2="56"
        stroke="var(--color-orange-500)"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function JourneyCard({ card }: { card: Card }) {
  return (
    <div
      className="grid h-full w-full overflow-hidden rounded-[32px] border border-[#fafafa] bg-white shadow-[0_1px_60px_rgba(0,0,0,0.05)]"
      style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.3fr)" }}
    >
      {/* Left side: copy */}
      <div className="flex flex-col gap-7 p-10">
        <h3 className="text-[26px] font-bold leading-[1.2] text-[var(--color-ink-soft)]">
          {card.title}
        </h3>
        <p className="text-[17px] leading-[1.5] text-[var(--color-mute)]">
          {card.description.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
        <ul className="mt-2 space-y-5">
          {card.items.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-3 text-[18px] text-[var(--color-ink)]"
            >
              <CheckIcon />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side: colored panel */}
      <div className="m-3 ml-0 rounded-[18px]" style={{ background: card.panelBg }}>
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <div className="text-[14px] font-medium uppercase tracking-[0.16em] text-[var(--color-mute)]">
            Step preview
          </div>
          <div className="mt-3 text-[20px] font-semibold text-[var(--color-ink-soft)]">
            {card.panelLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-blue-600)] text-white">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}
