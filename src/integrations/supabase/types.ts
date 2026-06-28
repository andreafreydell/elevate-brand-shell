export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      charges: {
        Row: {
          amount: number
          basis: Json
          charge_type: string
          created_at: string
          created_by: string | null
          currency: string
          error: string | null
          id: string
          idempotency_key: string
          membership_id: string | null
          quantity: number
          rental_cycle_id: string | null
          rental_reservation_id: string | null
          shopify_charge_ref: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          basis?: Json
          charge_type: string
          created_at?: string
          created_by?: string | null
          currency?: string
          error?: string | null
          id?: string
          idempotency_key: string
          membership_id?: string | null
          quantity?: number
          rental_cycle_id?: string | null
          rental_reservation_id?: string | null
          shopify_charge_ref?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          basis?: Json
          charge_type?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          error?: string | null
          id?: string
          idempotency_key?: string
          membership_id?: string | null
          quantity?: number
          rental_cycle_id?: string | null
          rental_reservation_id?: string | null
          shopify_charge_ref?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "charges_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charges_rental_cycle_id_fkey"
            columns: ["rental_cycle_id"]
            isOneToOne: false
            referencedRelation: "rental_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "charges_rental_reservation_id_fkey"
            columns: ["rental_reservation_id"]
            isOneToOne: false
            referencedRelation: "rental_reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      founding_members: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      inventory_units: {
        Row: {
          acquired_at: string
          availability_status: string
          condition_status: string
          created_at: string
          id: string
          last_inspected_at: string | null
          last_returned_at: string | null
          last_shipped_at: string | null
          location: string | null
          metadata: Json
          notes: string | null
          ready_since: string | null
          rental_count: number
          retail_price_cache: number | null
          retire_flagged: boolean
          retire_flagged_at: string | null
          retired: boolean
          retired_at: string | null
          serial_number: string
          shopify_product_id: string | null
          shopify_variant_id: string
          sku: string
          total_days_out: number
          unit_id: string
          updated_at: string
        }
        Insert: {
          acquired_at?: string
          availability_status?: string
          condition_status?: string
          created_at?: string
          id?: string
          last_inspected_at?: string | null
          last_returned_at?: string | null
          last_shipped_at?: string | null
          location?: string | null
          metadata?: Json
          notes?: string | null
          ready_since?: string | null
          rental_count?: number
          retail_price_cache?: number | null
          retire_flagged?: boolean
          retire_flagged_at?: string | null
          retired?: boolean
          retired_at?: string | null
          serial_number: string
          shopify_product_id?: string | null
          shopify_variant_id: string
          sku: string
          total_days_out?: number
          unit_id: string
          updated_at?: string
        }
        Update: {
          acquired_at?: string
          availability_status?: string
          condition_status?: string
          created_at?: string
          id?: string
          last_inspected_at?: string | null
          last_returned_at?: string | null
          last_shipped_at?: string | null
          location?: string | null
          metadata?: Json
          notes?: string | null
          ready_since?: string | null
          rental_count?: number
          retail_price_cache?: number | null
          retire_flagged?: boolean
          retire_flagged_at?: string | null
          retired?: boolean
          retired_at?: string | null
          serial_number?: string
          shopify_product_id?: string | null
          shopify_variant_id?: string
          sku?: string
          total_days_out?: number
          unit_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      member_returns: {
        Row: {
          created_at: string
          expected_serials: string[]
          id: string
          kept_serials: string[]
          membership_id: string | null
          metadata: Json
          reconciled_at: string | null
          rental_cycle_id: string | null
          returned_serials: string[]
          shopify_order_id: string | null
          shopify_return_id: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expected_serials?: string[]
          id?: string
          kept_serials?: string[]
          membership_id?: string | null
          metadata?: Json
          reconciled_at?: string | null
          rental_cycle_id?: string | null
          returned_serials?: string[]
          shopify_order_id?: string | null
          shopify_return_id?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expected_serials?: string[]
          id?: string
          kept_serials?: string[]
          membership_id?: string | null
          metadata?: Json
          reconciled_at?: string | null
          rental_cycle_id?: string | null
          returned_serials?: string[]
          shopify_order_id?: string | null
          shopify_return_id?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_returns_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_returns_rental_cycle_id_fkey"
            columns: ["rental_cycle_id"]
            isOneToOne: false
            referencedRelation: "rental_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          auth_user_id: string | null
          cancelled_at: string | null
          created_at: string
          free_items_per_cycle: number
          id: string
          keep_allowance_per_cycle: number
          metadata: Json
          shopify_customer_id: string
          shopify_subscription_contract_id: string | null
          started_at: string
          status: string
          tier: string
          tier_source: Json
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          cancelled_at?: string | null
          created_at?: string
          free_items_per_cycle: number
          id?: string
          keep_allowance_per_cycle?: number
          metadata?: Json
          shopify_customer_id: string
          shopify_subscription_contract_id?: string | null
          started_at?: string
          status?: string
          tier: string
          tier_source?: Json
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          cancelled_at?: string | null
          created_at?: string
          free_items_per_cycle?: number
          id?: string
          keep_allowance_per_cycle?: number
          metadata?: Json
          shopify_customer_id?: string
          shopify_subscription_contract_id?: string | null
          started_at?: string
          status?: string
          tier?: string
          tier_source?: Json
          updated_at?: string
        }
        Relationships: []
      }
      rental_cycles: {
        Row: {
          checkout_count: number
          created_at: string
          cycle_end: string
          cycle_number: number
          cycle_start: string
          cycle_tag_applied: boolean
          extra_items: number
          extra_keeps: number
          free_items_allowance: number
          free_used: number
          id: string
          keep_allowance: number
          keep_count: number
          membership_id: string
          reconciled_at: string | null
          status: string
          tag_applied_at: string | null
          tag_removed_at: string | null
          updated_at: string
        }
        Insert: {
          checkout_count?: number
          created_at?: string
          cycle_end: string
          cycle_number: number
          cycle_start: string
          cycle_tag_applied?: boolean
          extra_items?: number
          extra_keeps?: number
          free_items_allowance: number
          free_used?: number
          id?: string
          keep_allowance: number
          keep_count?: number
          membership_id: string
          reconciled_at?: string | null
          status?: string
          tag_applied_at?: string | null
          tag_removed_at?: string | null
          updated_at?: string
        }
        Update: {
          checkout_count?: number
          created_at?: string
          cycle_end?: string
          cycle_number?: number
          cycle_start?: string
          cycle_tag_applied?: boolean
          extra_items?: number
          extra_keeps?: number
          free_items_allowance?: number
          free_used?: number
          id?: string
          keep_allowance?: number
          keep_count?: number
          membership_id?: string
          reconciled_at?: string | null
          status?: string
          tag_applied_at?: string | null
          tag_removed_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_cycles_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_reservations: {
        Row: {
          assigned_at: string
          closed_at: string | null
          created_at: string
          id: string
          internal_status: string
          inventory_unit_id: string
          is_free_item: boolean | null
          item_price_cache: number | null
          keep_requested: boolean
          kept_at: string | null
          membership_id: string | null
          metadata: Json
          released_to_wms_at: string | null
          rental_cycle_id: string | null
          rental_end: string | null
          rental_start: string | null
          return_opened_at: string | null
          returned_at: string | null
          serial_number: string
          shipped_at: string | null
          shopify_customer_id: string | null
          shopify_line_item_id: string | null
          shopify_order_id: string
          shopify_order_name: string | null
          shopify_product_id: string | null
          shopify_variant_id: string
          sku: string
          unit_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          closed_at?: string | null
          created_at?: string
          id?: string
          internal_status?: string
          inventory_unit_id: string
          is_free_item?: boolean | null
          item_price_cache?: number | null
          keep_requested?: boolean
          kept_at?: string | null
          membership_id?: string | null
          metadata?: Json
          released_to_wms_at?: string | null
          rental_cycle_id?: string | null
          rental_end?: string | null
          rental_start?: string | null
          return_opened_at?: string | null
          returned_at?: string | null
          serial_number: string
          shipped_at?: string | null
          shopify_customer_id?: string | null
          shopify_line_item_id?: string | null
          shopify_order_id: string
          shopify_order_name?: string | null
          shopify_product_id?: string | null
          shopify_variant_id: string
          sku: string
          unit_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          closed_at?: string | null
          created_at?: string
          id?: string
          internal_status?: string
          inventory_unit_id?: string
          is_free_item?: boolean | null
          item_price_cache?: number | null
          keep_requested?: boolean
          kept_at?: string | null
          membership_id?: string | null
          metadata?: Json
          released_to_wms_at?: string | null
          rental_cycle_id?: string | null
          rental_end?: string | null
          rental_start?: string | null
          return_opened_at?: string | null
          returned_at?: string | null
          serial_number?: string
          shipped_at?: string | null
          shopify_customer_id?: string | null
          shopify_line_item_id?: string | null
          shopify_order_id?: string
          shopify_order_name?: string | null
          shopify_product_id?: string | null
          shopify_variant_id?: string
          sku?: string
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rental_reservations_inventory_unit_id_fkey"
            columns: ["inventory_unit_id"]
            isOneToOne: false
            referencedRelation: "inventory_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_reservations_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_reservations_rental_cycle_id_fkey"
            columns: ["rental_cycle_id"]
            isOneToOne: false
            referencedRelation: "rental_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      shopify_wms_field_config: {
        Row: {
          created_at: string
          field_key: string
          field_namespace: string
          field_strategy: string
          id: number
          is_active: boolean
          notes: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          field_key?: string
          field_namespace?: string
          field_strategy?: string
          id?: number
          is_active?: boolean
          notes?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          field_key?: string
          field_namespace?: string
          field_strategy?: string
          id?: number
          is_active?: boolean
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          created_at: string
          email: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      theolia_test_serials: {
        Row: {
          assigned_at: string | null
          assigned_line_item_id: string | null
          assigned_order_id: string | null
          assigned_order_name: string | null
          availability_status: string
          condition_status: string
          created_at: string
          last_returned_at: string | null
          last_shipped_at: string | null
          location: string
          notes: string | null
          ready_since: string | null
          rental_count: number
          serial: string
          sku: string
          updated_at: string
          variant_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_line_item_id?: string | null
          assigned_order_id?: string | null
          assigned_order_name?: string | null
          availability_status?: string
          condition_status?: string
          created_at?: string
          last_returned_at?: string | null
          last_shipped_at?: string | null
          location?: string
          notes?: string | null
          ready_since?: string | null
          rental_count?: number
          serial: string
          sku: string
          updated_at?: string
          variant_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_line_item_id?: string | null
          assigned_order_id?: string | null
          assigned_order_name?: string | null
          availability_status?: string
          condition_status?: string
          created_at?: string
          last_returned_at?: string | null
          last_shipped_at?: string | null
          location?: string
          notes?: string | null
          ready_since?: string | null
          rental_count?: number
          serial?: string
          sku?: string
          updated_at?: string
          variant_id?: string
        }
        Relationships: []
      }
      unit_lifecycle_events: {
        Row: {
          availability_snapshot: string | null
          condition_snapshot: string | null
          created_at: string
          event_type: string
          id: string
          notes: string | null
          serial: string
          shopify_order_id: string | null
          shopify_order_name: string | null
          source: string
        }
        Insert: {
          availability_snapshot?: string | null
          condition_snapshot?: string | null
          created_at?: string
          event_type: string
          id?: string
          notes?: string | null
          serial: string
          shopify_order_id?: string | null
          shopify_order_name?: string | null
          source?: string
        }
        Update: {
          availability_snapshot?: string | null
          condition_snapshot?: string | null
          created_at?: string
          event_type?: string
          id?: string
          notes?: string | null
          serial?: string
          shopify_order_id?: string | null
          shopify_order_name?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "unit_lifecycle_events_serial_fkey"
            columns: ["serial"]
            isOneToOne: false
            referencedRelation: "theolia_test_serials"
            referencedColumns: ["serial"]
          },
        ]
      }
      wms_events: {
        Row: {
          condition_status: string | null
          created_at: string
          event_type: string
          id: string
          inventory_unit_id: string | null
          payload: Json
          processed_at: string | null
          serial_number: string | null
          shopify_line_item_id: string | null
          shopify_order_id: string | null
          sku: string | null
          source: string
          tracking_number: string | null
          unit_id: string | null
        }
        Insert: {
          condition_status?: string | null
          created_at?: string
          event_type: string
          id?: string
          inventory_unit_id?: string | null
          payload?: Json
          processed_at?: string | null
          serial_number?: string | null
          shopify_line_item_id?: string | null
          shopify_order_id?: string | null
          sku?: string | null
          source?: string
          tracking_number?: string | null
          unit_id?: string | null
        }
        Update: {
          condition_status?: string | null
          created_at?: string
          event_type?: string
          id?: string
          inventory_unit_id?: string | null
          payload?: Json
          processed_at?: string | null
          serial_number?: string | null
          shopify_line_item_id?: string | null
          shopify_order_id?: string | null
          sku?: string | null
          source?: string
          tracking_number?: string | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wms_events_inventory_unit_id_fkey"
            columns: ["inventory_unit_id"]
            isOneToOne: false
            referencedRelation: "inventory_units"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_least_used_inventory_unit: {
        Args: { p_shopify_variant_id: string; p_sku?: string }
        Returns: {
          acquired_at: string
          availability_status: string
          condition_status: string
          created_at: string
          id: string
          last_inspected_at: string | null
          last_returned_at: string | null
          last_shipped_at: string | null
          location: string | null
          metadata: Json
          notes: string | null
          ready_since: string | null
          rental_count: number
          retail_price_cache: number | null
          retire_flagged: boolean
          retire_flagged_at: string | null
          retired: boolean
          retired_at: string | null
          serial_number: string
          shopify_product_id: string | null
          shopify_variant_id: string
          sku: string
          total_days_out: number
          unit_id: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "inventory_units"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      assign_most_used_inventory_unit: {
        Args: { p_shopify_variant_id: string; p_sku?: string }
        Returns: {
          acquired_at: string
          availability_status: string
          condition_status: string
          created_at: string
          id: string
          last_inspected_at: string | null
          last_returned_at: string | null
          last_shipped_at: string | null
          location: string | null
          metadata: Json
          notes: string | null
          ready_since: string | null
          rental_count: number
          retail_price_cache: number | null
          retire_flagged: boolean
          retire_flagged_at: string | null
          retired: boolean
          retired_at: string | null
          serial_number: string
          shopify_product_id: string | null
          shopify_variant_id: string
          sku: string
          total_days_out: number
          unit_id: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "inventory_units"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      claim_theolia_serial: {
        Args: {
          _line_item_id: string
          _order_id: string
          _order_name: string
          _variant_id: string
        }
        Returns: string
      }
      compute_keep_fees: {
        Args: { p_cycle_id: string }
        Returns: {
          fee_amount: number
          item_price: number
          rental_reservation_id: string
          serial_number: string
        }[]
      }
      count_checkout_for_reservation: {
        Args: { p_reservation_id: string }
        Returns: {
          assigned_at: string
          closed_at: string | null
          created_at: string
          id: string
          internal_status: string
          inventory_unit_id: string
          is_free_item: boolean | null
          item_price_cache: number | null
          keep_requested: boolean
          kept_at: string | null
          membership_id: string | null
          metadata: Json
          released_to_wms_at: string | null
          rental_cycle_id: string | null
          rental_end: string | null
          rental_start: string | null
          return_opened_at: string | null
          returned_at: string | null
          serial_number: string
          shipped_at: string | null
          shopify_customer_id: string | null
          shopify_line_item_id: string | null
          shopify_order_id: string
          shopify_order_name: string | null
          shopify_product_id: string | null
          shopify_variant_id: string
          sku: string
          unit_id: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "rental_reservations"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_charge: {
        Args: {
          p_amount: number
          p_basis: Json
          p_charge_type: string
          p_idempotency_key: string
          p_membership_id: string
          p_rental_cycle_id: string
          p_rental_reservation_id: string
        }
        Returns: {
          amount: number
          basis: Json
          charge_type: string
          created_at: string
          created_by: string | null
          currency: string
          error: string | null
          id: string
          idempotency_key: string
          membership_id: string | null
          quantity: number
          rental_cycle_id: string | null
          rental_reservation_id: string | null
          shopify_charge_ref: string | null
          status: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "charges"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_rental_reservation_for_order_line: {
        Args: {
          p_metadata?: Json
          p_rental_end?: string
          p_rental_start?: string
          p_shopify_customer_id?: string
          p_shopify_line_item_id?: string
          p_shopify_order_id: string
          p_shopify_order_name?: string
          p_shopify_product_id?: string
          p_shopify_variant_id: string
          p_sku: string
        }
        Returns: {
          assigned_at: string
          closed_at: string | null
          created_at: string
          id: string
          internal_status: string
          inventory_unit_id: string
          is_free_item: boolean | null
          item_price_cache: number | null
          keep_requested: boolean
          kept_at: string | null
          membership_id: string | null
          metadata: Json
          released_to_wms_at: string | null
          rental_cycle_id: string | null
          rental_end: string | null
          rental_start: string | null
          return_opened_at: string | null
          returned_at: string | null
          serial_number: string
          shipped_at: string | null
          shopify_customer_id: string | null
          shopify_line_item_id: string | null
          shopify_order_id: string
          shopify_order_name: string | null
          shopify_product_id: string | null
          shopify_variant_id: string
          sku: string
          unit_id: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "rental_reservations"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      current_cycle_number: {
        Args: { p_at?: string; p_started_at: string }
        Returns: number
      }
      get_or_create_current_cycle: {
        Args: { p_membership_id: string }
        Returns: {
          checkout_count: number
          created_at: string
          cycle_end: string
          cycle_number: number
          cycle_start: string
          cycle_tag_applied: boolean
          extra_items: number
          extra_keeps: number
          free_items_allowance: number
          free_used: number
          id: string
          keep_allowance: number
          keep_count: number
          membership_id: string
          reconciled_at: string | null
          status: string
          tag_applied_at: string | null
          tag_removed_at: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "rental_cycles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      is_staff: { Args: never; Returns: boolean }
      mark_unit_damaged: {
        Args: { _notes: string; _serial: string }
        Returns: boolean
      }
      mark_unit_kept: {
        Args: {
          p_serial_number: string
          p_shopify_line_item_id?: string
          p_shopify_order_id?: string
        }
        Returns: {
          acquired_at: string
          availability_status: string
          condition_status: string
          created_at: string
          id: string
          last_inspected_at: string | null
          last_returned_at: string | null
          last_shipped_at: string | null
          location: string | null
          metadata: Json
          notes: string | null
          ready_since: string | null
          rental_count: number
          retail_price_cache: number | null
          retire_flagged: boolean
          retire_flagged_at: string | null
          retired: boolean
          retired_at: string | null
          serial_number: string
          shopify_product_id: string | null
          shopify_variant_id: string
          sku: string
          total_days_out: number
          unit_id: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "inventory_units"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mark_unit_ready: {
        Args: { _serial: string; _source?: string }
        Returns: boolean
      }
      mark_unit_reserved: {
        Args: { _order_id: string; _order_name: string; _serial: string }
        Returns: boolean
      }
      mark_unit_return_open: {
        Args: {
          p_serial_number: string
          p_shopify_line_item_id?: string
          p_shopify_order_id?: string
        }
        Returns: {
          acquired_at: string
          availability_status: string
          condition_status: string
          created_at: string
          id: string
          last_inspected_at: string | null
          last_returned_at: string | null
          last_shipped_at: string | null
          location: string | null
          metadata: Json
          notes: string | null
          ready_since: string | null
          rental_count: number
          retail_price_cache: number | null
          retire_flagged: boolean
          retire_flagged_at: string | null
          retired: boolean
          retired_at: string | null
          serial_number: string
          shopify_product_id: string | null
          shopify_variant_id: string
          sku: string
          total_days_out: number
          unit_id: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "inventory_units"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mark_unit_return_processed: {
        Args: {
          p_restocked: boolean
          p_serial_number: string
          p_shopify_line_item_id?: string
          p_shopify_order_id?: string
        }
        Returns: {
          acquired_at: string
          availability_status: string
          condition_status: string
          created_at: string
          id: string
          last_inspected_at: string | null
          last_returned_at: string | null
          last_shipped_at: string | null
          location: string | null
          metadata: Json
          notes: string | null
          ready_since: string | null
          rental_count: number
          retail_price_cache: number | null
          retire_flagged: boolean
          retire_flagged_at: string | null
          retired: boolean
          retired_at: string | null
          serial_number: string
          shopify_product_id: string | null
          shopify_variant_id: string
          sku: string
          total_days_out: number
          unit_id: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "inventory_units"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mark_unit_returned: {
        Args: { _order_id: string; _order_name: string; _serial: string }
        Returns: boolean
      }
      mark_unit_shipped:
        | {
            Args: { _order_id: string; _order_name: string; _serial: string }
            Returns: boolean
          }
        | {
            Args: {
              p_serial_number: string
              p_shopify_line_item_id?: string
              p_shopify_order_id?: string
              p_tracking_number?: string
            }
            Returns: {
              acquired_at: string
              availability_status: string
              condition_status: string
              created_at: string
              id: string
              last_inspected_at: string | null
              last_returned_at: string | null
              last_shipped_at: string | null
              location: string | null
              metadata: Json
              notes: string | null
              ready_since: string | null
              rental_count: number
              retail_price_cache: number | null
              retire_flagged: boolean
              retire_flagged_at: string | null
              retired: boolean
              retired_at: string | null
              serial_number: string
              shopify_product_id: string | null
              shopify_variant_id: string
              sku: string
              total_days_out: number
              unit_id: string
              updated_at: string
            }
            SetofOptions: {
              from: "*"
              to: "inventory_units"
              isOneToOne: true
              isSetofReturn: false
            }
          }
      reconcile_member_return: {
        Args: { p_force?: boolean; p_return_id: string }
        Returns: {
          created_at: string
          expected_serials: string[]
          id: string
          kept_serials: string[]
          membership_id: string | null
          metadata: Json
          reconciled_at: string | null
          rental_cycle_id: string | null
          returned_serials: string[]
          shopify_order_id: string | null
          shopify_return_id: string | null
          source: string
          status: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "member_returns"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      tier_allowances: {
        Args: { p_tier: string }
        Returns: {
          free_items: number
          keep_allowance: number
        }[]
      }
      upsert_membership_from_contract: {
        Args: {
          p_shopify_customer_id: string
          p_shopify_subscription_contract_id: string
          p_started_at?: string
          p_status?: string
          p_tier: string
          p_tier_source?: Json
        }
        Returns: {
          auth_user_id: string | null
          cancelled_at: string | null
          created_at: string
          free_items_per_cycle: number
          id: string
          keep_allowance_per_cycle: number
          metadata: Json
          shopify_customer_id: string
          shopify_subscription_contract_id: string | null
          started_at: string
          status: string
          tier: string
          tier_source: Json
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "memberships"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
