"use client";

// Marketing section for Regions — Atlas's answer to organising knowledge
// without folders. A Region is just a note: a map-icon heading and a list of
// links to every note that shares a tag. The differentiator over folders is
// that the SAME note can live in MANY Regions at once.
//
// The visual is a life-sized slice of the app (full width, top faded into the
// page) built as one SVG so the connector lines hit their endpoints exactly.
// The loop animates the real interaction: the cursor types "#chr", the tag
// autocomplete popover opens with the match highlighted, it commits to a tag
// chip, and a line draws to the matching Region in the sidebar — repeated for
// three tags, ending with one note wired into three Regions at once.
//
// Grounded in the user-supplied definition + screenshots (Regions aren't in
// prd.md yet): no folders/hierarchy; tagging a note adds it to the matching
// Region automatically; Regions live in the sidebar. Tag chips use the app's
// royal link-blue; active Region rows + connectors use the brand cyan accent.

import { useEffect, useState, type ReactNode } from "react";
import { useInView } from "./useInView";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// The app's royal link/tag blue (distinct from the cyan brand accent, which the
// app reserves for active sidebar selection).
const TAG_BLUE = "#2f6fed";
const TAG_FILL = "#e9f0fd";

// ── Diagram geometry (a single 1200×620 coordinate space) ────────────────────
const W = 1200;
const H = 690;
const SIDEBAR_W = 280;
const EDITOR_X = 330; // left text margin inside the editor
const ANCHOR_X = 272; // where a connector meets a sidebar row (right edge)
const CHIP_H = 32;

// Sidebar rows. `on` is the connection index (0,1,2) for rows a tag links to.
const ROWS: { label: string; y: number; on: number | null }[] = [
  { label: "Chronobiology", y: 184, on: 0 },
  { label: "Circadian Systems", y: 228, on: null },
  { label: "Focus", y: 272, on: null },
  { label: "Light Exposure", y: 316, on: 1 },
  { label: "Sleep", y: 360, on: 2 },
];

// The body of the note — manually wrapped lines so it reads as a developed
// thought rather than a stub.
const BODY: string[] = [
  "Getting bright light within an hour of waking is one of the most reliable",
  "ways to set your circadian rhythm for the day.",
  "It tells your body when to feel alert — and, hours later, when to begin",
  "winding down. Even ten minutes outside beats the brightest indoor lighting.",
  "Done consistently the payoff compounds: steadier energy, sharper focus,",
  "and deeper sleep across the days that follow.",
];
const BODY_Y = [116, 142, 186, 212, 256, 282];

// The tags added to the note — each on its own line (stacked at the editor's
// left margin), so every connector is a clean smooth curve with nothing to
// route around. `y` is the chip's vertical centre; `type` the keystrokes;
// `sugg` the autocomplete rows (first is the highlighted match); `rowY` its
// target Region row.
const TAGS = [
  {
    label: "#chronobiology",
    type: "#chr",
    sugg: ["chronobiology", "chronotype"],
    y: 336,
    rowY: 184,
  },
  {
    label: "#light-exposure",
    type: "#lig",
    sugg: ["light-exposure", "lighting"],
    y: 380,
    rowY: 316,
  },
  {
    label: "#sleep",
    type: "#sle",
    sugg: ["sleep", "sleep-debt"],
    y: 424,
    rowY: 360,
  },
];

const chipWidth = (label: string) => label.length * 8.6 + 28;

// A smooth connector from a stacked tag chip (at the editor's left margin) to
// its Region row in the sidebar.
function connectorPath(y: number, rowY: number) {
  return `M ${EDITOR_X} ${y} C ${EDITOR_X - 40} ${y}, ${ANCHOR_X + 32} ${rowY}, ${ANCHOR_X} ${rowY}`;
}

function MapGlyph({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g
      transform={`translate(${x}, ${y}) scale(1.05)`}
      stroke={color}
      fill="none"
      className={`transition-colors duration-300 ${EASE}`}
    >
      <path
        d="M5.8 2.5 2 4v9.5l3.8-1.5 4.4 1.5L14 12V2.5l-3.8 1.5L5.8 2.5Z"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M5.8 2.5v9.5M10.2 4v9.5" strokeWidth="1.2" />
    </g>
  );
}

function SunGlyph({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(1.05)`} stroke={color} fill="none">
      <circle cx="8" cy="8" r="3" strokeWidth="1.1" />
      <path
        d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M12.6 3.4l-.9.9M4.3 11.7l-.9.9"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </g>
  );
}

function GridGlyph({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(1.05)`} stroke={color} fill="none" strokeWidth="1.1">
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
    </g>
  );
}

function TagChip({ y, label }: { y: number; label: string }) {
  const w = chipWidth(label);
  return (
    <g>
      <rect
        x={EDITOR_X}
        y={y - CHIP_H / 2}
        width={w}
        height={CHIP_H}
        rx={CHIP_H / 2}
        fill={TAG_FILL}
      />
      <text
        x={EDITOR_X + w / 2}
        y={y + 5}
        fontSize="15"
        fontWeight="600"
        textAnchor="middle"
        fill={TAG_BLUE}
      >
        {label}
      </text>
    </g>
  );
}

// The whole app as one SVG. `committed` drives the tag chips + typing/popover;
// `connected` drives the connectors + Region highlights (separate so the mobile
// camera can commit the chips, pan, then wire up the Regions).
function RegionsSvg({
  committed,
  connected,
  typed,
  popoverOpen,
}: {
  committed: number;
  connected: number;
  typed: string;
  popoverOpen: boolean;
}) {
  const current = committed < TAGS.length ? TAGS[committed] : null;
  const cursorX = current ? EDITOR_X + typed.length * 10.5 + 3 : 0;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full"
      style={{ fontFamily: "inherit" }}
      aria-hidden="true"
    >
        {/* Sidebar */}
        <rect x="0" y="0" width={SIDEBAR_W} height={H} fill="#f7f7f8" />
        <line x1={SIDEBAR_W} y1="0" x2={SIDEBAR_W} y2={H} stroke="var(--border)" />

        {/* General group — sits up in the faded top of the window. */}
        <text x="28" y="34" fontSize="11" fontWeight="600" letterSpacing="0.9" fill="var(--muted)" opacity="0.7">
          GENERAL
        </text>
        <SunGlyph x={28} y={51} color="var(--muted)" />
        <text x="54" y="65" fontSize="16" fill="var(--foreground)" fillOpacity="0.78">
          Daily
        </text>
        <GridGlyph x={28} y={95} color="var(--muted)" />
        <text x="54" y="109" fontSize="16" fill="var(--foreground)" fillOpacity="0.78">
          All Notes
        </text>

        <text
          x="28"
          y="152"
          fontSize="11"
          fontWeight="600"
          letterSpacing="0.9"
          fill="var(--muted)"
          opacity="0.7"
        >
          REGIONS
        </text>

        {/* Sidebar rows */}
        {ROWS.map((row) => {
          const isOn = row.on !== null && row.on < connected;
          return (
            <g key={row.label}>
              <rect
                x="14"
                y={row.y - 17}
                width="252"
                height="34"
                rx="9"
                fill="var(--accent-soft)"
                className={`transition-opacity duration-500 ${EASE}`}
                opacity={isOn ? 1 : 0}
              />
              <MapGlyph
                x={28}
                y={row.y - 9}
                color={isOn ? "var(--accent)" : "var(--muted)"}
              />
              <text
                x="54"
                y={row.y + 5}
                fontSize="16"
                fontWeight={isOn ? 600 : 400}
                fill={isOn ? "var(--accent)" : "var(--foreground)"}
                fillOpacity={isOn ? 1 : 0.78}
                className={`transition-colors duration-300 ${EASE}`}
              >
                {row.label}
              </text>
            </g>
          );
        })}

        {/* Editor — title near the top, a developed note body, then the tags */}
        <text x={EDITOR_X} y="48" fontSize="30" fontWeight="600" fill="var(--foreground)">
          Morning Sunlight
        </text>
        <line x1={EDITOR_X} y1="74" x2="1150" y2="74" stroke="var(--border)" />
        {BODY.map((line, i) => (
          <text
            key={i}
            x={EDITOR_X}
            y={BODY_Y[i]}
            fontSize="16.5"
            fill="var(--foreground)"
            fillOpacity="0.6"
          >
            {line}
          </text>
        ))}

        {/* Connectors — route from each chip to its Region row, around the
            chips in between. */}
        {TAGS.map((tag, i) => {
          const drawn = i < connected;
          return (
            <path
              key={`line-${i}`}
              d={connectorPath(tag.y, tag.rowY)}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.75"
              strokeLinecap="round"
              pathLength={1}
              className={`transition-all duration-700 ${EASE}`}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: drawn ? 0 : 1,
                opacity: drawn ? 0.55 : 0,
              }}
            />
          );
        })}

        {/* Endpoint dots on the Region rows */}
        {TAGS.map((tag, i) => (
          <circle
            key={`dot-${i}`}
            cx={ANCHOR_X}
            cy={tag.rowY}
            r="4"
            fill="var(--accent)"
            className={`transition-opacity duration-500 ${EASE}`}
            opacity={i < connected ? 1 : 0}
          />
        ))}

        {/* Committed tag chips */}
        {TAGS.slice(0, committed).map((tag) => (
          <TagChip key={tag.label} y={tag.y} label={tag.label} />
        ))}

        {/* In-progress typing + blinking caret on the current tag line */}
        {current && typed && (
          <>
            <text x={EDITOR_X} y={current.y + 5} fontSize="18" fill="var(--muted)">
              {typed}
            </text>
            <rect
              x={cursorX}
              y={current.y - 11}
              width="2.5"
              height="23"
              rx="1"
              fill={TAG_BLUE}
              className="[animation:caret-blink_1.1s_steps(1)_infinite]"
            />
          </>
        )}

        {/* Tag autocomplete popover */}
        {current && popoverOpen && (
          <g className={`transition-opacity duration-200 ${EASE}`} style={{ opacity: 1 }}>
            <rect
              x={EDITOR_X}
              y={current.y + 26}
              width="372"
              height="128"
              rx="16"
              fill="#f4f4f5"
              stroke="var(--border)"
            />
            <text
              x={EDITOR_X + 22}
              y={current.y + 58}
              fontSize="11"
              fontWeight="700"
              letterSpacing="0.9"
              fill="var(--muted)"
              opacity="0.7"
            >
              TAGS
            </text>
            {/* highlighted match */}
            <rect
              x={EDITOR_X + 12}
              y={current.y + 70}
              width="348"
              height="32"
              rx="9"
              fill={TAG_BLUE}
            />
            <text x={EDITOR_X + 28} y={current.y + 91} fontSize="15" fill="#fff" opacity="0.85">
              #
            </text>
            <text x={EDITOR_X + 48} y={current.y + 91} fontSize="15" fontWeight="500" fill="#fff">
              {current.sugg[0]}
            </text>
            {/* second suggestion */}
            <text x={EDITOR_X + 28} y={current.y + 127} fontSize="15" fill="var(--muted)">
              #
            </text>
            <text x={EDITOR_X + 48} y={current.y + 127} fontSize="15" fill="var(--foreground)" fillOpacity="0.8">
              {current.sugg[1]}
            </text>
          </g>
        )}
    </svg>
  );
}

// Looping demo: for each tag, type the prefix → open the autocomplete popover →
// commit the highlighted match (chip + connector + Region highlight) → next.
// Hold the fully-wired state, then reset and repeat. Under prefers-reduced-
// motion it snaps to all three connected, no typing, no loop.
function useRegionTagDemo(active: boolean) {
  const [committed, setCommitted] = useState(0);
  const [typed, setTyped] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (!active) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      const t = setTimeout(() => setCommitted(TAGS.length), 0);
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
        setCommitted(0);
        setTyped("");
        setPopoverOpen(false);
        await wait(900);
        if (cancelled) return;

        for (let i = 0; i < TAGS.length; i++) {
          const keys = TAGS[i].type;
          for (let c = 1; c <= keys.length; c++) {
            setTyped(keys.slice(0, c));
            await wait(95);
            if (cancelled) return;
          }
          setPopoverOpen(true);
          await wait(1100);
          if (cancelled) return;

          setPopoverOpen(false);
          setTyped("");
          setCommitted(i + 1);
          await wait(850);
          if (cancelled) return;
        }

        await wait(3800);
        if (cancelled) return;
      }
    }
    loop();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [active]);

  return { committed, typed, popoverOpen };
}

// ── Mobile camera ────────────────────────────────────────────────────────────
// The side-by-side app can't be legible shrunk to a phone, so on small screens
// we zoom into the SVG (MZOOM×) and pan a viewport between two framings: the
// note (where the stacked tags are typed) and the sidebar (where the Regions
// wire up). fx is the horizontal focus (0–1 of the viewBox); the vertical view
// is fixed (the whole note height fits).
const MZOOM = 3;
const FX_EDITOR = 0.4; // frames the note + its stacked tags
const FX_SIDEBAR = 1 / 6; // left-clamped so the sidebar fills the frame

function MobileCamera({ fx, children }: { fx: number; children: ReactNode }) {
  const tx = (0.5 / MZOOM - fx) * 100; // % of the (zoomed) child's width
  const ty = 5;
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-background">
      <div
        className={`absolute left-0 top-0 w-[300%] origin-top-left transition-transform duration-700 ${EASE}`}
        style={{ transform: `translate(${tx}%, ${ty}%)` }}
      >
        {children}
      </div>
    </div>
  );
}

// Mobile timeline: type the stacked tags with the camera on the note, then pan
// to the sidebar and wire the Regions up one by one. No popover (no room).
function useRegionTagDemoMobile(active: boolean) {
  const [committed, setCommitted] = useState(0);
  const [connected, setConnected] = useState(0);
  const [typed, setTyped] = useState("");
  const [fx, setFx] = useState(FX_EDITOR);

  useEffect(() => {
    if (!active) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      const t = setTimeout(() => {
        setCommitted(TAGS.length);
        setConnected(TAGS.length);
        setFx(FX_SIDEBAR);
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
        setCommitted(0);
        setConnected(0);
        setTyped("");
        setFx(FX_EDITOR);
        await wait(900);
        if (cancelled) return;

        // Type + commit each tag on its own line (camera stays on the note).
        for (let i = 0; i < TAGS.length; i++) {
          const keys = TAGS[i].type;
          for (let c = 1; c <= keys.length; c++) {
            setTyped(keys.slice(0, c));
            await wait(95);
            if (cancelled) return;
          }
          await wait(450);
          if (cancelled) return;
          setTyped("");
          setCommitted(i + 1);
          await wait(350);
          if (cancelled) return;
        }

        // Glide to the sidebar and wire up the Regions.
        setFx(FX_SIDEBAR);
        await wait(800);
        if (cancelled) return;
        for (let i = 0; i < TAGS.length; i++) {
          setConnected(i + 1);
          await wait(800);
          if (cancelled) return;
        }

        await wait(3200);
        if (cancelled) return;
      }
    }
    loop();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [active]);

  return { committed, connected, typed, fx };
}

function MapIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.8 2.5 2 4v9.5l3.8-1.5 4.4 1.5L14 12V2.5l-3.8 1.5L5.8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M5.8 2.5v9.5M10.2 4v9.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function Regions() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const desktop = useRegionTagDemo(inView);
  const mobile = useRegionTagDemoMobile(inView);

  return (
    <section className="overflow-x-clip py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-subtle px-3 py-1 text-xs font-medium text-muted">
            <span className="text-accent">
              <MapIcon />
            </span>
            Regions
          </span>

          <h2 className="mt-5 text-balance text-3xl leading-[1.15] tracking-tight text-sky-950 sm:text-4xl sm:leading-[1.1]">
            You shouldn&apos;t have to file your ideas to find them later.
          </h2>

          <p className="mt-5 text-pretty text-base leading-snug text-slate-500 sm:text-lg">
            Atlas has no folders to organize and no hierarchy to plan. You tag a
            note, and it joins the matching Region automatically — a living
            collection of everything you&apos;ve written on a subject. Every
            Region lives in your sidebar, one click from wherever you left off.
          </p>

          <p className="mt-5 text-pretty text-base leading-snug text-slate-500 sm:text-lg">
            A folder gives a note one home. A tag lets it belong to every subject
            it touches — so a single note can live in as many Regions as it
            earns, no copies, no choosing.
          </p>
        </div>

        {/* Life-sized app. On large screens it's full width, faded into the
            page. On small screens the side-by-side layout can't be legible, so
            the same app is zoomed into a camera that pans to follow the action. */}
        <div ref={ref} className="mt-12 sm:mt-16">
          <div className="relative hidden w-full overflow-hidden rounded-xl border border-border bg-background lg:block [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_9%,#000_88%,transparent_100%)] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_9%,#000_88%,transparent_100%)]">
            <RegionsSvg
              committed={desktop.committed}
              connected={desktop.committed}
              typed={desktop.typed}
              popoverOpen={desktop.popoverOpen}
            />
          </div>

          <div className="lg:hidden">
            <MobileCamera fx={mobile.fx}>
              <RegionsSvg
                committed={mobile.committed}
                connected={mobile.connected}
                typed={mobile.typed}
                popoverOpen={false}
              />
            </MobileCamera>
          </div>
        </div>
      </div>
    </section>
  );
}
