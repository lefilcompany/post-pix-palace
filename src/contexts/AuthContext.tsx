import { createContext, useContext, useEffect, useRef, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { teamService, Profile } from "@/services/teamService";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  profileReady: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileReady, setProfileReady] = useState(false);
  // The listener emits an INITIAL_SESSION event that can still carry a null
  // session. Ignoring it until getSession() resolves keeps the team check from
  // momentarily seeing "no user" and bouncing a hard-loaded protected page.
  const sessionResolved = useRef(false);

  const refreshProfile = async (currentUser?: User | null) => {
    const userToUse = currentUser || user;
    if (!userToUse) {
      setProfile(null);
      setProfileReady(true);
      return;
    }

    setProfileReady(false);
    try {
      const userProfile = await teamService.getUserProfile();
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setProfileReady(true);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "INITIAL_SESSION" && !session && !sessionResolved.current) {
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Fetch profile when user logs in
        if (session?.user) {
          refreshProfile(session.user);
        } else {
          setProfile(null);
          setProfileReady(true);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      sessionResolved.current = true;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        refreshProfile(session.user);
      } else {
        setProfileReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      toast.error("Erro ao criar conta: " + error.message);
    } else {
      toast.success("Conta criada com sucesso!");
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Erro ao fazer login: " + error.message);
    } else {
      toast.success("Login realizado com sucesso!");
    }

    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao fazer logout");
    } else {
      setProfile(null);
      setProfileReady(false);
      toast.success("Logout realizado com sucesso!");
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    profileReady,
    signUp,
    signIn,
    signOut,
    refreshProfile: () => refreshProfile(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
