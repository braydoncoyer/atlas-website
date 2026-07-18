"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { vemetric } from "@vemetric/react";
import WaitlistForm from "./WaitlistForm";
import RollingNumber from "./RollingNumber";

// Hide the social-proof line until the number is flattering enough to show.
const MIN_VISIBLE_COUNT = 1;

// Remembers across visits that this browser already joined.
const JOINED_KEY = "lore-waitlist-joined";
// Signups from before the Atlas → Lore rebrand still count as joined.
const LEGACY_JOINED_KEY = "atlas-waitlist-joined";

// Read the persisted flag via useSyncExternalStore so there's no hydration
// mismatch (server snapshot is always false) and no setState-in-effect.
function subscribeJoined(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
function getJoinedSnapshot() {
  try {
    return (
      localStorage.getItem(JOINED_KEY) === "1" ||
      localStorage.getItem(LEGACY_JOINED_KEY) === "1"
    );
  } catch {
    return false;
  }
}

// Variations drawn from the hero's ambient glow (blue #5087f5, violet
// #9678dc, pink #d869aa) so the avatars read as distinct people while
// echoing the wash behind the app window.
const AVATAR_GRADIENTS = [
  "from-[#5087f5] to-[#8ba7f0]",
  "from-[#9678dc] to-[#b79fe8]",
  "from-[#d869aa] to-[#e795c5]",
  "from-[#7d8ef0] to-[#a88ee2]",
  "from-[#c473c0] to-[#d98cb8]",
  "from-[#6f9bf7] to-[#9678dc]",
  "from-[#d869aa] to-[#9678dc]",
];

function SocialProof({ count }: { count: number }) {
  // Show one avatar per signup, capped at 7.
  const avatars = Math.min(count, 7);
  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <div className="flex -space-x-1.5">
        {Array.from({ length: avatars }).map((_, i) => (
          <span
            key={i}
            className={`h-5 w-5 rounded-full border-2 border-background bg-gradient-to-br ${
              AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
            }`}
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
    vemetric.trackEvent("WaitlistCtaClicked");
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
        className="w-fit rounded-full bg-gradient-to-b from-stone-600 to-accent px-4 py-2 text-sm font-medium text-white shadow-sm shadow-accent/25 transition-[filter,transform] duration-150 ease-out hover:brightness-105 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Be first to try Lore
      </button>

      {showProof && <SocialProof count={count} />}

      <dialog
        ref={dialogRef}
        onClose={onClose}
        // Clicking the backdrop (the dialog element itself, outside the inner box) closes it.
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        // Width/centering live in the `.modal` CSS rule (iOS-safe min() sizing).
        className="modal rounded-2xl border border-border bg-background p-0 text-foreground shadow-2xl"
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
