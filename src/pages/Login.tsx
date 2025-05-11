
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/providers/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isRecruiter } = useAuth();

  // Get the return path from location state or use default
  const from = location.state?.from || '/dashboard';

  // Redirect if already logged in
  useEffect(() => {
    if (user && loginAttempted) {
      const redirectPath = isRecruiter ? '/recruiter' : from;
      console.log("Login page: User is logged in, redirecting to:", redirectPath);
      navigate(redirectPath, { replace: true });
    }
  }, [user, isRecruiter, navigate, loginAttempted, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginAttempted(true);

    try {
      console.log("Attempting login with:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      } else {
        toast({
          title: "Success",
          description: "Successfully logged in!",
        });
        // The redirect will be handled by the auth state change in AuthProvider
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Show tutorial for recruiter login
  const handleDemoLogin = () => {
    setEmail("laibah@gmail.com");
    setPassword("Ld098!@#");
    toast({
      title: "Demo credentials filled",
      description: "Click Sign In to log in as a recruiter",
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">JA</span>
              </div>
              <span className="text-2xl font-bold gradient-text">JobAura</span>
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-jobaura-blue/50"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-jobaura-blue/50 pr-10"
                  disabled={isLoading}
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember-me" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : "Sign In"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Use Recruiter Demo
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-gray-400">Don't have an account? </span>
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Background */}
      <div className="hidden md:block md:w-1/2 bg-jobaura-blue-light relative">
        <div className="absolute inset-0 bg-gradient-to-br from-jobaura-purple/30 via-transparent to-transparent"></div>
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Find your next career opportunity with AI precision</h2>
            <p className="text-gray-300 mb-6">
              JobAura uses artificial intelligence to match your skills and experience with the perfect job openings.
            </p>
            <div className="glass-effect p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-jobaura-purple/30 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">AI-Powered Job Matching</h3>
                  <p className="text-sm text-gray-400">Finds your perfect career fit</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-jobaura-purple/30 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Secure Resume Storage</h3>
                  <p className="text-sm text-gray-400">Your data is always protected</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-jobaura-purple/30 flex items-center justify-center mr-4">
                  <svg className="w-5 h-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Job Alerts</h3>
                  <p className="text-sm text-gray-400">Never miss an opportunity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
