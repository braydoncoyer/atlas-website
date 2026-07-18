import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Shared social-share card used by both the Open Graph and Twitter/X metadata
// routes: the Lore editor mock on the right, "Join the waitlist" on the left.
// Rendered with next/og (Satori) — flexbox + inline styles only, so this is a
// hand-built, simplified twin of <ProductShot/>.

export const alt = "Lore Notes — Join the waitlist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Hex/rgb only — Satori (next/og) doesn't parse oklch. These mirror the
// Mirrors the site tokens: HEADING = stone-800, ACCENT = stone-800 (neutral;
// color comes from the glow).
const HEADING = "#292524";
const ACCENT = "#292524";
const BORDER = "#e4e4e7";
const SIDEBAR_BG = "#f7f7f8";

function Region({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 8px",
        fontSize: 15,
        color: "rgba(24,24,27,0.72)",
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        style={{ color: "#9ca3af" }}
      >
        <path
          d="M5.8 2.5 2 4v9.5l3.8-1.5 4.4 1.5L14 12V2.5l-3.8 1.5L5.8 2.5Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
        <path d="M5.8 2.5v9.5M10.2 4v9.5" stroke="currentColor" strokeWidth="1.1" />
      </svg>
      {label}
    </div>
  );
}

function EditorParagraph({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 16,
        lineHeight: 1.6,
        color: "rgba(24,24,27,0.82)",
      }}
    >
      {children}
    </div>
  );
}

export async function renderSocialImage() {
  // Satori can't fetch relative URLs, so inline the icon as a data URI.
  const icon = await readFile(join(process.cwd(), "public/lore-icon.png"));
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;

  // Satori ships no fonts and uses ONLY what we pass (any unlisted family
  // falls back to the first font given). So bundle both faces as raw TTF
  // (Satori can't read next/font or woff2): Geist for the body/UI text and
  // Playfair for the heading — mirroring the site.
  const fontDir = join(process.cwd(), "src/app/fonts");
  const [geist400, geist700, playfair600, playfair800] = await Promise.all([
    readFile(join(fontDir, "Geist-400.ttf")),
    readFile(join(fontDir, "Geist-700.ttf")),
    readFile(join(fontDir, "PlayfairDisplay-SemiBold.ttf")),
    readFile(join(fontDir, "PlayfairDisplay-ExtraBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#ffffff",
          position: "relative",
          fontFamily: "Geist",
        }}
      >
        {/* blue/pink brand glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(48% 58% at 80% 30%, rgba(80,135,245,0.33), rgba(80,135,245,0) 70%), radial-gradient(45% 55% at 16% 68%, rgba(216,105,170,0.29), rgba(216,105,170,0) 70%)",
          }}
        />

        {/* Left: copy */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 26,
            padding: "0 64px",
            width: 620,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: "Playfair Display",
              fontSize: 30,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: ACCENT,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain img */}
            <img
              src={iconSrc}
              alt=""
              width={44}
              height={44}
              style={{ borderRadius: 10 }}
            />
            Lore
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Playfair Display",
              fontSize: 62,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: HEADING,
            }}
          >
            Join the waitlist
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              lineHeight: 1.4,
              color: "#64748b",
              maxWidth: 470,
            }}
          >
            A writing-first, local-first notes app for Mac, iPad, and iPhone. Be
            the first to write in Lore.
          </div>
        </div>

        {/* Right: editor window, bleeding off the right/bottom */}
        <div
          style={{
            position: "absolute",
            left: 648,
            top: 70,
            width: 760,
            height: 600,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#ffffff",
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            boxShadow: "0 30px 70px rgba(8,47,73,0.16)",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", flex: 1 }}>
            {/* sidebar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 208,
                backgroundColor: SIDEBAR_BG,
                borderRight: `1px solid ${BORDER}`,
                padding: "16px 12px",
              }}
            >
              <div style={{ display: "flex", gap: 7, paddingBottom: 14, paddingLeft: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: 99, backgroundColor: "#ff5f57" }} />
                <div style={{ width: 12, height: 12, borderRadius: 99, backgroundColor: "#febc2e" }} />
                <div style={{ width: 12, height: 12, borderRadius: 99, backgroundColor: "#28c840" }} />
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "4px 8px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: ACCENT,
                }}
              >
                New Note
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "16px 8px 4px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "rgba(107,114,128,0.7)",
                }}
              >
                REGIONS
              </div>
              <Region label="Chronobiology" />
              <Region label="Circadian Systems" />
              <Region label="Focus" />
              <Region label="Light Exposure" />
              <Region label="Sleep" />
              <div
                style={{
                  display: "flex",
                  padding: "16px 8px 4px",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "rgba(107,114,128,0.7)",
                }}
              >
                PINNED
              </div>
              <div
                style={{
                  display: "flex",
                  padding: "5px 8px",
                  fontSize: 15,
                  fontWeight: 600,
                  color: ACCENT,
                  backgroundColor: "rgba(41,37,36,0.08)",
                  borderRadius: 7,
                }}
              >
                Start Here
              </div>
            </div>

            {/* editor */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "38px 44px",
                gap: 20,
                flex: 1,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 32,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "#18181b",
                }}
              >
                Start Here
              </div>
              <div style={{ display: "flex", height: 1, backgroundColor: BORDER }} />
              <EditorParagraph>Welcome to Lore.</EditorParagraph>
              <EditorParagraph>
                Lore is built around a simple idea: your notes should belong to
                you, and they should become more valuable the more you write.
              </EditorParagraph>
              <EditorParagraph>
                Everything starts with writing. Capture ideas, connect concepts,
                and let Lore help you rediscover them later.
              </EditorParagraph>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: geist400, weight: 400, style: "normal" },
        { name: "Geist", data: geist700, weight: 700, style: "normal" },
        {
          name: "Playfair Display",
          data: playfair600,
          weight: 600,
          style: "normal",
        },
        {
          name: "Playfair Display",
          data: playfair800,
          weight: 800,
          style: "normal",
        },
      ],
    },
  );
}
