import { useAuth } from "@/contexts/AuthContext";

/**
 * Whether the signed-in user belongs to a team.
 *
 * Derived during render on purpose: computing `isLoading` inside an effect
 * leaves one render where the session has resolved but the profile has not,
 * and that frame briefly reports "no team" and bounces the user away.
 */
export const useTeamAccess = () => {
  const { user, profile, profileReady, loading } = useAuth();

  // A profile row is created for every account, so an unresolved lookup means
  // "still loading", not "no team".
  const isLoading = loading || (!!user && !profileReady);
  const hasTeamAccess = !!profile?.current_team_id;

  return { hasTeamAccess, isLoading };
};
