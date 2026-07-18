import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { VemetricScript } from "@vemetric/react";
import RebrandBanner from "@/components/RebrandBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display serif for headings — echoes the serif "L" in the Lore icon.
// next/font self-hosts it, so it renders for every visitor. Variable font,
// so no explicit weight list is needed.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

// Handwritten face, used only for the "psst, it's interactive" annotation
// next to the product shot. Variable font, one subset — a tiny payload.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Canonical production origin — OG/Twitter image URLs resolve against
  // this instead of the deployment URL (or localhost in dev builds).
  metadataBase: new URL("https://www.lorenotes.com"),
  title: "Lore Notes — Remember more of what you already know.",
  description:
    "Lore is a local-first notes app designed around writing. Every note is a plain Markdown file you own, while Lore quietly surfaces related ideas and forgotten connections as you write. Join the waitlist.",
  openGraph: {
    title: "Lore Notes — Remember more of what you already know.",
    description:
      "Lore is a local-first notes app designed around writing. Every note is a plain Markdown file you own, while Lore quietly surfaces related ideas and forgotten connections as you write. Join the waitlist.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lore Notes — Remember more of what you already know.",
    description:
      "Lore is a local-first notes app designed around writing. Every note is a plain Markdown file you own, while Lore quietly surfaces related ideas and forgotten connections as you write. Join the waitlist.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {process.env.NEXT_PUBLIC_VEMETRIC_TOKEN && (
          <VemetricScript token={process.env.NEXT_PUBLIC_VEMETRIC_TOKEN} />
        )}
        <RebrandBanner />
        {children}
      </body>
    </html>
  );
}
