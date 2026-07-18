"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { joinWaitlist, type SignupState } from "@/app/actions";

const initialState: SignupState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition-[background-color,transform] duration-150 ease-out hover:bg-accent-hover active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-90"
    >
      {pending ? (
        <>
          <svg
            aria-hidden="true"
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            style={{ animationDuration: "0.7s" }}
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeOpacity="0.3"
              strokeWidth="3"
            />
            <path
              d="M12 3a9 9 0 0 1 9 9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <span className="sr-only">Joining…</span>
        </>
      ) : (
        "Join waitlist"
      )}
    </button>
  );
}

function FormView({
  state,
  formAction,
}: {
  state: SignupState;
  formAction: (formData: FormData) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-xl font-semibold text-stone-700">
        Join the waitlist
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
        Be the first to write in Lore. We&apos;ll email you the moment
        it&apos;s ready.
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-2.5">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={state.status === "error"}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-colors duration-150 ease-out placeholder:text-muted focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-red-400"
        />
        {/* Honeypot — hidden from humans, catches bots. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />
        <SubmitButton />
        <p
          role={state.status === "error" ? "alert" : undefined}
          className={`min-h-5 text-center text-xs ${
            state.status === "error" ? "font-medium text-red-600" : "text-muted"
          }`}
        >
          {state.status === "error"
            ? state.message
            : "No spam — one email when Lore is ready."}
        </p>
      </form>
    </div>
  );
}

function SuccessView({ returning }: { returning?: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="success-enter flex flex-col items-center gap-3 py-6 text-center"
    >
      <span className="success-badge grid h-12 w-12 place-items-center rounded-full bg-accent text-white">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            className="success-check"
            d="M6 12.5l4 4 8-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div>
        <p className="success-title text-lg font-semibold tracking-tight text-foreground">
          {returning ? "You're already on the list" : "You're on the list"}
        </p>
        <p className="success-sub mt-1 text-sm text-muted">
          We&apos;ll email you when Lore is ready.
        </p>
      </div>
    </div>
  );
}

export default function WaitlistForm({
  onJoined,
  alreadyJoined = false,
}: {
  onJoined?: () => void;
  alreadyJoined?: boolean;
}) {
  const [state, formAction] = useActionState(joinWaitlist, initialState);

  // Smoothly animate the modal's height as its content morphs between views.
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (innerRef.current) setHeight(innerRef.current.offsetHeight);
  }, [state, alreadyJoined]);

  // Notify the parent once when this signup succeeds (drives the optimistic
  // social-proof count bump).
  const joinedFiredRef = useRef(false);
  useEffect(() => {
    if (state.status === "success" && !joinedFiredRef.current) {
      joinedFiredRef.current = true;
      onJoined?.();
    }
  }, [state.status, onJoined]);

  const justJoined = state.status === "success";
  // The server reports this email was already on the list (no count bump).
  const alreadyOnList = state.status === "already";
  const success = justJoined || alreadyJoined || alreadyOnList;

  return (
    <div
      style={{ height }}
      // -mx-2/px-2 give the clip box horizontal room so focus rings aren't cut
      // off, while keeping content aligned with the modal padding.
      className="-mx-2 overflow-hidden px-2 transition-[height] duration-300 ease-out"
    >
      <div ref={innerRef}>
        {success ? (
          <SuccessView returning={alreadyOnList || (alreadyJoined && !justJoined)} />
        ) : (
          <FormView state={state} formAction={formAction} />
        )}
      </div>
    </div>
  );
}
