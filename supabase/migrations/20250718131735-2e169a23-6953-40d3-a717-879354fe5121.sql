-- Fix security definer functions with proper search_path
CREATE OR REPLACE FUNCTION public.user_is_team_member(_team_id bigint, _user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.team_members 
    WHERE team_id = _team_id 
      AND user_id = _user_id 
      AND status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.user_is_team_admin(_team_id bigint, _user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.teams 
    WHERE id = _team_id 
      AND admin_user_id = _user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_current_team_id(_user_id uuid)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT current_team_id 
  FROM public.profiles 
  WHERE id = _user_id;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Update all RLS policies to be more secure and restrict to authenticated users

-- Brands table
DROP POLICY IF EXISTS "Team members can view team brands" ON public.brands;
DROP POLICY IF EXISTS "Team members can create team brands" ON public.brands;
DROP POLICY IF EXISTS "Team members can update team brands" ON public.brands;
DROP POLICY IF EXISTS "Team members can delete team brands" ON public.brands;

CREATE POLICY "Team members can view team brands" ON public.brands
FOR SELECT TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can create team brands" ON public.brands
FOR INSERT TO authenticated
WITH CHECK (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can update team brands" ON public.brands
FOR UPDATE TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can delete team brands" ON public.brands
FOR DELETE TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

-- Personas table
DROP POLICY IF EXISTS "Users can view their own personas" ON public.personas;
DROP POLICY IF EXISTS "Users can create their own personas" ON public.personas;
DROP POLICY IF EXISTS "Users can update their own personas" ON public.personas;
DROP POLICY IF EXISTS "Users can delete their own personas" ON public.personas;

CREATE POLICY "Users can view their own personas" ON public.personas
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own personas" ON public.personas
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personas" ON public.personas
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personas" ON public.personas
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Profiles table
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- Themes table
DROP POLICY IF EXISTS "Team members can view team themes" ON public.themes;
DROP POLICY IF EXISTS "Team members can create team themes" ON public.themes;
DROP POLICY IF EXISTS "Team members can update team themes" ON public.themes;
DROP POLICY IF EXISTS "Team members can delete team themes" ON public.themes;

CREATE POLICY "Team members can view team themes" ON public.themes
FOR SELECT TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can create team themes" ON public.themes
FOR INSERT TO authenticated
WITH CHECK (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can update team themes" ON public.themes
FOR UPDATE TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can delete team themes" ON public.themes
FOR DELETE TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

-- Contents table
DROP POLICY IF EXISTS "Team members can view team contents" ON public.contents;
DROP POLICY IF EXISTS "Team members can create team contents" ON public.contents;
DROP POLICY IF EXISTS "Team members can update team contents" ON public.contents;
DROP POLICY IF EXISTS "Team members can delete team contents" ON public.contents;

CREATE POLICY "Team members can view team contents" ON public.contents
FOR SELECT TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can create team contents" ON public.contents
FOR INSERT TO authenticated
WITH CHECK (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can update team contents" ON public.contents
FOR UPDATE TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can delete team contents" ON public.contents
FOR DELETE TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

-- Content plans table
DROP POLICY IF EXISTS "Team members can view team content plans" ON public.content_plans;
DROP POLICY IF EXISTS "Team members can create team content plans" ON public.content_plans;
DROP POLICY IF EXISTS "Team members can update team content plans" ON public.content_plans;
DROP POLICY IF EXISTS "Team members can delete team content plans" ON public.content_plans;

CREATE POLICY "Team members can view team content plans" ON public.content_plans
FOR SELECT TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can create team content plans" ON public.content_plans
FOR INSERT TO authenticated
WITH CHECK (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can update team content plans" ON public.content_plans
FOR UPDATE TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can delete team content plans" ON public.content_plans
FOR DELETE TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

-- Content reviews table
DROP POLICY IF EXISTS "Team members can view team content reviews" ON public.content_reviews;
DROP POLICY IF EXISTS "Team members can create team content reviews" ON public.content_reviews;
DROP POLICY IF EXISTS "Team members can update team content reviews" ON public.content_reviews;
DROP POLICY IF EXISTS "Team members can delete team content reviews" ON public.content_reviews;

CREATE POLICY "Team members can view team content reviews" ON public.content_reviews
FOR SELECT TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can create team content reviews" ON public.content_reviews
FOR INSERT TO authenticated
WITH CHECK (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can update team content reviews" ON public.content_reviews
FOR UPDATE TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

CREATE POLICY "Team members can delete team content reviews" ON public.content_reviews
FOR DELETE TO authenticated
USING (team_id IN (
  SELECT team_members.team_id
  FROM public.team_members
  WHERE team_members.user_id = auth.uid() 
    AND team_members.status = 'active'
));

-- Teams table
DROP POLICY IF EXISTS "Users can view teams they belong to" ON public.teams;
DROP POLICY IF EXISTS "Users can create teams" ON public.teams;
DROP POLICY IF EXISTS "Team admins can update their teams" ON public.teams;
DROP POLICY IF EXISTS "Team admins can delete their teams" ON public.teams;

CREATE POLICY "Users can view teams they belong to" ON public.teams
FOR SELECT TO authenticated
USING (
  auth.uid() = admin_user_id 
  OR auth.uid() IN (
    SELECT team_members.user_id
    FROM public.team_members
    WHERE team_members.team_id = teams.id 
      AND team_members.status = 'active'
  )
);

CREATE POLICY "Users can create teams" ON public.teams
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = admin_user_id);

CREATE POLICY "Team admins can update their teams" ON public.teams
FOR UPDATE TO authenticated
USING (auth.uid() = admin_user_id);

CREATE POLICY "Team admins can delete their teams" ON public.teams
FOR DELETE TO authenticated
USING (auth.uid() = admin_user_id);

-- Team invitations table
DROP POLICY IF EXISTS "Users can view their own invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can create invitations for themselves" ON public.team_invitations;
DROP POLICY IF EXISTS "Team admins can view and manage invitations to their teams" ON public.team_invitations;

CREATE POLICY "Users can view their own invitations" ON public.team_invitations
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create invitations for themselves" ON public.team_invitations
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Team admins can view and manage invitations to their teams" ON public.team_invitations
FOR ALL TO authenticated
USING (auth.uid() IN (
  SELECT teams.admin_user_id
  FROM public.teams
  WHERE teams.id = team_invitations.team_id
));

-- Team members table
DROP POLICY IF EXISTS "Users can view team members of their current team" ON public.team_members;
DROP POLICY IF EXISTS "Team admins can insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Team admins can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Team admins can delete team members" ON public.team_members;

CREATE POLICY "Users can view team members of their current team" ON public.team_members
FOR SELECT TO authenticated
USING (
  team_id = public.get_user_current_team_id(auth.uid())
  OR public.user_is_team_admin(team_id, auth.uid())
);

CREATE POLICY "Team admins can insert team members" ON public.team_members
FOR INSERT TO authenticated
WITH CHECK (public.user_is_team_admin(team_id, auth.uid()));

CREATE POLICY "Team admins can update team members" ON public.team_members
FOR UPDATE TO authenticated
USING (public.user_is_team_admin(team_id, auth.uid()));

CREATE POLICY "Team admins can delete team members" ON public.team_members
FOR DELETE TO authenticated
USING (public.user_is_team_admin(team_id, auth.uid()));