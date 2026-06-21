"use server";

import { Resend } from "resend";

export type SignupState = {
  status: "idle" | "success" | "error";
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
    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    // Treat an already-subscribed contact as success — never leak list membership.
    if (error && !/already exists/i.test(error.message ?? "")) {
      console.error("Resend contacts.create failed:", error.message);
      return {
        status: "error",
        message: "Something went wrong. Please try again.",
      };
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
