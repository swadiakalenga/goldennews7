# Supabase Setup — GoldenNews7

This guide explains how to initialise the Supabase backend for GoldenNews7.  
All SQL is executed directly in the Supabase **SQL Editor** — no CLI required.

---

## Prerequisites

- A Supabase project already created at [supabase.com](https://supabase.com)
- Project URL: `https://bkkquuyonvljeknbzmrh.supabase.co`
- Your `.env.local` already contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 1 — Run the Schema Migration

1. Open the [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project **bkkquuyonvljeknbzmrh**
3. In the left sidebar, click **SQL Editor**
4. Click **+ New query**
5. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
6. Paste into the editor
7. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`)

This creates:

| Table | Purpose |
|---|---|
| `profiles` | One row per authenticated user; stores role (`admin`, `editor`, `viewer`) |
| `categories` | The 12 editorial categories |
| `authors` | Article authors |
| `articles` | All articles with status (`draft`, `published`, `archived`) |

All tables have Row Level Security (RLS) enabled. Public visitors can only read **published** articles.

---

## Step 2 — Run the Seed Data

1. In **SQL Editor**, click **+ New query**
2. Copy the entire contents of `supabase/seed.sql`
3. Paste and click **Run**

This inserts all 12 categories with stable UUIDs.  
The query is idempotent (`ON CONFLICT DO NOTHING`) — safe to run multiple times.

---

## Step 3 — Create the Storage Bucket

The `article-images` bucket holds all article cover images.

1. In the left sidebar, click **Storage**
2. Click **New bucket**
3. Name: `article-images`
4. Toggle **Public bucket** → ON (images are publicly accessible)
5. Click **Save**

### Storage RLS Policies

After creating the bucket, go to **Storage → Policies** and run this query in the SQL Editor:

```sql
-- Public read (images served without auth)
CREATE POLICY "article_images_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'article-images');

-- Only admins and editors can upload
CREATE POLICY "article_images_admin_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'article-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );

-- Only admins and editors can delete
CREATE POLICY "article_images_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'article-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'editor')
    )
  );
```

---

## Step 4 — Create Your First Admin User

1. In the dashboard, go to **Authentication → Users**
2. Click **Invite user** and enter your email
3. After signing up, go to **SQL Editor** and run:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your@email.com';
```

This elevates the user to admin — they can now create, edit, and delete articles via the future CMS.

---

## Step 5 — Verify Environment Variables

In `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bkkquuyonvljeknbzmrh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your anon key>
```

Run the dev server and confirm no console errors:

```bash
cd frontend
npm run dev
```

---

## Security Notes

| Key | Where | Do not... |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `.env.local`, browser | — |
| `service_role` key | **Nowhere in this repo** | Never commit or expose. Use Supabase Edge Functions if elevated access is needed. |

The anon key is safe to expose in client-side code — it is restricted entirely by RLS policies.

---

## Regenerating TypeScript Types

After any schema change, regenerate `src/lib/supabase/types.ts`:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Regenerate types
npx supabase gen types typescript \
  --project-id bkkquuyonvljeknbzmrh \
  > frontend/src/lib/supabase/types.ts
```

---

## Integration Roadmap

The frontend currently uses mock data from `src/data/mock-news.ts`.  
To switch to live Supabase data, update `src/lib/services/articleService.ts` — it is the single isolation point.

```
src/lib/services/articleService.ts   ← swap mock → Supabase queries here
src/lib/supabase/client.ts           ← browser client (client components)
src/lib/supabase/server.ts           ← server client (Server Components, generateStaticParams)
src/lib/supabase/types.ts            ← auto-generated type definitions
```

No other files need to change during the migration.
