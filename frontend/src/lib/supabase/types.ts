// Auto-generated types from Supabase schema.
// Run `npx supabase gen types typescript --project-id bkkquuyonvljeknbzmrh > src/lib/supabase/types.ts`
// to regenerate after schema changes.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "admin" | "editor" | "viewer";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "editor" | "viewer";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "editor" | "viewer";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          color: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          color?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          color?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      authors: {
        Row: {
          id: string;
          name: string;
          slug: string;
          bio: string | null;
          avatar_url: string | null;
          role: string | null;
          email: string | null;
          twitter_url: string | null;
          facebook_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          bio?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          email?: string | null;
          twitter_url?: string | null;
          facebook_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          bio?: string | null;
          avatar_url?: string | null;
          role?: string | null;
          email?: string | null;
          twitter_url?: string | null;
          facebook_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_image_url: string | null;
          category_id: string | null;
          author_id: string | null;
          status: "draft" | "published" | "archived" | "scheduled";
          is_featured: boolean;
          is_breaking: boolean;
          seo_title: string | null;
          seo_description: string | null;
          views_count: number;
          published_at: string | null;
          scheduled_at: string | null;
          published_by: string | null;
          archived_at: string | null;
          breaking_expires_at: string | null;
          ai_summary: string | null;
          reading_time_minutes: number | null;
          why_it_matters: string | null;
          is_live: boolean;
          social_twitter: string | null;
          social_facebook: string | null;
          social_telegram: string | null;
          auto_share_twitter: boolean;
          auto_share_facebook: boolean;
          engagement_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          status?: "draft" | "published" | "archived" | "scheduled";
          is_featured?: boolean;
          is_breaking?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          views_count?: number;
          published_at?: string | null;
          scheduled_at?: string | null;
          published_by?: string | null;
          archived_at?: string | null;
          breaking_expires_at?: string | null;
          ai_summary?: string | null;
          reading_time_minutes?: number | null;
          why_it_matters?: string | null;
          is_live?: boolean;
          social_twitter?: string | null;
          social_facebook?: string | null;
          social_telegram?: string | null;
          auto_share_twitter?: boolean;
          auto_share_facebook?: boolean;
          engagement_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string | null;
          cover_image_url?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          status?: "draft" | "published" | "archived" | "scheduled";
          is_featured?: boolean;
          is_breaking?: boolean;
          seo_title?: string | null;
          seo_description?: string | null;
          views_count?: number;
          published_at?: string | null;
          scheduled_at?: string | null;
          published_by?: string | null;
          archived_at?: string | null;
          breaking_expires_at?: string | null;
          ai_summary?: string | null;
          reading_time_minutes?: number | null;
          why_it_matters?: string | null;
          is_live?: boolean;
          social_twitter?: string | null;
          social_facebook?: string | null;
          social_telegram?: string | null;
          auto_share_twitter?: boolean;
          auto_share_facebook?: boolean;
          engagement_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "articles_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "authors";
            referencedColumns: ["id"];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
          confirmed: boolean;
          source: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          subscribed_at?: string;
          confirmed?: boolean;
          source?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          subscribed_at?: string;
          confirmed?: boolean;
          source?: string | null;
        };
        Relationships: [];
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          title: string;
          description: string | null;
          layout_type: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title: string;
          description?: string | null;
          layout_type?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          title?: string;
          description?: string | null;
          layout_type?: string;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      homepage_slots: {
        Row: {
          id: string;
          section_id: string;
          article_id: string;
          slot_type: string;
          position: number;
          is_active: boolean;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_id: string;
          article_id: string;
          slot_type: string;
          position?: number;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_id?: string;
          article_id?: string;
          slot_type?: string;
          position?: number;
          is_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "homepage_slots_section_id_fkey";
            columns: ["section_id"];
            isOneToOne: false;
            referencedRelation: "homepage_sections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "homepage_slots_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
        ];
      };
      site_settings: {
        Row: {
          id: string;
          site_name: string;
          site_tagline: string | null;
          site_description: string | null;
          contact_email: string | null;
          facebook_url: string | null;
          twitter_url: string | null;
          youtube_url: string | null;
          telegram_url: string | null;
          default_seo_title: string | null;
          default_seo_description: string | null;
          logo_url: string | null;
          favicon_url: string | null;
          enable_auto_share_twitter: boolean;
          enable_auto_share_facebook: boolean;
          twitter_account_label: string | null;
          facebook_page_label: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name?: string;
          site_tagline?: string | null;
          site_description?: string | null;
          contact_email?: string | null;
          facebook_url?: string | null;
          twitter_url?: string | null;
          youtube_url?: string | null;
          telegram_url?: string | null;
          default_seo_title?: string | null;
          default_seo_description?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          enable_auto_share_twitter?: boolean;
          enable_auto_share_facebook?: boolean;
          twitter_account_label?: string | null;
          facebook_page_label?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_name?: string;
          site_tagline?: string | null;
          site_description?: string | null;
          contact_email?: string | null;
          facebook_url?: string | null;
          twitter_url?: string | null;
          youtube_url?: string | null;
          telegram_url?: string | null;
          default_seo_title?: string | null;
          default_seo_description?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          enable_auto_share_twitter?: boolean;
          enable_auto_share_facebook?: boolean;
          twitter_account_label?: string | null;
          facebook_page_label?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      social_posts: {
        Row: {
          id: string;
          article_id: string;
          platform: "twitter" | "facebook";
          post_text: string;
          post_url: string | null;
          status: "pending" | "success" | "failed";
          error_message: string | null;
          created_at: string;
          posted_at: string | null;
        };
        Insert: {
          id?: string;
          article_id: string;
          platform: "twitter" | "facebook";
          post_text: string;
          post_url?: string | null;
          status?: "pending" | "success" | "failed";
          error_message?: string | null;
          created_at?: string;
          posted_at?: string | null;
        };
        Update: {
          id?: string;
          article_id?: string;
          platform?: "twitter" | "facebook";
          post_text?: string;
          post_url?: string | null;
          status?: "pending" | "success" | "failed";
          error_message?: string | null;
          created_at?: string;
          posted_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "social_posts_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
        ];
      };
      static_pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          seo_title: string | null;
          seo_description: string | null;
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      context_cards: {
        Row: {
          id: string;
          keyword: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          keyword: string;
          title: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          keyword?: string;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      live_updates: {
        Row: {
          id: string;
          article_id: string;
          content: string;
          author_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          content: string;
          author_note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          content?: string;
          author_note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "live_updates_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
        ];
      };
      notification_subscribers: {
        Row: {
          id: string;
          endpoint: string;
          p256dh: string | null;
          auth: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          endpoint: string;
          p256dh?: string | null;
          auth?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          endpoint?: string;
          p256dh?: string | null;
          auth?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      article_sources: {
        Row: {
          id: string;
          article_id: string;
          source_name: string;
          source_type: string;
          source_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          source_name: string;
          source_type?: string;
          source_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          source_name?: string;
          source_type?: string;
          source_url?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "article_sources_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "articles";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_activity_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          description: string | null;
          metadata: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          description?: string | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          description?: string | null;
          metadata?: Record<string, unknown> | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_article_views: {
        Args: { article_id: string };
        Returns: undefined;
      };
      update_engagement_score: {
        Args: { p_article_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
