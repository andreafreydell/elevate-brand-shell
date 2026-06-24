# GEA x Deposco (Nimbl) WMS PUT Writeback Build Ticket

## Summary

Build the `wms_rest_api` writeback path for GEA rental orders so that, after a Shopify order is paid and a serialized unit is assigned internally, the assigned serial number is sent directly to Nimbl / Deposco and stamped onto the correct order line in the WMS.

This replaces the current Shopify-side writeback preference for WMS consumption.

## Why This Build Exists

The Shopify-side approaches are constrained by post-order editing limitations:

- order-level data is editable after payment
- true line-level custom properties are not a reliable post-sale target

Nimbl has indicated the cleanest path is a direct API update:

- use `PUT`
- identify the order
- identify the target SKU / line
- update the line-level serial number field in the WMS

## Current State

Existing backend pieces already in place:

- Shopify paid-order webhook receives the order and filters rental lines
- Supabase assigns one serialized unit per rental line
- assigned serial metadata is assembled after assignment
- writeback strategy is configurable in `shopify_wms_field_config`
- `wms_rest_api` already exists as a declared strategy, but no writer has been implemented yet

Relevant files:

- [shopify-order-paid/index.ts](/C:/Users/direc/Dropbox/Ambiente%20Home%20LLC/Website/elevate-brand-shell/supabase/functions/shopify-order-paid/index.ts)
- [_shared/shopify.ts](/C:/Users/direc/Dropbox/Ambiente%20Home%20LLC/Website/elevate-brand-shell/supabase/functions/_shared/shopify.ts)
- [20260422090000_gea_rental_backend_mvp.sql](/C:/Users/direc/Dropbox/Ambiente%20Home%20LLC/Website/elevate-brand-shell/supabase/migrations/20260422090000_gea_rental_backend_mvp.sql)

## MVP Decision

For MVP, rental items should be constrained to:

- quantity `1` per rental SKU per order line

Reason:

- Shopify may import quantity `2` of the same SKU as one order line with quantity `2`
- Nimbl has flagged that this could create only one serial field on that line
- current GEA assignment flow is one serialized assignment per line item

If quantity `> 1` must be supported later, that becomes a follow-on enhancement and not part of this MVP.

## External Dependency

We still need the customer-specific Deposco / Nimbl contract from Anthony:

- endpoint URL for the `PUT`
- authentication method
- sample request payload
- exact field used to identify the target line
- exact field name where serial number should be written
- sample success response
- sample error response
- confirmation whether a line can store one serial only or multiple serials

Public reference:

- [Deposco Developer Portal](https://developer.deposco.com/)

## Goal

When a paid Shopify rental order is received:

1. GEA assigns the correct serialized unit internally.
2. GEA sends a direct `PUT` request to Nimbl / Deposco.
3. Nimbl updates the matching order line with the assigned serial number.
4. The warehouse sees the serial in its native WMS workflow.

## Non-Goals

- no attempt to post-edit Shopify line item properties
- no support for rental order quantities greater than `1` in MVP
- no redesign of warehouse returns flow in this ticket
- no storefront UX changes unless needed to enforce quantity `1`

## Implementation Scope

### 1. Implement `wms_rest_api` writer

Add a new writer path in `writeAssignedSerialsToShopify` or refactor that function into a more general writeback dispatcher.

Expected behavior:

- if `field_strategy = "wms_rest_api"`, call Nimbl / Deposco instead of Shopify
- send one writeback per assigned rental line unless the API contract says otherwise

### 2. Add Deposco API client helper

Create a helper to:

- build authenticated request
- send `PUT`
- parse success / error responses
- normalize result structure for logging and admin visibility

Suggested location:

- `supabase/functions/_shared/deposco.ts`

### 3. Extend environment configuration

Add environment variables for:

- `DEPOSCO_BASE_URL`
- `DEPOSCO_API_TOKEN` or equivalent auth secret
- `DEPOSCO_ACCOUNT_ID` or tenant identifier if required
- optional timeout / retry settings

### 4. Wire into existing paid-order flow

After serial assignment succeeds:

- build payload using Shopify order ID / order number, SKU, serial number, and any other required identifiers
- send writeback to Nimbl
- capture result per line

### 5. Add logging and failure handling

Minimum MVP behavior:

- log request outcome per assigned line
- return partial success if some lines assign but writeback fails
- avoid silently swallowing WMS writeback failures

Recommended:

- record WMS writeback outcomes in `wms_events` or a dedicated payload block
- include enough metadata to manually retry failed writes

### 6. Enforce rental quantity rule

Implement one of these before production use:

- storefront guardrail preventing quantity above `1` for rental items
- backend validation that rejects quantity `> 1` rental lines from automated assignment

Preferred MVP:

- both storefront and backend guardrails

## Suggested Payload Shape

Final shape depends on Anthony's sample, but our side will likely have these values:

```json
{
  "order_number": "GEA-1001",
  "sku": "GEA-NECKLACE-001",
  "serial_number": "SN-000245",
  "shopify_order_id": "1234567890",
  "shopify_line_item_id": "1122334455"
}
```

## Technical Risks

### Risk 1: Duplicate SKU in one order

If one order can contain the same rental SKU more than once, `order + sku` may not uniquely identify a line.

MVP mitigation:

- enforce quantity `1`
- avoid duplicate rental SKU lines

### Risk 2: WMS update succeeds partially or fails

Serial could be assigned internally but not written to Nimbl.

MVP mitigation:

- structured logging
- partial-success response
- clear retry path

### Risk 3: Nimbl contract is more custom than implied

If auth, payload shape, or line lookup requires more customer-specific fields, estimate expands modestly.

## Acceptance Criteria

### Functional

- a paid Shopify rental order triggers internal serialized assignment
- when `field_strategy = "wms_rest_api"`, GEA sends a `PUT` to Nimbl / Deposco
- the target order line in Nimbl shows the correct serial number
- mixed orders do not break the flow
- failed writeback is visible in logs / response payload

### Business

- warehouse team can see the assigned serial in the WMS without using GEA admin
- GEA admin does not need to manually stamp serials into Shopify for warehouse use

## Test Plan

### Test 1. Single rental line

- create paid order with one rental item
- verify one unit is assigned
- verify Nimbl line is updated with the serial

### Test 2. Mixed order

- create paid order with rental and non-rental items
- verify only rental line triggers serialized assignment and writeback

### Test 3. Writeback failure

- simulate Deposco auth or endpoint failure
- verify internal assignment does not disappear
- verify failure is logged clearly for retry

### Test 4. Quantity guardrail

- attempt rental line with quantity `2`
- verify system blocks it or routes it to manual review

## Estimate

Assuming Anthony provides a straightforward endpoint and payload:

- build + wiring: `1 day`
- testing + hardening: `0.5 to 1 day`

Practical estimate:

- `1 to 2 dev days`

If quantity `> 1` support is included:

- re-scope to `3 to 5 dev days`

## Next Action

Wait for Anthony's sample payload and auth details.

Once received:

1. finalize request contract
2. implement `wms_rest_api` writer
3. test against a real or sandbox order
