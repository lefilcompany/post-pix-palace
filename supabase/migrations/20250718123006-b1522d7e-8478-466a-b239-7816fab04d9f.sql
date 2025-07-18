-- Create content_plans table for planning content publication
CREATE TABLE public.content_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  team_id BIGINT REFERENCES public.teams(id),
  brand_id BIGINT REFERENCES public.brands(id),
  theme_id BIGINT REFERENCES public.themes(id),
  title TEXT NOT NULL,
  description TEXT,
  target_audience TEXT,
  post_count INTEGER,
  platforms TEXT[] DEFAULT '{}',
  frequency TEXT, -- daily, weekly, monthly
  duration_days INTEGER,
  content_types TEXT[] DEFAULT '{}', -- image, video, text, carousel
  objectives TEXT[] DEFAULT '{}',
  ai_suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content_reviews table for reviewing content
CREATE TABLE public.content_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  team_id BIGINT REFERENCES public.teams(id),
  brand_id BIGINT REFERENCES public.brands(id),
  theme_id BIGINT REFERENCES public.themes(id),
  content_text TEXT,
  content_image_url TEXT,
  content_video_url TEXT,
  review_type TEXT NOT NULL, -- 'pre_publish', 'improvement', 'engagement'
  positive_points TEXT,
  negative_points TEXT,
  improvement_suggestions TEXT,
  engagement_tips TEXT,
  overall_score INTEGER, -- 1-10 scale
  ai_analysis TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new fields to contents table for better organization
ALTER TABLE public.contents 
ADD COLUMN brand_id BIGINT REFERENCES public.brands(id),
ADD COLUMN theme_id BIGINT REFERENCES public.themes(id),
ADD COLUMN plan_id UUID REFERENCES public.content_plans(id),
ADD COLUMN content_type TEXT DEFAULT 'post', -- 'post', 'story', 'reel', 'carousel'
ADD COLUMN platform TEXT, -- 'instagram', 'facebook', 'twitter', 'linkedin'
ADD COLUMN status TEXT DEFAULT 'draft', -- 'draft', 'review', 'approved', 'published'
ADD COLUMN scheduled_for TIMESTAMP WITH TIME ZONE;

-- Enable RLS on new tables
ALTER TABLE public.content_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for content_plans
CREATE POLICY "Team members can view team content plans" 
ON public.content_plans 
FOR SELECT 
USING (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

CREATE POLICY "Team members can create team content plans" 
ON public.content_plans 
FOR INSERT 
WITH CHECK (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

CREATE POLICY "Team members can update team content plans" 
ON public.content_plans 
FOR UPDATE 
USING (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

CREATE POLICY "Team members can delete team content plans" 
ON public.content_plans 
FOR DELETE 
USING (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

-- Create RLS policies for content_reviews
CREATE POLICY "Team members can view team content reviews" 
ON public.content_reviews 
FOR SELECT 
USING (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

CREATE POLICY "Team members can create team content reviews" 
ON public.content_reviews 
FOR INSERT 
WITH CHECK (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

CREATE POLICY "Team members can update team content reviews" 
ON public.content_reviews 
FOR UPDATE 
USING (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

CREATE POLICY "Team members can delete team content reviews" 
ON public.content_reviews 
FOR DELETE 
USING (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

-- Update RLS policies for contents table to include team-based access
DROP POLICY "Users can view their own contents" ON public.contents;
DROP POLICY "Users can create their own contents" ON public.contents;
DROP POLICY "Users can update their own contents" ON public.contents;
DROP POLICY "Users can delete their own contents" ON public.contents;

CREATE POLICY "Team members can view team contents" 
ON public.contents 
FOR SELECT 
USING (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

CREATE POLICY "Team members can create team contents" 
ON public.contents 
FOR INSERT 
WITH CHECK (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

CREATE POLICY "Team members can update team contents" 
ON public.contents 
FOR UPDATE 
USING (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

CREATE POLICY "Team members can delete team contents" 
ON public.contents 
FOR DELETE 
USING (team_id IN ( 
  SELECT team_members.team_id
  FROM team_members
  WHERE ((team_members.user_id = auth.uid()) AND (team_members.status = 'active'::text))
));

-- Create triggers for updated_at
CREATE TRIGGER update_content_plans_updated_at
  BEFORE UPDATE ON public.content_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_reviews_updated_at
  BEFORE UPDATE ON public.content_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();