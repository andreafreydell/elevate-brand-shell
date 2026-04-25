import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  ClipboardList,
  Eye,
  PackageCheck,
  PackageX,
  RefreshCw,
  ScanSearch,
  Settings2,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type AvailabilityStatus = "in_stock" | "out_of_stock" | "reserved" | "shipped";
type ConditionStatus =
  | "cleaned_and_ready"
  | "under_inspection"
  | "marked_damaged_for_inspection"
  | "retired";
type InternalStatus =
  | "assigned"
  | "released_to_wms"
  | "shipped"
  | "return_open"
  | "closed"
  | "damage_review"
  | "cancelled";
type WMSEventType =
  | "order_accepted"
  | "serial_picked"
  | "shipment_created"
  | "return_opened"
  | "return_received"
  | "return_processed_restocked"
  | "return_processed_not_restocked"
  | "condition_result"
  | "missing_lost";
type FieldStrategy =
  | "line_item_property"
  | "order_metafield"
  | "order_note_attribute"
  | "fulfillment_note"
  | "order_tag"
  | "wms_rest_api";

type InventoryUnit = {
  id: string;
  unit_id: string;
  serial_number: string;
  shopify_product_id?: string;
  shopify_variant_id: string;
  sku: string;
  availability_status: AvailabilityStatus;
  condition_status: ConditionStatus;
  rental_count: number;
  total_days_out: number;
  location?: string;
  ready_since: string;
  last_shipped_at?: string;
  last_returned_at?: string;
  last_inspected_at?: string;
  notes: string;
  metadata: Record<string, string>;
  created_at: string;
  updated_at: string;
};

type RentalReservation = {
  id: string;
  shopify_order_id: string;
  shopify_order_name: string;
  shopify_line_item_id: string;
  shopify_customer_id: string;
  shopify_product_id: string;
  shopify_variant_id: string;
  sku: string;
  inventory_unit_id: string;
  unit_id: string;
  serial_number: string;
  internal_status: InternalStatus;
  assigned_at?: string;
  released_to_wms_at?: string;
  shipped_at?: string;
  return_opened_at?: string;
  returned_at?: string;
  closed_at?: string;
  rental_start?: string;
  rental_end?: string;
  metadata: Record<string, string>;
  created_at: string;
  updated_at: string;
};

type WMSEvent = {
  id: string;
  source: string;
  event_type: WMSEventType;
  shopify_order_id?: string;
  shopify_line_item_id?: string;
  inventory_unit_id: string;
  unit_id: string;
  serial_number: string;
  sku: string;
  tracking_number?: string;
  condition_status?: string;
  payload: Record<string, string | number | boolean | null>;
  processed_at: string;
  created_at: string;
};

type ShopifyWmsFieldConfig = {
  id: number;
  field_strategy: FieldStrategy;
  field_namespace: string;
  field_key: string;
  is_active: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
};

const ADMIN_PASSCODE = "GEA2026";
const ADMIN_STORAGE_KEY = "gea_rental_ops_access";

// Test seed: Theolia Silver Cluster Chain Necklace (variant 7601234502426)
const THEOLIA_VARIANT_ID = "7601234502426";
const THEOLIA_SKU = "THEOLIA-SCC-NECK";

const initialUnits: InventoryUnit[] = [
  {
    id: "unit-theolia-001",
    unit_id: "GEA-THEOLIA-001",
    serial_number: "GEA-THEOLIA-001",
    shopify_variant_id: THEOLIA_VARIANT_ID,
    sku: THEOLIA_SKU,
    availability_status: "in_stock",
    condition_status: "cleaned_and_ready",
    rental_count: 0,
    total_days_out: 0,
    location: "Stockholm Atelier",
    ready_since: "2026-04-24T09:00:00Z",
    notes: "Theolia test unit #1.",
    metadata: { product: "theolia_silver_cluster_chain_necklace" },
    created_at: "2026-04-24T09:00:00Z",
    updated_at: "2026-04-24T09:00:00Z",
  },
  {
    id: "unit-theolia-002",
    unit_id: "GEA-THEOLIA-002",
    serial_number: "GEA-THEOLIA-002",
    shopify_variant_id: THEOLIA_VARIANT_ID,
    sku: THEOLIA_SKU,
    availability_status: "in_stock",
    condition_status: "cleaned_and_ready",
    rental_count: 0,
    total_days_out: 0,
    location: "Stockholm Atelier",
    ready_since: "2026-04-24T09:00:00Z",
    notes: "Theolia test unit #2.",
    metadata: { product: "theolia_silver_cluster_chain_necklace" },
    created_at: "2026-04-24T09:00:00Z",
    updated_at: "2026-04-24T09:00:00Z",
  },
];

const initialReservations: RentalReservation[] = [];

const initialEvents: WMSEvent[] = [];

const initialConfig: ShopifyWmsFieldConfig = {
  id: 1,
  field_strategy: "line_item_property",
  field_namespace: "",
  field_key: "assigned_serial",
  is_active: true,
  notes: "Writes the assigned serial as a line item property the WMS reads on the pick ticket.",
  created_at: "2026-04-24T09:00:00Z",
  updated_at: "2026-04-24T09:00:00Z",
};

const availabilityOptions: Array<{ value: AvailabilityStatus | "all"; label: string }> = [
  { value: "all", label: "All availability" },
  { value: "in_stock", label: "In stock" },
  { value: "reserved", label: "Reserved" },
  { value: "shipped", label: "Shipped" },
  { value: "out_of_stock", label: "Out of stock" },
];

const conditionOptions: Array<{ value: ConditionStatus | "all"; label: string }> = [
  { value: "all", label: "All condition states" },
  { value: "cleaned_and_ready", label: "Cleaned + ready" },
  { value: "under_inspection", label: "Under inspection" },
  { value: "marked_damaged_for_inspection", label: "Marked damaged" },
  { value: "retired", label: "Retired" },
];

const reservationStatusOptions: Array<{ value: InternalStatus | "all"; label: string }> = [
  { value: "all", label: "All reservation states" },
  { value: "assigned", label: "Assigned" },
  { value: "released_to_wms", label: "Released to WMS" },
  { value: "shipped", label: "Shipped" },
  { value: "return_open", label: "Return open" },
  { value: "closed", label: "Closed" },
  { value: "damage_review", label: "Damage review" },
  { value: "cancelled", label: "Cancelled" },
];

const fieldStrategies: FieldStrategy[] = [
  "order_metafield",
  "order_note_attribute",
  "fulfillment_note",
  "order_tag",
  "line_item_property",
  "wms_rest_api",
];

const formatDateTime = (value?: string) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const toLabel = (value: string) => value.split("_").join(" ");

const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const statusTone = {
  ready: "border-primary/30 bg-primary/10 text-foreground",
  neutral: "border-border bg-secondary text-foreground",
  urgent: "border-destructive/30 bg-destructive/10 text-foreground",
  dark: "border-foreground bg-foreground text-primary-foreground",
} as const;

const StatusPill = ({ kind, children }: { kind: keyof typeof statusTone; children: string }) => (
  <span
    className={cn(
      "inline-flex items-center border px-2 py-1 text-[10px] font-medium uppercase tracking-[0.22em] rounded-none",
      statusTone[kind],
    )}
  >
    {children}
  </span>
);

const getAvailabilityTone = (value: AvailabilityStatus) =>
  value === "in_stock" ? "ready" : "dark";

const getConditionTone = (value: ConditionStatus) => {
  if (value === "cleaned_and_ready") return "ready";
  if (value === "under_inspection") return "neutral";
  return "urgent";
};

const getReservationTone = (value: InternalStatus) => {
  if (value === "damage_review") return "urgent";
  if (value === "return_open") return "neutral";
  if (value === "closed") return "ready";
  return "dark";
};

const MiniLabel = ({ children }: { children: string }) => (
  <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{children}</p>
);

const DataCell = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1 border-t border-border py-3 first:border-t-0 first:pt-0">
    <MiniLabel>{label}</MiniLabel>
    <p className="text-sm text-foreground">{value || "—"}</p>
  </div>
);

const AdminRentalOps = () => {
  const [accessGranted, setAccessGranted] = useState(() => localStorage.getItem(ADMIN_STORAGE_KEY) === "true");
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);

  const [inventoryUnits, setInventoryUnits] = useState<InventoryUnit[]>(initialUnits);
  const [reservations, setReservations] = useState<RentalReservation[]>(initialReservations);
  const [events, setEvents] = useState<WMSEvent[]>(initialEvents);
  const [fieldConfig, setFieldConfig] = useState<ShopifyWmsFieldConfig>(initialConfig);

  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityStatus | "all">("all");
  const [conditionFilter, setConditionFilter] = useState<ConditionStatus | "all">("all");
  const [inventorySkuFilter, setInventorySkuFilter] = useState("");
  const [inventoryVariantFilter, setInventoryVariantFilter] = useState("");
  const [inventorySearch, setInventorySearch] = useState("");

  const [reservationStatusFilter, setReservationStatusFilter] = useState<InternalStatus | "all">("all");
  const [reservationSkuFilter, setReservationSkuFilter] = useState("");
  const [reservationSerialFilter, setReservationSerialFilter] = useState("");
  const [reservationOrderFilter, setReservationOrderFilter] = useState("");

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(initialUnits[0]?.id ?? null);
  const [assignVariantId, setAssignVariantId] = useState("7601234502426");
  const [assignSku, setAssignSku] = useState("THEOLIA-SCC-NECK");
  const [assignOrderId, setAssignOrderId] = useState("");
  const [assignOrderName, setAssignOrderName] = useState("");
  const [assignResult, setAssignResult] = useState<string>("");
  const [assignError, setAssignError] = useState<string>("");

  const selectedUnit = useMemo(
    () => inventoryUnits.find((unit) => unit.id === selectedUnitId) ?? null,
    [inventoryUnits, selectedUnitId],
  );

  const unitReservation = useMemo(() => {
    if (!selectedUnit) return null;
    return [...reservations]
      .filter((reservation) => reservation.inventory_unit_id === selectedUnit.id)
      .sort(
        (a, b) =>
          new Date(b.assigned_at ?? b.created_at).getTime() - new Date(a.assigned_at ?? a.created_at).getTime(),
      )[0] ?? null;
  }, [reservations, selectedUnit]);

  const unitEvents = useMemo(() => {
    if (!selectedUnit) return [];
    return [...events]
      .filter((event) => event.inventory_unit_id === selectedUnit.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [events, selectedUnit]);

  const overview = useMemo(() => {
    const readyUnits = inventoryUnits.filter(
      (unit) => unit.availability_status === "in_stock" && unit.condition_status === "cleaned_and_ready",
    ).length;

    return {
      totalUnits: inventoryUnits.length,
      readyUnits,
      outOfStock: inventoryUnits.filter((unit) => unit.availability_status === "out_of_stock").length,
      underInspection: inventoryUnits.filter((unit) => unit.condition_status === "under_inspection").length,
      damaged: inventoryUnits.filter((unit) => unit.condition_status === "marked_damaged_for_inspection").length,
      activeReservations: reservations.filter((reservation) =>
        ["assigned", "released_to_wms", "shipped", "return_open"].includes(reservation.internal_status),
      ).length,
      damageReviewReservations: reservations.filter((reservation) => reservation.internal_status === "damage_review")
        .length,
    };
  }, [inventoryUnits, reservations]);

  const filteredUnits = useMemo(() => {
    const query = inventorySearch.trim().toLowerCase();
    return inventoryUnits.filter((unit) => {
      const matchesAvailability = availabilityFilter === "all" || unit.availability_status === availabilityFilter;
      const matchesCondition = conditionFilter === "all" || unit.condition_status === conditionFilter;
      const matchesSku = !inventorySkuFilter.trim() || unit.sku.toLowerCase().includes(inventorySkuFilter.trim().toLowerCase());
      const matchesVariant =
        !inventoryVariantFilter.trim() ||
        unit.shopify_variant_id.toLowerCase().includes(inventoryVariantFilter.trim().toLowerCase());
      const matchesSearch =
        !query ||
        unit.serial_number.toLowerCase().includes(query) ||
        unit.unit_id.toLowerCase().includes(query);

      return matchesAvailability && matchesCondition && matchesSku && matchesVariant && matchesSearch;
    });
  }, [availabilityFilter, conditionFilter, inventorySkuFilter, inventoryVariantFilter, inventorySearch, inventoryUnits]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesStatus = reservationStatusFilter === "all" || reservation.internal_status === reservationStatusFilter;
      const matchesSku =
        !reservationSkuFilter.trim() || reservation.sku.toLowerCase().includes(reservationSkuFilter.trim().toLowerCase());
      const matchesSerial =
        !reservationSerialFilter.trim() ||
        reservation.serial_number.toLowerCase().includes(reservationSerialFilter.trim().toLowerCase());
      const matchesOrder =
        !reservationOrderFilter.trim() ||
        reservation.shopify_order_id.toLowerCase().includes(reservationOrderFilter.trim().toLowerCase()) ||
        reservation.shopify_order_name.toLowerCase().includes(reservationOrderFilter.trim().toLowerCase());

      return matchesStatus && matchesSku && matchesSerial && matchesOrder;
    });
  }, [reservationOrderFilter, reservationSerialFilter, reservationSkuFilter, reservationStatusFilter, reservations]);

  const recentEvents = useMemo(
    () => [...events].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 12),
    [events],
  );

  const blockageReason = selectedUnit
    ? selectedUnit.availability_status === "in_stock" && selectedUnit.condition_status === "cleaned_and_ready"
      ? "Assignable now"
      : selectedUnit.condition_status === "marked_damaged_for_inspection"
        ? "Blocked for damage review"
        : selectedUnit.condition_status === "under_inspection"
          ? "Blocked pending inspection"
          : "Assigned or currently out"
    : "";

  const upsertEvent = (
    unit: InventoryUnit,
    eventType: WMSEventType,
    payload: Record<string, string | number | boolean | null>,
    reservation?: RentalReservation | null,
  ) => {
    const now = new Date().toISOString();
    const event: WMSEvent = {
      id: makeId("evt"),
      source: "manual_admin",
      event_type: eventType,
      shopify_order_id: reservation?.shopify_order_id,
      shopify_line_item_id: reservation?.shopify_line_item_id,
      inventory_unit_id: unit.id,
      unit_id: unit.unit_id,
      serial_number: unit.serial_number,
      sku: unit.sku,
      condition_status: unit.condition_status,
      payload,
      processed_at: now,
      created_at: now,
    };

    setEvents((current) => [event, ...current]);
  };

  const updateSelectedUnitNotes = (notes: string) => {
    if (!selectedUnit) return;
    const now = new Date().toISOString();
    setInventoryUnits((current) =>
      current.map((unit) => (unit.id === selectedUnit.id ? { ...unit, notes, updated_at: now } : unit)),
    );
  };

  const handleLifecycleAction = (
    action: "return_opened" | "processed_restocked" | "processed_not_restocked",
  ) => {
    if (!selectedUnit) return;
    const now = new Date().toISOString();
    const currentReservation = unitReservation;

    let updatedUnit: InventoryUnit = selectedUnit;
    let nextReservationStatus: InternalStatus | null = null;
    let nextEventType: WMSEventType = "condition_result";

    if (action === "return_opened") {
      updatedUnit = {
        ...selectedUnit,
        availability_status: "out_of_stock",
        condition_status: "under_inspection",
        updated_at: now,
      };
      nextReservationStatus = "return_open";
      nextEventType = "return_opened";
    }

    if (action === "processed_restocked") {
      updatedUnit = {
        ...selectedUnit,
        availability_status: "in_stock",
        condition_status: "cleaned_and_ready",
        ready_since: now,
        last_returned_at: now,
        last_inspected_at: now,
        updated_at: now,
      };
      nextReservationStatus = "closed";
      nextEventType = "return_processed_restocked";
    }

    if (action === "processed_not_restocked") {
      updatedUnit = {
        ...selectedUnit,
        availability_status: "out_of_stock",
        condition_status: "marked_damaged_for_inspection",
        last_returned_at: now,
        last_inspected_at: now,
        updated_at: now,
      };
      nextReservationStatus = "damage_review";
      nextEventType = "return_processed_not_restocked";
    }

    setInventoryUnits((current) => current.map((unit) => (unit.id === selectedUnit.id ? updatedUnit : unit)));

    if (currentReservation && nextReservationStatus) {
      setReservations((current) =>
        current.map((reservation) => {
          if (reservation.id !== currentReservation.id) return reservation;

          return {
            ...reservation,
            internal_status: nextReservationStatus,
            return_opened_at: action === "return_opened" ? now : reservation.return_opened_at,
            returned_at:
              action === "processed_restocked" || action === "processed_not_restocked"
                ? now
                : reservation.returned_at,
            closed_at: action === "processed_restocked" ? now : reservation.closed_at,
            updated_at: now,
          };
        }),
      );
    }

    upsertEvent(updatedUnit, nextEventType, { action }, currentReservation);
  };

  const handleAssignLeastUsed = () => {
    const variant = assignVariantId.trim();
    const sku = assignSku.trim();

    if (!variant && !sku) {
      setAssignError("Enter a Shopify variant ID or SKU to test assignment.");
      setAssignResult("");
      return;
    }

    const matchedUnits = inventoryUnits
      .filter(
        (unit) =>
          unit.availability_status === "in_stock" &&
          unit.condition_status === "cleaned_and_ready" &&
          (!variant || unit.shopify_variant_id === variant) &&
          (!sku || unit.sku === sku),
      )
      .sort((a, b) => {
        if (a.rental_count !== b.rental_count) return a.rental_count - b.rental_count;
        return new Date(a.ready_since).getTime() - new Date(b.ready_since).getTime();
      });

    const selected = matchedUnits[0];

    if (!selected) {
      setAssignError("No assignable unit matched the current variant/SKU criteria.");
      setAssignResult("");
      return;
    }

    const now = new Date().toISOString();
    const fallbackOrderId = assignOrderId.trim() || `TEST-${Date.now().toString().slice(-6)}`;
    const fallbackOrderName = assignOrderName.trim() || `#${fallbackOrderId}`;

    const updatedUnit: InventoryUnit = {
      ...selected,
      availability_status: "out_of_stock",
      updated_at: now,
    };

    const newReservation: RentalReservation = {
      id: makeId("res"),
      shopify_order_id: fallbackOrderId,
      shopify_order_name: fallbackOrderName,
      shopify_line_item_id: makeId("line"),
      shopify_customer_id: "prototype-customer",
      shopify_product_id: selected.shopify_product_id ?? "",
      shopify_variant_id: selected.shopify_variant_id,
      sku: selected.sku,
      inventory_unit_id: selected.id,
      unit_id: selected.unit_id,
      serial_number: selected.serial_number,
      internal_status: "assigned",
      assigned_at: now,
      rental_start: now.slice(0, 10),
      rental_end: now.slice(0, 10),
      metadata: { mode: "prototype" },
      created_at: now,
      updated_at: now,
    };

    setInventoryUnits((current) => current.map((unit) => (unit.id === selected.id ? updatedUnit : unit)));
    setReservations((current) => [newReservation, ...current]);
    setSelectedUnitId(selected.id);
    setAssignError("");
    setAssignResult(`${selected.serial_number} assigned to ${fallbackOrderName}`);
    upsertEvent(updatedUnit, "order_accepted", { mode: "prototype_assignment" }, newReservation);
  };

  const handlePasscodeSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE) {
      localStorage.setItem(ADMIN_STORAGE_KEY, "true");
      setAccessGranted(true);
      setPasscodeError(false);
      return;
    }

    setPasscodeError(true);
  };

  if (!accessGranted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-[780px] flex-col justify-center px-5 py-20 sm:px-6 md:px-10">
          <div className="border border-border bg-card p-8 md:p-12">
            <MiniLabel>Internal atelier console</MiniLabel>
            <h1 className="mt-4 text-4xl text-foreground md:text-5xl">Rental Operations</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
              Prototype access is currently protected by the shared internal passcode until the backend role system is live.
            </p>

            <form onSubmit={handlePasscodeSubmit} className="mt-10 grid gap-4 md:max-w-[360px]">
              <Input
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter internal passcode"
                className="rounded-none border-border bg-background text-foreground"
              />
              <Button type="submit" className="rounded-none">
                Enter rental ops
              </Button>
              <p className={cn("text-xs uppercase tracking-[0.2em] text-destructive", !passcodeError && "opacity-0")}>
                Passcode not recognized
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background-alt">
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-6 md:px-12 lg:px-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <MiniLabel>GEA rental brain · prototype mode</MiniLabel>
              <h1 className="text-4xl text-foreground md:text-5xl">Rental Operations</h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                Internal console for inventory visibility, assignment testing, exception handling, and WMS-state rehearsal before live backend automation is connected.
              </p>
            </div>
            <div className="grid gap-3 border border-border bg-card p-4 text-sm md:min-w-[340px]">
              <MiniLabel>Current mode</MiniLabel>
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                <p className="leading-6 text-muted-foreground">
                  Using local prototype data only. Once Shopify inventory is complete, we can attach the migration and live queries without changing this layout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] space-y-12 px-5 py-8 sm:px-6 md:px-12 md:py-10 lg:px-16">
        <section className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4 xl:grid-cols-7">
          {[
            { label: "Total units", value: overview.totalUnits, icon: Boxes },
            { label: "Ready now", value: overview.readyUnits, icon: PackageCheck },
            { label: "Out of stock", value: overview.outOfStock, icon: PackageX },
            { label: "Under inspection", value: overview.underInspection, icon: ScanSearch },
            { label: "Marked damaged", value: overview.damaged, icon: ShieldAlert },
            { label: "Active reservations", value: overview.activeReservations, icon: ClipboardList },
            { label: "Damage review", value: overview.damageReviewReservations, icon: AlertTriangle },
          ].map((item) => (
            <Card key={item.label} className="rounded-none border-0 bg-card shadow-none">
              <CardContent className="flex min-h-[132px] flex-col justify-between p-4">
                <div className="flex items-center justify-between gap-3">
                  <MiniLabel>{item.label}</MiniLabel>
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="font-serif text-4xl text-foreground">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.9fr)]">
          <div className="space-y-8">
            <section className="border border-border bg-card">
              <div className="flex flex-col gap-6 border-b border-border p-5 md:p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <MiniLabel>Inventory units</MiniLabel>
                    <h2 className="mt-2 text-2xl text-foreground">Serialized unit inventory</h2>
                  </div>
                  <p className="max-w-xl text-sm text-muted-foreground">
                    Click a row to inspect the unit, latest reservation, WMS events, and manual lifecycle actions.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                  <Select value={availabilityFilter} onValueChange={(value) => setAvailabilityFilter(value as AvailabilityStatus | "all") }>
                    <SelectTrigger className="rounded-none bg-background">
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {availabilityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="rounded-none">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={conditionFilter} onValueChange={(value) => setConditionFilter(value as ConditionStatus | "all") }>
                    <SelectTrigger className="rounded-none bg-background">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {conditionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="rounded-none">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={inventorySkuFilter}
                    onChange={(event) => setInventorySkuFilter(event.target.value)}
                    placeholder="Filter by SKU"
                    className="rounded-none bg-background"
                  />
                  <Input
                    value={inventoryVariantFilter}
                    onChange={(event) => setInventoryVariantFilter(event.target.value)}
                    placeholder="Filter by variant ID"
                    className="rounded-none bg-background"
                  />
                  <Input
                    value={inventorySearch}
                    onChange={(event) => setInventorySearch(event.target.value)}
                    placeholder="Search serial or unit ID"
                    className="rounded-none bg-background"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Serial number</TableHead>
                    <TableHead>Unit ID</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Variant</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Rental count</TableHead>
                    <TableHead>Ready since</TableHead>
                    <TableHead>Last shipped</TableHead>
                    <TableHead>Last returned</TableHead>
                    <TableHead>Last inspected</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUnits.map((unit) => (
                    <TableRow
                      key={unit.id}
                      className="cursor-pointer border-border hover:bg-background-alt"
                      onClick={() => setSelectedUnitId(unit.id)}
                    >
                      <TableCell className="font-medium text-foreground">{unit.serial_number}</TableCell>
                      <TableCell>{unit.unit_id}</TableCell>
                      <TableCell>{unit.sku}</TableCell>
                      <TableCell className="max-w-[180px] truncate">{unit.shopify_variant_id}</TableCell>
                      <TableCell>
                        <StatusPill kind={getAvailabilityTone(unit.availability_status)}>
                          {toLabel(unit.availability_status)}
                        </StatusPill>
                      </TableCell>
                      <TableCell>
                        <StatusPill kind={getConditionTone(unit.condition_status)}>
                          {toLabel(unit.condition_status)}
                        </StatusPill>
                      </TableCell>
                      <TableCell>{unit.rental_count}</TableCell>
                      <TableCell>{formatDateTime(unit.ready_since)}</TableCell>
                      <TableCell>{formatDateTime(unit.last_shipped_at)}</TableCell>
                      <TableCell>{formatDateTime(unit.last_returned_at)}</TableCell>
                      <TableCell>{formatDateTime(unit.last_inspected_at)}</TableCell>
                      <TableCell className="max-w-[220px] truncate text-muted-foreground">{unit.notes || "—"}</TableCell>
                    </TableRow>
                  ))}
                  {!filteredUnits.length && (
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell colSpan={12} className="py-10 text-center text-sm text-muted-foreground">
                        No units matched the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </section>

            <section className="border border-border bg-card">
              <div className="flex flex-col gap-6 border-b border-border p-5 md:p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                  <div>
                    <MiniLabel>Reservations</MiniLabel>
                    <h2 className="mt-2 text-2xl text-foreground">Assignment ledger</h2>
                  </div>
                  <p className="max-w-xl text-sm text-muted-foreground">
                    Prototype view of which serialized unit is linked to which Shopify order line.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <Select
                    value={reservationStatusFilter}
                    onValueChange={(value) => setReservationStatusFilter(value as InternalStatus | "all")}
                  >
                    <SelectTrigger className="rounded-none bg-background">
                      <SelectValue placeholder="Internal status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {reservationStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="rounded-none">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={reservationSkuFilter}
                    onChange={(event) => setReservationSkuFilter(event.target.value)}
                    placeholder="Filter by SKU"
                    className="rounded-none bg-background"
                  />
                  <Input
                    value={reservationSerialFilter}
                    onChange={(event) => setReservationSerialFilter(event.target.value)}
                    placeholder="Filter by serial number"
                    className="rounded-none bg-background"
                  />
                  <Input
                    value={reservationOrderFilter}
                    onChange={(event) => setReservationOrderFilter(event.target.value)}
                    placeholder="Filter by Shopify order"
                    className="rounded-none bg-background"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Shopify order</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Line item ID</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Serial number</TableHead>
                    <TableHead>Internal status</TableHead>
                    <TableHead>Assigned at</TableHead>
                    <TableHead>Shipped at</TableHead>
                    <TableHead>Return opened</TableHead>
                    <TableHead>Returned at</TableHead>
                    <TableHead>Closed at</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id} className="border-border hover:bg-background-alt">
                      <TableCell className="font-medium">{reservation.shopify_order_name}</TableCell>
                      <TableCell>{reservation.shopify_order_id}</TableCell>
                      <TableCell>{reservation.shopify_line_item_id}</TableCell>
                      <TableCell>{reservation.sku}</TableCell>
                      <TableCell>{reservation.serial_number}</TableCell>
                      <TableCell>
                        <StatusPill kind={getReservationTone(reservation.internal_status)}>
                          {toLabel(reservation.internal_status)}
                        </StatusPill>
                      </TableCell>
                      <TableCell>{formatDateTime(reservation.assigned_at)}</TableCell>
                      <TableCell>{formatDateTime(reservation.shipped_at)}</TableCell>
                      <TableCell>{formatDateTime(reservation.return_opened_at)}</TableCell>
                      <TableCell>{formatDateTime(reservation.returned_at)}</TableCell>
                      <TableCell>{formatDateTime(reservation.closed_at)}</TableCell>
                    </TableRow>
                  ))}
                  {!filteredReservations.length && (
                    <TableRow className="border-border hover:bg-transparent">
                      <TableCell colSpan={11} className="py-10 text-center text-sm text-muted-foreground">
                        No reservations matched the current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </section>
          </div>

          <div className="space-y-8">
            <section className="border border-border bg-card p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <MiniLabel>Simulate incoming order</MiniLabel>
                  <h2 className="mt-2 text-2xl text-foreground">Least-used assignment</h2>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                In production, this fires automatically via Shopify webhook on order creation. Use this panel to manually simulate that trigger during testing.
              </p>
              <div className="mt-6 grid gap-3">
                <Input
                  value={assignVariantId}
                  onChange={(event) => setAssignVariantId(event.target.value)}
                  placeholder="Shopify variant ID"
                  className="rounded-none bg-background"
                />
                <Input
                  value={assignSku}
                  onChange={(event) => setAssignSku(event.target.value)}
                  placeholder="SKU"
                  className="rounded-none bg-background"
                />
                <Input
                  value={assignOrderId}
                  onChange={(event) => setAssignOrderId(event.target.value)}
                  placeholder="Optional test order ID"
                  className="rounded-none bg-background"
                />
                <Input
                  value={assignOrderName}
                  onChange={(event) => setAssignOrderName(event.target.value)}
                  placeholder="Optional test order name"
                  className="rounded-none bg-background"
                />
                <Button onClick={handleAssignLeastUsed} className="mt-2 rounded-none">
                  Simulate order + assign serial
                </Button>
                {assignResult && (
                  <div className="border border-primary/30 bg-primary/10 p-4">
                    <MiniLabel>Assigned serial</MiniLabel>
                    <p className="mt-2 text-base text-foreground">{assignResult}</p>
                  </div>
                )}
                {assignError && (
                  <div className="border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground">
                    {assignError}
                  </div>
                )}
              </div>
            </section>

            <section className="border border-border bg-card p-5 md:p-6">
              <div>
                <MiniLabel>Shopify / WMS writeback</MiniLabel>
                <h2 className="mt-2 text-2xl text-foreground">Field configuration</h2>
              </div>
              <div className="mt-6 grid gap-4">
                <div className="grid gap-2">
                  <MiniLabel>Field strategy</MiniLabel>
                  <Select
                    value={fieldConfig.field_strategy}
                    onValueChange={(value) =>
                      setFieldConfig((current) => ({
                        ...current,
                        field_strategy: value as FieldStrategy,
                        updated_at: new Date().toISOString(),
                      }))
                    }
                  >
                    <SelectTrigger className="rounded-none bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {fieldStrategies.map((strategy) => (
                        <SelectItem key={strategy} value={strategy} className="rounded-none">
                          {toLabel(strategy)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {fieldConfig.field_strategy === "line_item_property" && (
                  <div className="border border-border bg-background-alt p-4 text-xs leading-6 text-muted-foreground">
                    <span className="font-medium text-foreground">line_item_property</span> writes the assigned serial directly onto each order line. The WMS reads this field on the pick ticket. One serial per line item; comma-separated if quantity &gt; 1.
                  </div>
                )}
                <div
                  className={cn(
                    "grid gap-4",
                    fieldConfig.field_strategy !== "line_item_property" && "md:grid-cols-2",
                  )}
                >
                  {fieldConfig.field_strategy !== "line_item_property" && (
                    <div className="grid gap-2">
                      <MiniLabel>Namespace</MiniLabel>
                      <Input
                        value={fieldConfig.field_namespace}
                        onChange={(event) =>
                          setFieldConfig((current) => ({
                            ...current,
                            field_namespace: event.target.value,
                            updated_at: new Date().toISOString(),
                          }))
                        }
                        className="rounded-none bg-background"
                      />
                    </div>
                  )}
                  <div className="grid gap-2">
                    <MiniLabel>Field key</MiniLabel>
                    <Input
                      value={fieldConfig.field_key}
                      onChange={(event) =>
                        setFieldConfig((current) => ({
                          ...current,
                          field_key: event.target.value,
                          updated_at: new Date().toISOString(),
                        }))
                      }
                      className="rounded-none bg-background"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between border border-border bg-background p-4">
                  <div>
                    <MiniLabel>Active</MiniLabel>
                    <p className="mt-2 text-sm text-muted-foreground">
                      This should match the WMS-readable field before live writeback is enabled.
                    </p>
                  </div>
                  <Button
                    variant={fieldConfig.is_active ? "default" : "outline"}
                    onClick={() =>
                      setFieldConfig((current) => ({
                        ...current,
                        is_active: !current.is_active,
                        updated_at: new Date().toISOString(),
                      }))
                    }
                    className="rounded-none"
                  >
                    {fieldConfig.is_active ? "Active" : "Inactive"}
                  </Button>
                </div>
                <div className="grid gap-2">
                  <MiniLabel>Notes</MiniLabel>
                  <Textarea
                    value={fieldConfig.notes}
                    onChange={(event) =>
                      setFieldConfig((current) => ({
                        ...current,
                        notes: event.target.value,
                        updated_at: new Date().toISOString(),
                      }))
                    }
                    className="min-h-[100px] rounded-none bg-background"
                  />
                </div>
              </div>
            </section>

            <section className="border border-border bg-card p-5 md:p-6">
              <div>
                <MiniLabel>Recent WMS events</MiniLabel>
                <h2 className="mt-2 text-2xl text-foreground">Event log</h2>
              </div>
              <div className="mt-6 space-y-3">
                {recentEvents.map((event) => (
                  <div key={event.id} className="border border-border bg-background p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill kind={event.event_type.includes("not_restocked") || event.event_type === "missing_lost" ? "urgent" : "neutral"}>
                          {toLabel(event.event_type)}
                        </StatusPill>
                        <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{event.source}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDateTime(event.created_at)}</span>
                    </div>
                    <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                      <p>
                        <span className="text-foreground">{event.serial_number}</span> · {event.sku}
                      </p>
                      <p>Order {event.shopify_order_id || "—"}</p>
                      <p className="truncate">{JSON.stringify(event.payload)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>

      <Sheet open={!!selectedUnit} onOpenChange={(open) => !open && setSelectedUnitId(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto rounded-none border-border bg-background p-0 sm:max-w-[720px]">
          {selectedUnit && (
            <>
              <SheetHeader className="border-b border-border bg-card px-6 py-6 text-left">
                <MiniLabel>Unit detail</MiniLabel>
                <SheetTitle className="mt-2 font-serif text-3xl font-medium text-foreground">
                  {selectedUnit.serial_number}
                </SheetTitle>
                <SheetDescription className="text-sm leading-7 text-muted-foreground">
                  {selectedUnit.unit_id} · {selectedUnit.sku} · {selectedUnit.shopify_variant_id}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-8 px-6 py-6">
                <section className="grid gap-3 md:grid-cols-3">
                  <div className="border border-border bg-card p-4">
                    <MiniLabel>Availability</MiniLabel>
                    <div className="mt-3">
                      <StatusPill kind={getAvailabilityTone(selectedUnit.availability_status)}>
                        {toLabel(selectedUnit.availability_status)}
                      </StatusPill>
                    </div>
                  </div>
                  <div className="border border-border bg-card p-4">
                    <MiniLabel>Condition</MiniLabel>
                    <div className="mt-3">
                      <StatusPill kind={getConditionTone(selectedUnit.condition_status)}>
                        {toLabel(selectedUnit.condition_status)}
                      </StatusPill>
                    </div>
                  </div>
                  <div className="border border-border bg-card p-4">
                    <MiniLabel>Current blockage</MiniLabel>
                    <p className="mt-3 text-sm text-foreground">{blockageReason}</p>
                  </div>
                </section>

                <section className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                  <div className="space-y-6">
                    <div className="border border-border bg-card p-5">
                      <MiniLabel>Unit record</MiniLabel>
                      <div className="mt-4 space-y-0">
                        <DataCell label="Shopify product ID" value={selectedUnit.shopify_product_id || "—"} />
                        <DataCell label="Location" value={selectedUnit.location || "—"} />
                        <DataCell label="Rental count" value={String(selectedUnit.rental_count)} />
                        <DataCell label="Total days out" value={String(selectedUnit.total_days_out)} />
                        <DataCell label="Ready since" value={formatDateTime(selectedUnit.ready_since)} />
                        <DataCell label="Last shipped" value={formatDateTime(selectedUnit.last_shipped_at)} />
                        <DataCell label="Last returned" value={formatDateTime(selectedUnit.last_returned_at)} />
                        <DataCell label="Last inspected" value={formatDateTime(selectedUnit.last_inspected_at)} />
                      </div>
                    </div>

                    <div className="border border-border bg-card p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <MiniLabel>Manual MVP actions</MiniLabel>
                          <p className="mt-2 text-sm text-muted-foreground">Use these while webhook automation is not yet connected.</p>
                        </div>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-5 grid gap-3">
                        <Button variant="outline" className="rounded-none" onClick={() => handleLifecycleAction("return_opened")}>
                          Mark return opened
                        </Button>
                        <Button className="rounded-none" onClick={() => handleLifecycleAction("processed_restocked")}>
                          Mark processed + restocked
                        </Button>
                        <Button variant="outline" className="rounded-none" onClick={() => handleLifecycleAction("processed_not_restocked")}>
                          Mark processed + not restocked
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="border border-border bg-card p-5">
                      <MiniLabel>Latest reservation</MiniLabel>
                      {unitReservation ? (
                        <div className="mt-4 space-y-0">
                          <DataCell label="Shopify order" value={`${unitReservation.shopify_order_name} · ${unitReservation.shopify_order_id}`} />
                          <DataCell label="Line item ID" value={unitReservation.shopify_line_item_id} />
                          <DataCell label="Internal status" value={toLabel(unitReservation.internal_status)} />
                          <DataCell label="Assigned at" value={formatDateTime(unitReservation.assigned_at)} />
                          <DataCell label="Shipped at" value={formatDateTime(unitReservation.shipped_at)} />
                          <DataCell label="Return opened" value={formatDateTime(unitReservation.return_opened_at)} />
                          <DataCell label="Returned at" value={formatDateTime(unitReservation.returned_at)} />
                          <DataCell label="Closed at" value={formatDateTime(unitReservation.closed_at)} />
                          <DataCell label="Rental window" value={`${formatDate(unitReservation.rental_start)} → ${formatDate(unitReservation.rental_end)}`} />
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-muted-foreground">No reservation linked yet for this unit in prototype data.</p>
                      )}
                    </div>

                    <div className="border border-border bg-card p-5">
                      <MiniLabel>Notes</MiniLabel>
                      <Textarea
                        value={selectedUnit.notes}
                        onChange={(event) => updateSelectedUnitNotes(event.target.value)}
                        className="mt-4 min-h-[120px] rounded-none bg-background"
                      />
                    </div>
                  </div>
                </section>

                <section className="border border-border bg-card p-5">
                  <MiniLabel>WMS event history</MiniLabel>
                  <div className="mt-4 space-y-3">
                    {unitEvents.map((event) => (
                      <div key={event.id} className="border border-border bg-background p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <StatusPill kind={event.event_type.includes("not_restocked") ? "urgent" : "neutral"}>
                            {toLabel(event.event_type)}
                          </StatusPill>
                          <span className="text-xs text-muted-foreground">{formatDateTime(event.created_at)}</span>
                        </div>
                        <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                          <p>Source: {event.source}</p>
                          <p>Order: {event.shopify_order_id || "—"}</p>
                          <p>Condition snapshot: {event.condition_status || "—"}</p>
                          <p className="break-words">Payload: {JSON.stringify(event.payload)}</p>
                        </div>
                      </div>
                    ))}
                    {!unitEvents.length && (
                      <p className="text-sm text-muted-foreground">No WMS events logged for this unit yet.</p>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminRentalOps;
