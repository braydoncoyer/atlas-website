"use client";

// Overview section directly under the hero: what Atlas is and how it's
// different, distilled into three pillars — a writing-first editor that gets
// out of the way, plain-Markdown files you own, and AI that surfaces what
// you've written rather than writing it for you. The deeper AI story lives in
// NearbyNotes just below; this section stays high-level.
//
// Each pillar's visual is an equal-height framed card so they read as
// intentional peers: a page being written (clean text + live caret), a raw
// Markdown file on disk, and a constellation of surfaced connections.
//
// Grounded in ../atlas/prd.md: writing-first (the editor is the headline);
// Markdown files on disk are the source of truth (ownership, no lock-in); and
// "AI Should surface / answer / locate" but "Should Not write / autocomplete /
// rewrite". Nothing here claims web/cross-platform or AI authoring.

import { useInView } from "./useInView";

function Compass() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.1" />
      <path d="M10.6 5.4 9 9l-3.6 1.6L7 7l3.6-1.6Z" fill="currentColor" />
    </svg>
  );
}

// Shared frame so all three pillar visuals are the exact same size and weight.
function VisualCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-40 overflow-hidden rounded-xl border border-border bg-background shadow-sm shadow-black/[0.03] ${className}`}
    >
      {children}
    </div>
  );
}

// ── Pillar visuals ───────────────────────────────────────────────────────────

// 1. The card itself is a "page" being written — a title, a few clean text
//    lines and a live caret. The interface recedes so the writing leads.
function WritingVisual() {
  return (
    <VisualCard className="items-center px-7">
      <div className="w-full">
        <div className="h-2.5 w-1/3 rounded-full bg-foreground/25" />
        <div className="mt-4 space-y-2.5">
          <div className="h-2 w-full rounded-full bg-foreground/[0.12]" />
          <div className="h-2 w-[92%] rounded-full bg-foreground/[0.12]" />
          <div className="h-2 w-[78%] rounded-full bg-foreground/[0.12]" />
          <div className="flex items-center text-[11px]">
            <div className="h-2 w-2/5 rounded-full bg-foreground/[0.12]" />
            <span className="writing-caret" />
          </div>
        </div>
      </div>
    </VisualCard>
  );
}

// 2. The card is a Markdown file on disk — a filename header and a few lines of
//    raw Markdown, the syntax marks tinted accent to read as "your files".
function MarkdownVisual() {
  return (
    <VisualCard className="flex-col">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5 text-muted">
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M4 1.8h4.6L12 5.2v8.5a.7.7 0 0 1-.7.7H4a.7.7 0 0 1-.7-.7V2.5A.7.7 0 0 1 4 1.8Z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <path d="M8.4 1.9v3.3h3.3" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
        <span className="font-mono text-[11px]">morning-sunlight.md</span>
      </div>
      <div className="flex-1 px-4 py-3.5 font-mono text-[11.5px] leading-[1.95] text-slate-500">
        <div>
          <span className="text-accent">#</span> Morning Sunlight
        </div>
        <div>
          Light <span className="text-accent">**anchors**</span> your day.
        </div>
        <div>
          <span className="text-accent">-</span> ten minutes outside
        </div>
      </div>
    </VisualCard>
  );
}

// 3. A constellation: the current note (accent) with related notes surfaced
//    around it, plus a sparkle — Atlas finding connections, not writing them.
function ConnectionsVisual() {
  return (
    <VisualCard className="items-center justify-center">
      <svg width="208" height="128" viewBox="0 0 208 128" fill="none" aria-hidden="true">
        <g stroke="var(--border)" strokeWidth="1.1">
          <path d="M104 64 34 30M104 64 42 100M104 64 174 32M104 64 166 98" />
        </g>
        <g fill="var(--background)" stroke="var(--border)" strokeWidth="1.2">
          <circle cx="34" cy="30" r="5.5" />
          <circle cx="42" cy="100" r="5.5" />
          <circle cx="174" cy="32" r="5.5" />
          <circle cx="166" cy="98" r="5.5" />
        </g>
        <circle cx="104" cy="64" r="10" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
        <circle cx="104" cy="64" r="3" fill="var(--accent)" />
        <path
          d="M142 32c.3 2.3 1.1 3.1 3.4 3.4-2.3.3-3.1 1.1-3.4 3.4-.3-2.3-1.1-3.1-3.4-3.4 2.3-.3 3.1-1.1 3.4-3.4Z"
          fill="var(--accent)"
        />
      </svg>
    </VisualCard>
  );
}

const PILLARS: { title: string; body: string; visual: React.ReactNode }[] = [
  {
    title: "Writing comes first",
    body: "A fast, native editor that disappears while you use it. No clutter, no menus to wade through — just you and the page.",
    visual: <WritingVisual />,
  },
  {
    title: "Your notes belong to you",
    body: "Every note is a plain Markdown file on your device. No proprietary format, no lock-in — open them anywhere and sync them however you like.",
    visual: <MarkdownVisual />,
  },
  {
    title: "AI that reads, not writes",
    body: "AI that reads your notes instead of writing them — surfacing related ideas and answering questions in plain English. Never inventing, only retrieving.",
    visual: <ConnectionsVisual />,
  },
];

export default function WhatIsAtlas() {
  const { ref, inView } = useInView<HTMLDivElement>();

  // Continuous stagger across the intro and the three columns.
  let step = 0;
  const delay = () =>
    ({ "--reveal-delay": `${step++ * 90}ms` }) as React.CSSProperties;

  return (
    <section className="overflow-x-clip py-24 sm:py-32">
      <div ref={ref} className={inView ? "reveal-in" : ""}>
        <div className="mx-auto max-w-7xl px-6">
          {/* Intro */}
          <div className="mx-auto max-w-2xl text-center">
            <span
              className="reveal-item inline-flex items-center gap-1.5 rounded-full border border-border bg-subtle px-3 py-1 text-xs font-medium text-muted"
              style={delay()}
            >
              <span className="text-accent">
                <Compass />
              </span>
              What is Atlas
            </span>

            <h2
              className="reveal-item mt-5 text-balance text-3xl leading-[1.05] tracking-tight text-sky-950 sm:text-4xl sm:leading-[1.0]"
              style={delay()}
            >
              Your best ideas are still yours.
            </h2>

            <p
              className="reveal-item mx-auto mt-5 max-w-xl text-pretty text-base leading-snug text-slate-500 sm:text-lg"
              style={delay()}
            >
              Atlas is an Apple-native notes app built on a quiet idea — that the
              ideas worth keeping are the ones you already had, and the job of
              good software is to protect them, not replace them.
            </p>
          </div>

          {/* Three pillars */}
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-3">
            {PILLARS.map((p) => (
              <div key={p.title} className="reveal-item flex flex-col" style={delay()}>
                {p.visual}
                <h3 className="mt-6 text-[17px] font-semibold tracking-tight text-sky-950">
                  {p.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-slate-600">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
