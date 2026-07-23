import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { serviceClient } from "../_shared/auth.ts";
import { createShopifyReturn } from "../_shared/shopify.ts";

const RETURN_ID = "11d3f1af-aa36-4369-a374-03e7d5a75ed8";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const supabase = serviceClient();

  const { data: mr } = await supabase
    .from("member_returns")
    .select("*")
    .eq("id", RETURN_ID)
    .single();

  if (!mr) return jsonResponse({ error: "not found" }, 404);

  // Line item ids for expected_serials
  const { data: reservs } = await supabase
    .from("rental_reservations")
    .select("serial_number, shopify_line_item_id")
    .in("serial_number", mr.expected_serials)
    .eq("shopify_order_id", mr.shopify_order_id);

  const lineItemIds = (reservs || [])
    .map((r) => r.shopify_line_item_id)
    .filter(Boolean) as string[];

  const result = await createShopifyReturn(mr.shopify_order_id, lineItemIds);

  if (result.returnId) {
    await supabase
      .from("member_returns")
      .update({ shopify_return_id: result.returnId })
      .eq("id", RETURN_ID);
  }

  return jsonResponse({ lineItemIds, result, member_return_id: RETURN_ID }, 200);
});
