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
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          manufacturer: string | null
          name: string
          slug: string
          tagline: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          manufacturer?: string | null
          name: string
          slug: string
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          manufacturer?: string | null
          name?: string
          slug?: string
          tagline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          id: string
          quantity: number
          updated_at: string
          variant_id: string
          warehouse: string | null
        }
        Insert: {
          id?: string
          quantity?: number
          updated_at?: string
          variant_id: string
          warehouse?: string | null
        }
        Update: {
          id?: string
          quantity?: number
          updated_at?: string
          variant_id?: string
          warehouse?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: true
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          is_default: boolean
          pack_size: number
          price: number
          product_id: string
          sku: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean
          pack_size: number
          price: number
          product_id: string
          sku?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean
          pack_size?: number
          price?: number
          product_id?: string
          sku?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badge_keys: string[]
          brand_id: string
          category_key: string
          created_at: string
          description_key: string | null
          flavor_key: string
          format_key: string
          id: string
          image_url: string | null
          is_active: boolean
          manufacturer: string | null
          name: string
          nicotine_mg: number
          nyehandel_id: string | null
          portions_per_can: number
          ratings: number
          slug: string
          strength_key: string
          updated_at: string
        }
        Insert: {
          badge_keys?: string[]
          brand_id: string
          category_key?: string
          created_at?: string
          description_key?: string | null
          flavor_key: string
          format_key: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          manufacturer?: string | null
          name: string
          nicotine_mg?: number
          nyehandel_id?: string | null
          portions_per_can?: number
          ratings?: number
          slug: string
          strength_key: string
          updated_at?: string
        }
        Update: {
          badge_keys?: string[]
          brand_id?: string
          category_key?: string
          created_at?: string
          description_key?: string | null
          flavor_key?: string
          format_key?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          manufacturer?: string | null
          name?: string
          nicotine_mg?: number
          nyehandel_id?: string | null
          portions_per_can?: number
          ratings?: number
          slug?: string
          strength_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      sku_mappings: {
        Row: {
          created_at: string
          id: string
          last_verified: string
          nyehandel_sku: string
          product_name: string
          shopify_sku: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_verified?: string
          nyehandel_sku: string
          product_name: string
          shopify_sku?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_verified?: string
          nyehandel_sku?: string
          product_name?: string
          shopify_sku?: string | null
          status?: string
        }
        Relationships: []
      }
      sync_runs: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_ms: number
          error_details: Json | null
          errors: number
          id: string
          items_processed: number
          started_at: string
          status: string
          type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number
          error_details?: Json | null
          errors?: number
          id?: string
          items_processed?: number
          started_at?: string
          status?: string
          type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number
          error_details?: Json | null
          errors?: number
          id?: string
          items_processed?: number
          started_at?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_inbox: {
        Row: {
          attempts: number
          created_at: string
          id: string
          payload: Json
          processed_at: string | null
          provider: string
          received_at: string
          status: string
          topic: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          provider: string
          received_at?: string
          status?: string
          topic: string
        }
        Update: {
          attempts?: number
          created_at?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: string
          received_at?: string
          status?: string
          topic?: string
        }
        Relationships: []
      }
      orders: {
        Row: { id: string; customer_email: string; total_price: number; currency: string; checkout_status: string; line_items_snapshot: Json | null; customer_metadata: Json | null; nyehandel_order_id: string | null; nyehandel_status: string | null; nyehandel_sync_status: string | null; tracking_id: string | null; tracking_url: string | null; shipping_method: string | null; payment_method: string | null; user_id: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; customer_email: string; total_price: number; currency?: string; checkout_status?: string; line_items_snapshot?: Json | null; customer_metadata?: Json | null; nyehandel_order_id?: string | null; nyehandel_status?: string | null; nyehandel_sync_status?: string | null; tracking_id?: string | null; tracking_url?: string | null; shipping_method?: string | null; payment_method?: string | null; user_id?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; customer_email?: string; total_price?: number; currency?: string; checkout_status?: string; line_items_snapshot?: Json | null; customer_metadata?: Json | null; nyehandel_order_id?: string | null; nyehandel_status?: string | null; nyehandel_sync_status?: string | null; tracking_id?: string | null; tracking_url?: string | null; shipping_method?: string | null; payment_method?: string | null; user_id?: string | null; created_at?: string; updated_at?: string }
        Relationships: []
      }
      ops_alerts: {
        Row: { id: string; alert_date: string; rule_key: string; severity: string; source_order_id: string | null; title: string; message: string; context: Json | null; status: string; resolved_at: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; alert_date?: string; rule_key: string; severity?: string; source_order_id?: string | null; title: string; message: string; context?: Json | null; status?: string; resolved_at?: string | null; created_at?: string; updated_at?: string }
        Update: { id?: string; alert_date?: string; rule_key?: string; severity?: string; source_order_id?: string | null; title?: string; message?: string; context?: Json | null; status?: string; resolved_at?: string | null; created_at?: string; updated_at?: string }
        Relationships: []
      }
      points_balances: {
        Row: { user_id: string; balance: number; lifetime_earned: number; updated_at: string }
        Insert: { user_id: string; balance?: number; lifetime_earned?: number; updated_at?: string }
        Update: { user_id?: string; balance?: number; lifetime_earned?: number; updated_at?: string }
        Relationships: []
      }
      points_transactions: {
        Row: { id: string; user_id: string; order_id: string | null; points: number; reason: string; created_at: string }
        Insert: { id?: string; user_id: string; order_id?: string | null; points: number; reason: string; created_at?: string }
        Update: { id?: string; user_id?: string; order_id?: string | null; points?: number; reason?: string; created_at?: string }
        Relationships: []
      }
      waitlist_emails: {
        Row: { id: string; email: string; source: string | null; created_at: string }
        Insert: { id?: string; email: string; source?: string | null; created_at?: string }
        Update: { id?: string; email?: string; source?: string | null; created_at?: string }
        Relationships: []
      }
      sync_config: {
        Row: { id: string; key: string; value: string; created_at: string }
        Insert: { id?: string; key: string; value: string; created_at?: string }
        Update: { id?: string; key?: string; value?: string; created_at?: string }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
