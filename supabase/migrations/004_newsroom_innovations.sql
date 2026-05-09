-- ============================================================
-- 004_newsroom_innovations.sql
-- GoldenNews7 — Newsroom innovation features
-- ============================================================

-- ── Phase 1: AI Summary & reading time ──────────────────────
ALTER TABLE articles ADD COLUMN IF NOT EXISTS ai_summary        TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS reading_time_minutes INTEGER;

-- ── Phase 3: Why It Matters ─────────────────────────────────
ALTER TABLE articles ADD COLUMN IF NOT EXISTS why_it_matters    TEXT;

-- ── Phase 5: Live coverage mode ─────────────────────────────
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_live           BOOLEAN NOT NULL DEFAULT FALSE;

-- ── Phase 9: Social snippets ────────────────────────────────
ALTER TABLE articles ADD COLUMN IF NOT EXISTS social_twitter    TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS social_facebook   TEXT;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS social_telegram   TEXT;

-- ── Phase 14: Engagement scoring foundation ─────────────────
ALTER TABLE articles ADD COLUMN IF NOT EXISTS engagement_score  NUMERIC(5,2) NOT NULL DEFAULT 0;

-- ── Phase 4: Context Cards ──────────────────────────────────
CREATE TABLE IF NOT EXISTS context_cards (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword     TEXT        NOT NULL,
  title       TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX IF NOT EXISTS context_cards_keyword_idx ON context_cards (LOWER(keyword));

-- ── Phase 5: Live Updates ───────────────────────────────────
CREATE TABLE IF NOT EXISTS live_updates (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id  UUID        NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  content     TEXT        NOT NULL,
  author_note TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS live_updates_article_idx ON live_updates (article_id, created_at DESC);

-- ── Phase 10: Push notification subscribers ─────────────────
CREATE TABLE IF NOT EXISTS notification_subscribers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint    TEXT        NOT NULL UNIQUE,
  p256dh      TEXT,
  auth        TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Phase 11: Article Sources ───────────────────────────────
CREATE TABLE IF NOT EXISTS article_sources (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id  UUID        NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  source_name TEXT        NOT NULL,
  source_type TEXT        NOT NULL DEFAULT 'web',
  source_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS article_sources_article_idx ON article_sources (article_id);

-- ── RLS Policies ─────────────────────────────────────────────

-- context_cards
ALTER TABLE context_cards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read context cards" ON context_cards;
CREATE POLICY "Public read context cards"
  ON context_cards FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage context cards" ON context_cards;
CREATE POLICY "Admins manage context cards"
  ON context_cards FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- live_updates
ALTER TABLE live_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read live updates" ON live_updates;
CREATE POLICY "Public read live updates"
  ON live_updates FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage live updates" ON live_updates;
CREATE POLICY "Admins manage live updates"
  ON live_updates FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- notification_subscribers
ALTER TABLE notification_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON notification_subscribers;
CREATE POLICY "Anyone can subscribe"
  ON notification_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Admins read subscribers" ON notification_subscribers;
CREATE POLICY "Admins read subscribers"
  ON notification_subscribers FOR SELECT
  TO authenticated USING (true);

-- article_sources
ALTER TABLE article_sources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read article sources" ON article_sources;
CREATE POLICY "Public read article sources"
  ON article_sources FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage article sources" ON article_sources;
CREATE POLICY "Admins manage article sources"
  ON article_sources FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ── Engagement score update function ────────────────────────
CREATE OR REPLACE FUNCTION public.update_engagement_score(p_article_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE articles
  SET engagement_score = ROUND(
    (COALESCE(views_count, 0) * 1.0) +
    (SELECT COUNT(*) * 5.0 FROM live_updates WHERE article_id = p_article_id) +
    (CASE WHEN is_featured THEN 10.0 ELSE 0.0 END) +
    (CASE WHEN is_breaking THEN 15.0 ELSE 0.0 END),
    2
  )
  WHERE id = p_article_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_engagement_score(UUID) TO authenticated;
