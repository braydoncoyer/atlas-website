import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Privacy — Lore Notes",
  description:
    "How Lore handles your writing, what the optional AI features send to third-party services, and the usual legal points — kept as plain as we can.",
  openGraph: {
    title: "Terms & Privacy — Lore Notes",
    description:
      "How Lore handles your writing, what the optional AI features send to third-party services, and the usual legal points — kept as plain as we can.",
    type: "website",
  },
};

const VERSION = "v1.0";
const EFFECTIVE_DATE = "June 25, 2026";

/** A section heading + body. Anchors let us deep-link individual sections. */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="scroll-mt-24">
      <h2
        id={id}
        className="font-serif text-xl font-semibold text-stone-700 sm:text-2xl"
      >
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[0.975rem] leading-relaxed text-slate-600">
        {children}
      </div>
    </section>
  );
}

/** External link, opened in a new tab and styled with the accent. */
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
    >
      {children}
    </a>
  );
}

export default function TermsPage() {
  return (
    <main className="bg-gradient-to-b from-stone-50 via-stone-50 to-stone-100/60">
      <div className="mx-auto w-full max-w-2xl px-6 pb-24 pt-12 sm:pt-16">
        {/* Back to home / wordmark */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-accent"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 12 6 8l4-4" />
          </svg>
          Back to Lore
        </Link>

        {/* Title */}
        <header className="mt-10 border-b border-border pb-8">
          <h1 className="font-serif text-balance text-3xl font-semibold text-stone-700 sm:text-4xl">
            Terms &amp; Privacy
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {VERSION} · Effective {EFFECTIVE_DATE}
          </p>
        </header>

        <div className="mt-10 space-y-12">
          <Section id="overview" title="Overview">
            <p>
              Lore Notes (&ldquo;Lore&rdquo;) is a writing-first notes app for
              Apple devices. Your notes are plain Markdown files stored on your
              own disk — Lore is the
              editor and the intelligent layer over them, not the owner of your
              content.
            </p>
            <p>
              By installing or using Lore you agree to these terms. They cover
              how the app handles your writing, what the optional AI features
              send to third-party services, and the usual legal points every app
              needs. We&rsquo;ve kept them as plain as we can.
            </p>
          </Section>

          <Section id="your-notes" title="Your notes are yours">
            <p>
              The Markdown file on disk is always the source of truth. Lore
              never locks your notes in a proprietary format, and everything it
              builds on top of them — the search index, embeddings, and caches —
              is rebuildable from the files alone.
            </p>
            <ul className="list-disc space-y-2 pl-5 marker:text-slate-300">
              <li>
                Writing, navigation, links, backlinks, and keyword search work
                fully offline and never touch the network.
              </li>
              <li>
                Your notes live in a folder you choose (local or iCloud Drive).
                Lore reads and writes those files; it doesn&rsquo;t upload them
                anywhere on its own.
              </li>
              <li>
                Ephemeral app data — the search index, caches, and recent
                history — lives in your Mac&rsquo;s Application Support folder,
                never inside your notes.
              </li>
            </ul>
          </Section>

          <Section id="ai-optional" title="AI features are optional and opt-in">
            <p>
              Lore is a complete writing app with no API keys at all. The AI
              features — Ask Lore, discovered connections, connection
              explanations, and trails — are the one exception, and they only
              run once you add your own API keys in Settings.
            </p>
            <p>
              Lore uses a bring-your-own-key model: you create accounts with the
              AI providers below and pay them directly for usage. With no keys
              set, nothing leaves your machine — the AI surfaces simply stay dark
              and the rest of the app works exactly the same.
            </p>
          </Section>

          <Section id="what-gets-sent" title="What gets sent to the cloud, and when">
            <p>
              When you&rsquo;ve enabled the AI features, Lore sends note content
              to two services to make retrieval and answers genuinely good. This
              is a deliberate quality-over-local-only trade, and here&rsquo;s
              exactly what happens:
            </p>
            <ul className="list-disc space-y-2 pl-5 marker:text-slate-300">
              <li>
                <span className="font-medium text-slate-700">Voyage AI</span>{" "}
                receives note text to build the semantic index that powers
                search, discovered connections, and trails (embeddings +
                reranking).
              </li>
              <li>
                <span className="font-medium text-slate-700">OpenAI</span>{" "}
                receives the relevant excerpts when you ask a question, so it can
                write the answer, connection explanations, and trail narratives.
              </li>
            </ul>
            <p>
              Lore is frugal with what it sends: a note is only re-sent when its
              content actually changes. Renaming a file, reopening it, or syncing
              it never re-uploads anything. If a feature needs the cloud it says
              so, and removing your keys turns all of it back off.
            </p>
          </Section>

          <Section
            id="ai-providers"
            title="The AI providers and their data policies"
          >
            <p>
              Because you connect directly to these providers with your own keys,
              your data is governed by their terms and privacy policies as well
              as ours. We summarize the key points below — they&rsquo;re accurate
              as of the effective date, but the providers&rsquo; own pages are
              authoritative, so please review them.
            </p>
            <p>
              <span className="font-medium text-slate-700">
                OpenAI (answers &amp; explanations).
              </span>{" "}
              OpenAI states that data submitted through its API is not used to
              train its models by default. API inputs and outputs may be retained
              for up to 30 days for abuse monitoring and then deleted (longer only
              where legally required). See OpenAI&rsquo;s{" "}
              <A href="https://platform.openai.com/docs/guides/your-data">
                API data controls
              </A>{" "}
              and{" "}
              <A href="https://openai.com/policies/privacy-policy">
                privacy policy
              </A>
              .
            </p>
            <p>
              <span className="font-medium text-slate-700">
                Voyage AI (search index &amp; connections).
              </span>{" "}
              <span className="font-medium text-slate-700">Important:</span> by
              default Voyage may use the content you submit to train and improve
              its models — this is opt-out, not opt-in. You retain ownership of
              your content, and Voyage says it won&rsquo;t share it with third
              parties except in aggregate, anonymized form. We recommend opting
              out of training in your Voyage account (Organization → Terms of
              Service), which also enables zero-day retention of your data. See
              Voyage&rsquo;s{" "}
              <A href="https://www.voyageai.com/tos">terms</A> and{" "}
              <A href="https://www.voyageai.com/privacy">privacy policy</A>.
            </p>
          </Section>

          <Section id="keys-privacy" title="Your keys and your privacy">
            <ul className="list-disc space-y-2 pl-5 marker:text-slate-300">
              <li>
                API keys are stored only in the system Keychain — never in your
                notes, never in plain files, and never sent anywhere except to
                the provider they belong to.
              </li>
              <li>
                Lore does not run its own servers, accounts, or analytics that
                collect your notes. There is no Lore cloud between you and the AI
                providers.
              </li>
              <li>We never log your note content or your API keys.</li>
              <li>
                Sending note text to a cloud model is inherent to how good
                retrieval works. If you&rsquo;d rather keep everything local,
                simply don&rsquo;t add keys — Lore stays a complete offline
                writing app.
              </li>
            </ul>
          </Section>

          <Section id="license" title="License and acceptable use">
            <p>
              Lore is licensed to you for personal and professional use, not
              sold. You agree to use it lawfully and not to reverse-engineer,
              resell, or redistribute the app except as permitted by law.
            </p>
            <p>
              You are responsible for your own API keys, your usage of the AI
              providers, and any charges they bill you. Keep your keys secure;
              anyone with a key can incur charges on your account.
            </p>
          </Section>

          <Section
            id="disclaimer"
            title="Disclaimer and limitation of liability"
          >
            <p>
              Lore is provided &ldquo;as is,&rdquo; without warranties of any
              kind, whether express or implied, including fitness for a
              particular purpose. AI-generated answers, connections, and
              explanations can be incomplete or wrong — treat them as a starting
              point, not a source of truth, and keep your own backups of your
              notes.
            </p>
            <p>
              To the maximum extent permitted by law, Lore and its developer are
              not liable for any indirect, incidental, or consequential damages,
              or for any loss of data, arising from your use of the app or of the
              third-party AI services.
            </p>
          </Section>

          <Section id="governing-law" title="Governing law">
            <p>
              Lore is made by an independent developer based in Texas, United
              States. These terms are governed by the laws of the State of Texas,
              without regard to its conflict-of-laws rules, and any dispute
              relating to these terms or to your use of Lore will be subject to
              the exclusive jurisdiction of the state and federal courts located
              in Texas.
            </p>
          </Section>

          <Section id="changes" title="Changes to these terms">
            <p>
              We may update these terms as Lore evolves. When we make a
              substantive change we increment the version shown at the top of
              this document and update the effective date, and Lore marks the
              terms as updated until you open them again. Continuing to use the
              app after a change means you accept the revised terms.
            </p>
          </Section>

          <Section id="contact" title="Contact">
            <p>
              Lore is made by an independent developer. Questions about these
              terms or how Lore handles your data? Open an issue at{" "}
              <A href="https://github.com/braydoncoyer/atlas-releases/issues">
                github.com/braydoncoyer/atlas-releases
              </A>
              . Issues there are public — please don&rsquo;t include anything
              private.
            </p>
          </Section>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border pt-8 text-sm text-slate-400">
          <Link
            href="/"
            className="font-medium text-slate-500 transition-colors hover:text-accent"
          >
            ← Back to Lore
          </Link>
        </footer>
      </div>
    </main>
  );
}
