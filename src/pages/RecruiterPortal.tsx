import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import JobPostForm from "@/components/recruiter/JobPostForm";
import { FilePlus, Users, BarChart3, BriefcaseIcon, Trash2, User } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Job } from "@/types/job";
import { JobCard } from "@/components/jobs/JobCard";

const RecruiterPortal = () => {
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isRecruiter } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Ensure user is a recruiter
    if (user && !isRecruiter) {
      console.log("Redirecting non-recruiter from recruiter portal to dashboard");
      navigate('/dashboard');
    }
  }, [user, isRecruiter, navigate]);

  // Fetch recruiter's posted jobs
  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        toast({
          title: "Error",
          description: "Failed to load your job postings",
          variant: "destructive",
        });
        setJobs([]);
      } else {
        // Transform the jobs data into the Job type
        const transformedJobs: Job[] = await Promise.all(
          jobsData.map(async (job) => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location || "Remote",
            // Cast locationType to the correct type with a default value of "Remote"
            locationType: (job.locationType || "Remote") as "Remote" | "Onsite" | "Hybrid",
            salary: `$${(job.salaryMin / 1000).toFixed(0)}K - $${(job.salaryMax / 1000).toFixed(0)}K`,
            salaryRange: [job.salaryMin || 0, job.salaryMax || 0],
            posted: new Date(job.created_at).toLocaleDateString(),
            postedDays: 0, // Calculate if needed
            description: job.description,
            skills: job.skills || [],
            matchScore: 0, // Not relevant for recruiter view
            matchExplanation: "", // Not relevant for recruiter view
            isFavorite: false, // Not relevant for recruiter view
            isApplied: false, // Not relevant for recruiter view
            // Cast employmentType to the correct type with a default value of "Full-time"
            employmentType: (job.employmentType || "Full-time") as "Full-time" | "Part-time" | "Contract" | "Internship",
            // Cast experienceLevel to the correct type with a default value of "Mid"
            experienceLevel: (job.experienceLevel || "Mid") as "Entry" | "Mid" | "Senior" | "Lead",
            created_at: job.created_at,
            updated_at: job.updated_at,
            user_id: job.user_id,
            requirements: job.requirements
          }))
        );
        setJobs(transformedJobs);
      }
    } catch (err) {
      console.error('Error processing jobs:', err);
      toast({
        title: "Error",
        description: "Failed to process job data",
        variant: "destructive",
      });
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      // First delete related job-resume matches
      const { error: matchesError } = await supabase
        .from('job_resume_matches')
        .delete()
        .eq('job_id', jobToDelete.id.toString());
      
      if (matchesError) {
        console.error('Error deleting job matches:', matchesError);
      }
      
      // Then delete the job itself
      const { error: jobError } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobToDelete.id.toString())
        .eq('user_id', user?.id); // Ensure the user can only delete their own jobs
      
      if (jobError) {
        console.error('Error deleting job:', jobError);
        toast({
          title: "Error",
          description: "Failed to delete job posting",
          variant: "destructive",
        });
      } else {
        // Update local state to remove the deleted job
        setJobs(jobs.filter(job => job.id !== jobToDelete.id));
        toast({
          title: "Job Deleted",
          description: "Your job posting has been successfully deleted",
        });
      }
    } catch (err) {
      console.error('Error in delete operation:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      // Reset the job to delete
      setJobToDelete(null);
    }
  };

  const handleSelectJob = () => {
    // Placeholder for job selection - not needed for deletion functionality
  };

  const handleFavoriteJob = () => {
    // Placeholder for job favorite - not needed for deletion functionality
  };

  const handleApplyJob = () => {
    // Placeholder for job apply - not needed for deletion functionality
  };

  const renderJobList = () => {
    if (isLoading) {
      return <p>Loading your job postings...</p>;
    }

    if (jobs.length === 0) {
      return <p>You haven't posted any jobs yet.</p>;
    }

    return (
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-semibold">Your Job Postings</h2>
        {jobs.map((job) => (
          <div key={job.id} className="relative group">
            <JobCard 
              job={job}
              onSelect={handleSelectJob}
              onFavorite={handleFavoriteJob}
              onApply={handleApplyJob}
              isSelected={false}
              isRecruiterView={true} // Set to true for recruiter view
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 hover:bg-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setJobToDelete(job);
                  }}
                >
                  <Trash2 size={18} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this job posting? This action cannot be undone.
                    <div className="mt-2 p-4 bg-muted rounded-md">
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setJobToDelete(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteJob} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout userType="recruiter">
      <div className="container mx-auto p-6">
        <PageHeader
          title="Recruiter Dashboard"
          description="Manage job postings, candidates, and analytics"
        >
          <Button onClick={() => setShowJobForm(!showJobForm)}>
            <FilePlus className="mr-2 h-4 w-4" />
            {showJobForm ? "Hide Form" : "Post New Job"}
          </Button>
        </PageHeader>

        {showJobForm ? (
          <div className="mt-8">
            <JobPostForm onJobPosted={fetchJobs} />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Job Postings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobs.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manage your active listings
                  </p>
                  <div className="mt-4">
                   <Link to="/jobs" className="w-full">
                      <Button variant="outline" size="sm" className="w-full">
                        <BriefcaseIcon className="h-4 w-4 mr-2" />
                        View Jobs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Candidates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +10 since last month
                  </p>
                  <div className="mt-4">
                    <Link to="/resumes" className="w-full">
                      <Button variant="outline" size="sm" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        View Candidates
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Conversion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +2% since last month
                  </p>
                  <div className="mt-4">
                     <Link to="/insights" className="w-full">
                      <Button variant="outline" size="sm" className="w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Analytics
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {renderJobList()}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterPortal;