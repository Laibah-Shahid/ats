import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { PageHeader } from "@/components/ui/page-header";
import { toast } from "@/components/ui/use-toast";
import { ResumeFilters } from "@/components/resume/ResumeFilters";
import { ResumeTable } from "@/components/resume/ResumeTable";
import { Resume } from "@/types/resume";
import { Job } from "@/types/job";

const ResumeList = () => {
  const { isRecruiter } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchedResumes, setMatchedResumes] = useState<Resume[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching resumes:', error);
          setError("Failed to load resumes. Please try again later.");
          return;
        }

        setResumes(data || []);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError("An unexpected error occurred while fetching resumes.");
      } finally {
        setLoading(false);
      }
    };

    const fetchJobs = async () => {
      try {
        const { data: tableExists, error: checkError } = await supabase.rpc('check_table_exists', {
          table_name: 'jobs'
        });

        if (checkError || !tableExists) {
          console.log('Jobs table does not exist yet');
          return;
        }

        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching jobs:', error);
          return;
        }

        // Convert database job records to our frontend Job interface
        if (data && data.length > 0) {
          const transformedJobs: Job[] = data.map(job => ({
            id: job.id,
            title: job.title || "Untitled Job",
            company: job.company || "Unknown Company",
            description: job.description || "",
            skills: job.skills || [],
            // Default values for required fields that don't exist in DB
            location: "Not specified",
            locationType: "Remote",
            salary: "Not specified",
            salaryRange: [0, 0],
            posted: job.created_at ? new Date(job.created_at).toLocaleDateString() : "Recently",
            postedDays: job.created_at ? Math.floor((Date.now() - new Date(job.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0,
            matchScore: 0,
            isFavorite: false,
            isApplied: false,
            employmentType: "Full-time",
            experienceLevel: "Mid",
            // Keep database fields
            created_at: job.created_at,
            updated_at: job.updated_at,
            user_id: job.user_id,
            requirements: job.requirements
          }));
          
          setJobs(transformedJobs);
          if (transformedJobs.length > 0) {
            setSelectedJobId(String(transformedJobs[0].id));
          }
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchResumes();
    fetchJobs();
  }, []);

  const handleMatchResumes = async () => {
    if (!selectedJobId) {
      toast({
        title: "No Job Selected",
        description: "Please select a job to match resumes against.",
        variant: "destructive",
      });
      return;
    }

    setMatchingLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("match-resume", {
        body: { jobId: selectedJobId },
      });

      if (error) throw new Error(error.message);

      setMatchedResumes(data?.results || []);
      toast({
        title: "Matching Complete",
        description: `Analyzed ${data?.results?.length || 0} resumes against the selected job.`,
      });
    } catch (error) {
      console.error('Error matching resumes:', error);
      toast({
        title: "Matching Failed",
        description: "Failed to analyze resumes. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setMatchingLoading(false);
    }
  };

  const getMatchBadgeColor = (percentage?: number) => {
    if (!percentage) return "bg-gray-200 text-gray-800";
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 60) return "bg-blue-100 text-blue-800";
    if (percentage >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const filteredResumes = searchTerm
    ? (matchedResumes.length ? matchedResumes : resumes).filter(resume =>
        resume.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resume.skills && resume.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
        (resume.experience && resume.experience.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : (matchedResumes.length ? matchedResumes : resumes);

  const totalPages = Math.ceil(filteredResumes.length / resultsPerPage);
  const paginatedResumes = filteredResumes.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  if (loading) {
    return (
      <DashboardLayout userType="recruiter">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="recruiter">
      <div className="container mx-auto py-6">
        <PageHeader
          title="Resume List"
          description="Browse and match candidate resumes with job postings"
        />
        
        {error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Database Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <ResumeFilters
          jobs={jobs}
          selectedJobId={selectedJobId}
          searchTerm={searchTerm}
          matchingLoading={matchingLoading}
          onSearchChange={setSearchTerm}
          onJobSelect={setSelectedJobId}
          onMatchResumes={handleMatchResumes}
        />
        
        <ResumeTable
          resumes={paginatedResumes}
          getMatchBadgeColor={getMatchBadgeColor}
        />

        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeList;
