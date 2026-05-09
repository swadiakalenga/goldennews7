-- ============================================================
-- GoldenNews7 — Initial Schema
-- Migration: 001_initial_schema.sql
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────
-- pgcrypto provides gen_random_uuid(), usually already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ─── Helper: updated_at trigger ──────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ─── Table: profiles ─────────────────────────────────────────
-- Mirrors auth.users; one row per registered user.
-- The `role` column controls admin/editor access.
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text        UNIQUE NOT NULL,
  full_name   text,
  avatar_url  text,
  role        text        NOT NULL DEFAULT 'viewer'
                          CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─── Table: categories ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        UNIQUE NOT NULL,
  slug        text        UNIQUE NOT NULL,
  description text,
  color       text,                        -- tailwind class or hex, e.g. "amber"
  created_at  timestamptz NOT NULL DEFAULT now()
);


-- ─── Table: authors ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.authors (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        UNIQUE NOT NULL,
  bio         text,
  avatar_url  text,
  role        text,                        -- e.g. "Correspondant Afrique de l'Ouest"
  email       text        UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_authors_updated_at
  BEFORE UPDATE ON public.authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─── Table: articles ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.articles (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text        NOT NULL,
  slug             text        UNIQUE NOT NULL,
  excerpt          text,
  content          text,
  cover_image_url  text,
  category_id      uuid        REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id        uuid        REFERENCES public.authors(id)    ON DELETE SET NULL,
  status           text        NOT NULL DEFAULT 'draft'
                               CHECK (status IN ('draft', 'published', 'archived')),
  is_featured      boolean     NOT NULL DEFAULT false,
  is_breaking      boolean     NOT NULL DEFAULT false,
  seo_title        text,
  seo_description  text,
  published_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_articles_status        ON public.articles (status);
CREATE INDEX IF NOT EXISTS idx_articles_category_id   ON public.articles (category_id);
CREATE INDEX IF NOT EXISTS idx_articles_author_id     ON public.articles (author_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at  ON public.articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured   ON public.articles (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_is_breaking   ON public.articles (is_breaking) WHERE is_breaking = true;
CREATE INDEX IF NOT EXISTS idx_articles_slug          ON public.articles (slug);


-- ─── Row Level Security ───────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles   ENABLE ROW LEVEL SECURITY;


-- ── profiles ──
-- Users can read their own profile; admins can read all
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- ── categories — public read, admin write ──
CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "categories_insert_admin"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "categories_update_admin"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "categories_delete_admin"
  ON public.categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );


-- ── authors — public read, admin/editor write ──
CREATE POLICY "authors_select_public"
  ON public.authors FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "authors_insert_admin_editor"
  ON public.authors FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "authors_update_admin_editor"
  ON public.authors FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "authors_delete_admin"
  ON public.authors FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );


-- ── articles — public can read published; admin/editor can write ──
CREATE POLICY "articles_select_published"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Admins and editors can see all articles (including drafts)
CREATE POLICY "articles_select_admin_editor"
  ON public.articles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "articles_insert_admin_editor"
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "articles_update_admin_editor"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

CREATE POLICY "articles_delete_admin"
  ON public.articles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
