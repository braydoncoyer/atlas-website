import WaitlistDialog from "./WaitlistDialog";

// Closing call-to-action: one last, centered push to join the waitlist after
// the product sections have made the case. Layout takes after the centered
// "big headline → subhead → button → reassurance line" pattern; the visual
// language stays Atlas's own — light, calm, a single soft blue glow.
//
// Facts kept honest: nothing has shipped (it's a waitlist), Atlas is
// Apple-native and Mac/iPad/iPhone arrive together, notes are plain Markdown
// you own, and AI is opt-in. No ship date, no pricing.

const REASSURANCES = ["Plain Markdown you own", "AI is opt-in", "Free to write"];

export default function FinalCta({
  waitlist,
}: {
  waitlist: { count: number; hasMore: boolean } | null;
}) {
  return (
    <section className="relative isolate overflow-x-clip py-28 sm:py-36">
      {/* Soft blue wash, echoing the hero — the brand accent, used sparingly. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(0,136,255,0.16),rgba(0,136,255,0.06)_45%,transparent_70%)] blur-2xl" />
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <h2 className="text-balance text-3xl leading-[1.1] tracking-tight text-sky-950 sm:text-4xl">
          Own your notes. Understand your thinking.
        </h2>

        <p className="mt-5 max-w-xl text-balance text-base leading-snug text-slate-500 sm:text-lg">
          Atlas is a local-first writing app with AI that helps you revisit what
          you already know — never generate it for you. Join the waitlist to be
          first in.
        </p>

        <div className="mt-9">
          <WaitlistDialog waitlist={waitlist} align="center" />
        </div>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
          {REASSURANCES.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                className="text-accent"
              >
                <path
                  d="M3.5 8.5l3 3 6-7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
