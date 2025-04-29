
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

type AuthGuardProps = {
  children: React.ReactNode;
  requireRecruiter?: boolean;
  allowUnauthorized?: boolean;
};

export const AuthGuard = ({ children, requireRecruiter = false, allowUnauthorized = false }: AuthGuardProps) => {
  const { user, isLoading, isRecruiter } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Only check auth when loading is complete
    if (!isLoading) {
      console.log("AuthGuard: Auth check complete", {
        user: !!user,
        isRecruiter,
        requireRecruiter,
        allowUnauthorized,
        path: window.location.pathname
      });

      if (!user && !allowUnauthorized) {
        console.log("AuthGuard: No user, redirecting to login");
        // Save the current location to redirect back after login
        const returnPath = location.pathname !== "/login" ? location.pathname : "/dashboard";
        navigate("/login", { state: { from: returnPath } });
        return;
      }

      // Handle recruiter access restrictions
      if (requireRecruiter && !isRecruiter) {
        console.log("AuthGuard: User is not a recruiter, redirecting to dashboard");
        toast({
          title: "Access Denied",
          description: "You need recruiter permissions to access this page.",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      // Special case for the recruiter page
      if (window.location.pathname === '/recruiter' && !isRecruiter) {
        console.log("AuthGuard: Non-recruiter trying to access recruiter page, redirecting to dashboard");
        navigate("/dashboard");
        return;
      }

      // Mark auth check as complete for rendering
      setAuthChecked(true);
    }
  }, [user, isLoading, isRecruiter, navigate, requireRecruiter, toast, location, allowUnauthorized]);

  // Show better loading state
  if (isLoading || (!authChecked && user)) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  // Render children if auth check is complete and user is authorized
  return (allowUnauthorized || (authChecked && user)) ? <>{children}</> : null;
};
