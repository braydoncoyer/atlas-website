"use client";

// The hero product visual: a working recreation of the Lore macOS window.
// Built in markup rather than a screenshot so it stays crisp at any size —
// and, on desktop, it's genuinely interactive: the sidebar navigates between
// notes (Daily, All Notes, Pinned, Recent), and note bodies are editable with
// real Markdown behavior (see lore/NoteEditor). Titles are fixed; edits live
// in memory for the session. On touch devices it renders as a static shot.

import { useRef, useState, useSyncExternalStore } from "react";
import AllNotes from "./lore/AllNotes";
import EditableTitle from "./lore/EditableTitle";
import NoteEditor from "./lore/NoteEditor";
import {
  ChevronMini,
  ComposeIcon,
  GridIcon,
  MapIcon,
  PanelIcon,
  SearchIcon,
  SunIcon,
} from "./lore/icons";
import {
  makeDailyNote,
  makeScratchNote,
  noteById,
  NOTES,
  REGION_NOTES,
  START_HERE_ID,
  WHY_LORE_ID,
  type LoreNote,
} from "./lore/notes";

type View = { kind: "note"; id: string } | { kind: "all" };

// Editing is desktop-only (a fine pointer + hover implies a hardware
// keyboard); phones and iPads get the static shot. SSR snapshot is false.
const POINTER_QUERY = "(hover: hover) and (pointer: fine)";

function subscribePointer(onChange: () => void) {
  const mq = window.matchMedia(POINTER_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useIsDesktopPointer() {
  return useSyncExternalStore(
    subscribePointer,
    () => window.matchMedia(POINTER_QUERY).matches,
    () => false
  );
}

function TrafficLights() {
  return (
    <>
      <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
      <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
      <span className="h-3 w-3 rounded-full bg-[#28c840]" />
    </>
  );
}

function GroupLabel({
  children,
  chevron = false,
}: {
  children: React.ReactNode;
  chevron?: boolean;
}) {
  return (
    <p className="flex items-center gap-1 px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#98938a]">
      {children}
      {chevron ? <ChevronMini /> : null}
    </p>
  );
}

function SidebarItem({
  icon,
  iconClass,
  label,
  active = false,
  onClick,
}: {
  icon?: React.ReactNode;
  /** Color for the icon (the real app tints them: amber sun, blue grid, green maps). */
  iconClass?: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const base = "flex w-full items-center gap-2.5 rounded-md px-2 py-[5px] text-left text-[13px]";
  const tone = active ? "bg-black/[0.06] font-medium text-[#26241f]" : "text-[#43403a]";
  const inner = (
    <>
      {icon ? <span className={`shrink-0 ${iconClass ?? "text-[#8f8b84]"}`}>{icon}</span> : null}
      <span className="truncate">{label}</span>
    </>
  );
  if (!onClick) {
    return <div className={`${base} ${tone}`}>{inner}</div>;
  }
  return (
    <button type="button" onClick={onClick} className={`${base} ${tone} hover:bg-black/[0.04]`}>
      {inner}
    </button>
  );
}

export default function ProductShot() {
  const [view, setView] = useState<View>({ kind: "note", id: WHY_LORE_ID });
  // Notes created at runtime (today's daily note, the "Untitled" scratch note).
  const [extraNotes, setExtraNotes] = useState<Record<string, LoreNote>>({});
  const [recentIds, setRecentIds] = useState<string[]>([WHY_LORE_ID]);
  const [lastNoteId, setLastNoteId] = useState<string>(WHY_LORE_ID);
  const editable = useIsDesktopPointer();
  // Live note bodies, keyed by id. NoteEditor only reads its html prop at
  // mount (the DOM owns it afterwards), so per-keystroke updates here never
  // touch the editor's DOM — they just keep All Notes snippets and note
  // switches in sync. Same deal for `titles` and EditableTitle.
  const [contents, setContents] = useState<Record<string, string>>({});
  const [titles, setTitles] = useState<Record<string, string>>({});
  const scratchCount = useRef(0);

  const getNote = (id: string): LoreNote | undefined => noteById[id] ?? extraNotes[id];
  const titleOf = (note: LoreNote) => titles[note.id] ?? note.title;

  function openNote(note: LoreNote) {
    if (!noteById[note.id]) {
      setExtraNotes((m) => (m[note.id] ? m : { ...m, [note.id]: note }));
    }
    setView({ kind: "note", id: note.id });
    setLastNoteId(note.id);
    // Recent tracks only notes with no permanent home in the sidebar: daily
    // lives under Daily, regions under Regions, Start Here under Pinned.
    const alwaysReachable =
      note.id === START_HERE_ID || note.isRegion || note.id.startsWith("daily-");
    if (!alwaysReachable) {
      setRecentIds((ids) => [note.id, ...ids.filter((i) => i !== note.id)].slice(0, 4));
    }
  }

  function createNote() {
    scratchCount.current += 1;
    openNote(makeScratchNote(scratchCount.current));
  }

  // Obsidian-style link resolution: a link opens the note with that title,
  // or creates an empty one (locked title) if it doesn't exist yet.
  function openLink(title: string) {
    const known = [...NOTES, ...REGION_NOTES, ...Object.values(extraNotes)].find(
      (n) => titleOf(n).toLowerCase() === title.toLowerCase()
    );
    if (known) {
      openNote(known);
      return;
    }
    openNote({
      id: `linked-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title,
      badge: "purple",
      seedHtml: "",
    });
  }

  const activeNote = view.kind === "note" ? getNote(view.id) : undefined;
  const isDailyActive = view.kind === "note" && view.id.startsWith("daily-");

  return (
    <div className="relative flex h-[26rem] flex-col overflow-hidden rounded-xl border border-black/[0.08] bg-[#faf9f7] shadow-2xl shadow-black/10 ring-1 ring-black/[0.04] sm:h-[30rem] lg:h-[48rem]">
      {/* The window is a fixed, app-like size at every breakpoint; note
          content scrolls inside the pane instead of growing the frame. */}
      <div className="flex min-h-0 flex-1">
        {/* Sidebar — hidden on small screens, like toggling it closed in the app */}
        <aside className="hidden w-[244px] shrink-0 flex-col overflow-hidden border-r border-black/[0.06] bg-[#f4f2ef] px-3 lg:flex">
          <div className="flex items-center gap-2 pb-1 pt-3.5">
            <TrafficLights />
            <span className="ml-2 text-[#8f8b84]">
              <PanelIcon />
            </span>
            <span className="grid h-5 w-4 place-items-center text-[13px] text-[#8f8b84]">‹</span>
            <span className="grid h-5 w-4 place-items-center text-[13px] text-[#cbc7c0]">›</span>
          </div>

          <div className="pt-2">
            <SidebarItem icon={<ComposeIcon />} label="New Note" onClick={createNote} />
            <SidebarItem icon={<SearchIcon />} label="Search" />
          </div>

          <div className="min-h-0 flex-1">
            <GroupLabel>General</GroupLabel>
            <SidebarItem
              icon={<SunIcon />}
              iconClass="text-[#e2a114]"
              label="Daily"
              active={isDailyActive}
              onClick={() => openNote(makeDailyNote(new Date()))}
            />
            <SidebarItem
              icon={<GridIcon />}
              iconClass="text-[#3576f0]"
              label="All Notes"
              active={view.kind === "all"}
              onClick={() => setView({ kind: "all" })}
            />

            <GroupLabel chevron>Regions</GroupLabel>
            {REGION_NOTES.map((region) => (
              <SidebarItem
                key={region.id}
                icon={<MapIcon />}
                iconClass="text-[#3f9d58]"
                label={region.title}
                active={view.kind === "note" && view.id === region.id}
                onClick={() => openNote(region)}
              />
            ))}

            <GroupLabel chevron>Pinned</GroupLabel>
            <SidebarItem
              label="Start Here"
              active={view.kind === "note" && view.id === START_HERE_ID}
              onClick={() => openNote(noteById[START_HERE_ID])}
            />

            <GroupLabel chevron>Recent</GroupLabel>
            {recentIds.map((id) => {
              const note = getNote(id);
              if (!note) return null;
              return (
                <SidebarItem
                  key={id}
                  label={titleOf(note) || "Untitled"}
                  active={view.kind === "note" && view.id === id}
                  onClick={() => openNote(note)}
                />
              );
            })}
          </div>
        </aside>

        {/* Content pane */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* window chrome — shown here only when the sidebar is hidden (small screens) */}
          <div className="flex shrink-0 items-center gap-2 px-6 pb-1 pt-3.5 lg:hidden">
            <TrafficLights />
          </div>

          <div className="min-h-0 flex-1 overflow-hidden lg:overflow-y-auto">
            {view.kind === "all" ? (
              <AllNotes
                notes={NOTES}
                contents={contents}
                selectedId={lastNoteId}
                onOpen={openNote}
              />
            ) : activeNote ? (
              <div className="mx-auto max-w-[41rem] px-6 pb-24 pt-4 sm:px-10 lg:pt-14">
                {activeNote.tag ? (
                  <span className="inline-block rounded-md bg-[#3576f0]/10 px-1.5 py-0.5 text-[11px] font-medium text-[#3576f0]">
                    {activeNote.tag}
                  </span>
                ) : null}
                {activeNote.editableTitle ? (
                  <EditableTitle
                    // NOT activeNote.id — NoteEditor below already uses that
                    // key, and duplicate sibling keys corrupt reconciliation
                    // (React re-mounts the title on every render and strands
                    // the old DOM node).
                    key={`title-${activeNote.id}`}
                    title={titleOf(activeNote)}
                    editable={editable}
                    className="lore-serif text-[27px] font-bold tracking-tight text-[#211f1c]"
                    onChange={(t) =>
                      setTitles((m) => ({ ...m, [activeNote.id]: t }))
                    }
                  />
                ) : (
                  <h3
                    className={`lore-serif flex items-center gap-3 text-[27px] font-bold tracking-tight text-[#211f1c] ${
                      activeNote.tag ? "mt-2.5" : ""
                    }`}
                  >
                    {activeNote.isRegion ? (
                      <span className="text-[#3f9d58] [&_svg]:h-[22px] [&_svg]:w-[22px]">
                        <MapIcon />
                      </span>
                    ) : null}
                    {activeNote.title}
                  </h3>
                )}
                <div className="mb-6 mt-4 h-px w-full bg-black/[0.08]" />
                <NoteEditor
                  key={activeNote.id}
                  html={contents[activeNote.id] ?? activeNote.seedHtml}
                  editable={editable}
                  onChange={(html) => {
                    setContents((c) => ({ ...c, [activeNote.id]: html }));
                  }}
                  onLinkClick={openLink}
                />
              </div>
            ) : null}
          </div>

          {/* Soft glow pooling at the bottom of the editor, like the app's
              ambient accent light. Purely decorative. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 overflow-hidden lg:block"
          >
            <div className="absolute left-1/2 top-10 h-36 w-[26rem] -translate-x-[70%] rounded-full bg-[radial-gradient(circle,rgba(96,140,245,0.30),transparent_70%)] blur-2xl" />
            <div className="absolute left-1/2 top-14 h-32 w-[22rem] -translate-x-[15%] rounded-full bg-[radial-gradient(circle,rgba(226,120,190,0.24),transparent_70%)] blur-2xl" />
          </div>
        </div>
      </div>

      {/* On small screens the window has a fixed, app-like height and the note
          clips at the bottom edge — fade it out so the cut reads as a window,
          not a truncated page. Desktop scrolls instead.
          A solid layer faded via mask (not a gradient to `transparent`): iOS
          Safari interpolates gradient colors unpremultiplied, so fading to
          transparent — which is transparent *black* — renders a gray band.
          Masks only interpolate alpha, so no such banding. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-xl bg-[#faf9f7] [mask-image:linear-gradient(to_top,black,transparent)] lg:hidden"
      />
    </div>
  );
}
