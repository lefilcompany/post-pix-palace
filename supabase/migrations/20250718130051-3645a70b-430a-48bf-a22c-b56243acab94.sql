-- Remove existing problematic policies
DROP POLICY IF EXISTS "Users can view team members of their teams" ON public.team_members;
DROP POLICY IF EXISTS "Team admins can manage team members" ON public.team_members;

-- Create security definer functions to avoid recursion
CREATE OR REPLACE FUNCTION public.user_is_team_member(_team_id bigint, _user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
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
AS $$
  SELECT current_team_id 
  FROM public.profiles 
  WHERE id = _user_id;
$$;

-- Create new safe policies for team_members
CREATE POLICY "Users can view team members of their current team"
ON public.team_members
FOR SELECT
USING (
  team_id = public.get_user_current_team_id(auth.uid())
  OR public.user_is_team_admin(team_id, auth.uid())
);

CREATE POLICY "Team admins can insert team members"
ON public.team_members
FOR INSERT
WITH CHECK (
  public.user_is_team_admin(team_id, auth.uid())
);

CREATE POLICY "Team admins can update team members"
ON public.team_members
FOR UPDATE
USING (
  public.user_is_team_admin(team_id, auth.uid())
);

CREATE POLICY "Team admins can delete team members"
ON public.team_members
FOR DELETE
USING (
  public.user_is_team_admin(team_id, auth.uid())
);

-- Ensure users can only be in one team at a time
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_team_member 
ON public.team_members (user_id) 
WHERE status = 'active';