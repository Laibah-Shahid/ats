
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { Resume } from "@/types/resume";
import { toast } from "@/components/ui/use-toast";

export interface JobResumeMatch {
  id: string;
  job_id: string;
  resume_id: string;
  match_percentage: number;
  match_explanation?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch existing match for a specific job and resume
 */
export const fetchJobResumeMatch = async (jobId: string | number, resumeId: string): Promise<JobResumeMatch | null> => {
  try {
    const { data, error } = await supabase
      .from('job_resume_matches')
      .select('*')
      .eq('job_id', jobId.toString()) // Convert job ID to string
      .eq('resume_id', resumeId)
      .single();
    
    if (error) {
      console.error('Error fetching job-resume match:', error);
      return null;
    }
    
    return data as JobResumeMatch;
  } catch (error) {
    console.error('Error in fetchJobResumeMatch:', error);
    return null;
  }
};

/**
 * Fetch all matches for a specific job
 */
export const fetchAllMatchesForJob = async (jobId: string | number): Promise<JobResumeMatch[]> => {
  try {
    const { data, error } = await supabase
      .from('job_resume_matches')
      .select('*')
      .eq('job_id', jobId.toString()) // Convert job ID to string
      .order('match_percentage', { ascending: false });
    
    if (error) {
      console.error('Error fetching matches for job:', error);
      return [];
    }
    
    return data as JobResumeMatch[];
  } catch (error) {
    console.error('Error in fetchAllMatchesForJob:', error);
    return [];
  }
};

/**
 * Fetch all matches for a specific resume
 */
export const fetchAllMatchesForResume = async (resumeId: string): Promise<JobResumeMatch[]> => {
  try {
    const { data, error } = await supabase
      .from('job_resume_matches')
      .select('*')
      .eq('resume_id', resumeId)
      .order('match_percentage', { ascending: false });
    
    if (error) {
      console.error('Error fetching matches for resume:', error);
      return [];
    }
    
    return data as JobResumeMatch[];
  } catch (error) {
    console.error('Error in fetchAllMatchesForResume:', error);
    return [];
  }
};

/**
 * Process a job against all resumes to generate match scores
 */
export const matchJobWithAllResumes = async (jobId: string | number): Promise<JobResumeMatch[]> => {
  try {
    // Show loading toast
    const loadingToast = toast({
      title: "Processing",
      description: "Analyzing resumes against job requirements. This may take a moment.",
      duration: 10000,
    });

    // Call our match-resume edge function
    const { data, error } = await supabase.functions.invoke("match-resume", {
      body: { jobId },
    });

    // Clear loading toast
    toast({
      variant: "default",
      title: "Processing complete",
      description: "Resume analysis finished",
    });

    if (error) {
      console.error('Error matching job with resumes:', error);
      toast({
        title: "Error",
        description: "Failed to match job with resumes. API rate limits may have been exceeded.",
        variant: "destructive",
      });
      return [];
    }

    // The results array should now contain all the resume match data
    return data.results || [];
  } catch (error) {
    console.error('Error in matchJobWithAllResumes:', error);
    toast({
      title: "Error",
      description: "An unexpected error occurred while matching resumes. Please try again later.",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Process a resume against all jobs to generate match scores
 */
// export const matchResumeWithAllJobs = async (resumeId: string): Promise<JobResumeMatch[]> => {
//   try {
//     // Call a similar edge function (we'll need to create this)
//     const { data, error } = await supabase.functions.invoke("match-resume-to-jobs", {
//       body: { resumeId },
//     });

//     if (error) {
//       console.error('Error matching resume with jobs:', error);
//       toast({
//         title: "Error", 
//         description: "Failed to match resume with jobs",
//         variant: "destructive",
//       });
//       return [];
//     }

//     return data.results || [];
//   } catch (error) {
//     console.error('Error in matchResumeWithAllJobs:', error);
//     toast({
//       title: "Error",
//       description: "An unexpected error occurred while matching jobs",
//       variant: "destructive",
//       });
//     return [];
//   }
// };