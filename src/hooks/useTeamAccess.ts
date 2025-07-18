import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { teamService } from "@/services/teamService";

export const useTeamAccess = () => {
  const { user, profile } = useAuth();
  const [hasTeamAccess, setHasTeamAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkTeamAccess = async () => {
      if (!user || !profile) {
        setHasTeamAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        // User has team access if they have a current_team_id
        setHasTeamAccess(!!profile.current_team_id);
      } catch (error) {
        console.error("Error checking team access:", error);
        setHasTeamAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTeamAccess();
  }, [user, profile]);

  return { hasTeamAccess, isLoading };
};