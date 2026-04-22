
Build an internal rental-ops console at `/admin/rental-ops` without changing the public storefront experience, using the existing GEA visual language and a small backend model focused only on inventory units, reservations, event history, and Shopify/WMS field configuration.

1. Backend structure
- Create the four canonical tables exactly as specified:
  - `inventory_units`
  - `rental_reservations`
  - `wms_events`
  - `shopify_wms_field_config`
- Keep the status values exactly as requested:
  - `availability_status`: `in_stock`, `out_of_stock`
  - `condition_status`: `cleaned_and_ready`, `under_inspection`, `marked_damaged_for_inspection`
  - `internal_status`: `assigned`, `released_to_wms`, `shipped`, `return_open`, `closed`, `damage_review`, `cancelled`
  - `event_type`: `order_accepted`, `serial_picked`, `shipment_created`, `return_opened`, `return_received`, `return_processed_restocked`, `return_processed_not_restocked`, `condition_result`, `missing_lost`
- Add only MVP-simple supporting structure:
  - timestamps/defaults for `created_at` and `updated_at`
  - unique constraints on `unit_id` and `serial_number`
  - foreign key from `rental_reservations.inventory_unit_id` and `wms_events.inventory_unit_id` to `inventory_units.id`
  - indexes on `shopify_variant_id`, `sku`, `serial_number`, and frequently filtered status columns
- Seed `shopify_wms_field_config` with the single default row:
  - `id = 1`
  - `field_strategy = order_metafield`
  - `field_namespace = gea`
  - `field_key = assigned_serials`
  - `is_active = true`

2. Security and admin access
- Because this is internal operational data, protect the backend with authentication and RLS rather than relying only on the existing site passcode.
- Keep your requested shared passcode as a lightweight UI gate for convenience if desired, but do not use it as the only protection for real admin data.
- Implement a minimal admin access model with:
  - standard staff sign-in
  - a separate `user_roles` table
  - `has_role()` security-definer helper
  - admin-only RLS policies on all rental-ops tables
- Since you said no staff profiles are needed, skip a `profiles` table.
- Restrict `/admin/rental-ops` to authenticated admins only.

3. Assignment logic
- Add one backend function for “Assign Least-Used Unit”.
- Function behavior:
  - accept `shopify_variant_id`, `sku`, optional fake Shopify order ID/name, and optional line item/customer IDs
  - select only units where:
    - `availability_status = in_stock`
    - `condition_status = cleaned_and_ready`
    - matching `shopify_variant_id` and/or `sku`
  - order by:
    - lowest `rental_count`
    - oldest `ready_since`
  - mark selected unit `availability_status = out_of_stock`
  - create a `rental_reservations` row with `internal_status = assigned`
  - create a `wms_events` audit row such as `order_accepted`
  - return the assigned serial/unit clearly to the UI
- Make this transactional so the same unit cannot be double-assigned.

4. Manual lifecycle actions
- Add backend actions for the unit detail panel:
  - Mark Return Opened
    - unit: `out_of_stock` + `under_inspection`
    - reservation: move toward `return_open`
    - event log: `return_opened`
  - Mark Processed + Restocked
    - unit: `in_stock` + `cleaned_and_ready`
    - update `ready_since`, `last_returned_at`, `last_inspected_at`
    - reservation: `closed`
    - event log: `return_processed_restocked`
  - Mark Processed + Not Restocked
    - unit: `out_of_stock` + `marked_damaged_for_inspection`
    - reservation: `damage_review`
    - event log: `return_processed_not_restocked`
  - Add/update notes on the unit
- Keep these as internal testing/exception tools only.

5. Admin UI route and layout
- Add a new page at `/admin/rental-ops`.
- Keep it outside the customer journey:
  - no customer-facing links in primary navigation
  - internal-only route guard
- Use the existing GEA layout vocabulary:
  - warm cream background
  - brown borders/text
  - square cards and controls
  - editorial section headings
  - no generic SaaS color styling
- Reuse existing primitives like `PageLayout`, `Card`, `Table`, `Button`, `Input`, and the craft/editorial accents sparingly so it feels like an atelier operations console.

6. Dashboard sections to implement
- Overview cards
  - Total units
  - In stock + cleaned and ready
  - Out of stock
  - Under inspection
  - Marked damaged for inspection
  - Active reservations
  - Damage review reservations
- Inventory Units table
  - requested columns
  - filters for availability, condition, SKU, variant ID, search by serial/unit ID
  - status badges with clear visual hierarchy:
    - ready = positive
    - inspection = muted/neutral
    - damage review = urgent
- Unit detail panel/drawer
  - full unit record
  - latest/current reservation
  - recent WMS event history
  - manual actions
  - notes editor
- Reservation table
  - requested columns and filters
- Assign test unit panel
  - simple form
  - result card showing assigned serial prominently
- Shopify/WMS field config panel
  - show current config
  - allow safe editing of `field_strategy`
  - optionally allow namespace/key editing if straightforward
  - warning copy that this must match the WMS-readable field
- Event log
  - recent events with payload preview

7. Data fetching pattern
- Load dashboard aggregates with targeted queries instead of one giant fetch.
- Fetch tables with filterable queries and reasonable limits.
- Support drill-in selection for unit detail without reloading the full page.
- Keep actions optimistic only where safe; otherwise prefer refetch after write for operational accuracy.

8. Suggested MVP-simple improvements
- Add a computed “assignable” interpretation in the UI (`in_stock` + `cleaned_and_ready`) without creating another database status.
- Add a small “last event” / “current blockage reason” summary in the unit detail panel for faster triage.
- Add empty states and obvious warnings for:
  - no matching unit available
  - unit blocked by condition
  - unit already assigned/out of stock
- Defer webhook automation and Shopify writeback UI until the internal lifecycle works cleanly.

9. Files likely involved
- New admin page and child components under something like:
  - `src/pages/AdminRentalOps.tsx`
  - `src/components/admin-rental-ops/*`
- Route update in `src/App.tsx`
- Auth/admin guard utilities/hooks
- Backend migration files for schema/RLS
- Backend functions or RPC-backed actions for:
  - assignment
  - lifecycle transitions
  - admin aggregates

10. Important implementation note
- I recommend not shipping this with only the shared passcode gate. For a real internal admin tool with writable inventory/reservation state, the shared passcode can remain as an extra convenience layer, but the actual data access should still be protected by authenticated admin-only backend rules.

Technical details
- Use database migrations for schema creation and RLS.
- Do not modify the auto-generated Supabase client/types files manually.
- Use a separate `user_roles` table for admin authorization.
- Keep all public storefront routes unchanged.
- Use a transactional backend action for least-used assignment so inventory cannot double-book.
- Treat Shopify/WMS serial writeback strategy as configuration, not hard-coded UI logic.
