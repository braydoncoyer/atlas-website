"use client";

// The title of a freshly created note — the only editable title in the mock.
// Same uncontrolled-contentEditable pattern as NoteEditor: seeded once via a
// referentially-stable dangerouslySetInnerHTML object, then the DOM owns it.
// Plain text only: Enter and formatting shortcuts are swallowed, paste is
// stripped to text.

import { useEffect, useRef, useState } from "react";

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function EditableTitle({
  title,
  editable,
  className,
  onChange,
}: {
  title: string;
  editable: boolean;
  className: string;
  onChange: (title: string) => void;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [initial] = useState(() => ({ __html: escapeHtml(title) }));

  // A brand-new note is for naming first: focus the title and select the
  // placeholder "Untitled" so typing replaces it.
  useEffect(() => {
    const el = ref.current;
    if (!editable || !el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [editable]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      ref.current?.blur();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && ["b", "i", "u"].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    document.execCommand(
      "insertText",
      false,
      e.clipboardData.getData("text/plain").replace(/\n+/g, " ")
    );
  }

  return (
    <h3
      ref={ref}
      className={`lore-title ${editable ? "cursor-text" : ""} ${className}`}
      contentEditable={editable}
      suppressContentEditableWarning
      spellCheck={false}
      data-placeholder="Untitled"
      {...(editable ? { role: "textbox", "aria-label": "Note title" } : {})}
      onKeyDown={editable ? handleKeyDown : undefined}
      onInput={() => onChange(ref.current?.textContent ?? "")}
      onPaste={editable ? handlePaste : undefined}
      dangerouslySetInnerHTML={initial}
    />
  );
}
