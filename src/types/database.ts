// Hand-written to match supabase/migrations/0001_init.sql exactly. If the
// schema changes, regenerate with:
//   supabase gen types typescript --db-url "<connection-string>" --schema public
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          slug: string;
          default_locale: string;
          supported_locales: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          default_locale?: string;
          supported_locales?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          default_locale?: string;
          supported_locales?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurant_settings: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          logo_path: string | null;
          cover_image_path: string | null;
          phone: string | null;
          whatsapp: string | null;
          address: string | null;
          google_maps_url: string | null;
          instagram_url: string | null;
          working_hours: Json | null;
          currency_code: string;
          currency_symbol: string;
          theme_primary_color: string;
          theme_secondary_color: string;
          theme_accent_color: string;
          seo_title: Json | null;
          seo_description: Json | null;
          seo_og_image_path: string | null;
          favicon_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          logo_path?: string | null;
          cover_image_path?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          address?: string | null;
          google_maps_url?: string | null;
          instagram_url?: string | null;
          working_hours?: Json | null;
          currency_code?: string;
          currency_symbol?: string;
          theme_primary_color?: string;
          theme_secondary_color?: string;
          theme_accent_color?: string;
          seo_title?: Json | null;
          seo_description?: Json | null;
          seo_og_image_path?: string | null;
          favicon_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          logo_path?: string | null;
          cover_image_path?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          address?: string | null;
          google_maps_url?: string | null;
          instagram_url?: string | null;
          working_hours?: Json | null;
          currency_code?: string;
          currency_symbol?: string;
          theme_primary_color?: string;
          theme_secondary_color?: string;
          theme_accent_color?: string;
          seo_title?: Json | null;
          seo_description?: Json | null;
          seo_og_image_path?: string | null;
          favicon_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      admin_profiles: {
        Row: {
          id: string;
          restaurant_id: string;
          role: string;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          restaurant_id: string;
          role?: string;
          full_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          role?: string;
          full_name?: string | null;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          restaurant_id: string;
          slug: string;
          name: Json;
          description: Json | null;
          display_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          slug?: string;
          name: Json;
          description?: Json | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          slug?: string;
          name?: Json;
          description?: Json | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string;
          name: Json;
          description: Json | null;
          price: number;
          image_path: string | null;
          display_order: number;
          is_active: boolean;
          availability: "available" | "out_of_stock";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          category_id: string;
          name: Json;
          description?: Json | null;
          price: number;
          image_path?: string | null;
          display_order?: number;
          is_active?: boolean;
          availability?: "available" | "out_of_stock";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          category_id?: string;
          name?: Json;
          description?: Json | null;
          price?: number;
          image_path?: string | null;
          display_order?: number;
          is_active?: boolean;
          availability?: "available" | "out_of_stock";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
