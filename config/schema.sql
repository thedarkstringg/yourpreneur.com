-- Yourpreneur Database Schema for Supabase

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  tier TEXT DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  avatar_url TEXT,
  bio TEXT
);

-- Ventures table
CREATE TABLE IF NOT EXISTS public.ventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'stealth', 'graveyard', 'pivot', 'paused', 'shutdown', 'exited', 'archived', 'acquired', 'failed'
  started_date DATE NOT NULL,
  ended_date DATE,
  logo_url TEXT,
  color TEXT,
  parent_id UUID REFERENCES public.ventures(id) ON DELETE SET NULL,
  branch_label TEXT,
  position_x DECIMAL,
  position_y DECIMAL,
  hardest_lesson TEXT,
  burn_rate INTEGER,
  runway_months INTEGER,
  collaborators TEXT[],
  health_score INTEGER,
  mrr_trend INTEGER[],
  last_synced_at TIMESTAMP,
  source TEXT DEFAULT 'manual', -- 'manual', 'notion', 'github', 'linear', 'stripe'
  timeline_side TEXT DEFAULT 'below', -- 'above', 'below'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venture_id UUID NOT NULL REFERENCES public.ventures(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'milestone', 'launch', 'funding', 'team', 'pivot', 'setback', 'exit', 'decision', 'lesson', 'feeling', 'other'
  title TEXT NOT NULL,
  notes TEXT,
  event_date DATE NOT NULL,
  link_url TEXT,
  mood TEXT, -- 'energized', 'uncertain', 'burned_out', 'focused', 'lost', 'proud', 'regretful'
  impact TEXT, -- 'low', 'medium', 'high', 'critical'
  was_planned BOOLEAN,
  trigger_type TEXT, -- 'internal', 'external', 'market', 'team', 'personal'
  lesson_learned TEXT,
  counterfactual TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venture_id UUID REFERENCES public.ventures(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  role TEXT, -- 'founder', 'ops', 'growth', 'product', 'finance'
  deadline DATE,
  notes TEXT,
  status TEXT DEFAULT 'todo', -- 'todo', 'doing', 'blocked', 'done'
  position_x DECIMAL,
  position_y DECIMAL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Task connections (dependencies)
CREATE TABLE IF NOT EXISTS public.task_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  to_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Integrations table
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'github', 'stripe', 'notion', 'linear'
  config JSONB,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Share links table
CREATE TABLE IF NOT EXISTS public.share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  venture_id UUID NOT NULL REFERENCES public.ventures(id) ON DELETE CASCADE,
  link_token TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'viewer', -- 'viewer', 'editor'
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ventures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own user record
CREATE POLICY "Users can view own user" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can only see their ventures
CREATE POLICY "Users can view own ventures" ON public.ventures
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ventures" ON public.ventures
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ventures" ON public.ventures
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ventures" ON public.ventures
  FOR DELETE USING (auth.uid() = user_id);

-- Users can see events for their ventures
CREATE POLICY "Users can view events for own ventures" ON public.events
  FOR SELECT USING (
    venture_id IN (
      SELECT id FROM public.ventures WHERE user_id = auth.uid()
    )
  );

-- Similar policies for tasks, connections, integrations, and share links...
