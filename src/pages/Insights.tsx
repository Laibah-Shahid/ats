
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { AreaChart, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Area, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ArrowUpIcon, BarChart2Icon, ChartPieIcon, LineChartIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Insights = () => {
  const [timeframe, setTimeframe] = useState("month");
  const [jobSector, setJobSector] = useState("all");
  
  // Mock data for jobs by skill
  const skillData = [
    { name: "React", value: 120 },
    { name: "JavaScript", value: 95 },
    { name: "TypeScript", value: 85 },
    { name: "CSS/Tailwind", value: 75 },
    { name: "Node.js", value: 65 },
    { name: "Python", value: 45 }
  ];
  
  // Mock data for job trends over time
  const trendData = [
    { month: "Jan", applications: 105, interviews: 12, offers: 3 },
    { month: "Feb", applications: 125, interviews: 15, offers: 4 },
    { month: "Mar", applications: 110, interviews: 18, offers: 3 },
    { month: "Apr", applications: 90, interviews: 10, offers: 2 },
    { month: "May", applications: 115, interviews: 14, offers: 5 },
    { month: "Jun", applications: 130, interviews: 16, offers: 6 }
  ];
  
  // Mock data for job locations
  const locationData = [
    { name: "Remote", value: 65 },
    { name: "San Francisco", value: 35 },
    { name: "New York", value: 30 },
    { name: "Seattle", value: 25 },
    { name: "Austin", value: 20 },
    { name: "Other", value: 25 }
  ];
  
  // Mock data for experience level demand
  const experienceData = [
    { name: "Entry Level", value: 25 },
    { name: "Mid Level", value: 45 },
    { name: "Senior Level", value: 25 },
    { name: "Lead/Manager", value: 5 }
  ];
  
  // Colors for charts
  const COLORS = ["#7e22ce", "#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff", "#f3e8ff"];
  
  // Mock top skills data for candidates
  const topSkillsData = [
    { skill: "React", score: 85, category: "Technical" },
    { skill: "JavaScript", score: 92, category: "Technical" },
    { skill: "TypeScript", score: 78, category: "Technical" },
    { skill: "CSS", score: 88, category: "Technical" },
    { skill: "Problem Solving", score: 90, category: "Soft" },
    { skill: "Communication", score: 82, category: "Soft" }
  ];
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-jobaura-black/90 p-3 rounded-md border border-border shadow-md">
          <p className="text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout userType="recruiter">
      <PageHeader
        title="Analytics & Insights"
        description="Discover trends and patterns in job market data"
      >
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 3 months</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={jobSector} onValueChange={setJobSector}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Job Sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Job Listings Card */}
        <Card className="bg-jobaura-blue-light border-jobaura-blue">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Job Listings</p>
                <h3 className="text-2xl font-bold mt-1">1,248</h3>
                <span className="inline-flex items-center text-xs mt-1 text-green-500">
                  +12%
                  <ArrowUpIcon size={12} className="ml-1" />
                  <span className="text-gray-400 ml-1">from last month</span>
                </span>
              </div>
              <div className="p-2 rounded-lg bg-jobaura-black/50">
                <LineChartIcon size={18} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Avg. Applications Card */}
        <Card className="bg-jobaura-blue-light border-jobaura-blue">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">Avg. Applications per Job</p>
                <h3 className="text-2xl font-bold mt-1">24</h3>
                <span className="inline-flex items-center text-xs mt-1 text-green-500">
                  +8%
                  <ArrowUpIcon size={12} className="ml-1" />
                  <span className="text-gray-400 ml-1">from last month</span>
                </span>
              </div>
              <div className="p-2 rounded-lg bg-jobaura-black/50">
                <BarChart2Icon size={18} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time to Hire Card */}
        <Card className="bg-jobaura-blue-light border-jobaura-blue">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">Avg. Time to Hire</p>
                <h3 className="text-2xl font-bold mt-1">18 days</h3>
                <span className="inline-flex items-center text-xs mt-1 text-green-500">
                  -5%
                  <ArrowUpIcon size={12} className="ml-1" />
                  <span className="text-gray-400 ml-1">from last month</span>
                </span>
              </div>
              <div className="p-2 rounded-lg bg-jobaura-black/50">
                <LineChartIcon size={18} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Rate Card */}
        <Card className="bg-jobaura-blue-light border-jobaura-blue">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-400">AI Match Rate</p>
                <h3 className="text-2xl font-bold mt-1">92%</h3>
                <span className="inline-flex items-center text-xs mt-1 text-green-500">
                  +3%
                  <ArrowUpIcon size={12} className="ml-1" />
                  <span className="text-gray-400 ml-1">from last month</span>
                </span>
              </div>
              <div className="p-2 rounded-lg bg-jobaura-black/50">
                <ChartPieIcon size={18} className="text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="market" className="mb-6">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="market">Market Insights</TabsTrigger>
          <TabsTrigger value="candidate">Candidate Insights</TabsTrigger>
          <TabsTrigger value="company">Company Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="market" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Job Demand by Skill Chart */}
            <Card className="bg-jobaura-blue-light border-jobaura-blue">
              <CardHeader>
                <CardTitle>Job Demand by Skill</CardTitle>
                <CardDescription>
                  Most in-demand skills across job listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={skillData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
                      <XAxis type="number" stroke="#6b7280" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={80} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                        {skillData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Job Trends Chart */}
            <Card className="bg-jobaura-blue-light border-jobaura-blue">
              <CardHeader>
                <CardTitle>Job Market Activity</CardTitle>
                <CardDescription>
                  Applications, interviews, and offers over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7e22ce" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#7e22ce" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d8b4fe" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#d8b4fe" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="applications" 
                        stroke="#7e22ce" 
                        fillOpacity={1} 
                        fill="url(#colorApplications)" 
                        name="Applications"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="interviews" 
                        stroke="#a855f7" 
                        fillOpacity={1} 
                        fill="url(#colorInterviews)" 
                        name="Interviews"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="offers" 
                        stroke="#d8b4fe" 
                        fillOpacity={1} 
                        fill="url(#colorOffers)" 
                        name="Offers"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Distribution by Location */}
            <Card className="bg-jobaura-blue-light border-jobaura-blue">
              <CardHeader>
                <CardTitle>Job Distribution by Location</CardTitle>
                <CardDescription>Where jobs are concentrated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={locationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry, index) => <span className="text-xs text-gray-300">{value}</span>}
                      />
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Job Distribution by Experience Level */}
            <Card className="bg-jobaura-blue-light border-jobaura-blue">
              <CardHeader>
                <CardTitle>Demand by Experience Level</CardTitle>
                <CardDescription>
                  Job openings by experience requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={experienceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {experienceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry, index) => <span className="text-xs text-gray-300">{value}</span>}
                      />
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="candidate" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Skills of Successful Candidates */}
            <Card className="bg-jobaura-blue-light border-jobaura-blue">
              <CardHeader>
                <CardTitle>Top Skills of Successful Candidates</CardTitle>
                <CardDescription>
                  Skills that lead to successful job placements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topSkillsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
                      <XAxis type="number" stroke="#6b7280" fontSize={12} domain={[0, 100]} />
                      <YAxis dataKey="skill" type="category" stroke="#6b7280" fontSize={12} width={100} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="score" barSize={20} radius={[0, 4, 4, 0]}>
                        {topSkillsData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.category === "Technical" ? "#7e22ce" : "#a855f7"} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#7e22ce] mr-2"></div>
                    <span className="text-xs text-gray-300">Technical Skills</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-[#a855f7] mr-2"></div>
                    <span className="text-xs text-gray-300">Soft Skills</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Candidate Source Effectiveness */}
            <Card className="bg-jobaura-blue-light border-jobaura-blue">
              <CardHeader>
                <CardTitle>Candidate Source Effectiveness</CardTitle>
                <CardDescription>
                  Where successful candidates come from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Direct Applications", value: 45 },
                          { name: "LinkedIn", value: 25 },
                          { name: "Job Boards", value: 15 },
                          { name: "Referrals", value: 10 },
                          { name: "Other", value: 5 }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {locationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry, index) => <span className="text-xs text-gray-300">{value}</span>}
                      />
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="company" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hiring Efficiency */}
            <Card className="bg-jobaura-blue-light border-jobaura-blue">
              <CardHeader>
                <CardTitle>Hiring Efficiency</CardTitle>
                <CardDescription>
                  Key metrics by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Engineering", timeToHire: 16, costPerHire: 4500, retention: 92 },
                        { name: "Design", timeToHire: 14, costPerHire: 3800, retention: 88 },
                        { name: "Marketing", timeToHire: 12, costPerHire: 3200, retention: 85 },
                        { name: "Sales", timeToHire: 10, costPerHire: 3000, retention: 80 },
                        { name: "HR", timeToHire: 15, costPerHire: 3500, retention: 90 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        verticalAlign="top" 
                        height={36}
                        formatter={(value, entry, index) => <span className="text-xs text-gray-300">{value}</span>}
                      />
                      <Bar dataKey="timeToHire" fill="#7e22ce" name="Time to Hire (days)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="retention" fill="#c084fc" name="Retention %" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* AI Match Accuracy */}
            <Card className="bg-jobaura-blue-light border-jobaura-blue">
              <CardHeader>
                <CardTitle>AI Match Accuracy</CardTitle>
                <CardDescription>
                  Performance of AI matching algorithm
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { month: "Jan", accuracy: 82 },
                        { month: "Feb", accuracy: 85 },
                        { month: "Mar", accuracy: 87 },
                        { month: "Apr", accuracy: 90 },
                        { month: "May", accuracy: 91 },
                        { month: "Jun", accuracy: 92 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7e22ce" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#7e22ce" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} domain={[75, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="accuracy" 
                        stroke="#7e22ce" 
                        fillOpacity={1} 
                        fill="url(#colorAccuracy)" 
                        name="Match Accuracy %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Insights;
