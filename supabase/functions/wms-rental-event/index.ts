import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, jsonResponse } from "../_shared/cors.ts";

type WmsRentalEventType =
  | "shipment_created"
  | "return_opened"
  | "return_received"
  | "return_processed_restocked"
  | "return_processed_not_restocked"
  | "missing_lost";

interface WmsRentalEventRequest {
  event_type: WmsRentalEventType;
  serial_number: string;
  shopify_order_id?: string;
  shopify_line_item_id?: string;
  tracking_number?: string;
  payload?: Record<string, unknown>;
}

function isAuthorized(req: Request) {
  const expectedSecret = Deno.env.get("GEA_WMS_EVENT_SECRET");
  if (!expectedSecret) {
    console.warn("GEA_WMS_EVENT_SECRET not set; rejecting WMS event requests.");
    return false;
  }

  const providedSecret = req.headers.get("x-gea-wms-secret");
  return providedSecret === expectedSecret;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  if (!isAuthorized(req)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const body = (await req.json()) as WmsRentalEventRequest;
  if (!body.event_type || !body.serial_number) {
    return jsonResponse({ error: "event_type and serial_number are required" }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let rpcName: string | null = null;
  let rpcParams: Record<string, unknown> = {};

  if (body.event_type === "shipment_created") {
    rpcName = "mark_unit_shipped";
    rpcParams = {
      p_serial_number: body.serial_number,
      p_shopify_order_id: body.shopify_order_id || null,
      p_shopify_line_item_id: body.shopify_line_item_id || null,
      p_tracking_number: body.tracking_number || null,
    };
  }

  if (body.event_type === "return_opened" || body.event_type === "return_received") {
    rpcName = "mark_unit_return_open";
    rpcParams = {
      p_serial_number: body.serial_number,
      p_shopify_order_id: body.shopify_order_id || null,
      p_shopify_line_item_id: body.shopify_line_item_id || null,
    };
  }

  if (body.event_type === "return_processed_restocked" || body.event_type === "return_processed_not_restocked") {
    rpcName = "mark_unit_return_processed";
    rpcParams = {
      p_serial_number: body.serial_number,
      p_restocked: body.event_type === "return_processed_restocked",
      p_shopify_order_id: body.shopify_order_id || null,
      p_shopify_line_item_id: body.shopify_line_item_id || null,
    };
  }

  if (!rpcName) {
    const { data: unit, error: lookupError } = await supabase
      .from("inventory_units")
      .select("id, unit_id, serial_number, sku, condition_status")
      .eq("serial_number", body.serial_number)
      .single();

    if (lookupError || !unit) {
      return jsonResponse({ error: lookupError?.message || "Unit not found" }, 404);
    }

    const { error: insertError } = await supabase.from("wms_events").insert({
      source: "wms",
      event_type: body.event_type,
      shopify_order_id: body.shopify_order_id || null,
      shopify_line_item_id: body.shopify_line_item_id || null,
      inventory_unit_id: unit.id,
      unit_id: unit.unit_id,
      serial_number: unit.serial_number,
      sku: unit.sku,
      condition_status: unit.condition_status,
      tracking_number: body.tracking_number || null,
      payload: body.payload || {},
      processed_at: new Date().toISOString(),
    });

    if (insertError) {
      return jsonResponse({ error: insertError.message }, 500);
    }

    return jsonResponse({ ok: true, event_type: body.event_type, serial_number: body.serial_number });
  }

  const { data, error } = await supabase.rpc(rpcName, rpcParams);
  if (error) {
    console.error("WMS event RPC failed:", error);
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({
    ok: true,
    event_type: body.event_type,
    serial_number: body.serial_number,
    unit: data,
  });
});
