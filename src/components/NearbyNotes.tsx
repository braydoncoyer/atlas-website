"use client";

// Marketing section explaining how Atlas uses AI: it surfaces notes you've
// already written rather than writing content for you. The visual reuses the
// hero's ProductShot (the full macOS app) showing a note being written, then
// fades the top of the window into white so focus lands on the bottom — a
// horizontal dock of floating "Nearby Notes" suggestion cards. Showing it as a
// suggestion dock (rather than the in-app context panel) keeps the demo honest:
// Atlas *suggests*, it never inserts.
//
// Product facts are grounded in ../atlas (DemoVault "Nearby Notes" + prd.md
// "Discovered Connections"): semantic similarity surfaces conceptually related
// notes even when no link exists, labelled with qualitative High/Medium/Low
// confidence. Per the PRD, AI may surface/answer/locate but must never write,
// autocomplete, or rewrite — the contrast this section is built around.

import { useEffect, useState } from "react";
import ProductShot from "./ProductShot";
import { useInView } from "./useInView";

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M8 1.5c.3 2.6 1.4 3.7 4 4-2.6.3-3.7 1.4-4 4-.3-2.6-1.4-3.7-4-4 2.6-.3 3.7-1.4 4-4Z"
        fill="currentColor"
      />
      <path
        d="M13 9c.15 1.2.7 1.75 1.9 1.9-1.2.15-1.75.7-1.9 1.9-.15-1.2-.7-1.75-1.9-1.9C12.3 10.75 12.85 10.2 13 9Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.8 2.5 2 4v9.5l3.8-1.5 4.4 1.5L14 12V2.5l-3.8 1.5L5.8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M5.8 2.5v9.5M10.2 4v9.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

// Iridescent AI rim — a conic sweep (blue-led per brand, warming through
// violet, pink, orange like the command-palette glow), sized just larger than
// whatever it sits behind. The element it haloes is opaque and on top, so only
// the blurred coloured edge shows as a halo evenly surrounding the shape.
const AURA_BG =
  "conic-gradient(from 210deg at 50% 50%, rgba(0,136,255,0.3), rgba(120,90,255,0.21), rgba(255,90,130,0.24), rgba(255,150,60,0.21), rgba(0,136,255,0.3))";

function AiAura({
  active = true,
  className = "-inset-1.5 blur-sm",
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full transition-opacity duration-700 ${
        active ? "ai-aura opacity-100" : "opacity-0"
      } ${className}`}
      style={{ background: AURA_BG }}
    />
  );
}

type Level = "high" | "medium" | "low";

const LEVELS: Record<Level, { label: string; pill: string; dot: string }> = {
  high: { label: "High", pill: "bg-accent-soft text-accent", dot: "bg-accent" },
  medium: { label: "Med", pill: "bg-accent-soft text-accent/75", dot: "bg-accent/55" },
  low: { label: "Low", pill: "bg-subtle text-muted", dot: "bg-muted/50" },
};

function ConfidenceChip({ level }: { level: Level }) {
  const l = LEVELS[level];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${l.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${l.dot}`} />
      {l.label}
    </span>
  );
}

const CONNECTIONS: { title: string; level: Level; reason: string }[] = [
  {
    title: "Circadian Rhythm",
    level: "high",
    reason: "Both explore how morning light anchors your body clock.",
  },
  {
    title: "Light Exposure",
    level: "high",
    reason: "Shared focus on getting bright light early in the day.",
  },
  {
    title: "Adenosine Clearance",
    level: "medium",
    reason: "Connects to the grogginess morning light helps lift.",
  },
  {
    title: "Caffeine and Adenosine",
    level: "low",
    reason: "A looser thread on alertness chemistry.",
  },
];

// The note shown being written in the editor — circadian/light, so the surfaced
// Nearby Notes read as genuinely related. The first paragraph and the opening of
// the second are static; TYPE_TARGET is what the cursor "types" each loop, which
// is what prompts Atlas to surface the nearby notes.
const NOTE_P1 =
  "Getting bright light within an hour of waking is one of the most reliable ways to set your circadian rhythm for the day.";
const NOTE_P2_PREFIX =
  "It signals your body when to feel alert — and, hours later, when to start winding down. ";
const TYPE_TARGET =
  "Even ten minutes outside beats the brightest indoor lighting.";

function MorningSunlightNote({
  typed,
  caret,
}: {
  typed: string;
  caret: boolean;
}) {
  return (
    <>
      <h3 className="text-[26px] font-semibold tracking-tight text-foreground">
        Morning Sunlight
      </h3>
      <div className="mt-3 h-px w-full max-w-[760px] bg-border" />
      <div className="mt-7 space-y-6">
        <p className="max-w-[600px] text-[14px] leading-[1.7] text-foreground/85">
          {NOTE_P1}
        </p>
        <p className="max-w-[600px] text-[14px] leading-[1.7] text-foreground/85">
          {NOTE_P2_PREFIX}
          {typed}
          {caret && <span className="writing-caret" />}
        </p>
      </div>
    </>
  );
}

// ── Looping demo timeline ────────────────────────────────────────────────────
// Drives the section's story on a loop once it scrolls into view: the cursor
// types the last line of the note → a "nearby notes" pill rises from the bottom
// of the app with an AI aura → its Show button is "pressed" → the suggestion
// cards animate up → hold → reset and repeat. Only opacity/transform animate; a
// cancellable timeout chain sequences the stages. Under prefers-reduced-motion
// the demo snaps to its resolved state (text typed, cards shown) and never loops.
type Stage = "type" | "pill" | "press" | "open" | "reset";

function useNearbyDemo(active: boolean) {
  const [stage, setStage] = useState<Stage>("type");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!active) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // Snap to the resolved state (typed, cards shown), deferred so it isn't a
      // synchronous setState in the effect body.
      const t = setTimeout(() => {
        setTyped(TYPE_TARGET);
        setStage("open");
      }, 0);
      return () => clearTimeout(t);
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    async function loop() {
      while (!cancelled) {
        // Reset to an empty editor line and retype.
        setStage("type");
        setTyped("");
        await wait(700);
        if (cancelled) return;

        for (let i = 1; i <= TYPE_TARGET.length; i++) {
          setTyped(TYPE_TARGET.slice(0, i));
          await wait(TYPE_TARGET[i - 1] === " " ? 58 : 30);
          if (cancelled) return;
        }
        await wait(550);
        if (cancelled) return;

        // Pill rises with its aura.
        setStage("pill");
        await wait(1500);
        if (cancelled) return;

        // Show button depresses, then the cards take over.
        setStage("press");
        await wait(200);
        if (cancelled) return;

        setStage("open");
        // Cards reveal in the first ~0.8s, then hold ~5s before looping.
        await wait(5800);
        if (cancelled) return;

        // Cards drop away, then the loop restarts.
        setStage("reset");
        await wait(550);
      }
    }
    loop();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [active]);

  return { stage, typed };
}

// Floating overlay on the bottom of the editor: the suggestion pill (with AI
// aura) and the revealed Nearby Notes cards, sequenced by the demo stage. Spans
// the editor area (right of the sidebar on large screens). Marked aria-hidden by
// the parent — it's a looping visual; the section copy carries the meaning.
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

function NearbyNotesDock({ stage }: { stage: Stage }) {
  const showPill = stage === "pill" || stage === "press";
  const pressed = stage === "press";
  const showCards = stage === "open";

  return (
    <div className="absolute inset-x-5 bottom-6 sm:inset-x-8 lg:inset-x-auto lg:bottom-8 lg:left-[284px] lg:right-auto">
      {/* Suggestion pill + AI aura — rises from the app's bottom edge. Centered
          in the *visible* editor canvas (between the sidebar's right edge and
          the viewport edge), not over the bled-off app. The lg offset is derived
          from the layout: on wide screens the right column starts near 50vw, so
          centering the pill in that visible span, then biased a bit further
          right toward the viewport edge. */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-[calc(25vw_-_80px)]">
        <div
          className={`relative transition-all duration-500 ${EASE} ${
            showPill
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-8 opacity-0"
          }`}
        >
          <AiAura active={showPill} />
          <div className="flex items-center gap-2.5 rounded-full border border-border bg-background/85 py-1.5 pl-3 pr-1.5 shadow-lg shadow-accent/15 backdrop-blur">
            <span className="text-accent">
              <Sparkle className="h-3.5 w-3.5" />
            </span>
            <span className="whitespace-nowrap text-[13px] font-medium text-foreground">
              Atlas found nearby notes
            </span>
            <button
              type="button"
              tabIndex={-1}
              className={`rounded-full bg-accent px-3 py-1 text-[12px] font-medium text-white shadow-sm transition-transform duration-150 ease-out ${
                pressed ? "scale-95" : "scale-100"
              }`}
            >
              Show
            </button>
          </div>
        </div>
      </div>

      {/* Revealed Nearby Notes cards. */}
      <div
        className={`mb-2.5 flex items-center gap-1.5 text-[11px] font-medium text-muted transition-all duration-500 ${EASE} ${
          showCards ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <span className="text-accent">
          <Sparkle className="h-3 w-3" />
        </span>
        Nearby Notes
      </div>
      <div className="flex gap-3">
        {CONNECTIONS.map((c, i) => (
          <div
            key={c.title}
            style={{ transitionDelay: showCards ? `${100 + i * 70}ms` : "0ms" }}
            className={`w-[200px] shrink-0 rounded-xl border border-border bg-background/95 p-3 shadow-lg shadow-black/[0.06] backdrop-blur transition-all duration-500 ${EASE} lg:w-[208px] ${
              showCards ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-muted/55">
                <MapIcon />
              </span>
              <ConfidenceChip level={c.level} />
            </div>
            <p className="mt-2 truncate text-[13px] font-medium text-foreground">
              {c.title}
            </p>
            <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-muted">
              {c.reason}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NearbyNotes() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { stage, typed } = useNearbyDemo(inView);
  const caret = stage === "type" || stage === "pill" || stage === "press";

  return (
    <section className="overflow-x-clip py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-y-14 lg:grid-cols-2 lg:gap-x-12">
          {/* Left: copy */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-subtle px-3 py-1 text-xs font-medium text-muted">
              <span className="text-accent">
                <Sparkle className="h-3 w-3" />
              </span>
              Nearby Notes
            </span>

            <h2 className="mt-5 text-balance text-3xl leading-[1.15] tracking-tight text-sky-950 sm:text-4xl sm:leading-[1.1]">
              Most apps help you collect ideas. Atlas helps you find them again.
            </h2>

            <p className="mt-5 text-pretty text-base leading-snug text-slate-500 sm:text-lg">
              Capturing a thought is the easy part. Digging it back out — months
              and hundreds of notes later — is where most tools leave you. Atlas
              reads alongside you and resurfaces the connected notes as you write,
              even ones you never linked. Less like searching. More like
              remembering.
            </p>

            <p className="mt-5 text-pretty text-base leading-snug text-slate-500 sm:text-lg">
              The goal isn&apos;t to replace your thinking. It&apos;s to help you
              return to it.
            </p>
          </div>

          {/* Right: the app, bleeding past the container's right edge. It's
              masked so its top fades to TRANSPARENT (the real page background
              shows through — no seam, and the window's top border + shadow
              dissolve into the page). Anchored at the column's left and over-
              wide (50vw-based) so it runs past the container and off the right
              edge of the page on any monitor. The dock is a sibling, crisp. */}
          <div
            ref={ref}
            aria-hidden="true"
            className="relative h-[560px]"
          >
            <div className="absolute inset-y-0 left-0 w-[150%] max-w-none lg:w-[calc(50vw+200px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,transparent_15%,#000_58%)] [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_15%,#000_58%)]">
              <ProductShot
                activeItem="Light Exposure"
                note={<MorningSunlightNote typed={typed} caret={caret} />}
                flat
              />
            </div>

            <NearbyNotesDock stage={stage} />
          </div>
        </div>
      </div>
    </section>
  );
}
