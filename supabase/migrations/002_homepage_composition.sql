-- Migration: 002_homepage_composition.sql
-- Homepage composition system: sections and article slots

-- ─── Tables ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS homepage_sections (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text        UNIQUE NOT NULL,
  title       text        NOT NULL,
  description text,
  layout_type text        NOT NULL DEFAULT 'grid',
  sort_order  int         DEFAULT 0,
  is_active   boolean     DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS homepage_slots (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid        NOT NULL REFERENCES homepage_sections(id) ON DELETE CASCADE,
  article_id uuid        NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  slot_type  text        NOT NULL,
  position   int         DEFAULT 0,
  is_active  boolean     DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_homepage_sections_sort    ON homepage_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_key     ON homepage_sections(section_key);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_active  ON homepage_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_homepage_slots_section    ON homepage_slots(section_id);
CREATE INDEX IF NOT EXISTS idx_homepage_slots_article    ON homepage_slots(article_id);
CREATE INDEX IF NOT EXISTS idx_homepage_slots_position   ON homepage_slots(section_id, position);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_slots    ENABLE ROW LEVEL SECURITY;

-- Anonymous (public site): read active sections only
CREATE POLICY "anon_read_active_sections"
  ON homepage_sections FOR SELECT
  TO anon
  USING (is_active = true);

-- Authenticated (admin/editor): full access to all sections
CREATE POLICY "auth_all_sections"
  ON homepage_sections FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anonymous: read active slots only
CREATE POLICY "anon_read_active_slots"
  ON homepage_slots FOR SELECT
  TO anon
  USING (is_active = true);

-- Authenticated: full access to all slots
CREATE POLICY "auth_all_slots"
  ON homepage_slots FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── Default sections ────────────────────────────────────────────────────────

INSERT INTO homepage_sections (section_key, title, description, layout_type, sort_order, is_active)
VALUES
  ('hero',       'À la une',              'Article principal (hero) et articles secondaires (sidebar)', 'hero',     1, true),
  ('breaking',   'Fil urgent',            'Articles affichés dans le bandeau d''actualité urgente',     'ticker',   2, true),
  ('latest',     'Dernières actualités',  'Grille automatique des derniers articles publiés',            'grid',     3, true),
  ('politics',   'Politique',             'Article mis en avant dans la section Politique',              'featured', 4, false),
  ('africa',     'Afrique',               'Article mis en avant dans la section Afrique',               'featured', 5, false),
  ('technology', 'Technologie',           'Article mis en avant dans la section Technologie',           'featured', 6, false),
  ('opinion',    'Opinion',               'Article mis en avant dans la section Opinion',               'featured', 7, false)
ON CONFLICT (section_key) DO NOTHING;
