
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { setupRecruiter } from "@/utils/setupRecruiter";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isRecruiter: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isRecruiter: false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [setupComplete, setSetupComplete] = useState(false);

  // Handle sign out
  const signOut = async () => {
    console.log("Signing out user");
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsRecruiter(false);
    navigate("/login");
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  // Check user role and update state
  const checkUserRole = async (userId: string) => {
    try {
      console.log("Checking user role for userId:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error("Error fetching user role:", error);
        return false;
      }
      
      const isUserRecruiter = profile?.role === 'recruiter';
      console.log("User role check result:", isUserRecruiter ? "Recruiter" : "Candidate", "Role value:", profile?.role);
      setIsRecruiter(isUserRecruiter);
      return isUserRecruiter;
    } catch (error) {
      console.error("Unexpected error checking user role:", error);
      return false;
    }
  };

  // Set up recruiter once
  useEffect(() => {
    if (!setupComplete) {
      setupRecruiter().then(() => setSetupComplete(true));
    }
  }, [setupComplete]);

  useEffect(() => {
    // Set up auth state listener first
    console.log("Setting up auth state listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          setSession(currentSession);
          
          // Use setTimeout to avoid potential deadlocks in Supabase auth
          setTimeout(async () => {
            const isUserRecruiter = await checkUserRole(currentSession.user.id);
            
            // Only redirect on sign-in events, not for general auth state changes
            if (event === 'SIGNED_IN' && location.pathname === '/login') {
              const redirectPath = isUserRecruiter ? '/recruiter' : '/dashboard';
              console.log("Redirecting after sign in to:", redirectPath);
              navigate(redirectPath);
            }
            
          }, 0);
        } else {
          setUser(null);
          setSession(null);
          setIsRecruiter(false);
          setIsLoading(false);
        }
      }
    );

    // Check for initial session
    const initializeAuth = async () => {
      console.log("Initializing auth");
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession?.user) {
        console.log("Found existing session for:", currentSession.user.email);
        setUser(currentSession.user);
        setSession(currentSession);
        await checkUserRole(currentSession.user.id);
      } else {
        console.log("No existing session found");
      }
      
      setIsLoading(false);
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isRecruiter, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
