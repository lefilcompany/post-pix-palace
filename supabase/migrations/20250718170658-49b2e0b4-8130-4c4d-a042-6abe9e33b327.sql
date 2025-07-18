-- Create ENUMs for better type safety
CREATE TYPE public.user_role AS ENUM ('admin', 'member', 'viewer');
CREATE TYPE public.content_status AS ENUM ('draft', 'review', 'approved', 'published', 'archived');
CREATE TYPE public.content_type AS ENUM ('post', 'story', 'reel', 'video', 'carousel', 'article');
CREATE TYPE public.platform_type AS ENUM ('instagram', 'facebook', 'linkedin', 'twitter', 'tiktok', 'youtube');
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');
CREATE TYPE public.plan_type AS ENUM ('free', 'basic', 'premium', 'enterprise');

-- Update profiles table with additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS city_user TEXT,
ADD COLUMN IF NOT EXISTS state_user TEXT,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_deleted INTEGER DEFAULT 0;

-- Update teams table
ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS is_deleted INTEGER DEFAULT 0;

-- Update brands table with all new fields
ALTER TABLE public.brands 
ADD COLUMN IF NOT EXISTS value_proposition TEXT,
ADD COLUMN IF NOT EXISTS brand_pillars TEXT,
ADD COLUMN IF NOT EXISTS brand_mission TEXT,
ADD COLUMN IF NOT EXISTS brand_inspiration TEXT,
ADD COLUMN IF NOT EXISTS current_objective TEXT,
ADD COLUMN IF NOT EXISTS numeric_target TEXT,
ADD COLUMN IF NOT EXISTS restrictions TEXT,
ADD COLUMN IF NOT EXISTS brand_hashtags TEXT,
ADD COLUMN IF NOT EXISTS reference_contents TEXT,
ADD COLUMN IF NOT EXISTS important_dates TEXT,
ADD COLUMN IF NOT EXISTS relevant_content TEXT,
ADD COLUMN IF NOT EXISTS brand_crisis TEXT,
ADD COLUMN IF NOT EXISTS influencers_action INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS brand_manual INTEGER DEFAULT 0;

-- Update themes table
ALTER TABLE public.themes 
ADD COLUMN IF NOT EXISTS brand_id BIGINT REFERENCES public.brands(id),
ADD COLUMN IF NOT EXISTS colors TEXT,
ADD COLUMN IF NOT EXISTS universe_target TEXT,
ADD COLUMN IF NOT EXISTS add_info TEXT,
ADD COLUMN IF NOT EXISTS is_deleted INTEGER DEFAULT 0;

-- Update personas table with all new fields
ALTER TABLE public.personas 
ADD COLUMN IF NOT EXISTS brand_id BIGINT REFERENCES public.brands(id),
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS position_degree TEXT,
ADD COLUMN IF NOT EXISTS beliefs TEXT,
ADD COLUMN IF NOT EXISTS content_habit TEXT,
ADD COLUMN IF NOT EXISTS favorite_voice TEXT,
ADD COLUMN IF NOT EXISTS buy_journey TEXT,
ADD COLUMN IF NOT EXISTS interest_trigger TEXT,
ADD COLUMN IF NOT EXISTS is_deleted INTEGER DEFAULT 0;

-- Update contents table
ALTER TABLE public.contents 
ADD COLUMN IF NOT EXISTS persona_id BIGINT REFERENCES public.personas(id),
ADD COLUMN IF NOT EXISTS is_promote INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS visual_reference INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_deleted INTEGER DEFAULT 0;

-- Create plans table
CREATE TABLE IF NOT EXISTS public.plans (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    plan_type plan_type NOT NULL DEFAULT 'free',
    members_limit INTEGER NOT NULL DEFAULT 1,
    brands_limit INTEGER NOT NULL DEFAULT 1,
    themes_limit INTEGER NOT NULL DEFAULT 5,
    personas_limit INTEGER NOT NULL DEFAULT 3,
    content_limit INTEGER NOT NULL DEFAULT 10,
    planning_limit INTEGER NOT NULL DEFAULT 5,
    review_limit INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted INTEGER DEFAULT 0
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    plan_id BIGINT NOT NULL REFERENCES public.plans(id),
    team_id BIGINT NOT NULL REFERENCES public.teams(id),
    status subscription_status NOT NULL DEFAULT 'pending',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    stripe_subscription_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted INTEGER DEFAULT 0
);

-- Create planning table
CREATE TABLE IF NOT EXISTS public.planning (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    brand_id BIGINT NOT NULL REFERENCES public.brands(id),
    theme_id BIGINT NOT NULL REFERENCES public.themes(id),
    team_id BIGINT NOT NULL REFERENCES public.teams(id),
    platform TEXT NOT NULL,
    posts_number INTEGER NOT NULL DEFAULT 1,
    add_info TEXT,
    response_ai TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted INTEGER DEFAULT 0
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    brand_id BIGINT NOT NULL REFERENCES public.brands(id),
    team_id BIGINT NOT NULL REFERENCES public.teams(id),
    ia_text TEXT NOT NULL,
    response_ai TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted INTEGER DEFAULT 0
);

-- Create solicitations table (renamed from team_invitations for clarity)
CREATE TABLE IF NOT EXISTS public.solicitations (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    team_id BIGINT NOT NULL REFERENCES public.teams(id),
    status INTEGER DEFAULT 0, -- 0=pending, 1=accepted, 2=rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted INTEGER DEFAULT 0
);

-- Enable RLS on new tables
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for plans (public read)
CREATE POLICY "Plans are viewable by everyone" ON public.plans
    FOR SELECT USING (true);

-- Create RLS policies for subscriptions
CREATE POLICY "Team members can view team subscriptions" ON public.subscriptions
    FOR SELECT USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Team admins can manage team subscriptions" ON public.subscriptions
    FOR ALL USING (
        team_id IN (
            SELECT id FROM public.teams 
            WHERE admin_user_id = auth.uid()
        )
    );

-- Create RLS policies for planning
CREATE POLICY "Team members can view team planning" ON public.planning
    FOR SELECT USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Team members can create team planning" ON public.planning
    FOR INSERT WITH CHECK (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Team members can update team planning" ON public.planning
    FOR UPDATE USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Team members can delete team planning" ON public.planning
    FOR DELETE USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Create RLS policies for reviews
CREATE POLICY "Team members can view team reviews" ON public.reviews
    FOR SELECT USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Team members can create team reviews" ON public.reviews
    FOR INSERT WITH CHECK (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Team members can update team reviews" ON public.reviews
    FOR UPDATE USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Team members can delete team reviews" ON public.reviews
    FOR DELETE USING (
        team_id IN (
            SELECT team_id FROM public.team_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

-- Create RLS policies for solicitations
CREATE POLICY "Users can view their own solicitations" ON public.solicitations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own solicitations" ON public.solicitations
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Team admins can view team solicitations" ON public.solicitations
    FOR SELECT USING (
        team_id IN (
            SELECT id FROM public.teams 
            WHERE admin_user_id = auth.uid()
        )
    );

CREATE POLICY "Team admins can update team solicitations" ON public.solicitations
    FOR UPDATE USING (
        team_id IN (
            SELECT id FROM public.teams 
            WHERE admin_user_id = auth.uid()
        )
    );

-- Add some default plans
INSERT INTO public.plans (name, price, plan_type, members_limit, brands_limit, themes_limit, personas_limit, content_limit, planning_limit, review_limit)
VALUES 
    ('Free', 0.00, 'free', 1, 1, 3, 2, 5, 2, 2),
    ('Basic', 29.99, 'basic', 3, 3, 10, 5, 25, 10, 10),
    ('Premium', 79.99, 'premium', 10, 10, 50, 20, 100, 50, 50),
    ('Enterprise', 199.99, 'enterprise', 50, 50, 200, 100, 500, 200, 200);

-- Create updated_at triggers for new tables
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_planning_updated_at
    BEFORE UPDATE ON public.planning
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_solicitations_updated_at
    BEFORE UPDATE ON public.solicitations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
    BEFORE UPDATE ON public.plans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();