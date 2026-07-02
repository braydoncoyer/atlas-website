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
      <section className="relative isolate flex min-h-[100dvh] flex-col">
        {/* AI glow — blue, per Atlas brand (purple/pink rejected). Kept in the
            hero band (above the opaque product-shot window, which would
            otherwise paint over it) so the color actually reads. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          {/* Primary wash, haloing behind the headline + subhead. */}
          <div className="absolute left-1/2 top-[16%] h-[460px] w-[115%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(0,136,255,0.19),rgba(0,136,255,0.08)_45%,transparent_70%)] blur-2xl" />
          {/* Cooler accent over the form/CTA, top-right. */}
          <div className="absolute right-[6%] top-[10%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(64,196,255,0.25),transparent_70%)] blur-3xl" />
          {/* Faint counter-glow on the left so the wash isn't lopsided. */}
          <div className="absolute left-[2%] top-[24%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(0,136,255,0.11),transparent_70%)] blur-3xl" />
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

        {/* Product shot — the full app window, contained within the content
            width (no right-edge bleed). Flexes to fill the rest of the hero so
            its lower half runs down to the bottom of the viewport. Cut-off
            treatments are reserved for the body sections below. */}
        <div className="mt-10 flex-1 sm:mt-14">
          <div className="mx-auto h-full max-w-7xl px-6">
            <ProductShot />
          </div>
        </div>
      </section>
    </main>
  );
}
