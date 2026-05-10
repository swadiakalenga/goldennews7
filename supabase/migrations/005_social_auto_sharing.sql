-- ============================================================
-- Migration 005: Social Auto-Sharing Infrastructure
-- ============================================================

-- Add per-article auto-share toggles (post text reuses existing social_twitter/social_facebook columns)
ALTER TABLE articles ADD COLUMN IF NOT EXISTS auto_share_twitter  BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS auto_share_facebook BOOLEAN NOT NULL DEFAULT FALSE;

-- Add global auto-share settings to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS enable_auto_share_twitter  BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS enable_auto_share_facebook BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS twitter_account_label       TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS facebook_page_label         TEXT;

-- Social posts log table
CREATE TABLE IF NOT EXISTS social_posts (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id     UUID        NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  platform       TEXT        NOT NULL CHECK (platform IN ('twitter', 'facebook')),
  post_text      TEXT        NOT NULL,
  post_url       TEXT,
  status         TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  error_message  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  posted_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS social_posts_article_idx ON social_posts (article_id);
CREATE INDEX IF NOT EXISTS social_posts_status_idx  ON social_posts (platform, status);

ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (admins/editors) can manage
CREATE POLICY "auth_manage_social_posts"
  ON social_posts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Public cannot read social post data
CREATE POLICY "public_no_social_posts"
  ON social_posts FOR SELECT TO anon
  USING (false);
