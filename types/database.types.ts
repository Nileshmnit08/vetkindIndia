export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          password: string | null
          role: string
          status: string
          email_verified: string | null
          image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          password?: string | null
          role?: string
          status?: string
          email_verified?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          password?: string | null
          role?: string
          status?: string
          email_verified?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      distributor_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string
          phone: string | null
          address: string | null
          region: string | null
          gst_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          phone?: string | null
          address?: string | null
          region?: string | null
          gst_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          phone?: string | null
          address?: string | null
          region?: string | null
          gst_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      species: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image: string | null
          featured: boolean
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image?: string | null
          featured?: boolean
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image?: string | null
          featured?: boolean
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          species_id: string | null
          category: string | null
          benefits: string | null
          product_type: string | null
          badges: string | null
          pack_size: string | null
          description: string | null
          short_description: string | null
          price: number | null
          image: string | null
          featured: boolean
          bestseller: boolean
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          species_id?: string | null
          category?: string | null
          benefits?: string | null
          product_type?: string | null
          badges?: string | null
          pack_size?: string | null
          description?: string | null
          short_description?: string | null
          price?: number | null
          image?: string | null
          featured?: boolean
          bestseller?: boolean
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          species_id?: string | null
          category?: string | null
          benefits?: string | null
          product_type?: string | null
          badges?: string | null
          pack_size?: string | null
          description?: string | null
          short_description?: string | null
          price?: number | null
          image?: string | null
          featured?: boolean
          bestseller?: boolean
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      product_resources: {
        Row: {
          id: string
          product_id: string
          title: string
          file_url: string
          resource_type: string
          visibility: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          title: string
          file_url: string
          resource_type: string
          visibility?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          title?: string
          file_url?: string
          resource_type?: string
          visibility?: string
          created_at?: string
          updated_at?: string
        }
      }
      inquiries: {
        Row: {
          id: string
          user_id: string | null
          name: string
          company: string | null
          email: string
          phone: string | null
          message: string
          status: string
          created_at: string
          updated_at: string
          assigned_to: string | null
          inquiry_type: string | null
          priority: string | null
          source: string | null
          product_interest: string | null
          city: string | null
          state: string | null
          is_spam: boolean | null
          updated_by: string | null
          last_whatsapp_notification_at: string | null
          last_whatsapp_notification_status: string | null
          last_whatsapp_message_id: string | null
          last_whatsapp_error: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          company?: string | null
          email: string
          phone?: string | null
          message: string
          status?: string
          created_at?: string
          updated_at?: string
          assigned_to?: string | null
          inquiry_type?: string | null
          priority?: string | null
          source?: string | null
          product_interest?: string | null
          city?: string | null
          state?: string | null
          is_spam?: boolean | null
          updated_by?: string | null
          last_whatsapp_notification_at?: string | null
          last_whatsapp_notification_status?: string | null
          last_whatsapp_message_id?: string | null
          last_whatsapp_error?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          company?: string | null
          email?: string
          phone?: string | null
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
          assigned_to?: string | null
          inquiry_type?: string | null
          priority?: string | null
          source?: string | null
          product_interest?: string | null
          city?: string | null
          state?: string | null
          is_spam?: boolean | null
          updated_by?: string | null
          last_whatsapp_notification_at?: string | null
          last_whatsapp_notification_status?: string | null
          last_whatsapp_message_id?: string | null
          last_whatsapp_error?: string | null
        }
      }
      solutions_admin: {
        Row: {
          id: string
          title: string
          slug: string
          short_summary: string | null
          full_content: string | null
          hero_image: string | null
          icon_name: string | null
          species_tags: string | null
          benefits: string | null
          related_products: string | null
          featured: boolean
          sort_order: number
          status: string
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          short_summary?: string | null
          full_content?: string | null
          hero_image?: string | null
          icon_name?: string | null
          species_tags?: string | null
          benefits?: string | null
          related_products?: string | null
          featured?: boolean
          sort_order?: number
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          short_summary?: string | null
          full_content?: string | null
          hero_image?: string | null
          icon_name?: string | null
          species_tags?: string | null
          benefits?: string | null
          related_products?: string | null
          featured?: boolean
          sort_order?: number
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      knowledge_articles: {
        Row: {
          id: string
          title: string
          slug: string
          category: string | null
          excerpt: string | null
          cover_image: string | null
          article_content: string | null
          author: string | null
          read_time: string | null
          published_at: string | null
          featured: boolean
          status: string
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category?: string | null
          excerpt?: string | null
          cover_image?: string | null
          article_content?: string | null
          author?: string | null
          read_time?: string | null
          published_at?: string | null
          featured?: boolean
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: string | null
          excerpt?: string | null
          cover_image?: string | null
          article_content?: string | null
          author?: string | null
          read_time?: string | null
          published_at?: string | null
          featured?: boolean
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      research_articles: {
        Row: {
          id: string
          title: string
          slug: string
          category: string | null
          excerpt: string | null
          cover_image: string | null
          article_content: string | null
          author: string | null
          published_at: string | null
          status: string
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category?: string | null
          excerpt?: string | null
          cover_image?: string | null
          article_content?: string | null
          author?: string | null
          published_at?: string | null
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: string | null
          excerpt?: string | null
          cover_image?: string | null
          article_content?: string | null
          author?: string | null
          published_at?: string | null
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news_events: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string | null
          cover_image: string | null
          content: string | null
          type: string
          event_date: string | null
          location: string | null
          published_at: string | null
          featured: boolean
          status: string
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary?: string | null
          cover_image?: string | null
          content?: string | null
          type?: string
          event_date?: string | null
          location?: string | null
          published_at?: string | null
          featured?: boolean
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          summary?: string | null
          cover_image?: string | null
          content?: string | null
          type?: string
          event_date?: string | null
          location?: string | null
          published_at?: string | null
          featured?: boolean
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      
      site_settings: {
        Row: {
          id: number
          whatsapp_number: string
          whatsapp_message: string
          whatsapp_enabled: boolean
        }
        Insert: {
          id?: number
          whatsapp_number?: string
          whatsapp_message?: string
          whatsapp_enabled?: boolean
        }
        Update: {
          id?: number
          whatsapp_number?: string
          whatsapp_message?: string
          whatsapp_enabled?: boolean
        }
      }
      inquiry_activities: {
        Row: {
          id: string
          inquiry_id: string
          user_id: string | null
          activity_type: string
          content: string | null
          old_value: string | null
          new_value: string | null
          created_at: string
        }
        Insert: {
          id?: string
          inquiry_id: string
          user_id?: string | null
          activity_type: string
          content?: string | null
          old_value?: string | null
          new_value?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          inquiry_id?: string
          user_id?: string | null
          activity_type?: string
          content?: string | null
          old_value?: string | null
          new_value?: string | null
          created_at?: string
        }
      }
      whatsapp_notification_logs: {
        Row: {
          id: string
          inquiry_id: string
          phone: string
          template_key: string
          message_body: string
          status: string
          error_message: string | null
          sent_by: string | null
          provider: string
          created_at: string
        }
        Insert: {
          id?: string
          inquiry_id: string
          phone: string
          template_key: string
          message_body: string
          status: string
          error_message?: string | null
          sent_by?: string | null
          provider?: string
          created_at?: string
        }
        Update: {
          id?: string
          inquiry_id?: string
          phone?: string
          template_key?: string
          message_body?: string
          status?: string
          error_message?: string | null
          sent_by?: string | null
          provider?: string
          created_at?: string
        }
      }
      blog_articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          cover_image: string | null
          article_content: string | null
          author: string | null
          category: string | null
          tags: string | null
          published_at: string | null
          featured: boolean
          status: string
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          cover_image?: string | null
          article_content?: string | null
          author?: string | null
          category?: string | null
          tags?: string | null
          published_at?: string | null
          featured?: boolean
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          cover_image?: string | null
          article_content?: string | null
          author?: string | null
          category?: string | null
          tags?: string | null
          published_at?: string | null
          featured?: boolean
          status?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
