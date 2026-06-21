import "server-only";

const RESEND_API = "https://api.resend.com";

/**
 * Resend has no count endpoint, so we list the audience's contacts and count
 * subscribed ones. Cached for 5 minutes (Next fetch revalidation) so page loads
 * don't hammer the API. Returns null on any failure so the UI can hide the
 * social-proof line rather than show a broken number.
 *
 * Note: the list endpoint paginates (`has_more`). For a large waitlist this
 * would need to page through; for now we count the first page and append "+"
 * when there's more.
 */
export async function getWaitlistCount(): Promise<{
  count: number;
  hasMore: boolean;
} | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return null;

  try {
    const res = await fetch(
      `${RESEND_API}/audiences/${audienceId}/contacts`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) return null;

    const json = (await res.json()) as {
      data?: { unsubscribed?: boolean }[];
      has_more?: boolean;
    };
    const contacts = Array.isArray(json.data) ? json.data : [];
    const count = contacts.filter((c) => !c.unsubscribed).length;
    return { count, hasMore: Boolean(json.has_more) };
  } catch {
    return null;
  }
}
