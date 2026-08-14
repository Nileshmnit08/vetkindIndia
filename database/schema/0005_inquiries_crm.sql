-- ============================================
-- CRM Inquiries Schema Updates
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Extend inquiries table
ALTER TABLE inquiries 
  ADD COLUMN IF NOT EXISTS inquiry_type TEXT DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS product_interest TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'legacy',
  ADD COLUMN IF NOT EXISTS source_page TEXT,
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium',
  ADD COLUMN IF NOT EXISTS assigned_to TEXT REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS tags TEXT, -- Stored as comma-separated string for simplicity
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS next_follow_up_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_spam BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_by TEXT REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS updated_by TEXT REFERENCES users(id);

-- Update existing rows
UPDATE inquiries SET inquiry_type = 'general', priority = 'Medium', source = 'legacy' WHERE source IS NULL;

-- 2. Create inquiry_activities table
CREATE TABLE IF NOT EXISTS inquiry_activities (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  inquiry_id TEXT NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL, -- Admin who performed the action
  activity_type TEXT NOT NULL, -- e.g. 'STATUS_CHANGE', 'NOTE', 'ASSIGNMENT', 'EMAIL', 'CALL', 'WHATSAPP'
  content TEXT, -- Note content or description
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for inquiry_activities
ALTER TABLE inquiry_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON inquiry_activities FOR ALL USING (true) WITH CHECK (true);
