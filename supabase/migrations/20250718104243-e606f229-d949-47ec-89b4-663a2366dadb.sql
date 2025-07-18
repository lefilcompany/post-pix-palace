-- Create tables for the social media content management system

-- Create brands table
CREATE TABLE public.brands (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  team_id BIGINT DEFAULT 0,
  influencers_action BIGINT DEFAULT 0,
  brand_manual BIGINT DEFAULT 0,
  is_deleted BIGINT DEFAULT 0,
  name TEXT NOT NULL,
  value_proposition TEXT,
  brand_pillars TEXT,
  brand_mission TEXT,
  brand_inspiration TEXT,
  target_audience TEXT,
  brand_personality TEXT,
  brand_voice TEXT,
  brand_competitors TEXT,
  brand_differentials TEXT,
  brand_promise TEXT,
  brand_crisis TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create themes table
CREATE TABLE public.themes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  voice_ai TEXT,
  hashtags TEXT[],
  objectives TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create personas table
CREATE TABLE public.personas (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  position_degree TEXT,
  location TEXT,
  main_objective TEXT,
  challenge TEXT,
  interests TEXT[],
  pain_points TEXT[],
  preferred_platforms TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contents table
CREATE TABLE public.contents (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  micro_result TEXT NOT NULL,
  main_message TEXT,
  feeling TEXT,
  format TEXT,
  image_url TEXT,
  next_step TEXT,
  response_ai TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for brands
CREATE POLICY "Users can view their own brands" ON public.brands
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brands" ON public.brands
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brands" ON public.brands
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brands" ON public.brands
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for themes
CREATE POLICY "Users can view their own themes" ON public.themes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own themes" ON public.themes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own themes" ON public.themes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own themes" ON public.themes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for personas
CREATE POLICY "Users can view their own personas" ON public.personas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own personas" ON public.personas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personas" ON public.personas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personas" ON public.personas
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for contents
CREATE POLICY "Users can view their own contents" ON public.contents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own contents" ON public.contents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own contents" ON public.contents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contents" ON public.contents
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_themes_updated_at
  BEFORE UPDATE ON public.themes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_personas_updated_at
  BEFORE UPDATE ON public.personas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contents_updated_at
  BEFORE UPDATE ON public.contents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();