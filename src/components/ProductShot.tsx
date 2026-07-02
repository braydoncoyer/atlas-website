// A faithful CSS recreation of the Atlas macOS window (the demo "Start Here"
// note) used as the hero product visual. Built in markup — rather than a flat
// screenshot — so it can bleed off the right edge of the page and stay crisp at
// any size. Mirrors the real app: traffic-light chrome, a Regions sidebar, the
// live-preview editor, and the faint inline "discovered connection" labels in
// the right gutter.

function MapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.8 2.5 2 4v9.5l3.8-1.5 4.4 1.5L14 12V2.5l-3.8 1.5L5.8 2.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M5.8 2.5v9.5M10.2 4v9.5" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M12.6 3.4l-.9.9M4.3 11.7l-.9.9"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

function ComposeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2.5H3.5A1.5 1.5 0 0 0 2 4v8.5A1.5 1.5 0 0 0 3.5 14H12a1.5 1.5 0 0 0 1.5-1.5V8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="m11 2 3 3-5.5 5.5L6 11l.5-2.5L11 2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-md px-2 py-[5px] text-[13px] ${
        active
          ? "bg-accent-soft font-medium text-accent"
          : "text-foreground/75"
      }`}
    >
      {icon ? <span className="shrink-0 text-muted/70">{icon}</span> : null}
      <span className="truncate">{label}</span>
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted/60">
      {children}
    </p>
  );
}

// A body paragraph with an optional faint "discovered connection" label sitting
// in the right gutter, like the real editor's inline connections.
function EditorP({
  children,
  connection,
}: {
  children: React.ReactNode;
  connection?: string;
}) {
  return (
    <div className="flex items-start gap-10">
      <p className="max-w-[600px] text-[14px] leading-[1.7] text-foreground/85">
        {children}
      </p>
      {connection ? (
        <span className="mt-1 hidden shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] text-muted/45 lg:flex">
          <span className="h-px w-4 bg-border" />
          {connection}
        </span>
      ) : null}
    </div>
  );
}

function Check() {
  return (
    <span className="mt-[3px] h-[15px] w-[15px] shrink-0 rounded-[4px] border border-border" />
  );
}

export default function ProductShot() {
  return (
    <div className="flex h-full min-h-[560px] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/10 ring-1 ring-black/[0.04]">
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[244px_1fr]">
        {/* Sidebar — hidden on small screens, like toggling it closed in the app */}
        <aside className="hidden flex-col border-r border-border bg-[#f7f7f8] px-3 lg:flex">
          {/* window chrome + toolbar */}
          <div className="flex items-center gap-2 pb-1 pt-3.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex items-center justify-between py-1.5 text-muted/70">
            <div className="flex items-center gap-1">
              <span className="grid h-6 w-6 place-items-center rounded-md text-[13px]">‹</span>
              <span className="grid h-6 w-6 place-items-center rounded-md text-[13px] text-muted/35">›</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6.5 3v10" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </div>

          <div className="flex items-center gap-2.5 px-2 py-2 text-[13px] font-medium text-accent">
            <ComposeIcon />
            New Note
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <GroupLabel>General</GroupLabel>
            <SidebarItem icon={<SunIcon />} label="Daily" />
            <SidebarItem icon={<GridIcon />} label="All Notes" />

            <GroupLabel>Regions</GroupLabel>
            <SidebarItem icon={<MapIcon />} label="Chronobiology" />
            <SidebarItem icon={<MapIcon />} label="Circadian Systems" />
            <SidebarItem icon={<MapIcon />} label="Focus" />
            <SidebarItem icon={<MapIcon />} label="Light Exposure" />
            <SidebarItem icon={<MapIcon />} label="Product" />
            <SidebarItem icon={<MapIcon />} label="Sleep" />

            <GroupLabel>Pinned</GroupLabel>
            <SidebarItem label="Start Here" active />
          </div>

          {/* account row */}
          <div className="mt-auto flex items-center gap-2 border-t border-border/70 px-1 py-2.5 text-[12px] text-muted">
            <span className="grid h-5 w-5 place-items-center rounded-md bg-foreground/85 text-[10px] font-medium text-background">
              A
            </span>
            <span className="text-foreground/70">Atlas</span>
            <span className="ml-auto text-muted/50">···</span>
          </div>
        </aside>

        {/* Editor */}
        <div className="min-w-0">
          {/* window chrome — shown here only when the sidebar is hidden (small screens) */}
          <div className="flex items-center gap-2 px-6 pb-1 pt-3.5 lg:hidden">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="px-6 pt-4 sm:px-10 lg:pl-24 lg:pr-14 lg:pt-12 xl:pl-32 xl:pr-20">
            <h3 className="text-[26px] font-semibold tracking-tight text-foreground">
              Start Here
            </h3>
            <div className="mt-3 h-px w-full max-w-[760px] bg-border" />

          <div className="mt-7 space-y-6">
            <EditorP>Welcome to Atlas.</EditorP>
            <EditorP connection="Circadian Systems">
              Atlas is built around a simple idea: your notes should belong to
              you, and they should become more valuable the more you write.
            </EditorP>
            <EditorP>
              Everything starts with writing. Capture ideas, connect concepts,
              and let Atlas help you rediscover them later.
            </EditorP>

            <h4 className="pt-2 text-[19px] font-semibold tracking-tight text-foreground">
              Start writing
            </h4>
            <EditorP>The editor is the heart of Atlas.</EditorP>
            <EditorP>
              It&apos;s fast, native, and designed to stay out of your way. No
              clutter. No unnecessary complexity. Just a clean space to think.
            </EditorP>
            <EditorP connection="Circadian Rhythm">
              Because Atlas uses Markdown, you can use familiar keyboard
              shortcuts for formatting, or select text to open the formatting
              bubble.
            </EditorP>

            <div className="space-y-2.5">
              <p className="text-[14px] leading-[1.7] text-foreground/85">
                Try a few things:
              </p>
              <div className="flex items-start gap-2.5">
                <Check />
                <span className="text-[14px] leading-[1.7] text-foreground/85">
                  Make this sentence bold.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check />
                <span className="text-[14px] leading-[1.7] text-foreground/85">
                  Create a heading below this section.
                </span>
              </div>
            </div>

            <h4 className="pt-2 text-[19px] font-semibold tracking-tight text-foreground">
              Your notes belong to you
            </h4>
            <EditorP>
              Every note is stored as a plain Markdown file on your machine.
            </EditorP>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
