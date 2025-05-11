import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowUpDown, FilterIcon, SearchIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { JobFilters } from "@/components/jobs/JobFilters";
import { JobList } from "@/components/jobs/JobList";
import { JobDetails } from "@/components/jobs/JobDetails";
import { Job } from "@/types/job";
import { XIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { transformDbJobToJob } from "@/utils/jobUtils";

// Helper function to calculate days between dates
const getDaysBetween = (date1: Date, date2: Date = new Date()): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to format days ago
const formatDaysAgo = (days: number): string => {
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

const Jobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Filter states
  const [salaryRange, setSalaryRange] = useState<[number, number]>([50000, 200000]);
  const [locationTypes, setLocationTypes] = useState<Record<string, boolean>>({
    Remote: false,
    Hybrid: false,
    Onsite: false
  });
  const [experienceLevels, setExperienceLevels] = useState<Record<string, boolean>>({
    Entry: false,
    Mid: false,
    Senior: false,
    Lead: false
  });
  const [employmentTypes, setEmploymentTypes] = useState<Record<string, boolean>>({
    "Full-time": false,
    "Part-time": false,
    Contract: false,
    Internship: false
  });
  const [datePosted, setDatePosted] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("matchScore");

  // Load jobs from Supabase
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('jobs')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          // Transform database jobs to frontend job model with real match scores
          const transformPromises = data.map(job => transformDbJobToJob(job, user?.id));
          const transformedJobs = await Promise.all(transformPromises);
          
          setAllJobs(transformedJobs);
          setJobs(transformedJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job listings.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

    // Set up realtime subscription for job updates
    const jobsChannel = supabase
      .channel('public:jobs')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'jobs' 
      }, payload => {
        console.log('Job change received:', payload);
        if (payload.eventType === 'INSERT') {
          // Add new job to the list
          const processNewJob = async () => {
            const newJob = await transformDbJobToJob(payload.new, user?.id);
            setAllJobs(prevJobs => [newJob, ...prevJobs]);
            setJobs(prevJobs => [newJob, ...prevJobs]);
          };
          
          processNewJob();
          
          toast({
            title: 'New Job Posted',
            description: `${payload.new.title} at ${payload.new.company} is now available.`
          });
        }
      })
      .subscribe();

    // Set up realtime subscription for match updates
    const matchesChannel = supabase
      .channel('public:job_resume_matches')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'job_resume_matches'
      }, payload => {
        console.log('Match update received:', payload);
        if (user && (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE')) {
          // Check if this match is for the current user
          const updateUserMatches = async () => {
            const { data: userResumes } = await supabase
              .from('resumes')
              .select('id')
              .eq('user_id', user.id);
            
            if (userResumes && userResumes.length > 0) {
              const userResumeIds = userResumes.map(r => r.id);
              
              if (userResumeIds.includes(payload.new.resume_id)) {
                // Update the job's match score in our state
                setAllJobs(prevJobs => 
                  prevJobs.map(job => 
                    job.id === payload.new.job_id 
                      ? { 
                          ...job, 
                          matchScore: payload.new.match_percentage,
                          matchExplanation: payload.new.match_explanation 
                        } 
                      : job
                  )
                );
                
                setJobs(prevJobs => 
                  prevJobs.map(job => 
                    job.id === payload.new.job_id 
                      ? { 
                          ...job, 
                          matchScore: payload.new.match_percentage,
                          matchExplanation: payload.new.match_explanation 
                        } 
                      : job
                  )
                );
                
                // Also update the selected job if it's the one that got updated
                if (selectedJob && selectedJob.id === payload.new.job_id) {
                  setSelectedJob({
                    ...selectedJob,
                    matchScore: payload.new.match_percentage,
                    matchExplanation: payload.new.match_explanation
                  });
                }
              }
            }
          };
          
          updateUserMatches();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(matchesChannel);
    };
  }, [toast, user]);

  // Handler functions
  const handleFiltersChange = (key: string, value: any) => {
    switch (key) {
      case 'salaryRange':
        setSalaryRange(value);
        break;
      case 'locationTypes':
        setLocationTypes(value);
        break;
      case 'experienceLevels':
        setExperienceLevels(value);
        break;
      case 'employmentTypes':
        setEmploymentTypes(value);
        break;
      case 'datePosted':
        setDatePosted(value);
        break;
    }
  };

  // Filter functions
  const applyFilters = () => {
    let filteredJobs = [...allJobs];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(term) || 
        job.company.toLowerCase().includes(term) ||
        job.skills.some(skill => skill.toLowerCase().includes(term))
      );
    }
    
    // Apply salary range filter
    filteredJobs = filteredJobs.filter(job => 
      job.salaryRange[0] <= salaryRange[1] && job.salaryRange[1] >= salaryRange[0]
    );
    
    // Apply location type filter
    const selectedLocationTypes = Object.entries(locationTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);
      
    if (selectedLocationTypes.length > 0) {
      filteredJobs = filteredJobs.filter(job => selectedLocationTypes.includes(job.locationType));
    }
    
    // Apply experience level filter
    const selectedExperienceLevels = Object.entries(experienceLevels)
      .filter(([_, isSelected]) => isSelected)
      .map(([level]) => level);
      
    if (selectedExperienceLevels.length > 0) {
      filteredJobs = filteredJobs.filter(job => selectedExperienceLevels.includes(job.experienceLevel));
    }
    
    // Apply employment type filter
    const selectedEmploymentTypes = Object.entries(employmentTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type);
      
    if (selectedEmploymentTypes.length > 0) {
      filteredJobs = filteredJobs.filter(job => selectedEmploymentTypes.includes(job.employmentType));
    }
    
    // Apply date posted filter
    if (datePosted) {
      let daysAgo = 0;
      switch (datePosted) {
        case "today":
          daysAgo = 1;
          break;
        case "week":
          daysAgo = 7;
          break;
        case "month":
          daysAgo = 30;
          break;
      }
      
      if (daysAgo > 0) {
        filteredJobs = filteredJobs.filter(job => job.postedDays <= daysAgo);
      }
    }
    
    // Apply sorting
    filteredJobs.sort((a, b) => {
      switch (sortBy) {
        case "matchScore":
          return b.matchScore - a.matchScore;
        case "datePosted":
          return a.postedDays - b.postedDays;
        case "salary":
          return b.salaryRange[1] - a.salaryRange[1];
        default:
          return b.matchScore - a.matchScore;
      }
    });
    
    setJobs(filteredJobs);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSalaryRange([50000, 200000]);
    setLocationTypes({
      Remote: false,
      Hybrid: false,
      Onsite: false
    });
    setExperienceLevels({
      Entry: false,
      Mid: false,
      Senior: false,
      Lead: false
    });
    setEmploymentTypes({
      "Full-time": false,
      "Part-time": false,
      Contract: false,
      Internship: false
    });
    setDatePosted(null);
    setSortBy("matchScore");
    setJobs(allJobs);
  };

  // Toggle job favorite status
  const toggleFavorite = (id: number | string) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, isFavorite: !job.isFavorite } : job
    ));
    
    setAllJobs(allJobs.map(job => 
      job.id === id ? { ...job, isFavorite: !job.isFavorite } : job
    ));
    
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob({ ...selectedJob, isFavorite: !selectedJob.isFavorite });
    }
  };

  // Apply to job
  const applyToJob = (id: number | string) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, isApplied: true } : job
    ));
    
    setAllJobs(allJobs.map(job => 
      job.id === id ? { ...job, isApplied: true } : job
    ));
    
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob({ ...selectedJob, isApplied: true });
    }
    
    toast({
      title: "Application Submitted",
      description: "Your job application has been submitted successfully!"
    });
  };

  // Handle job click to view details - with real-time matching
  const handleJobClick = async (job: Job) => {
    setSelectedJob(job);
    
    // If the user is logged in, trigger a match operation in the background
    // This ensures the match score is updated when the user views a job
    if (user && user.id) {
      try {
        // Find the user's resume
        const { data: userResumes } = await supabase
          .from('resumes')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);
        
        if (userResumes && userResumes.length > 0) {
          const resumeId = userResumes[0].id;
          
          // Call the edge function to update the match
          const { data, error } = await supabase.functions.invoke("match-resume", {
            body: { jobId: job.id },
          });
          
          if (error) {
            console.error('Error updating match score:', error);
          } else if (data && data.results) {
            // Find the result for the current user's resume
            const userMatch = data.results.find((result: any) => result.id === resumeId);
            
            if (userMatch) {
              // Update the selected job with the new match score
              setSelectedJob({
                ...job,
                matchScore: userMatch.matchPercentage,
                matchExplanation: userMatch.matchExplanation
              });
            }
          }
        }
      } catch (error) {
        console.error('Error processing job match:', error);
      }
    }
  };

  // Format salary for display
  const formatSalary = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Job Listings"
        description="Find your next career opportunity"
      >
        {/* <Button 
          size="sm" 
          variant="outline" 
          className="gap-1"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FilterIcon size={16} />
          <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
        </Button> */}
      </PageHeader>

      {/* Search and Sort */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search jobs by title, company, or skills..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto gap-1">
                <ArrowUpDown size={16} />
                Sort: {sortBy === "matchScore" ? "Best Match" : sortBy === "datePosted" ? "Most Recent" : "Highest Salary"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {setSortBy("matchScore"); applyFilters();}}>
                Best Match
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {setSortBy("datePosted"); applyFilters();}}>
                Most Recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {setSortBy("salary"); applyFilters();}}>
                Highest Salary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={applyFilters}>Search</Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <JobFilters
            filters={{
              searchTerm,
              salaryRange,
              locationTypes,
              experienceLevels,
              employmentTypes,
              datePosted
            }}
            onFiltersChange={handleFiltersChange}
            onApplyFilters={applyFilters}
            onResetFilters={resetFilters}
          />
        )}

        {/* Active Filters */}
        {(Object.values(locationTypes).some(Boolean) || 
         Object.values(experienceLevels).some(Boolean) ||
         Object.values(employmentTypes).some(Boolean) ||
         datePosted ||
         salaryRange[0] > 50000 ||
         salaryRange[1] < 200000) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {Object.entries(locationTypes)
              .filter(([_, isSelected]) => isSelected)
              .map(([type]) => (
                <Badge key={`loc-${type}`} variant="outline" className="gap-1">
                  {type}
                  <button 
                    onClick={() => {
                      setLocationTypes({...locationTypes, [type]: false});
                      applyFilters();
                    }}
                    className="ml-1"
                  >
                    <XIcon size={12} />
                  </button>
                </Badge>
              ))}
              
            {Object.entries(experienceLevels)
              .filter(([_, isSelected]) => isSelected)
              .map(([level]) => (
                <Badge key={`exp-${level}`} variant="outline" className="gap-1">
                  {level} Level
                  <button 
                    onClick={() => {
                      setExperienceLevels({...experienceLevels, [level]: false});
                      applyFilters();
                    }}
                    className="ml-1"
                  >
                    <XIcon size={12} />
                  </button>
                </Badge>
              ))}
              
            {Object.entries(employmentTypes)
              .filter(([_, isSelected]) => isSelected)
              .map(([type]) => (
                <Badge key={`emp-${type}`} variant="outline" className="gap-1">
                  {type}
                  <button 
                    onClick={() => {
                      setEmploymentTypes({...employmentTypes, [type]: false});
                      applyFilters();
                    }}
                    className="ml-1"
                  >
                    <XIcon size={12} />
                  </button>
                </Badge>
              ))}
              
            {datePosted && (
              <Badge variant="outline" className="gap-1">
                {datePosted === "today" ? "Past 24 hours" : 
                 datePosted === "week" ? "Past week" : "Past month"}
                <button 
                  onClick={() => {
                    setDatePosted(null);
                    applyFilters();
                  }}
                  className="ml-1"
                >
                  <XIcon size={12} />
                </button>
              </Badge>
            )}
            
            {(salaryRange[0] > 50000 || salaryRange[1] < 200000) && (
              <Badge variant="outline" className="gap-1">
                {formatSalary(salaryRange[0])} - {formatSalary(salaryRange[1])}
                <button 
                  onClick={() => {
                    setSalaryRange([50000, 200000]);
                    applyFilters();
                  }}
                  className="ml-1"
                >
                  <XIcon size={12} />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Jobs List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6 w-full max-w-sm">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
              <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>Loading jobs...</span>
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  <JobList
                    jobs={jobs}
                    selectedJobId={selectedJob?.id}
                    onSelectJob={handleJobClick}
                    onFavorite={toggleFavorite}
                    onApply={applyToJob}
                    onResetFilters={resetFilters}
                  />
                </TabsContent>
                
                <TabsContent value="saved">
                  <JobList
                    jobs={jobs.filter(job => job.isFavorite)}
                    selectedJobId={selectedJob?.id}
                    onSelectJob={handleJobClick}
                    onFavorite={toggleFavorite}
                    onApply={applyToJob}
                    onResetFilters={resetFilters}
                  />
                </TabsContent>
                
                <TabsContent value="applied">
                  <JobList
                    jobs={jobs.filter(job => job.isApplied)}
                    selectedJobId={selectedJob?.id}
                    onSelectJob={handleJobClick}
                    onFavorite={toggleFavorite}
                    onApply={applyToJob}
                    onResetFilters={resetFilters}
                  />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>

        {/* Job Details */}
        <div className="hidden lg:block sticky top-6">
          <JobDetails
            job={selectedJob}
            onFavorite={toggleFavorite}
            onApply={applyToJob}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Jobs;