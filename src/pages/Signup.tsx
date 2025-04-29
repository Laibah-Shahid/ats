
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOff, CheckIcon, XIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("candidate");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: accountType,
            full_name: name
          },
        },
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  
  const passwordStrength = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar
  ].filter(Boolean).length;

  const getPasswordStrengthClass = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
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
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-gray-400">Join JobAura to find your perfect career match</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-jobaura-blue/50"
              />
            </div>

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
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-jobaura-blue/50 pr-10"
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
              
              {/* Password strength meter */}
              {password && (
                <div className="mt-2 space-y-2">
                  <div className="h-1.5 w-full bg-jobaura-black rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getPasswordStrengthClass()}`} 
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="space-y-1 text-xs">
                    <li className="flex items-center">
                      {hasMinLength ? 
                        <CheckIcon size={14} className="text-green-500 mr-2" /> : 
                        <XIcon size={14} className="text-red-500 mr-2" />
                      }
                      <span className={hasMinLength ? "text-green-500" : "text-gray-400"}>
                        At least 8 characters
                      </span>
                    </li>
                    <li className="flex items-center">
                      {hasUppercase && hasLowercase ? 
                        <CheckIcon size={14} className="text-green-500 mr-2" /> : 
                        <XIcon size={14} className="text-red-500 mr-2" />
                      }
                      <span className={hasUppercase && hasLowercase ? "text-green-500" : "text-gray-400"}>
                        Uppercase and lowercase letters
                      </span>
                    </li>
                    <li className="flex items-center">
                      {hasNumber ? 
                        <CheckIcon size={14} className="text-green-500 mr-2" /> : 
                        <XIcon size={14} className="text-red-500 mr-2" />
                      }
                      <span className={hasNumber ? "text-green-500" : "text-gray-400"}>
                        At least one number
                      </span>
                    </li>
                    <li className="flex items-center">
                      {hasSpecialChar ? 
                        <CheckIcon size={14} className="text-green-500 mr-2" /> : 
                        <XIcon size={14} className="text-red-500 mr-2" />
                      }
                      <span className={hasSpecialChar ? "text-green-500" : "text-gray-400"}>
                        At least one special character
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Account Type</Label>
              <RadioGroup 
                value={accountType} 
                onValueChange={setAccountType}
                className="grid grid-cols-2 gap-4"
              >
                <div className={`p-4 rounded-lg border transition-colors ${
                  accountType === "candidate" 
                    ? "border-primary bg-primary/10" 
                    : "border-gray-700 bg-jobaura-blue/50"
                }`}>
                  <RadioGroupItem 
                    value="candidate" 
                    id="candidate" 
                    className="sr-only" 
                  />
                  <Label 
                    htmlFor="candidate" 
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <svg 
                      className="w-6 h-6 mb-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                    <span className="font-medium text-sm">Job Seeker</span>
                    <span className="text-xs text-gray-400">Find opportunities</span>
                  </Label>
                </div>
                
                <div className={`p-4 rounded-lg border transition-colors ${
                  accountType === "recruiter" 
                    ? "border-primary bg-primary/10" 
                    : "border-gray-700 bg-jobaura-blue/50"
                }`}>
                  <RadioGroupItem 
                    value="recruiter" 
                    id="recruiter" 
                    className="sr-only" 
                  />
                  <Label 
                    htmlFor="recruiter" 
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <svg 
                      className="w-6 h-6 mb-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                    <span className="font-medium text-sm">Recruiter</span>
                    <span className="text-xs text-gray-400">Hire talent</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                disabled={isLoading}
                required
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the Terms of Service and Privacy Policy
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-gray-400">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Background */}
      <div className="hidden md:block md:w-1/2 bg-jobaura-blue-light relative">
        <div className="absolute inset-0 bg-gradient-to-bl from-jobaura-purple/30 via-transparent to-transparent"></div>
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Start your journey with JobAura</h2>
            <p className="text-gray-300 mb-6">
              Join thousands of professionals who have found their dream job with our AI-powered platform.
            </p>
            <div className="glass-effect p-6 rounded-lg">
              <div className="mb-6">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-jobaura-purple/30">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Why join JobAura?</h3>
                <p className="text-gray-400 text-sm">
                  Our AI doesn't just match keywords—it understands your career goals and finds opportunities that align with your unique skills and aspirations.
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-300">Access to thousands of curated job opportunities</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-300">AI-powered resume optimization suggestions</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-300">Interview preparation tools and guidance</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-300">Career growth insights tailored to your profile</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
