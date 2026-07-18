"use client";

// The editable body of a note in the Lore window mock. A contentEditable
// surface with just enough Markdown behavior to feel like the real editor:
//
//   - Shortcuts: ⌘B bold, ⌘I italic, ⌘⇧X / ⌘⇧S strikethrough
//   - Block rules (typed at the start of a line, completed by space):
//     `#`/`##`/`###` headings, `>` callout, `-` bullets, `1.` numbered list
//   - Inline rules (completed by the closing marker): **bold**, *italic*,
//     ~~strike~~, `code`
//
// Parents remount it per note (via `key`) so the initial HTML is set once with
// dangerouslySetInnerHTML and never touched by React again — the DOM is the
// source of truth while typing, and every change is reported up via onChange.

import { useRef, useState } from "react";

// Inner content may not contain (or start/end with) the marker character —
// otherwise typing the closing `*` of `**bold**` would fire the italic rule
// early on `**bold*` (its first `*` counts as non-space content).
const INLINE_RULES: Array<[RegExp, string]> = [
  [/`([^`]+)`$/, "code"],
  [/~~([^~\s](?:[^~]*[^~\s])?)~~$/, "s"],
  [/\*\*([^*\s](?:[^*]*[^*\s])?)\*\*$/, "strong"],
  [/(?<!\*)\*([^*\s](?:[^*]*[^*\s])?)\*$/, "em"],
];

const HEADING_MARKERS: Record<string, string> = {
  "#": "h1",
  "##": "h2",
  "###": "h3",
};

function placeCaret(node: Node, offset: number) {
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

function emptyParagraph() {
  const p = document.createElement("p");
  p.appendChild(document.createElement("br"));
  return p;
}

export default function NoteEditor({
  html,
  editable,
  onChange,
  onLinkClick,
}: {
  /** Initial body HTML; the DOM owns it afterwards. */
  html: string;
  /** False on touch devices — the note renders as static text. */
  editable: boolean;
  onChange: (html: string) => void;
  /** Obsidian-style note links: called with the link's text on click. */
  onLinkClick?: (title: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const composing = useRef(false);
  // Captured once, as a referentially-stable object — after mount the DOM
  // owns the content and React must never rewrite it (the parent remounts
  // this component per note via `key`). React 19 re-applies
  // dangerouslySetInnerHTML when it sees a new object, which would wipe
  // in-progress edits on every re-render.
  const [initialHtml] = useState(() => ({ __html: html }));

  function save() {
    if (ref.current) onChange(ref.current.innerHTML);
  }

  /** Top-level child of the editor containing the caret. */
  function caretBlock(): Node | null {
    const root = ref.current;
    const sel = window.getSelection();
    if (!root || !sel || sel.rangeCount === 0) return null;
    let node: Node | null = sel.anchorNode;
    if (!node || node === root || !root.contains(node)) return null;
    while (node.parentNode && node.parentNode !== root) node = node.parentNode;
    return node;
  }

  // `# `, `> `, `- `, `1. ` at the start of a line become real blocks. The
  // replacement is built by hand: execCommand('formatBlock') on a freshly
  // emptied block makes Chrome pull the previous block into the format too.
  function handleSpace(e: React.KeyboardEvent) {
    const root = ref.current;
    const sel = window.getSelection();
    if (!root || !sel?.isCollapsed || sel.rangeCount === 0) return;
    const block = caretBlock();
    if (!block) return;

    const pre = document.createRange();
    pre.setStart(block, 0);
    pre.setEnd(sel.anchorNode!, sel.anchorOffset);
    const marker = pre.toString();

    const heading = HEADING_MARKERS[marker];
    const isQuote = marker === ">";
    const isList = marker === "-" || marker === "1.";
    if (!heading && !isQuote && !isList) return;

    e.preventDefault();
    pre.deleteContents();

    // The rest of the line moves into the new block; caret lands at its start.
    const target = document.createElement(heading ?? (isQuote ? "p" : "li"));
    if (block.nodeType === Node.TEXT_NODE) {
      if (block.textContent) target.append(block.textContent);
    } else {
      while (block.firstChild) target.appendChild(block.firstChild);
    }
    if (target.textContent === "" && !target.querySelector("br")) {
      target.replaceChildren(document.createElement("br"));
    }

    let replacement: HTMLElement = target;
    if (isQuote || isList) {
      replacement = document.createElement(isQuote ? "blockquote" : marker === "-" ? "ul" : "ol");
      replacement.appendChild(target);
    }
    root.replaceChild(replacement, block);
    placeCaret(target, 0);
    save();
  }

  // Enter at the end of a heading starts a paragraph (not another heading);
  // Enter on an empty callout line steps out of the callout.
  function handleEnter(e: React.KeyboardEvent) {
    const root = ref.current;
    const sel = window.getSelection();
    if (!root || !sel?.isCollapsed) return;
    const block = caretBlock();
    if (!(block instanceof HTMLElement)) return;

    if (/^H[1-6]$/.test(block.tagName)) {
      const after = document.createRange();
      after.selectNodeContents(block);
      after.setStart(sel.anchorNode!, sel.anchorOffset);
      if (after.toString() !== "") return; // mid-heading: let the browser split it
      e.preventDefault();
      const p = emptyParagraph();
      block.after(p);
      placeCaret(p, 0);
      save();
      return;
    }

    if (block.tagName === "BLOCKQUOTE") {
      let line: Node | null = sel.anchorNode === block ? null : sel.anchorNode;
      while (line && line.parentNode && line.parentNode !== block) {
        line = line.parentNode;
        if (line === root) {
          line = null;
          break;
        }
      }
      const lineEmpty = line ? line.textContent === "" : block.textContent === "";
      if (!lineEmpty) return;
      e.preventDefault();
      const p = emptyParagraph();
      block.after(p);
      if (line instanceof HTMLElement) line.remove();
      if (block.textContent === "" && block.children.length === 0) block.remove();
      placeCaret(p, 0);
      save();
    }
  }

  // Completed inline markers (**x**, *x*, ~~x~~, `x`) collapse into styled
  // elements. Runs after the DOM updates, on the text node holding the caret.
  function applyInlineRules() {
    const root = ref.current;
    const sel = window.getSelection();
    if (!root || !sel?.isCollapsed || sel.rangeCount === 0) return;
    const node = sel.anchorNode;
    if (!node || node.nodeType !== Node.TEXT_NODE || !root.contains(node)) return;
    if (node.parentElement?.closest("code, a")) return;

    const typed = node.textContent!.slice(0, sel.anchorOffset);
    for (const [regex, tag] of INLINE_RULES) {
      const match = typed.match(regex);
      if (!match || !match[1]) continue;
      const range = document.createRange();
      range.setStart(node, match.index!);
      range.setEnd(node, sel.anchorOffset);
      range.deleteContents();
      const el = document.createElement(tag);
      el.textContent = match[1];
      range.insertNode(el);
      // Land the caret in a zero-width space after the element so the next
      // keystroke types unformatted text instead of extending the mark.
      const tail = document.createTextNode("\u200B");
      el.after(tail);
      placeCaret(tail, 1);
      return;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();
    if (mod && !e.altKey) {
      if (!e.shiftKey && key === "b") {
        e.preventDefault();
        document.execCommand("bold");
        save();
        return;
      }
      if (!e.shiftKey && key === "i") {
        e.preventDefault();
        document.execCommand("italic");
        save();
        return;
      }
      if (e.shiftKey && (key === "x" || key === "s")) {
        e.preventDefault();
        document.execCommand("strikeThrough");
        save();
        return;
      }
    }
    if (e.key === " ") handleSpace(e);
    else if (e.key === "Enter" && !e.shiftKey) handleEnter(e);
  }

  function handleInput() {
    const el = ref.current;
    if (!el) return;
    if (!composing.current) applyInlineRules();
    // A fully-deleted note leaves one empty paragraph behind; clear it so the
    // :empty placeholder shows.
    const leftover = el.innerHTML;
    if (leftover === "<p><br></p>" || leftover === "<div><br></div>" || leftover === "<br>") {
      el.innerHTML = "";
      if (document.activeElement === el) placeCaret(el, 0);
    }
    save();
  }

  // Paste as plain text so outside markup can't break the note's typography.
  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
  }

  // Note links navigate like Obsidian's: click opens the linked note.
  function handleClick(e: React.MouseEvent) {
    if (!onLinkClick) return;
    const link = (e.target as HTMLElement).closest("a");
    if (!link || !ref.current?.contains(link)) return;
    e.preventDefault();
    const title = link.textContent?.trim();
    if (title) onLinkClick(title);
  }

  return (
    <div
      ref={ref}
      className={`lore-editor ${editable ? "cursor-text" : ""}`}
      contentEditable={editable}
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder="Start writing…"
      {...(editable
        ? { role: "textbox", "aria-multiline": true, "aria-label": "Note body" }
        : {})}
      onKeyDown={editable ? handleKeyDown : undefined}
      onInput={editable ? handleInput : undefined}
      onPaste={editable ? handlePaste : undefined}
      onClick={editable ? handleClick : undefined}
      onCompositionStart={() => (composing.current = true)}
      onCompositionEnd={() => (composing.current = false)}
      dangerouslySetInnerHTML={initialHtml}
    />
  );
}
