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
      attribute_categories: {
        Row: {
          key: string
          label: string
          options: string[]
          sort_order: number
        }
        Insert: {
          key: string
          label: string
          options: string[]
          sort_order?: number
        }
        Update: {
          key?: string
          label?: string
          options?: string[]
          sort_order?: number
        }
        Relationships: []
      }
      avatars: {
        Row: {
          id: string
          image_url: string
          name: string
          rarity: string
          sort_order: number
          unlock_threshold: number
          unlock_type: string
        }
        Insert: {
          id: string
          image_url: string
          name: string
          rarity: string
          sort_order: number
          unlock_threshold: number
          unlock_type: string
        }
        Update: {
          id?: string
          image_url?: string
          name?: string
          rarity?: string
          sort_order?: number
          unlock_threshold?: number
          unlock_type?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          body: string
          cover_image_url: string | null
          author_name: string
          tags: string[]
          published: boolean
          published_at: string | null
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt: string
          body: string
          cover_image_url?: string | null
          author_name?: string
          tags?: string[]
          published?: boolean
          published_at?: string | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string
          body?: string
          cover_image_url?: string | null
          author_name?: string
          tags?: string[]
          published?: boolean
          published_at?: string | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
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
          compare_price: number | null
          created_at: string
          description: string | null
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
          compare_price?: number | null
          created_at?: string
          description?: string | null
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
          compare_price?: number | null
          created_at?: string
          description?: string | null
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
      daily_spins: {
        Row: { id: string; user_id: string; prize_key: string; prize_value: Json; spin_date: string; spun_at: string }
        Insert: { id?: string; user_id: string; prize_key: string; prize_value: Json; spin_date?: string; spun_at?: string }
        Update: { id?: string; user_id?: string; prize_key?: string; prize_value?: Json; spin_date?: string; spun_at?: string }
        Relationships: []
      }
      vouchers: {
        Row: { id: string; user_id: string; type: string; value: Json; status: string; source: string; expires_at: string; used_at: string | null; created_at: string }
        Insert: { id?: string; user_id: string; type: string; value: Json; status?: string; source?: string; expires_at: string; used_at?: string | null; created_at?: string }
        Update: { id?: string; user_id?: string; type?: string; value?: Json; status?: string; source?: string; expires_at?: string; used_at?: string | null; created_at?: string }
        Relationships: []
      }
      points_redemptions: {
        Row: {
          id: string
          user_id: string
          points_spent: number
          reward_type: string
          reward_value: number | null
          voucher_id: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points_spent: number
          reward_type: string
          reward_value?: number | null
          voucher_id?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points_spent?: number
          reward_type?: string
          reward_value?: number | null
          voucher_id?: string | null
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      spin_config: {
        Row: { key: string; value: Json; updated_at: string }
        Insert: { key: string; value: Json; updated_at?: string }
        Update: { key?: string; value?: Json; updated_at?: string }
        Relationships: []
      }
      product_reviews: {
        Row: {
          body: string
          cons: string[]
          created_at: string
          flagged: boolean
          helpful_count: number
          id: string
          photo_urls: string[]
          product_id: string
          pros: string[]
          rating: number
          title: string
          user_id: string
        }
        Insert: {
          body: string
          cons?: string[]
          created_at?: string
          flagged?: boolean
          helpful_count?: number
          id?: string
          photo_urls?: string[]
          product_id: string
          pros?: string[]
          rating: number
          title: string
          user_id: string
        }
        Update: {
          body?: string
          cons?: string[]
          created_at?: string
          flagged?: boolean
          helpful_count?: number
          id?: string
          photo_urls?: string[]
          product_id?: string
          pros?: string[]
          rating?: number
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      review_summaries: {
        Row: {
          product_id: string
          summary_text: string
          review_count_at_generation: number
          generated_at: string
        }
        Insert: {
          product_id: string
          summary_text: string
          review_count_at_generation: number
          generated_at?: string
        }
        Update: {
          product_id?: string
          summary_text?: string
          review_count_at_generation?: number
          generated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_summaries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      review_likes: {
        Row: {
          user_id: string
          review_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          review_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          review_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "product_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          id: string
          product_id: string
          user_id: string
          body: string
          photo_url: string | null
          likes_count: number
          comments_count: number
          pinned: boolean
          flagged: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          body: string
          photo_url?: string | null
          likes_count?: number
          comments_count?: number
          pinned?: boolean
          flagged?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          body?: string
          photo_url?: string | null
          likes_count?: number
          comments_count?: number
          pinned?: boolean
          flagged?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          body: string
          flagged: boolean
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          body: string
          flagged?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          body?: string
          flagged?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_likes: {
        Row: {
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          post_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_post_product_tags: {
        Row: {
          post_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          post_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          post_id?: string
          product_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_post_product_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_post_product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      community_polls: {
        Row: {
          id: string
          post_id: string
          question: string
          ends_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          question: string
          ends_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          question?: string
          ends_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_polls_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: true
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_poll_options: {
        Row: {
          id: string
          poll_id: string
          label: string
          votes_count: number
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          label: string
          votes_count?: number
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          label?: string
          votes_count?: number
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "community_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      community_poll_votes: {
        Row: {
          poll_id: string
          user_id: string
          option_id: string
          created_at: string
        }
        Insert: {
          poll_id: string
          user_id: string
          option_id: string
          created_at?: string
        }
        Update: {
          poll_id?: string
          user_id?: string
          option_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "community_polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "community_poll_options"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          active: boolean
          description: string
          id: string
          quest_type: string
          reward_avatar_id: string | null
          reward_points: number
          sort_order: number
          target_value: number
          time_limit_days: number | null
          title: string
        }
        Insert: {
          active?: boolean
          description: string
          id: string
          quest_type: string
          reward_avatar_id?: string | null
          reward_points: number
          sort_order: number
          target_value: number
          time_limit_days?: number | null
          title: string
        }
        Update: {
          active?: boolean
          description?: string
          id?: string
          quest_type?: string
          reward_avatar_id?: string | null
          reward_points?: number
          sort_order?: number
          target_value?: number
          time_limit_days?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quests_reward_avatar_id_fkey"
            columns: ["reward_avatar_id"]
            isOneToOne: false
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
        ]
      }
      user_avatar_unlocks: {
        Row: {
          avatar_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          avatar_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          avatar_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_avatar_unlocks_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
        ]
      }
      user_attributes: {
        Row: {
          user_id: string
          attribute_key: string
          attribute_value: string
          created_at: string
        }
        Insert: {
          user_id: string
          attribute_key: string
          attribute_value: string
          created_at?: string
        }
        Update: {
          user_id?: string
          attribute_key?: string
          attribute_value?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_attributes_attribute_key_fkey"
            columns: ["attribute_key"]
            isOneToOne: false
            referencedRelation: "attribute_categories"
            referencedColumns: ["key"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_id: string | null
          bio: string | null
          created_at: string
          display_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_id?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_id?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_avatar_id_fkey"
            columns: ["avatar_id"]
            isOneToOne: false
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quest_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          current_value: number
          id: string
          quest_id: string
          started_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          current_value?: number
          id?: string
          quest_id: string
          started_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          current_value?: number
          id?: string
          quest_id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wishlists: {
        Row: {
          created_at: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_tiers: {
        Row: {
          id: string
          name: string
          min_points_lifetime: number
          benefits: Json
          sort_order: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          min_points_lifetime: number
          benefits?: Json
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          min_points_lifetime?: number
          benefits?: Json
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      user_memberships: {
        Row: {
          user_id: string
          tier_id: string
          lifetime_points: number
          tier_updated_at: string
          created_at: string
        }
        Insert: {
          user_id: string
          tier_id?: string
          lifetime_points?: number
          tier_updated_at?: string
          created_at?: string
        }
        Update: {
          user_id?: string
          tier_id?: string
          lifetime_points?: number
          tier_updated_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_memberships_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "membership_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_codes: {
        Row: {
          id: string
          user_id: string
          code: string
          uses: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          uses?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          uses?: number
          created_at?: string
        }
        Relationships: []
      }
      referral_redemptions: {
        Row: {
          id: string
          referral_code_id: string
          referred_user_id: string
          points_awarded: number
          created_at: string
        }
        Insert: {
          id?: string
          referral_code_id: string
          referred_user_id: string
          points_awarded?: number
          created_at?: string
        }
        Update: {
          id?: string
          referral_code_id?: string
          referred_user_id?: string
          points_awarded?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "referral_redemptions_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "referral_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      login_streaks: {
        Row: {
          user_id: string
          current_streak: number
          longest_streak: number
          last_login_date: string
          total_login_days: number
          updated_at: string
        }
        Insert: {
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_login_date?: string
          total_login_days?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_login_date?: string
          total_login_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      checkout_upsells: {
        Row: {
          active: boolean
          display_name: string
          id: string
          price_override: number
          sku: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          display_name: string
          id?: string
          price_override?: number
          sku: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          display_name?: string
          id?: string
          price_override?: number
          sku?: string
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      leaderboard_top_users: {
        Row: {
          user_id: string
          total_points: number
          display_name: string | null
          avatar_url: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      flag_review: {
        Args: {
          review_id: string
        }
        Returns: undefined
      }
      replace_user_attributes: {
        Args: {
          p_user_id: string
          p_attribute_key: string
          p_values: string[]
        }
        Returns: undefined
      }
      toggle_review_like: {
        Args: {
          p_review_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      cast_poll_vote: {
        Args: {
          p_poll_id: string
          p_option_id: string
        }
        Returns: { voted: boolean; option_id: string; votes_count: number }[]
      }
      get_or_create_referral_code: {
        Args: {
          p_user_id: string
        }
        Returns: string
      }
      redeem_referral_code: {
        Args: {
          p_code: string
          p_new_user_id: string
        }
        Returns: Json
      }
      record_daily_login: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
      toggle_community_post_like: {
        Args: {
          p_post_id: string
        }
        Returns: { liked: boolean; new_count: number }[]
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
