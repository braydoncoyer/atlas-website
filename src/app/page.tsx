import Link from "next/link";
import ProductShot from "@/components/ProductShot";
import WaitlistDialog from "@/components/WaitlistDialog";
import { getWaitlistCount } from "@/lib/waitlist";

function Wordmark() {
  return (
    <div className="font-serif text-lg font-extrabold uppercase tracking-[0.2em] text-accent">
      Lore
    </div>
  );
}

export default async function Home() {
  const waitlist = await getWaitlistCount();

  return (
    <main className="flex min-h-[100dvh] flex-col overflow-x-clip bg-gradient-to-b from-stone-50 via-stone-50 to-mauve-100/60">
      <section className="relative isolate flex min-h-[100dvh] flex-col">
        {/* Ambient glow — a blue→pink wash (blue over the CTA on the right,
            pink on the left, violet bridging the middle). Kept in the hero
            band (above the opaque product-shot window, which would otherwise
            paint over it) so the color actually reads. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          {/* Primary wash, haloing behind the headline + subhead. */}
          <div className="absolute left-1/2 top-[14%] h-[520px] w-[120%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(150,120,220,0.30),rgba(150,120,220,0.14)_45%,transparent_72%)] blur-[80px]" />
          {/* Blue over the form/CTA, top-right. */}
          <div className="absolute right-[3%] top-[6%] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(80,135,245,0.46),transparent_70%)] blur-[90px]" />
          {/* Pink counter-glow on the left so the two hues bracket the band. */}
          <div className="absolute left-[0%] top-[16%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(216,105,170,0.42),transparent_70%)] blur-[90px]" />
        </div>

        {/* Hero */}
        <div className="mx-auto w-full max-w-7xl shrink-0 px-6 pt-12 sm:pt-20">
          <Wordmark />
          <div className="mt-8 grid items-start gap-5 sm:mt-10 lg:grid-cols-2 lg:gap-24">
            {/* Left: headline */}
            <h1 className="font-serif text-balance text-[2rem] leading-[1.05] sm:text-4xl sm:leading-[1.0] lg:text-5xl text-stone-800">
              Remember more of what
              <br className="hidden sm:inline" /> you already know.
              {/* <span className="font-serif font-normal italic"></span> */}
            </h1>

            {/* Right: subhead + form */}
            <div className="flex flex-col gap-5">
              <p className="max-w-xl text-pretty text-base leading-snug sm:text-lg text-stone-500">
                Lore is a local-first notes app designed around writing. Every
                note is a plain Markdown file you own, while Lore quietly
                surfaces related ideas and forgotten connections as you write.
              </p>
              <WaitlistDialog waitlist={waitlist} />
            </div>
          </div>
        </div>

        {/* Product shot — the full app window. On phones it's oversized and
            bleeds off the right edge of the screen (clipped by the page's
            overflow-x-clip), so the window keeps Mac-app-like proportions
            instead of squeezing into the content column. From `sm` up it's
            contained within the content width and flexes to fill the rest of
            the hero so its lower half runs down to the bottom of the
            viewport. */}
        {/* Extra headroom from `lg` up so the handwritten nudge (absolutely
            positioned above the window) breathes below the waitlist row. */}
        <div className="mt-10 flex-1 sm:mt-14 lg:mt-28">
          <div className="mx-auto h-full max-w-7xl px-6">
            <div className="relative h-full w-[140%] max-w-none sm:w-full">
              {/* Handwritten nudge — desktop only, since that's where the
                  window is actually editable. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-[4.75rem] left-[34%] z-10 hidden select-none items-start gap-1.5 lg:flex"
              >
                <p className="-rotate-2 font-hand text-[1.2rem] leading-[1.15] text-stone-500">
                  psst. It&apos;s interactive.
                  <br />
                  Try editing a note
                </p>
                <svg
                  className="mt-3 text-stone-400"
                  width="42"
                  height="48"
                  viewBox="0 0 42 48"
                  fill="none"
                >
                  <path
                    d="M4 4c14 1 27 8 30 22 1.5 7 .5 12-1.5 17"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M25.5 36.5 32.5 44l7-5.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <ProductShot />
            </div>
          </div>
        </div>
      </section>

      {/* Footer — kept quiet so it doesn't compete with the hero. Holds the
          legal link the App Store / privacy requirements need. */}
      <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-stone-400 sm:flex-row">
        <span>© {new Date().getFullYear()} Lore Notes</span>
        <Link
          href="/terms"
          className="font-medium text-stone-400 transition-colors hover:text-accent"
        >
          Terms &amp; Privacy
        </Link>
      </footer>
    </main>
  );
}
