# CLAUDE.md

Guidance for Claude Code (and humans) working in the **Lore Notes waitlist site**.

## What this is

A single-page marketing + waitlist website for **Lore Notes** ("Lore" for short —
formerly **Atlas**, renamed July 2026), a native macOS markdown note-taking app.
The site's only jobs are: (1) explain what Lore is and why it's
different, and (2) capture an email signup. Keep it that focused — this is not the
app, not a docs site, not a blog. One page, one primary call to action.

## Source of truth for product facts

The app itself lives in the sibling folder **`../atlas/`** (the folder still has
the pre-rebrand name pending its own rename). **Never invent product
claims.** Before writing or changing any copy that describes features, read:

- `../atlas/prd.md` — full product spec, philosophy, and Decision Log (the *what* and *why*)
- `../atlas/CLAUDE.md` — how the app is built (useful for technical accuracy)

If `prd.md` and the site disagree, `prd.md` wins. If you want to claim something the
PRD doesn't support, ask first.

### Facts that must stay accurate (do not overclaim)

- **macOS-native** (Swift + SwiftUI). iPad shipped; iPhone is planned. **No web app, no Android.** Don't imply a web/cross-platform product.
- **Markdown files on disk are the source of truth** — users fully own their notes; no lock-in, no proprietary format. This ownership angle is a core selling point.
- **Writing-first.** The editor (Craft-grade inline live-preview) is the headline. Retrieval (⌘K) and discovered connections are the intelligence layer.
- **AI is opt-in and bring-your-own-key** (Voyage + OpenAI). The app is fully usable for writing with no keys. **Never** market it as "an AI writing assistant," chatbot, or autocomplete — Lore explicitly is not those (see PRD "Non Goals" / "AI Should Not").
- It's pre-release — this is a *waitlist*. Don't promise ship dates or pricing unless the user provides them.

## Brand & voice

- **Naming:** use **"Lore"** in UI copy (wordmark, body text, product mock, form/dialog); use the full **"Lore Notes"** in metadata (`<title>`, OG/Twitter titles, OG alt text), the footer copyright, and legal contexts. The AI feature is "Ask Lore".
- **Tone:** calm, confident, writer-focused. Mirrors Lore's own restraint — premium and quiet, never hypey or buzzword-y. Think "tool for people who think through writing."
- **Visual north star:** Lore chases **Craft Docs**-grade polish — generous whitespace, refined typography, subtle motion. The landing page should feel like that too.
- **Accent color:** Lore uses Tailwind's **`olive`** palette (a warm, desaturated gray-olive) as the primary accent — `olive-600` for solid fills / white-text CTAs, `olive-700` hover, a 10% tint for soft surfaces. Wired through the `--accent*` tokens in `globals.css` and the `accent` Tailwind color, so prefer `text-accent`/`bg-accent` (or `olive-*` utilities) over hardcoded values. Blue `#0088FF` was the pre-rebrand accent; purple/pink were also rejected. Keep accent usage sparing and intentional.
- **Neutrals:** page canvas is **`stone-50`** (component surfaces stay white so they lift off it); headings are **`stone-700`**.
- **Typography:** headings use **Playfair Display** (a display serif that echoes the serif "L" in the icon), self-hosted via `next/font/google` and exposed as Tailwind's `font-serif` (`--font-playfair` → `--font-serif`); body/UI text stays **Geist** sans. Apply `font-serif` to new headings. The OG card (`social-card.tsx`) can't use `next/font`, so it loads bundled TTFs from `src/app/fonts/` (Geist 400/700 + Playfair 600) directly into Satori.
- Default to a clean light theme with a strong type hierarchy; respect `prefers-reduced-motion` and `prefers-color-scheme` if a dark mode is added.

## Tech stack

- **Next.js (App Router) + TypeScript + Tailwind CSS.** Deploy target is **Vercel**.
- Email capture via **Resend Audiences** — the signup form adds the contact to a Resend audience (and may trigger a confirmation email).
- Form submission uses a **Next.js Server Action** (or a route handler under `app/api/`) — never call Resend from the client; the API key must stay server-side.
- Keep dependencies minimal. No CMS, no auth, no database unless a real need appears (Resend holds the list).

## Environment / secrets

Server-only env vars in `.env.local` (gitignored; provide `.env.example` with empty values):

- `RESEND_API_KEY` — Resend API key
- `RESEND_AUDIENCE_ID` — target audience for signups
- `WAITLIST_NOTIFY_TO` — where to send new-signup notification emails (optional; empty disables them)
- `WAITLIST_NOTIFY_FROM` — sender for those notifications, on a Resend-verified domain (optional; defaults to `onboarding@resend.dev`)

Never log, echo, or commit keys. Never expose them to the client (no `NEXT_PUBLIC_` prefix for these).

## Form behavior

- Validate the email server-side before calling Resend.
- Handle the already-subscribed case gracefully (treat as success, don't leak that the email exists).
- Show clear success / error / loading states; the form must work and be accessible (labeled input, keyboard-usable, announced status).
- Don't block on third-party JS; the form should degrade reasonably.

## Legacy domain redirects

The old product domains (`writeatlas.app`, `fernnotes.app`) redirect to this
site. Those redirects must append a `?from=` marker (`?from=atlas`,
`?from=fern`) — `RebrandBanner` (mounted in the root layout) reads it, shows
"<Old name> is now Lore Notes", strips the param from the URL, and remembers a
dismissal for the session. Add new legacy names to `FORMER_NAMES` in
`src/components/RebrandBanner.tsx`.

## Conventions

- Match the surrounding code's style and naming. Function components, server components by default; mark client components with `"use client"` only when needed (the form).
- Tailwind for styling; pull shared values (accent color, spacing scale) into the Tailwind config rather than hardcoding `#0088FF` everywhere.
- Keep copy in the page/components readable and easy to edit — this site's content will change often.
- Accessibility and Lighthouse performance matter (it's one page; there's no excuse for a slow or inaccessible site).

## Commands

This project is not scaffolded yet. Once `package.json` exists (e.g. via
`npx create-next-app@latest`), the standard scripts apply:

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Production preview: `npm run start`
- Lint: `npm run lint`

If you scaffold it, prefer the App Router + TypeScript + Tailwind options and keep
the default ESLint config.
