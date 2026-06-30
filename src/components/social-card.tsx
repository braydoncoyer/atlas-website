import { ImageResponse } from "next/og";

// Shared social-share card used by both the Open Graph and Twitter/X metadata
// routes: the Atlas editor mock on the right, "Join the waitlist" on the left.
// Rendered with next/og (Satori) — flexbox + inline styles only, so this is a
// hand-built, simplified twin of <ProductShot/>.

export const alt = "Atlas — Join the waitlist";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#082f49";
const ACCENT = "#0088ff";
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

export function renderSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#ffffff",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* blue brand glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "radial-gradient(55% 55% at 72% 32%, rgba(0,136,255,0.16), rgba(0,136,255,0) 70%)",
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
              gap: 10,
              fontSize: 30,
              fontWeight: 700,
              color: ACCENT,
            }}
          >
            Atlas
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: NAVY,
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
            the first to write in Atlas.
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
                  backgroundColor: "rgba(0,136,255,0.10)",
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
              <EditorParagraph>Welcome to Atlas.</EditorParagraph>
              <EditorParagraph>
                Atlas is built around a simple idea: your notes should belong to
                you, and they should become more valuable the more you write.
              </EditorParagraph>
              <EditorParagraph>
                Everything starts with writing. Capture ideas, connect concepts,
                and let Atlas help you rediscover them later.
              </EditorParagraph>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
