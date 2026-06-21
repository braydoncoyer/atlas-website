"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import WaitlistForm from "./WaitlistForm";
import RollingNumber from "./RollingNumber";

// Hide the social-proof line until the number is flattering enough to show.
const MIN_VISIBLE_COUNT = 1;

// Remembers across visits that this browser already joined.
const JOINED_KEY = "atlas-waitlist-joined";

// Read the persisted flag via useSyncExternalStore so there's no hydration
// mismatch (server snapshot is always false) and no setState-in-effect.
function subscribeJoined(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
function getJoinedSnapshot() {
  try {
    return localStorage.getItem(JOINED_KEY) === "1";
  } catch {
    return false;
  }
}

function SocialProof({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <div className="flex -space-x-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-5 w-5 rounded-full border-2 border-background bg-gradient-to-br from-accent/70 to-accent/30"
          />
        ))}
      </div>
      <span className="inline-flex items-center gap-1">
        Join
        <RollingNumber value={count} className="font-medium text-foreground" />
        {count === 1 ? "other" : "others"} on the waitlist
      </span>
    </div>
  );
}

export default function WaitlistDialog({
  waitlist,
}: {
  waitlist: { count: number; hasMore: boolean } | null;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Bumped on each open so the flow remounts and resets to the form view.
  const [instance, setInstance] = useState(0);
  // Optimistic count, seeded from the server value.
  const [count, setCount] = useState(waitlist?.count ?? 0);
  // Set when this session's signup succeeds; consumed once on close so the
  // number rolls as the backdrop clears and the eye lands on it.
  const joinedRef = useRef(false);
  // Persisted across visits (other tabs / return visits) + a same-tab session
  // flag for the signup that just happened. Either means "open to success".
  const persistedJoined = useSyncExternalStore(
    subscribeJoined,
    getJoinedSnapshot,
    () => false,
  );
  const [sessionJoined, setSessionJoined] = useState(false);
  const alreadyJoined = persistedJoined || sessionJoined;

  const handleJoined = () => {
    joinedRef.current = true;
    setSessionJoined(true);
    try {
      localStorage.setItem(JOINED_KEY, "1");
    } catch {
      // localStorage unavailable (private mode, etc.) — session flag still works.
    }
  };

  const open = () => {
    setInstance((i) => i + 1);
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();

  // Fires for every close path (button, backdrop, Esc). Consume a successful
  // signup here so the count rolls as the backdrop clears.
  const onClose = () => {
    if (joinedRef.current) {
      joinedRef.current = false;
      setCount((c) => c + 1);
    }
  };

  const showProof = waitlist && count >= MIN_VISIBLE_COUNT;

  return (
    <div className="flex flex-col items-start gap-3 lg:items-end">
      <button
        type="button"
        onClick={open}
        className="w-fit rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-[background-color,transform] duration-150 ease-out hover:bg-accent-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Be first to try Atlas
      </button>

      {showProof && <SocialProof count={count} />}

      <dialog
        ref={dialogRef}
        onClose={onClose}
        // Clicking the backdrop (the dialog element itself, outside the inner box) closes it.
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="modal m-auto w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl"
      >
        <div className="relative p-7">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-3.5 top-3.5 z-10 grid h-7 w-7 place-items-center rounded-full text-muted transition-colors duration-150 ease-out hover:bg-subtle hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <WaitlistForm
            key={instance}
            alreadyJoined={alreadyJoined}
            onJoined={handleJoined}
          />
        </div>
      </dialog>
    </div>
  );
}
