// Seed data for the interactive Lore window on the landing page. Notes are
// plain HTML strings because the editor is a contentEditable surface — edits
// live only in memory for the session. Titles are fixed; only bodies are
// editable.

export type NoteBadge = "green" | "red" | "purple" | "blue";

export type LoreNote = {
  id: string;
  title: string;
  /** Optional tag pill shown above the title (e.g. "#product"). */
  tag?: string;
  /** Icon badge color used on All Notes cards. Blue renders a calendar. */
  badge: NoteBadge;
  /** All Notes group. Notes without a group (daily, scratch) stay off the grid. */
  group?: "today" | "yesterday" | "july";
  pinned?: boolean;
  /** Region notes get the map icon next to their title. */
  isRegion?: boolean;
  /** Freshly created notes are the only ones whose title can be changed. */
  editableTitle?: boolean;
  seedHtml: string;
};

export const WHY_LORE_ID = "why-lore-exists";
export const START_HERE_ID = "start-here";

const WHY_LORE_EXISTS: LoreNote = {
  id: WHY_LORE_ID,
  title: "Why Lore Exists",
  tag: "#product",
  badge: "purple",
  group: "today",
  seedHtml:
    "<p>The point of Lore isn't to store notes — plenty of apps do that. It's to surface the connections you'd never find by hand, while never interrupting the writing. Plain Markdown files you own, a beautiful place to write them, and an intelligence layer that stays invisible until you ask.</p>" +
    "<p>Which is the pricing argument too: <mark>you charge for craft, not for access.</mark> Competing on price is a race to be the cheapest commodity; the bet here is that people pay properly for something that feels good and earns trust with their own words. That sits in honest tension with the grow-by-discounting instinct in <a>Pricing Experiments</a>.</p>",
};

const START_HERE: LoreNote = {
  id: START_HERE_ID,
  title: "Start Here",
  badge: "green",
  group: "july",
  pinned: true,
  seedHtml:
    "<p>Welcome to Lore.</p>" +
    "<p>Lore is built around a simple idea: your notes should belong to you, and they should become more valuable the more you write.</p>" +
    "<h2>Start writing</h2>" +
    "<p>The editor is the heart of Lore. It's fast, native, and designed to stay out of your way.</p>" +
    "<p>Because Lore uses Markdown, formatting is just typing: <code>**bold**</code>, <code>*italic*</code>, <code># heading</code>, <code>&gt; callout</code>.</p>" +
    "<blockquote><p>Try it right here — this note is yours to edit.</p></blockquote>" +
    "<h2>Your notes belong to you</h2>" +
    "<p>Every note is stored as a plain Markdown file on your machine.</p>",
};

// Dummy atomic notes for the All Notes grid — single-idea, declarative titles
// that echo the sidebar regions (chronobiology, sleep, focus, product).
const ATOMIC_NOTES: LoreNote[] = [
  {
    id: "morning-light",
    title: "Morning light anchors the circadian clock",
    badge: "green",
    group: "today",
    seedHtml:
      "<p>Ten minutes of outdoor light within an hour of waking sets the day's melatonin timer. Overcast daylight still beats any indoor lamp.</p>",
  },
  {
    id: "sleep-pressure",
    title: "Sleep pressure is an adenosine budget",
    badge: "red",
    group: "today",
    seedHtml:
      "<p>Every waking hour deposits adenosine. Caffeine doesn't cancel the debt — it hides the statement.</p>",
  },
  {
    id: "attention-frays",
    title: "Attention frays after ninety minutes",
    badge: "purple",
    group: "today",
    seedHtml:
      "<p>Focus runs in ultradian cycles of roughly ninety minutes. Schedule the break before the crash, not after it.</p>",
  },
  {
    id: "blue-light",
    title: "Blue light is a timing signal, not a poison",
    badge: "green",
    group: "yesterday",
    seedHtml:
      "<p>The dose and the hour matter more than the color. A bright screen at noon is fine; a dim amber one at midnight still delays sleep.</p>",
  },
  {
    id: "shutdown-ritual",
    title: "Deep work ends with a shutdown ritual",
    badge: "purple",
    group: "yesterday",
    seedHtml:
      "<p>An explicit &quot;done for today&quot; closes open loops so they stop billing the mind overnight.</p>",
  },
  {
    id: "charge-for-craft",
    title: "You charge for craft, not for access",
    badge: "red",
    group: "yesterday",
    seedHtml:
      "<p>Competing on price is a race to be the cheapest commodity. People pay properly for tools that feel good and earn trust with their own words.</p>",
  },
  {
    id: "letters-to-future-self",
    title: "Notes are letters to your future self",
    badge: "green",
    group: "yesterday",
    seedHtml:
      "<p>Write for a reader who has forgotten today's context. Future-you is a stranger with your handwriting.</p>",
  },
  {
    id: "core-temperature",
    title: "Core temperature gates sleep onset",
    badge: "green",
    group: "july",
    seedHtml:
      "<p>The body needs to shed about a degree to fall asleep. A warm bath works by forcing the drop that follows it.</p>",
  },
  {
    id: "constraints-style",
    title: "Constraints are where style comes from",
    badge: "purple",
    group: "july",
    seedHtml:
      "<p>Every tool that removes a limit also removes a decision. Style is the residue of decisions.</p>",
  },
  {
    id: "naming-notes",
    title: "Naming a note is thinking twice",
    badge: "red",
    group: "july",
    seedHtml:
      "<p>If the idea won't fit in a one-line title, it's two ideas. Split them.</p>",
  },
];

/** Grid order for All Notes: Today, Yesterday, July. */
export const NOTES: LoreNote[] = [
  WHY_LORE_EXISTS,
  ...ATOMIC_NOTES.filter((n) => n.group === "today"),
  ...ATOMIC_NOTES.filter((n) => n.group === "yesterday"),
  ...ATOMIC_NOTES.filter((n) => n.group === "july"),
  START_HERE,
];

// Regions are notes themselves: an "area of thinking" whose body is a list of
// links into the notes that belong to it. Generic areas so any note-taker /
// PKM visitor sees themselves in the sidebar.
function regionNote(name: string, links: string[]): LoreNote {
  return {
    id: `region-${name.toLowerCase()}`,
    title: name,
    badge: "green",
    isRegion: true,
    seedHtml: `<ul>${links.map((l) => `<li><a>${l}</a></li>`).join("")}</ul>`,
  };
}

export const REGION_NOTES: LoreNote[] = [
  regionNote("Focus", [
    "Attention frays after ninety minutes",
    "Deep work ends with a shutdown ritual",
    "The 23-minute cost of context switching",
  ]),
  regionNote("Health", [
    "Morning light anchors the circadian clock",
    "Sleep pressure is an adenosine budget",
    "Blue light is a timing signal, not a poison",
    "Core temperature gates sleep onset",
  ]),
  regionNote("Ideas", [
    "Constraints are where style comes from",
    "Naming a note is thinking twice",
    "Notes are letters to your future self",
    "You charge for craft, not for access",
  ]),
];

export const noteById: Record<string, LoreNote> = Object.fromEntries(
  [...NOTES, ...REGION_NOTES].map((n) => [n.id, n])
);

/** Today's daily note — empty by default. Created client-side on first open. */
export function makeDailyNote(now: Date): LoreNote {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return {
    id: `daily-${y}-${m}-${d}`,
    title: now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    badge: "blue",
    seedHtml: "",
  };
}

/** A fresh note from "New Note" — the only kind whose title is editable. */
export function makeScratchNote(n: number): LoreNote {
  return {
    id: `untitled-${n}`,
    title: "Untitled",
    badge: "purple",
    editableTitle: true,
    seedHtml: "",
  };
}
