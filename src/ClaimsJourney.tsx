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

const NAVBAR_HEIGHT = 80;
const STEPPER_HEIGHT = 160; // height of sticky stepper (heading + ruler + padding)
const CARD_STICKY_TOP = NAVBAR_HEIGHT + STEPPER_HEIGHT - 20; // small overlap with stepper bottom

export function ClaimsJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stepLabelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Step labels initial state: only first is active
      stepLabelRefs.current.forEach((el, i) => {
        if (el) {
          gsap.set(el, {
            opacity: i === 0 ? 1 : 0.3,
            fontWeight: i === 0 ? 700 : 400,
          });
        }
      });

      // Orange marker glides from step 1 to step 3 across the journey scroll
      gsap.fromTo(
        markerRef.current,
        { left: `${STEP_POSITIONS[0]}%` },
        {
          left: `${STEP_POSITIONS[2]}%`,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top ${NAVBAR_HEIGHT + STEPPER_HEIGHT / 2}px`,
            end: "bottom bottom",
            scrub: true,
          },
        },
      );

      // Each card has its own ScrollTrigger that flips the active step
      // when the card reaches its sticky position (locked at top)
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        ScrollTrigger.create({
          trigger: card,
          start: `top ${CARD_STICKY_TOP + 30}px`,
          end: `bottom ${CARD_STICKY_TOP - 30}px`,
          onToggle: (self) => {
            if (self.isActive) activateStep(i);
          },
          onEnter: () => activateStep(i),
          onEnterBack: () => activateStep(i),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  function activateStep(idx: number) {
    stepLabelRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.to(el, {
        opacity: i === idx ? 1 : 0.3,
        fontWeight: i === idx ? 700 : 400,
        duration: 0.3,
        overwrite: true,
      });
    });
  }

  return (
    <section ref={sectionRef} className="claims-journey relative">
      {/* Sticky stepper — heading + ruler + marker, locks below the navbar */}
      <div
        className="claims-journey__stepper sticky z-40 bg-white"
        style={{ top: `${NAVBAR_HEIGHT}px`, height: `${STEPPER_HEIGHT}px` }}
      >
        <div className="mx-auto w-full max-w-[1280px] px-10 pt-10">
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
              className="pointer-events-none absolute top-0 -translate-x-1/2"
              style={{ left: `${STEP_POSITIONS[0]}%` }}
            >
              <Marker />
            </div>
          </div>
        </div>
      </div>

      {/* Card stack — each card is sticky at the same top, so as you scroll
          card 2 rises from below and locks on top of card 1, then card 3
          rises and locks on top of card 2. Real overlap, no inner frames. */}
      <div className="claims-journey__stack relative">
        {cards.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="claims-journey__sticky-card"
            style={{
              position: "sticky",
              top: `${CARD_STICKY_TOP}px`,
              zIndex: i + 1,
              marginBottom: i < cards.length - 1 ? "70vh" : "30vh",
            }}
          >
            <div className="mx-auto w-full max-w-[1122px] px-10">
              <JourneyCard card={card} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Ruler() {
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
  return (
    <svg
      width="22"
      height="56"
      viewBox="0 0 22 56"
      fill="none"
      aria-hidden
      style={{ transform: "translateY(-6px)" }}
    >
      <path d="M11 2 L19 13 L11 24 L3 13 Z" fill="var(--color-orange-500)" />
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
      className="grid h-[420px] w-full overflow-hidden rounded-[32px] border border-[#fafafa] bg-white"
      style={{
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.3fr)",
        boxShadow: "0 1px 250px rgba(0,0,0,0.04)",
      }}
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
