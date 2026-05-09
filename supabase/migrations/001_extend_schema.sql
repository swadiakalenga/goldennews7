-- GoldenNews7 — Schema extension migration
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/bkkquuyonvljeknbzmrh/sql

-- ─── Categories: add sort_order + is_active ───────────────────
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active  BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS categories_sort_order_idx ON public.categories (sort_order);

-- ─── Authors: add social links ────────────────────────────────
ALTER TABLE public.authors
  ADD COLUMN IF NOT EXISTS twitter_url  TEXT,
  ADD COLUMN IF NOT EXISTS facebook_url TEXT;

-- ─── Articles: add view counter ───────────────────────────────
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS views_count INTEGER NOT NULL DEFAULT 0;

-- Function to safely increment view count (prevents race conditions)
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.articles
  SET views_count = views_count + 1
  WHERE id = article_id;
END;
$$;

-- ─── Newsletter subscribers ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed     BOOLEAN NOT NULL DEFAULT false,
  source        TEXT,
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email)
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read subscribers
CREATE POLICY "Admins can read subscribers"
  ON public.newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete subscribers
CREATE POLICY "Admins can delete subscribers"
  ON public.newsletter_subscribers
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ─── RLS Policies ─────────────────────────────────────────────

-- articles: public can read published articles
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published articles"
  ON public.articles FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins have full access to articles"
  ON public.articles FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- categories: public read, admin write
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active categories"
  ON public.categories FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins have full access to categories"
  ON public.categories FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- authors: public read, admin write
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read authors"
  ON public.authors FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins have full access to authors"
  ON public.authors FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- profiles: users can read their own profile, admins can read all
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
  );

-- Grant public access to increment_article_views function
GRANT EXECUTE ON FUNCTION public.increment_article_views(UUID) TO anon, authenticated;

-- ─── Storage bucket policies ──────────────────────────────────
-- Ensure article-images bucket exists and has correct policies
-- Run these in Storage → Policies in Supabase dashboard if not set:
--
-- Policy: Public can view images
--   Bucket: article-images | Operation: SELECT | Role: anon
--   USING: true
--
-- Policy: Admins can upload images
--   Bucket: article-images | Operation: INSERT | Role: authenticated
--   WITH CHECK: (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
--
-- Policy: Admins can delete images
--   Bucket: article-images | Operation: DELETE | Role: authenticated
--   USING: (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
