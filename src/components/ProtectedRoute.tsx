import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTeamAccess } from "@/hooks/useTeamAccess";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { hasTeamAccess, isLoading: teamLoading } = useTeamAccess();

  if (loading || teamLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!hasTeamAccess) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};