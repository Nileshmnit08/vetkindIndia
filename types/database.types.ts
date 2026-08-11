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
      categories: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
      }
      animal_species: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
      }
      product_benefits: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          short_description: string | null
          description: string | null
          category_id: string | null
          brand: string | null
          product_type: string | null
          ingredients: string | null
          composition: string | null
          dosage: string | null
          usage: string | null
          pack_sizes: string[] | null
          mrp: number | null
          status: string | null
          featured: boolean | null
          bestseller: boolean | null
          seo_title: string | null
          seo_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          short_description?: string | null
          description?: string | null
          category_id?: string | null
          brand?: string | null
          product_type?: string | null
          ingredients?: string | null
          composition?: string | null
          dosage?: string | null
          usage?: string | null
          pack_sizes?: string[] | null
          mrp?: number | null
          status?: string | null
          featured?: boolean | null
          bestseller?: boolean | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          category_id?: string | null
          brand?: string | null
          product_type?: string | null
          ingredients?: string | null
          composition?: string | null
          dosage?: string | null
          usage?: string | null
          pack_sizes?: string[] | null
          mrp?: number | null
          status?: string | null
          featured?: boolean | null
          bestseller?: boolean | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      product_species_link: {
        Row: {
          product_id: string
          species_id: string
        }
        Insert: {
          product_id: string
          species_id: string
        }
        Update: {
          product_id?: string
          species_id?: string
        }
      }
      product_benefits_link: {
        Row: {
          product_id: string
          benefit_id: string
        }
        Insert: {
          product_id: string
          benefit_id: string
        }
        Update: {
          product_id?: string
          benefit_id?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string | null
          image_url: string
          is_primary: boolean | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          image_url: string
          is_primary?: boolean | null
        }
        Update: {
          id?: string
          product_id?: string | null
          image_url?: string
          is_primary?: boolean | null
        }
      }
      product_documents: {
        Row: {
          id: string
          product_id: string | null
          title: string
          file_url: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          title: string
          file_url: string
        }
        Update: {
          id?: string
          product_id?: string | null
          title?: string
          file_url?: string
        }
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          category_id: string | null
          author_id: string | null
          published_at: string | null
          featured_image: string | null
          seo_title: string | null
          seo_description: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          category_id?: string | null
          author_id?: string | null
          published_at?: string | null
          featured_image?: string | null
          seo_title?: string | null
          seo_description?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string | null
          category_id?: string | null
          author_id?: string | null
          published_at?: string | null
          featured_image?: string | null
          seo_title?: string | null
          seo_description?: string | null
          status?: string | null
          created_at?: string | null
        }
      }
      solutions: {
        Row: {
          id: string
          name: string
          slug: string
          hero_headline: string
          hero_image_url: string | null
          problem_explanation: string
          common_signs: string[] | null
          management_considerations: string[] | null
          vetkind_approach: string
          seo_title: string | null
          seo_description: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          hero_headline: string
          hero_image_url?: string | null
          problem_explanation: string
          common_signs?: string[] | null
          management_considerations?: string[] | null
          vetkind_approach: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          hero_headline?: string
          hero_image_url?: string | null
          problem_explanation?: string
          common_signs?: string[] | null
          management_considerations?: string[] | null
          vetkind_approach?: string
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      solution_faqs: {
        Row: {
          id: string
          solution_id: string | null
          question: string
          answer: string
          sort_order: number | null
        }
        Insert: {
          id?: string
          solution_id?: string | null
          question: string
          answer: string
          sort_order?: number | null
        }
        Update: {
          id?: string
          solution_id?: string | null
          question?: string
          answer?: string
          sort_order?: number | null
        }
      }
      solution_articles_link: {
        Row: {
          solution_id: string
          article_id: string
        }
        Insert: {
          solution_id: string
          article_id: string
        }
        Update: {
          solution_id?: string
          article_id?: string
        }
      }
      solution_products_link: {
        Row: {
          solution_id: string
          product_id: string
        }
        Insert: {
          solution_id: string
          product_id: string
        }
        Update: {
          solution_id?: string
          product_id?: string
        }
      }
      article_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          slug: string
          bio: string | null
          avatar_url: string | null
          role: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          bio?: string | null
          avatar_url?: string | null
          role?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          bio?: string | null
          avatar_url?: string | null
          role?: string | null
        }
      }
      article_tags: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
      }
      article_tags_link: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
      }
      article_products_link: {
        Row: {
          article_id: string
          product_id: string
        }
        Insert: {
          article_id: string
          product_id: string
        }
        Update: {
          article_id?: string
          product_id?: string
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
