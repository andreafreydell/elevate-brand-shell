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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_theolia_serial: {
        Args: {
          _line_item_id: string
          _order_id: string
          _order_name: string
          _variant_id: string
        }
        Returns: string
      }
      mark_unit_damaged: {
        Args: { _notes: string; _serial: string }
        Returns: boolean
      }
      mark_unit_ready: {
        Args: { _serial: string; _source?: string }
        Returns: boolean
      }
      mark_unit_reserved: {
        Args: { _order_id: string; _order_name: string; _serial: string }
        Returns: boolean
      }
      mark_unit_returned: {
        Args: { _order_id: string; _order_name: string; _serial: string }
        Returns: boolean
      }
      mark_unit_shipped: {
        Args: { _order_id: string; _order_name: string; _serial: string }
        Returns: boolean
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
