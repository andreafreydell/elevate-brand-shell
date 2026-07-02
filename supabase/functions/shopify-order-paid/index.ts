import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import {
  isRentalLineItem,
  removeCustomerTags,
  ShopifyOrderPaidWebhook,
  ShopifyWmsFieldConfig,
  verifyShopifyWebhook,
  writeAssignedSerialsToShopify,
} from "../_shared/shopify.ts";
import { handleMembershipOrder } from "../_shared/membership.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const rawBody = await req.text();
  const isVerified = await verifyShopifyWebhook(req, rawBody);

  if (!isVerified) {
    return jsonResponse({ error: "Invalid Shopify webhook signature" }, 401);
  }

  const order = JSON.parse(rawBody) as ShopifyOrderPaidWebhook;
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: config, error: configError } = await supabase
    .from("shopify_wms_field_config")
    .select("field_strategy, field_namespace, field_key")
    .eq("id", 1)
    .single();

  if (configError || !config) {
    console.error("Failed to load WMS field config:", configError);
    return jsonResponse({ error: "WMS field config not found" }, 500);
  }

  const wmsFieldConfig = config as ShopifyWmsFieldConfig;

  const lineItems = order.line_items || [];
  const rentalLines = lineItems.filter(isRentalLineItem);
  const assignedSerials = [];
  const errors = [];
  let isMemberOrder = false;
  let memberCycleId: string | null = null;

  for (const lineItem of rentalLines) {
    if (!lineItem.variant_id || !lineItem.sku) {
      errors.push({
        line_item_id: String(lineItem.id),
        error: "Missing variant_id or sku",
      });
      continue;
    }

    const { data: reservation, error } = await supabase.rpc("create_rental_reservation_for_order_line", {
      p_shopify_order_id: String(order.id),
      p_shopify_order_name: order.name || null,
      p_shopify_line_item_id: String(lineItem.id),
      p_shopify_customer_id: order.customer?.id ? String(order.customer.id) : null,
      p_shopify_product_id: lineItem.product_id ? String(lineItem.product_id) : null,
      p_shopify_variant_id: String(lineItem.variant_id),
      p_sku: lineItem.sku,
      p_metadata: {
        line_item_title: lineItem.title || null,
        source: "shopify-order-paid",
      },
    });

    if (error || !reservation) {
      console.error("Reservation assignment failed:", error);
      errors.push({
        line_item_id: String(lineItem.id),
        error: error?.message || "Reservation assignment failed",
      });
      continue;
    }

    assignedSerials.push({
      shopify_order_id: String(order.id),
      shopify_line_item_id: String(lineItem.id),
      shopify_variant_id: String(lineItem.variant_id),
      sku: lineItem.sku,
      unit_id: reservation.unit_id,
      serial_number: reservation.serial_number,
    });

    // Count this checkout against the member's current cycle (idempotent;
    // no-op for non-members). Returns the enriched reservation.
    const { data: counted, error: countError } = await supabase.rpc("count_checkout_for_reservation", {
      p_reservation_id: reservation.id,
    });
    if (countError) {
      console.error("count_checkout_for_reservation failed:", countError);
    } else if (counted?.account_id) {
      isMemberOrder = true;
      memberCycleId = counted.rental_cycle_id;
    }
  }

  // A member has now used (part of) their cycle — remove the discount tag so the
  // 100%-off automatic discount can't be reused until next cycle opens.
  if (isMemberOrder && order.customer?.id) {
    try {
      await removeCustomerTags(String(order.customer.id), ["gea_cycle_open"]);
      if (memberCycleId) {
        await supabase
          .from("rental_cycles")
          .update({ tag_removed_at: new Date().toISOString() })
          .eq("id", memberCycleId);
      }
    } catch (tagError) {
      console.error("Failed to remove gea_cycle_open tag:", tagError);
    }
  }

  let shopifyWriteResult = null;
  if (assignedSerials.length > 0) {
    shopifyWriteResult = await writeAssignedSerialsToShopify(wmsFieldConfig, order, assignedSerials);
  }

  return jsonResponse({
    ok: errors.length === 0,
    order_id: String(order.id),
    rental_line_count: rentalLines.length,
    assigned_serials: assignedSerials,
    shopify_write_result: shopifyWriteResult,
    errors,
  }, errors.length > 0 ? 207 : 200);
});
