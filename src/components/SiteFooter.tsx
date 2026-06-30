// Site footer — deliberately spare. This is a one-page waitlist, so there are
// no docs/careers/legal pages to link to yet; inventing them would be
// dishonest. Just the wordmark, a one-line reminder of what Atlas is, the
// platforms, and a copyright. Layout (wordmark left, meta right, hairline rule
// above) follows the minimal-footer reference.

export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-semibold tracking-tight text-accent">Atlas</div>
          <p className="mt-1.5 max-w-xs text-sm leading-snug text-muted">
            Markdown notes that surface what you already know.
          </p>
        </div>

        <div className="flex flex-col gap-1 text-sm text-muted sm:items-end">
          <span>Apple-native — Mac, iPad &amp; iPhone</span>
          <span>© {new Date().getFullYear()} Atlas</span>
        </div>
      </div>
    </footer>
  );
}
