# CLAUDE.md

Guidance for Claude Code (and humans) working in the **Atlas waitlist site**.

## What this is

A single-page marketing + waitlist website for **Atlas**, a native macOS markdown
note-taking app. The site's only jobs are: (1) explain what Atlas is and why it's
different, and (2) capture an email signup. Keep it that focused — this is not the
app, not a docs site, not a blog. One page, one primary call to action.

## Source of truth for product facts

The app itself lives in the sibling folder **`../atlas/`**. **Never invent product
claims.** Before writing or changing any copy that describes features, read:

- `../atlas/prd.md` — full product spec, philosophy, and Decision Log (the *what* and *why*)
- `../atlas/CLAUDE.md` — how the app is built (useful for technical accuracy)

If `prd.md` and the site disagree, `prd.md` wins. If you want to claim something the
PRD doesn't support, ask first.

### Facts that must stay accurate (do not overclaim)

- **macOS-native** (Swift + SwiftUI). iPad shipped; iPhone is planned. **No web app, no Android.** Don't imply a web/cross-platform product.
- **Markdown files on disk are the source of truth** — users fully own their notes; no lock-in, no proprietary format. This ownership angle is a core selling point.
- **Writing-first.** The editor (Craft-grade inline live-preview) is the headline. Retrieval (⌘K) and discovered connections are the intelligence layer.
- **AI is opt-in and bring-your-own-key** (Voyage + OpenAI). The app is fully usable for writing with no keys. **Never** market it as "an AI writing assistant," chatbot, or autocomplete — Atlas explicitly is not those (see PRD "Non Goals" / "AI Should Not").
- It's pre-release — this is a *waitlist*. Don't promise ship dates or pricing unless the user provides them.

## Brand & voice

- **Tone:** calm, confident, writer-focused. Mirrors Atlas's own restraint — premium and quiet, never hypey or buzzword-y. Think "tool for people who think through writing."
- **Visual north star:** Atlas chases **Craft Docs**-grade polish — generous whitespace, refined typography, subtle motion. The landing page should feel like that too.
- **Accent color:** Atlas's AI/accent surfaces use blue **`#0088FF`**. Use it as the site's primary accent; purple/pink were explicitly rejected. Keep accent usage sparing and intentional.
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
