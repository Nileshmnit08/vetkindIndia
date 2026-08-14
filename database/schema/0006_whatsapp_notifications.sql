-- ============================================
-- WhatsApp Notifications Schema Updates
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Extend inquiries table
ALTER TABLE inquiries 
  ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_whatsapp_notification_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_whatsapp_notification_status TEXT,
  ADD COLUMN IF NOT EXISTS last_whatsapp_message_id TEXT,
  ADD COLUMN IF NOT EXISTS last_whatsapp_error TEXT;

-- 2. Create whatsapp_notification_logs table
CREATE TABLE IF NOT EXISTS whatsapp_notification_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  inquiry_id TEXT NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  template_key TEXT NOT NULL,
  message_body TEXT NOT NULL,
  status TEXT NOT NULL, -- e.g. 'DELIVERED', 'FAILED', 'SIMULATED'
  error_message TEXT,
  sent_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  provider TEXT NOT NULL -- e.g. 'MOCK', 'TWILIO', 'WHATSAPP_CLOUD'
);

-- Enable RLS for whatsapp_notification_logs
ALTER TABLE whatsapp_notification_logs ENABLE ROW LEVEL SECURITY;

-- Note: VetKind uses Next-Auth for authentication, so the DB policy is permissive 
-- and Server Actions handle security checks.
DO $$ BEGIN
  CREATE POLICY "Allow all operations" ON whatsapp_notification_logs FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Force PostgREST schema cache to reload
NOTIFY pgrst, 'reload schema';
