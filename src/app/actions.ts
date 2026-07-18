"use server";

import { Resend } from "resend";

export type SignupState = {
  status: "idle" | "success" | "already" | "error";
  message: string;
};

// Intentionally permissive — Resend does the authoritative validation.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Floor for how long the request appears to take, so the loading→success
// animation always reads. This is a *minimum*, not an added delay: a slow
// request (> this) incurs no extra wait.
const MIN_PENDING_MS = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function joinWaitlist(
  _prev: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const start = Date.now();
  const result = await processSignup(formData);
  const elapsed = Date.now() - start;
  if (elapsed < MIN_PENDING_MS) {
    await sleep(MIN_PENDING_MS - elapsed);
  }
  return result;
}

async function processSignup(formData: FormData): Promise<SignupState> {
  // Honeypot: bots fill hidden fields, humans don't. Pretend success.
  if (formData.get("company")) {
    return { status: "success", message: "You're on the list." };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error("Resend env vars missing: RESEND_API_KEY / RESEND_AUDIENCE_ID");
    return {
      status: "error",
      message: "Signups are temporarily unavailable. Please try again later.",
    };
  }

  try {
    const resend = new Resend(apiKey);

    // Surface already-subscribed contacts with a friendly "already on the list"
    // state. Note: this reveals list membership for a typed email (email
    // enumeration) — an accepted tradeoff for a low-stakes waitlist. A failed
    // lookup (e.g. not found / transient error) just falls through to create,
    // which is idempotent.
    const existing = await resend.contacts.get({ audienceId, email });
    if (existing.data) {
      return { status: "already", message: "You're already on the list." };
    }

    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    // Backstop: if a contact slipped in between the lookup and create, Resend
    // may report it — treat that as already-on-the-list too.
    if (error) {
      if (/already exists/i.test(error.message ?? "")) {
        return { status: "already", message: "You're already on the list." };
      }
      console.error("Resend contacts.create failed:", error.message);
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
      };
    }

    // Fire the "waitlist" event for the new contact (triggers any Resend
    // automations tied to it, e.g. a confirmation email). Only on fresh
    // signups — re-submitting shouldn't re-trigger automations. A failure
    // here isn't fatal: the contact is already on the list.
    const { error: eventError } = await resend.events.send({
      event: "waitlist",
      email,
    });
    if (eventError) {
      console.error("Resend events.send failed:", eventError.message);
    }

    // Notify the team about the fresh signup. Same rules as the event above:
    // only on new contacts, and a failure isn't fatal — the signup already
    // succeeded, so we only lose the heads-up email.
    const notifyTo = process.env.WAITLIST_NOTIFY_TO;
    if (notifyTo) {
      const { error: notifyError } = await resend.emails.send({
        from:
          process.env.WAITLIST_NOTIFY_FROM ??
          "Lore Waitlist <onboarding@resend.dev>",
        to: notifyTo,
        subject: "New Lore Notes waitlist signup",
        text: `${email} just joined the Lore waitlist.`,
      });
      if (notifyError) {
        console.error(
          "Resend signup notification failed:",
          notifyError.message,
        );
      }
    }
  } catch (err) {
    console.error("Resend request threw:", err);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return { status: "success", message: "You're on the list. We'll be in touch." };
}
