import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CallToAction from "@/components/sections/CallToAction";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { 
  BadgeCheck, 
  BarChart3, 
  BriefcaseIcon, 
  CheckIcon, 
  FileTextIcon, 
  LightbulbIcon, 
  SearchIcon, 
  UsersIcon,
  Zap 
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-jobaura-purple/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
                AI-Powered Talent Matching
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Find Your <span className="gradient-text">Perfect Match</span> with JobAura
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Our AI-driven applicant tracking system analyzes resumes and job requirements to create perfect matches, saving time for both recruiters and job seekers.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started <ArrowRightIcon className="ml-2" />
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center md:justify-start mt-8 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <CheckIcon size={16} className="text-primary mr-2" />
                  No credit card required
                </span>
                <span className="mx-3">•</span>
                <span className="flex items-center">
                  <CheckIcon size={16} className="text-primary mr-2" />
                  Free for job seekers
                </span>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="rounded-lg overflow-hidden shadow-2xl card-shadow">
                <div className="relative w-full h-[400px] bg-jobaura-blue-light rounded-lg flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                  <div className="relative glass-effect p-6 rounded-lg w-[80%] animate-float">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-jobaura-purple/30 flex items-center justify-center mr-4">
                        <Zap size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">AI Resume Matching</h3>
                        <p className="text-sm text-gray-400">Powered by advanced algorithms</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-jobaura-black/50 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                      </div>
                      <div className="h-2 w-full bg-jobaura-black/50 rounded-full overflow-hidden">
                        <div className="h-full w-[68%] bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                      </div>
                      <div className="h-2 w-full bg-jobaura-black/50 rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-jobaura-black/30 rounded-md">
                      <p className="text-sm"><span className="text-primary font-medium">AI Analysis:</span> 92% match for Frontend Developer position at TechCorp</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-jobaura-purple/30 to-transparent rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-jobaura-blue-light/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Recruiting</h2>
            <p className="text-gray-300">JobAura combines AI technology with user-friendly design to transform how companies hire and how candidates find jobs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-jobaura-black/70 border border-border rounded-lg p-6 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FileTextIcon size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Resume Screening</h3>
              <p className="text-gray-400">Our AI analyzes resumes against job requirements to identify the best matches, saving recruiters countless hours.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-jobaura-black/70 border border-border rounded-lg p-6 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BriefcaseIcon size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Job Matching</h3>
              <p className="text-gray-400">Candidates receive personalized job recommendations based on their skills, experience, and career preferences.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-jobaura-black/70 border border-border rounded-lg p-6 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
              <p className="text-gray-400">Gain insights into hiring trends, high-demand skills, and applicant engagement with detailed analytics.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-jobaura-black/70 border border-border rounded-lg p-6 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BadgeCheck size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Skill Verification</h3>
              <p className="text-gray-400">Validate candidate skills with automated assessments tailored to specific job requirements.</p>
            </div>

            {/* Feature 5 */}
            <div className="bg-jobaura-black/70 border border-border rounded-lg p-6 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <UsersIcon size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Collaborative Hiring</h3>
              <p className="text-gray-400">Enable your entire team to review candidates, leave feedback, and make collaborative hiring decisions.</p>
            </div>

            {/* Feature 6 */}
            <div className="bg-jobaura-black/70 border border-border rounded-lg p-6 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <SearchIcon size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Search</h3>
              <p className="text-gray-400">Find the perfect candidate with powerful search filters across your entire talent pool.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How JobAura Works</h2>
            <p className="text-gray-300">Our AI-powered platform streamlines the recruitment process from job posting to hiring.</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-24 bottom-8 w-0.5 bg-gradient-to-b from-primary/80 via-primary/30 to-transparent"></div>
            
            <div className="space-y-16 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="md:pr-8">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                      <span className="mr-2">01</span>
                      <span>For Recruiters</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Post Jobs & Define Requirements</h3>
                    <p className="text-gray-300 mb-4">
                      Create detailed job postings with required skills, experience, and qualifications. Our AI helps you optimize job descriptions to attract the right candidates.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckIcon size={20} className="text-primary shrink-0 mr-2 mt-0.5" />
                        <span className="text-gray-300">AI suggestion for job requirement optimization</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon size={20} className="text-primary shrink-0 mr-2 mt-0.5" />
                        <span className="text-gray-300">Custom application forms with screening questions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon size={20} className="text-primary shrink-0 mr-2 mt-0.5" />
                        <span className="text-gray-300">Automated posting to multiple job boards</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2 flex justify-center">
                  <div className="bg-jobaura-blue-light border border-border rounded-lg p-4 w-full max-w-md">
                    <div className="rounded-md bg-jobaura-black/50 p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">Senior Frontend Developer</h4>
                          <p className="text-xs text-gray-400">TechCorp Inc. • Remote</p>
                        </div>
                        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">New</span>
                      </div>
                      <div className="mb-3">
                        <div className="text-xs font-medium mb-1.5 text-gray-300">Required Skills</div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-xs px-2 py-0.5 bg-jobaura-blue/70 rounded-full">React</span>
                          <span className="text-xs px-2 py-0.5 bg-jobaura-blue/70 rounded-full">TypeScript</span>
                          <span className="text-xs px-2 py-0.5 bg-jobaura-blue/70 rounded-full">NextJS</span>
                          <span className="text-xs px-2 py-0.5 bg-jobaura-blue/70 rounded-full">Tailwind CSS</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>$120K - $150K</span>
                        <span>Posted 2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <div className="bg-jobaura-blue-light border border-border rounded-lg p-4 w-full max-w-md mx-auto">
                    <div className="p-4 bg-jobaura-black/50 rounded-md">
                      <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-jobaura-purple/20 flex items-center justify-center">
                          <LightbulbIcon size={28} className="text-primary" />
                        </div>
                      </div>
                      <div className="text-sm text-center">
                        <p className="font-medium mb-2">AI-Resume Analysis in Progress</p>
                        <div className="h-2 w-full bg-jobaura-black/50 rounded-full overflow-hidden mb-3">
                          <div className="h-full w-[75%] bg-gradient-to-r from-primary to-blue-400 rounded-full animate-pulse-slow"></div>
                        </div>
                        <p className="text-gray-400 text-xs">Analyzing skills, experience and qualifications...</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="md:pl-8">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                      <span className="mr-2">02</span>
                      <span>For Job Seekers</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Upload Your Resume</h3>
                    <p className="text-gray-300 mb-4">
                      Simply upload your resume and our AI will analyze your skills, experience, and qualifications to match you with the most relevant job opportunities.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckIcon size={20} className="text-primary shrink-0 mr-2 mt-0.5" />
                        <span className="text-gray-300">Supports all common resume formats</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon size={20} className="text-primary shrink-0 mr-2 mt-0.5" />
                        <span className="text-gray-300">Instant skills and experience analysis</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon size={20} className="text-primary shrink-0 mr-2 mt-0.5" />
                        <span className="text-gray-300">Personalized improvement suggestions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 order-2 md:order-1">
                  <div className="md:pr-8">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                      <span className="mr-2">03</span>
                      <span>Perfect Matching</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">AI-Powered Matching</h3>
                    <p className="text-gray-300 mb-4">
                      Our advanced algorithms match candidates with job openings based on skills alignment, experience level, career goals, and company culture fit.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckIcon size={20} className="text-primary shrink-0 mr-2 mt-0.5" />
                        <span className="text-gray-300">95% accuracy in skills matching</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon size={20} className="text-primary shrink-0 mr-2 mt-0.5" />
                        <span className="text-gray-300">Considers both hard and soft skills</span>
                      </li>
                      <li className="flex items-start">
                        <CheckIcon size={20} className="text-primary shrink-0 mr-2 mt-0.5" />
                        <span className="text-gray-300">Continuous learning from hiring outcomes</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="md:w-1/2 order-1 md:order-2">
                  <div className="bg-jobaura-blue-light border border-border rounded-lg p-4 w-full max-w-md mx-auto">
                    <div className="flex flex-col space-y-3">
                      <div className="p-3 bg-jobaura-black/50 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Match Score: 92%</h4>
                          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Top Match</span>
                        </div>
                        <div className="h-2 w-full bg-jobaura-black/50 rounded-full overflow-hidden mb-3">
                          <div className="h-full w-[92%] bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Senior Frontend Developer at TechCorp Inc.
                        </div>
                      </div>
                      
                      <div className="p-3 bg-jobaura-black/50 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Match Score: 85%</h4>
                          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Good Match</span>
                        </div>
                        <div className="h-2 w-full bg-jobaura-black/50 rounded-full overflow-hidden mb-3">
                          <div className="h-full w-[85%] bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-400">
                          UI Developer at InnovateTech
                        </div>
                      </div>
                      
                      <div className="p-3 bg-jobaura-black/50 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">Match Score: 78%</h4>
                          <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">Partial Match</span>
                        </div>
                        <div className="h-2 w-full bg-jobaura-black/50 rounded-full overflow-hidden mb-3">
                          <div className="h-full w-[78%] bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Frontend Engineer at WebSolutions
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 bg-jobaura-blue-light/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent Pricing</h2>
            <p className="text-gray-300">Choose the plan that fits your hiring needs and scale as your team grows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-jobaura-black/70 border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Starter</h3>
                <p className="text-gray-400 mb-4">For small teams and startups</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Up to 5 active job postings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">AI resume screening</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Basic analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Email support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Get Started</Button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-jobaura-black/70 border-2 border-primary rounded-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Professional</h3>
                <p className="text-gray-400 mb-4">For growing companies</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Up to 15 active job postings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Advanced AI matching</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Full analytics dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Candidate skill assessments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Priority email & chat support</span>
                  </li>
                </ul>
                <Button className="w-full">Get Started</Button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-jobaura-black/70 border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                <p className="text-gray-400 mb-4">For large organizations</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Unlimited job postings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Advanced AI matching & screening</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Custom analytics & reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">API access</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">ATS integration</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={18} className="text-primary shrink-0 mr-2 mt-0.5" />
                    <span className="text-gray-300">Dedicated account manager</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CallToAction />

      <Footer />
    </div>
  );
};

export default Index;
