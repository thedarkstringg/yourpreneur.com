# Supabase Setup Guide

When you're ready to connect to a real database, follow these steps:

## 1. Create a Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Enter a project name (e.g., "preneurs")
5. Create a strong database password
6. Select a region closest to you
7. Wait for the project to be created (~5 min)

## 2. Get Your Credentials

1. Go to Project Settings → API
2. Copy `Project URL` and paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key and paste into `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Save `.env.local`

## 3. Create Database Tables

In the Supabase dashboard, go to SQL Editor and run these queries:

### Create users table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_title TEXT DEFAULT 'Vol. 01',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);
```

### Create ventures table

```sql
CREATE TABLE ventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  status TEXT CHECK (status IN ('active', 'pivot', 'paused', 'shutdown', 'exited')),
  started_date DATE NOT NULL,
  ended_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE ventures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own ventures"
  ON ventures
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create ventures"
  ON ventures
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ventures"
  ON ventures
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ventures"
  ON ventures
  FOR DELETE
  USING (auth.uid() = user_id);
```

### Create events table

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venture_id UUID NOT NULL REFERENCES ventures(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  event_type TEXT CHECK (event_type IN ('milestone', 'launch', 'funding', 'team', 'pivot', 'setback', 'exit', 'other')),
  title TEXT NOT NULL,
  notes TEXT,
  event_date DATE NOT NULL,
  link_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see their own events"
  ON events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create events"
  ON events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON events
  FOR DELETE
  USING (auth.uid() = user_id);
```

## 4. Set Up Authentication

In Supabase dashboard → Authentication:

### Email/Password
1. Go to Providers
2. Email is enabled by default
3. Configure email templates if desired

### Google OAuth (Optional)
1. Go to Providers → Google
2. Enable it
3. Add OAuth Redirect URLs from your app
4. Paste your Google OAuth credentials

## 5. Create Storage Bucket (for avatars)

In Supabase dashboard → Storage:

1. Click "New Bucket"
2. Name it `avatars`
3. Set public access
4. Create

## 6. Update App Configuration

Once you have your credentials:

1. Update `.env.local` with real keys
2. In `/lib/appStore.ts`, update the data fetching to use real Supabase queries instead of mock data
3. Create `/app/api/` routes to handle database operations
4. Test authentication flow

## Testing

After setup:

1. Run `npm run dev`
2. Try creating an account
3. Log an entry
4. Check Supabase dashboard to see data appear

For troubleshooting, check Supabase docs: https://supabase.com/docs
