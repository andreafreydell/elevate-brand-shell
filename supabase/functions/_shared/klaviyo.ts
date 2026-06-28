// Minimal Klaviyo Events API client — used to fire the `cycle_opened` event that
// triggers the "your new cycle is open — pick your pieces" flow. The flow itself
// is built in the Klaviyo UI; this just emits the trigger with the data it needs.

export async function trackKlaviyoEvent(params: {
  metric: string;
  email: string;
  properties?: Record<string, unknown>;
}): Promise<{ ok: boolean; status: number; error?: string }> {
  const apiKey = Deno.env.get("KLAVIYO_PRIVATE_KEY");
  if (!apiKey) {
    console.warn("KLAVIYO_PRIVATE_KEY not set; skipping Klaviyo event.");
    return { ok: false, status: 0, error: "KLAVIYO_PRIVATE_KEY not set" };
  }

  const body = {
    data: {
      type: "event",
      attributes: {
        properties: params.properties ?? {},
        metric: { data: { type: "metric", attributes: { name: params.metric } } },
        profile: { data: { type: "profile", attributes: { email: params.email } } },
      },
    },
  };

  const response = await fetch("https://a.klaviyo.com/api/events/", {
    method: "POST",
    headers: {
      "Authorization": `Klaviyo-API-Key ${apiKey}`,
      "Content-Type": "application/json",
      "revision": "2024-10-15",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok && response.status !== 202) {
    const text = await response.text();
    console.error("Klaviyo event failed:", response.status, text);
    return { ok: false, status: response.status, error: text };
  }
  return { ok: true, status: response.status };
}
