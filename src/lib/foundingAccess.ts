import { supabase } from "@/integrations/supabase/client";

// Klaviyo client-side subscribe — public (publishable) company ID, safe in browser code.
const KLAVIYO_COMPANY_ID = "VXe57M";
const KLAVIYO_LIST_ID = "RE3YJQ"; // "New Chapter Members"

/**
 * Subscribe an email to the Klaviyo welcome list. Fire-and-forget:
 * never throws, never blocks the visitor's experience.
 */
const subscribeToKlaviyo = (email: string, source: string, firstName?: string) => {
  try {
    const profileAttributes: Record<string, unknown> = { email };
    if (firstName) profileAttributes.first_name = firstName;

    void fetch(
      `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", revision: "2024-10-15" },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              custom_source: source,
              profile: { data: { type: "profile", attributes: profileAttributes } },
            },
            relationships: { list: { data: { type: "list", id: KLAVIYO_LIST_ID } } },
          },
        }),
      },
    ).catch(() => undefined);
  } catch {
    // Never let marketing plumbing break the site.
  }
};

export const FOUNDING_ACCESS_CAPTURED_KEY = "gea_email_captured";
export const FOUNDING_ACCESS_DISMISSED_KEY = "gea_popup_dismissed";
export const FOUNDING_ACCESS_EVENT = "gea-founding-access-state-change";

export const CAPTURE_SUPPRESSION_MS = 7 * 24 * 60 * 60 * 1000;
export const DISMISS_SUPPRESSION_MS = 24 * 60 * 60 * 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const dispatchFoundingAccessEvent = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(FOUNDING_ACCESS_EVENT));
};

const readStoredTimestamp = (key: string) => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
};

const isWithinWindow = (key: string, durationMs: number) => {
  const timestamp = readStoredTimestamp(key);
  return timestamp !== null && Date.now() - timestamp < durationMs;
};

export const hasRecentFoundingAccessCapture = () =>
  isWithinWindow(FOUNDING_ACCESS_CAPTURED_KEY, CAPTURE_SUPPRESSION_MS);

export const hasRecentFoundingAccessDismissal = () =>
  isWithinWindow(FOUNDING_ACCESS_DISMISSED_KEY, DISMISS_SUPPRESSION_MS);

export const markFoundingAccessCaptured = (timestamp = Date.now()) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FOUNDING_ACCESS_CAPTURED_KEY, String(timestamp));
  window.localStorage.removeItem(FOUNDING_ACCESS_DISMISSED_KEY);
  dispatchFoundingAccessEvent();
};

export const markFoundingAccessDismissed = (timestamp = Date.now()) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FOUNDING_ACCESS_DISMISSED_KEY, String(timestamp));
  dispatchFoundingAccessEvent();
};

interface SaveFoundingAccessResult {
  success: boolean;
  error?: string;
}

export const saveFoundingAccessEmail = async (
  email: string,
  source: string,
  firstName?: string,
): Promise<SaveFoundingAccessResult> => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  // Klaviyo first and unconditionally: even if Supabase hiccups, the welcome
  // flow still reaches them. Endpoint is idempotent for repeat subscribes.
  subscribeToKlaviyo(normalizedEmail, source, firstName);

  const { error } = await supabase
    .from("founding_members")
    .insert({ email: normalizedEmail, source });

  if (error && error.code !== "23505") {
    return { success: false, error: "Something went wrong. Please try again." };
  }

  markFoundingAccessCaptured();
  return { success: true };
};
