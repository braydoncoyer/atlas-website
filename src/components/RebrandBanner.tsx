"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// Old product names, keyed by the `?from=` marker the legacy domains append
// when redirecting here (e.g. writeatlas.app/* → lorenotes.com/?from=atlas).
const FORMER_NAMES: Record<string, string> = {
  atlas: "Atlas",
  writeatlas: "Atlas",
  fern: "Fern",
  fernnotes: "Fern",
};

// Session-scoped so a dismissed banner stays gone while browsing, but a fresh
// redirect on a later visit shows it again.
const DISMISSED_KEY = "lore-rebrand-banner-dismissed";

// Read the redirect marker once per page load and cache it: the URL param is
// stripped right after mount (see the effect below), so a live re-read would
// make the banner vanish on any later render.
let cachedName: string | null | undefined;
function getFormerNameSnapshot() {
  if (cachedName === undefined) {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY) === "1") {
        cachedName = null;
        return cachedName;
      }
    } catch {
      // sessionStorage unavailable — show the banner; dismissal won't stick.
    }
    const from = new URLSearchParams(window.location.search).get("from");
    cachedName = FORMER_NAMES[from?.toLowerCase() ?? ""] ?? null;
  }
  return cachedName;
}
const subscribeNever = () => () => {};

export default function RebrandBanner() {
  // useSyncExternalStore so the server snapshot is always null (no hydration
  // mismatch) with no setState-in-effect — same pattern as WaitlistDialog.
  const formerName = useSyncExternalStore(
    subscribeNever,
    getFormerNameSnapshot,
    () => null,
  );
  const [dismissed, setDismissed] = useState(false);
  const show = formerName !== null && !dismissed;

  // Drop the marker so the clean URL is what gets bookmarked or shared.
  useEffect(() => {
    if (!show) return;
    const params = new URLSearchParams(window.location.search);
    if (!params.has("from")) return;
    params.delete("from");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname +
        (query ? `?${query}` : "") +
        window.location.hash,
    );
  }, [show]);

  if (!show) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Nothing to do — the banner is gone for this render either way.
    }
  };

  return (
    <div
      role="status"
      className="banner-enter relative isolate flex items-center justify-center bg-accent px-12 py-2.5 text-sm text-white"
    >
      <p className="text-pretty text-center">
        <span className="font-semibold">{formerName}</span> is now Lore Notes —
        same app, new name.
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 grid h-7 w-7 place-items-center rounded-full text-white/80 transition-colors duration-150 ease-out hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
