"use client";

// The "All Notes" grid view inside the Lore window mock: an Open Loops chip,
// then note cards grouped by recency, mirroring the real app's layout. Card
// snippets come from the live note contents so edits show up here.

import { CalendarIcon, DocIcon, PinIcon } from "./icons";
import type { LoreNote, NoteBadge } from "./notes";

const BADGE_STYLES: Record<NoteBadge, string> = {
  green: "bg-[#e3f2e6] text-[#3f9d58]",
  red: "bg-[#fdeaec] text-[#de5462]",
  purple: "bg-[#eee9fe] text-[#7a5af5]",
  blue: "bg-[#e6eefc] text-[#3576f0]",
};

const GROUPS: Array<{ key: NonNullable<LoreNote["group"]>; label: string }> = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "july", label: "July" },
];

function snippet(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\u200B/g, "")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function NoteCard({
  note,
  body,
  selected,
  onOpen,
}: {
  note: LoreNote;
  body: string;
  selected: boolean;
  onOpen: (note: LoreNote) => void;
}) {
  const text = snippet(body);
  return (
    <button
      type="button"
      onClick={() => onOpen(note)}
      className={`flex min-h-[9.5rem] flex-col items-start gap-2.5 rounded-xl bg-white p-4 text-left transition-shadow hover:shadow-md ${
        selected
          ? "ring-2 ring-[#4a83f0]"
          : "shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.05]"
      }`}
    >
      <span className="flex w-full items-center gap-2">
        <span
          className={`grid h-[22px] w-[22px] place-items-center rounded-md ${BADGE_STYLES[note.badge]}`}
        >
          {note.badge === "blue" ? <CalendarIcon /> : <DocIcon />}
        </span>
        {note.pinned ? <span className="text-[#a9a49b]"><PinIcon /></span> : null}
      </span>
      <span className="text-[14px] font-semibold leading-snug text-[#26241f]">
        {note.title}
      </span>
      {text ? (
        <span className="line-clamp-4 text-[11.5px] leading-relaxed text-[#8c8880]">
          {text}
        </span>
      ) : null}
    </button>
  );
}

export default function AllNotes({
  notes,
  contents,
  selectedId,
  onOpen,
}: {
  notes: LoreNote[];
  /** Live note bodies (edits included); falls back to each note's seed. */
  contents: Record<string, string>;
  /** The most recently opened note gets the blue selection ring. */
  selectedId: string | null;
  onOpen: (note: LoreNote) => void;
}) {
  return (
    <div className="px-7 pb-16 pt-9 lg:px-11">
      <h3 className="text-[26px] font-bold tracking-tight text-[#211f1c]">
        All Notes
      </h3>

      <div className="mt-6 w-full max-w-[22.5rem] rounded-xl bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.05]">
        <div className="flex items-center gap-2">
          <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[#3576f0] text-[10px] font-bold text-white">
            ?
          </span>
          <span className="text-[13px] font-semibold text-[#26241f]">
            Open Loops
          </span>
          <span className="ml-auto text-[12px] text-[#8c8880]">
            9 answered · 38 open
          </span>
        </div>
        <p className="mt-1.5 text-[12px] text-[#8c8880]">
          &ldquo;What is the purpose of this?&rdquo;
        </p>
      </div>

      {GROUPS.map((group) => {
        const groupNotes = notes.filter((n) => n.group === group.key);
        if (groupNotes.length === 0) return null;
        return (
          <section key={group.key}>
            <div className="flex items-baseline gap-2 pb-3 pt-8">
              <h4 className="text-[13px] font-semibold text-[#57534e]">
                {group.label}
              </h4>
              <span className="text-[12px] text-[#a8a29e]">
                {groupNotes.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {groupNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  body={contents[note.id] ?? note.seedHtml}
                  selected={selectedId === note.id}
                  onOpen={onOpen}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
