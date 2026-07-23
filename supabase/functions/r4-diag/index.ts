// Temp diagnostic: recent orders + webhook deliveries. Delete after use.
Deno.serve(async (req) => {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== Deno.env.get("WEBHOOK_ADMIN_TMP")) {
    return new Response("forbidden", { status: 403 });
  }
  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "orders";

  const shop = Deno.env.get("SHOPIFY_SHOP_DOMAIN") || Deno.env.get("SHOPIFY_STORE_DOMAIN");
  const clientId = Deno.env.get("SHOPIFY_OAUTH_CLIENT_ID")!;
  const clientSecret = Deno.env.get("SHOPIFY_OAUTH_CLIENT_SECRET")!;

  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: clientId, client_secret: clientSecret }),
  });
  const tokenJson = await tokenRes.json();
  const token = tokenJson.access_token;

  const apiVersion = "2026-01";
  const headers = { "X-Shopify-Access-Token": token, "Content-Type": "application/json" };

  if (action === "orders") {
    // Recent 10 orders with line items
    const r = await fetch(`https://${shop}/admin/api/${apiVersion}/orders.json?status=any&limit=10&fields=id,name,created_at,email,customer,line_items,discount_codes,financial_status`, { headers });
    const j = await r.json();
    return Response.json(j);
  }

  if (action === "events") {
    // Webhook delivery events for orders/paid via GraphQL webhookSubscriptions + events
    const orderId = url.searchParams.get("order_id");
    const q = `query { events(first: 20, query: "subject_id:${orderId}") { edges { node { id message createdAt } } } }`;
    const r = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, { method: "POST", headers, body: JSON.stringify({ query: q }) });
    return Response.json(await r.json());
  }

  if (action === "replay") {
    const orderId = url.searchParams.get("order_id")!;
    // Fetch full order
    const r = await fetch(`https://${shop}/admin/api/${apiVersion}/orders/${orderId}.json`, { headers });
    const oj = await r.json();
    const order = oj.order;

    // POST to shopify-order-paid with valid HMAC
    const secret = Deno.env.get("SHOPIFY_WEBHOOK_SECRET")!;
    const body = JSON.stringify(order);
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
    const hmac = btoa(String.fromCharCode(...new Uint8Array(sig)));

    const target = `${Deno.env.get("SUPABASE_URL")}/functions/v1/shopify-order-paid`;
    const rr = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Hmac-Sha256": hmac,
        "X-Shopify-Topic": "orders/paid",
        "X-Shopify-Shop-Domain": shop!,
      },
      body,
    });
    const txt = await rr.text();
    return Response.json({ status: rr.status, body: txt, order_name: order.name, order_id: order.id, line_items: order.line_items?.map((li: any) => ({ id: li.id, variant_id: li.variant_id, sku: li.sku, title: li.title })) });
  }

  return new Response("unknown action", { status: 400 });
});
