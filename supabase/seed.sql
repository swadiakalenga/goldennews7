-- ============================================================
-- GoldenNews7 — Seed Data
-- Run AFTER 001_initial_schema.sql
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ─── Categories ──────────────────────────────────────────────
-- Matches the CATEGORIES array in src/types/index.ts
-- UUIDs are fixed so foreign keys in article seeds are stable.

INSERT INTO public.categories (id, name, slug, description, color)
VALUES
  ('11111111-0001-0001-0001-000000000001', 'Actualité',   'actualite',   'Toute l''actualité du moment, en temps réel et sans frontières.',                                           'blue'),
  ('11111111-0001-0001-0001-000000000002', 'Politique',   'politique',   'Analyses, décryptages et reportages sur la vie politique africaine et internationale.',                      'purple'),
  ('11111111-0001-0001-0001-000000000003', 'Sécurité',    'securite',    'Conflits, défense, terrorisme : le suivi des enjeux sécuritaires du continent.',                            'red'),
  ('11111111-0001-0001-0001-000000000004', 'Économie',    'economie',    'Marchés, entreprises, finance : l''économie africaine en profondeur.',                                      'green'),
  ('11111111-0001-0001-0001-000000000005', 'Société',     'societe',     'Les grandes questions sociales qui façonnent l''Afrique contemporaine.',                                    'orange'),
  ('11111111-0001-0001-0001-000000000006', 'Afrique',     'afrique',     'Le continent dans toute sa diversité, ses défis et ses réussites.',                                        'yellow'),
  ('11111111-0001-0001-0001-000000000007', 'Monde',       'monde',       'L''Afrique dans le monde, le monde vu d''Afrique.',                                                        'teal'),
  ('11111111-0001-0001-0001-000000000008', 'Technologie', 'technologie', 'Innovation, numérique et tech : l''Afrique à la pointe de demain.',                                        'cyan'),
  ('11111111-0001-0001-0001-000000000009', 'Sport',       'sport',       'Football, athlétisme, basket : les exploits sportifs africains.',                                           'emerald'),
  ('11111111-0001-0001-0001-000000000010', 'Culture',     'culture',     'Arts, cinéma, musique, littérature : la culture africaine rayonne.',                                        'pink'),
  ('11111111-0001-0001-0001-000000000011', 'Santé',       'sante',       'Médecine, épidémies, bien-être : la santé au cœur de nos vies.',                                           'lime'),
  ('11111111-0001-0001-0001-000000000012', 'Opinion',     'opinion',     'Tribunes, éditoriaux et analyses de nos experts et contributeurs.',                                         'gray')
ON CONFLICT (slug) DO NOTHING;


-- ─── Storage bucket plan ─────────────────────────────────────
-- The `article-images` bucket must be created via the Supabase
-- Dashboard (Storage → New bucket) or via the CLI, not SQL.
-- See docs/supabase-setup.md for step-by-step instructions.
--
-- Once created, run these storage RLS policies:
--
-- INSERT INTO storage.buckets (id, name, public)
--   VALUES ('article-images', 'article-images', true)
--   ON CONFLICT (id) DO NOTHING;
--
-- CREATE POLICY "article_images_public_read"
--   ON storage.objects FOR SELECT
--   TO anon, authenticated
--   USING (bucket_id = 'article-images');
--
-- CREATE POLICY "article_images_admin_upload"
--   ON storage.objects FOR INSERT
--   TO authenticated
--   WITH CHECK (
--     bucket_id = 'article-images'
--     AND EXISTS (
--       SELECT 1 FROM public.profiles p
--       WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
--     )
--   );
--
-- CREATE POLICY "article_images_admin_delete"
--   ON storage.objects FOR DELETE
--   TO authenticated
--   USING (
--     bucket_id = 'article-images'
--     AND EXISTS (
--       SELECT 1 FROM public.profiles p
--       WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
--     )
--   );
