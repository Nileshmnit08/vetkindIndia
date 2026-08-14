const fs = require('fs');
let content = fs.readFileSync('types/database.types.ts', 'utf8');

// Replace inquiries block
const newInquiries = `inquiries: {
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
      }`;
content = content.replace(/inquiries: \{[\s\S]*?\}\n      \}/, newInquiries);

// Add missing tables
const newTables = `
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
      blog_articles: {`;
content = content.replace('blog_articles: {', newTables);

fs.writeFileSync('types/database.types.ts', content);
console.log('Types updated successfully!');
