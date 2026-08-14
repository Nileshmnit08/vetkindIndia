-- Site Settings Table
-- Singleton table for storing global application settings

CREATE TABLE IF NOT EXISTS site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  whatsapp_number text NOT NULL DEFAULT '1234567890',
  whatsapp_message text NOT NULL DEFAULT 'Hello! I would like to know more about VetKind solutions.',
  whatsapp_enabled boolean NOT NULL DEFAULT true,
  updated_by text REFERENCES users(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_id_check CHECK (id = 1)
);

-- Insert default row
INSERT INTO site_settings (id, whatsapp_number, whatsapp_message, whatsapp_enabled) 
VALUES (1, '1234567890', 'Hello! I would like to know more about VetKind solutions.', true) 
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Note: VetKind uses Next-Auth for authentication, not Supabase Auth.
-- Therefore, Supabase's auth.uid() is null in Postgres.
-- The Next.js Server Actions (e.g. app/actions/settings.ts) handle security by 
-- checking the Next-Auth session before executing database queries.
DO $$ BEGIN
  CREATE POLICY "Allow all operations" ON site_settings FOR ALL USING (true) WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;
-- Force PostgREST schema cache to reload
NOTIFY pgrst, 'reload schema';
