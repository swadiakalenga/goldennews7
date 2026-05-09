-- Migration: 003_editorial_workflow.sql
-- Editorial workflow polish: site settings, static pages, scheduled publishing,
-- breaking expiration, homepage slot expiration, activity log.

-- ─── Phase 4: Articles schema extensions ────────────────────────────────────

ALTER TABLE articles ADD COLUMN IF NOT EXISTS scheduled_at    timestamptz;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS published_by    uuid REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS archived_at     timestamptz;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS breaking_expires_at timestamptz;

-- Extend status to include 'scheduled'
-- (If there is a CHECK constraint, drop and recreate it)
DO $$
BEGIN
  ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_status_check;
  ALTER TABLE articles ADD CONSTRAINT articles_status_check
    CHECK (status IN ('draft', 'published', 'archived', 'scheduled'));
EXCEPTION WHEN OTHERS THEN
  NULL; -- ignore if constraint didn't exist or if status is an ENUM
END $$;

CREATE INDEX IF NOT EXISTS idx_articles_scheduled_at ON articles(scheduled_at)
  WHERE scheduled_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_breaking_expires ON articles(breaking_expires_at)
  WHERE breaking_expires_at IS NOT NULL;

-- ─── Phase 7: Homepage slot expiration ──────────────────────────────────────

ALTER TABLE homepage_slots ADD COLUMN IF NOT EXISTS expires_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_slots_expires ON homepage_slots(expires_at)
  WHERE expires_at IS NOT NULL;

-- ─── Phase 2: Site settings ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_settings (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name            text        NOT NULL DEFAULT 'GoldenNews7',
  site_tagline         text        DEFAULT 'L''information africaine sans frontières',
  site_description     text        DEFAULT 'GoldenNews7 est votre source de référence pour l''information africaine et internationale. Indépendant, rigoureux, accessible.',
  contact_email        text,
  facebook_url         text,
  twitter_url          text,
  youtube_url          text,
  telegram_url         text,
  default_seo_title    text,
  default_seo_description text,
  logo_url             text,
  favicon_url          text,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_site_settings"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "auth_manage_site_settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Seed exactly one row
INSERT INTO site_settings (site_name, site_tagline)
VALUES ('GoldenNews7', 'L''information africaine sans frontières')
ON CONFLICT DO NOTHING;

-- ─── Phase 3: Static pages ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS static_pages (
  id              uuid  PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text  UNIQUE NOT NULL,
  title           text  NOT NULL,
  excerpt         text,
  content         text,
  seo_title       text,
  seo_description text,
  status          text  NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'published', 'archived')),
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_static_pages_slug   ON static_pages(slug);
CREATE INDEX IF NOT EXISTS idx_static_pages_status ON static_pages(status);

ALTER TABLE static_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_read_published_pages"
  ON static_pages FOR SELECT
  TO anon
  USING (status = 'published');

CREATE POLICY "auth_manage_static_pages"
  ON static_pages FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);

-- Seed default static pages (empty content — admins fill in via CMS)
INSERT INTO static_pages (slug, title, status)
VALUES
  ('a-propos', 'À propos de GoldenNews7', 'published'),
  ('contact',  'Contactez-nous',           'published'),
  ('privacy',  'Politique de confidentialité', 'published'),
  ('terms',    'Conditions d''utilisation', 'published')
ON CONFLICT (slug) DO NOTHING;

-- ─── Phase 8: Activity log ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    uuid        REFERENCES profiles(id) ON DELETE SET NULL,
  action      text        NOT NULL,
  entity_type text,
  entity_id   uuid,
  description text,
  metadata    jsonb,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_created  ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_actor    ON admin_activity_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_activity_entity   ON admin_activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_action   ON admin_activity_logs(action);

ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read/write logs (no public access)
CREATE POLICY "auth_manage_activity_logs"
  ON admin_activity_logs FOR ALL
  TO authenticated
  USING (true) WITH CHECK (true);
