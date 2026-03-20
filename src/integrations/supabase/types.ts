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
      orders: {
        Row: {
          checkout_status: 'pending' | 'confirmed' | 'shipped' | 'cancelled'
          created_at: string
          currency: string
          customer_email: string | null
          customer_metadata: Json
          delivery_callback_received_at: string | null
          id: string
          idempotency_key: string | null
          last_sync_error: string | null
          line_items_snapshot: Json
          nyehandel_order_id: string | null
          nyehandel_order_status: string | null
          nyehandel_prefix: string | null
          nyehandel_sync_status: 'pending' | 'synced' | 'failed'
          paid_at: string | null
          shipping_address: Json
          total_price: number
          tracking_id: string | null
          tracking_url: string | null
          updated_at: string
        }
        Insert: {
          checkout_status?: 'pending' | 'confirmed' | 'shipped' | 'cancelled'
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_metadata?: Json
          delivery_callback_received_at?: string | null
          id?: string
          idempotency_key?: string | null
          last_sync_error?: string | null
          line_items_snapshot?: Json
          nyehandel_order_id?: string | null
          nyehandel_order_status?: string | null
          nyehandel_prefix?: string | null
          nyehandel_sync_status?: 'pending' | 'synced' | 'failed'
          paid_at?: string | null
          shipping_address?: Json
          total_price: number
          tracking_id?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Update: {
          checkout_status?: 'pending' | 'confirmed' | 'shipped' | 'cancelled'
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_metadata?: Json
          delivery_callback_received_at?: string | null
          id?: string
          idempotency_key?: string | null
          last_sync_error?: string | null
          line_items_snapshot?: Json
          nyehandel_order_id?: string | null
          nyehandel_order_status?: string | null
          nyehandel_prefix?: string | null
          nyehandel_sync_status?: 'pending' | 'synced' | 'failed'
          paid_at?: string | null
          shipping_address?: Json
          total_price?: number
          tracking_id?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          created_at: string
          gtin: string | null
          id: string
          is_checkout_enabled: boolean
          is_default: boolean
          nyehandel_variant_id: string | null
          pack_size: number
          price: number
          product_id: string
          sku: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          gtin?: string | null
          id?: string
          is_checkout_enabled?: boolean
          is_default?: boolean
          nyehandel_variant_id?: string | null
          pack_size: number
          price: number
          product_id: string
          sku?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          gtin?: string | null
          id?: string
          is_checkout_enabled?: boolean
          is_default?: boolean
          nyehandel_variant_id?: string | null
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
          status: 'mapped' | 'missing' | 'conflict'
        }
        Insert: {
          created_at?: string
          id?: string
          last_verified?: string
          nyehandel_sku: string
          product_name: string
          status?: 'mapped' | 'missing' | 'conflict'
        }
        Update: {
          created_at?: string
          id?: string
          last_verified?: string
          nyehandel_sku?: string
          product_name?: string
          status?: 'mapped' | 'missing' | 'conflict'
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
          status: 'success' | 'partial' | 'failed' | 'running'
          type: 'catalog' | 'inventory'
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
          status?: 'success' | 'partial' | 'failed' | 'running'
          type: 'catalog' | 'inventory'
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
          status?: 'success' | 'partial' | 'failed' | 'running'
          type?: 'catalog' | 'inventory'
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
          provider: 'nyehandel'
          received_at: string
          status: 'received' | 'processed' | 'failed'
          topic: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          provider: 'nyehandel'
          received_at?: string
          status?: 'received' | 'processed' | 'failed'
          topic: string
        }
        Update: {
          attempts?: number
          created_at?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: 'nyehandel'
          received_at?: string
          status?: 'received' | 'processed' | 'failed'
          topic?: string
        }
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

export interface DbProduct {
  id: string;
  brand_id: string;
  slug: string;
  name: string;
  description_key: string | null;
  description: string | null;
  compare_price: number | null;
  category_key: string;
  flavor_key: string;
  strength_key: string;
  format_key: string;
  nicotine_mg: number;
  portions_per_can: number;
  image_url: string | null;
  ratings: number;
  badge_keys: string[];
  manufacturer: string | null;
  is_active: boolean;
  nyehandel_id: string | null;
  created_at: string;
  updated_at: string;
  brands: { id: string; slug: string; name: string; manufacturer: string | null } | null;
  product_variants: { pack_size: number; price: number; sku: string | null; inventory?: { quantity: number }[] | null }[];
}

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
