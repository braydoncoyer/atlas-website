import ProductShot from "@/components/ProductShot";
import WaitlistDialog from "@/components/WaitlistDialog";
import { getWaitlistCount } from "@/lib/waitlist";

function Wordmark() {
  return (
    <div className="flex items-center gap-2 font-semibold tracking-tight text-accent">
      Atlas
    </div>
  );
}

export default async function Home() {
  const waitlist = await getWaitlistCount();

  return (
    <main className="flex min-h-[100dvh] flex-col overflow-x-clip bg-gradient-to-b from-white via-white to-sky-50/70">
      <section className="relative flex flex-1 flex-col">
        {/* AI glow — blue, per Atlas brand (purple/pink rejected) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-1/2 top-[40%] h-[420px] w-[120%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(0,136,255,0.18),rgba(0,136,255,0.06)_45%,transparent_70%)] blur-2xl" />
          <div className="absolute right-[8%] top-[18%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(64,196,255,0.20),transparent_70%)] blur-3xl" />
        </div>

        {/* Hero */}
        <div className="mx-auto w-full max-w-7xl shrink-0 px-6 pt-12 sm:pt-20">
          <Wordmark />
          <div className="mt-8 grid items-start gap-5 sm:mt-10 lg:grid-cols-2 lg:gap-24">
            {/* Left: headline */}
            <h1 className="text-balance text-[2rem] leading-[1.02] tracking-tight sm:text-4xl sm:leading-[0.98] lg:text-5xl text-sky-950">
              Remember more of what
              <br className="hidden sm:inline" /> you already know.
              {/* <span className="font-serif font-normal italic"></span> */}
            </h1>

            {/* Right: subhead + form */}
            <div className="flex flex-col gap-5">
              <p className="max-w-xl text-pretty text-base leading-snug sm:text-lg text-slate-500">
                Atlas is a local-first notes app designed around writing. Every
                note is a plain Markdown file you own, while Atlas quietly
                surfaces related ideas and forgotten connections as you write.
              </p>
              <WaitlistDialog waitlist={waitlist} />
            </div>
          </div>
        </div>

        {/* Product shot — left-aligned to the headline, bleeds off the right
            edge and clips at the fold. The large-screen width is viewport-based
            (anchored to the content's left edge) so it overruns the right edge
            on any monitor size instead of stopping short. min-h keeps it visible
            on short/landscape viewports, where the page scrolls instead. */}
        <div className="mt-8 flex-1 overflow-hidden min-h-[22rem] sm:mt-12">
          <div className="mx-auto h-full max-w-7xl px-6">
            <div className="h-[calc(100%+3rem)] w-[120%] max-w-none lg:w-[calc(50vw+744px)]">
              <ProductShot />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
