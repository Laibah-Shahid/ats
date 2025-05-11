
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowUpRight, BarChart2, BriefcaseIcon, FileTextIcon, PlusIcon, TrendingUp, UserIcon, UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

const Dashboard = () => {
  const { isRecruiter } = useAuth();
  // Mock data for dashboard stats
  const stats = [
    { 
      title: "Jobs Applied", 
      value: 12, 
      change: "+33%", 
      status: "increase",
      icon: BriefcaseIcon
    },
    { 
      title: "Interviews", 
      value: 3, 
      change: "+50%", 
      status: "increase",
      icon: UsersIcon
    },
    { 
      title: "Profile Views", 
      value: 142, 
      change: "+24%", 
      status: "increase",
      icon: UserIcon
    },
    { 
      title: "Match Score", 
      value: "87%", 
      change: "+5%", 
      status: "increase",
      icon: TrendingUp
    },
  ];

  // Mock data for job recommendations
  const jobRecommendations = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "Remote",
      matchScore: 92,
      salary: "$120K - $150K",
      posted: "2 days ago",
      skills: ["React", "TypeScript", "NextJS", "TailwindCSS"]
    },
    {
      id: 2,
      title: "UI Developer",
      company: "InnovateTech",
      location: "San Francisco, CA",
      matchScore: 85,
      salary: "$110K - $140K",
      posted: "5 days ago",
      skills: ["React", "JavaScript", "CSS", "UI/UX"]
    },
    {
      id: 3,
      title: "Frontend Engineer",
      company: "WebSolutions",
      location: "New York, NY (Hybrid)",
      matchScore: 78,
      salary: "$100K - $130K",
      posted: "1 week ago",
      skills: ["JavaScript", "React", "Redux", "HTML/CSS"]
    },
  ];

  // Mock data for activity
  const recentActivity = [
    {
      id: 1,
      type: "application",
      job: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      date: "Today",
      status: "Submitted"
    },
    {
      id: 2,
      type: "interview",
      job: "UI Developer",
      company: "InnovateTech",
      date: "Tomorrow",
      status: "Scheduled"
    },
    {
      id: 3,
      type: "resume",
      action: "updated",
      date: "Yesterday",
      status: "Completed"
    },
    {
      id: 4,
      type: "application",
      job: "Frontend Engineer",
      company: "WebSolutions",
      date: "3 days ago",
      status: "In Review"
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your job search."
      >
      {!isRecruiter && (
          <Link to="/upload-resume" className="w-full">
          <Button  size="sm" className="gap-1">
            <PlusIcon className="h-4 w-4 mr-2" />
            <span>Quick Apply</span>
          </Button>
       </Link>
)}
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-jobaura-blue-light border-jobaura-blue">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <span className={`inline-flex items-center text-xs mt-1 ${
                    stat.status === "increase" ? "text-green-500" : "text-red-500"
                  }`}>
                    {stat.change}
                    {stat.status === "increase" ? (
                      <ArrowUpRight size={12} className="ml-1" />
                    ) : (
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    )}
                    <span className="text-gray-400 ml-1">from last month</span>
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-jobaura-black/50">
                  <stat.icon size={18} className="text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Recommendations */}
        <div className="lg:col-span-2">
          <Card className="bg-jobaura-blue-light border-jobaura-blue">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recommended Jobs</CardTitle>
                  <CardDescription>Based on your skills and preferences</CardDescription>
                </div>
                <Link to="/jobs">
                  <Button variant="ghost" size="sm" className="gap-1 text-sm">
                    View All
                    <ArrowUpRight size={14} />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobRecommendations.map((job) => (
                  <div 
                    key={job.id}
                    className="p-4 rounded-lg bg-jobaura-black/50 border border-border hover:border-primary/40 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">{job.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {job.company} • {job.location}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {job.skills.map((skill, index) => (
                            <span key={index} className="text-xs px-2 py-0.5 bg-jobaura-blue/70 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <span>{job.salary}</span>
                          <span className="mx-2">•</span>
                          <span>{job.posted}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium mr-2">Match:</span>
                          <span 
                            className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                              job.matchScore >= 90 
                                ? "bg-green-500/20 text-green-400" 
                                : job.matchScore >= 80 
                                ? "bg-primary/20 text-primary" 
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}
                          >
                            {job.matchScore}%
                          </span>
                        </div>
                        <Button size="sm" variant="outline" className="mt-2">Apply Now</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Section */}
        <div>
          <Card className="bg-jobaura-blue-light border-jobaura-blue">
            <CardHeader className="pb-2">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your job search activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div 
                    key={activity.id}
                    className="p-3 rounded-lg bg-jobaura-black/50 border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === "application" 
                          ? "bg-purple-500/20" 
                          : activity.type === "interview" 
                          ? "bg-blue-500/20" 
                          : "bg-green-500/20"
                      }`}>
                        {activity.type === "application" ? (
                          <FileTextIcon size={16} className="text-purple-400" />
                        ) : activity.type === "interview" ? (
                          <UsersIcon size={16} className="text-blue-400" />
                        ) : (
                          <FileTextIcon size={16} className="text-green-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            {activity.type === "application" && (
                              <p className="text-sm font-medium">
                                Applied to {activity.job}
                              </p>
                            )}
                            {activity.type === "interview" && (
                              <p className="text-sm font-medium">
                                Interview for {activity.job}
                              </p>
                            )}
                            {activity.type === "resume" && (
                              <p className="text-sm font-medium">
                                Resume {activity.action}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5">
                              {activity.company && `${activity.company} • `}
                              {activity.date}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            activity.status === "Submitted" || activity.status === "Completed"
                              ? "bg-primary/20 text-primary" 
                              : activity.status === "Scheduled"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <Button variant="ghost" size="sm" className="w-full text-sm">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skills Overview */}
          <Card className="bg-jobaura-blue-light border-jobaura-blue mt-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Skills Overview</CardTitle>
                  <CardDescription>Your top skills</CardDescription>
                </div>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-1 text-sm">
                    Edit
                    <ArrowUpRight size={14} />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>React</span>
                    <span>Expert</span>
                  </div>
                  <div className="h-2 w-full bg-jobaura-black/50 rounded-full overflow-hidden">
                    <div className="h-full w-[95%] bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>TypeScript</span>
                    <span>Advanced</span>
                  </div>
                  <div className="h-2 w-full bg-jobaura-black/50 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Next.js</span>
                    <span>Intermediate</span>
                  </div>
                  <div className="h-2 w-full bg-jobaura-black/50 rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Tailwind CSS</span>
                    <span>Advanced</span>
                  </div>
                  <div className="h-2 w-full bg-jobaura-black/50 rounded-full overflow-hidden">
                    <div className="h-full w-[80%] bg-gradient-to-r from-primary to-blue-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
