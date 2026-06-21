// The Atlas hero product visual: a real screenshot of the macOS app.
// (Replaces the former CSS mock.) The capture already includes the native
// window chrome — traffic lights and rounded corners — so we seat it in a
// bordered, shadowed card so the white editor doesn't melt into the white
// page. The image keeps its aspect ratio; the page clips the bottom at the fold.
import Image from "next/image";

export default function ProductShot() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-2xl shadow-black/10 ring-1 ring-black/5">
      <Image
        src="/screenshot.png"
        alt="Atlas on macOS: a note open in the live-preview editor, with the sidebar of regions and pinned notes alongside it."
        width={1728}
        height={1084}
        priority
        sizes="(min-width: 1280px) 1232px, 100vw"
        className="h-auto w-full"
      />
    </div>
  );
}
