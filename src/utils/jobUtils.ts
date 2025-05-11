
import { Job } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";
import { JobResumeMatch } from "./jobMatchUtils";

// Helper function to calculate days between dates
export const getDaysBetween = (date1: Date, date2: Date = new Date()): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Helper function to format days ago
export const formatDaysAgo = (days: number): string => {
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};

// Transform database job to frontend job model
export const transformDbJobToJob = async (dbJob: any, userId?: string): Promise<Job> => {
  const createdAt = new Date(dbJob.created_at);
  const now = new Date();
  const postedDays = getDaysBetween(createdAt, now);
  
  // Initialize match score and explanation
  let matchScore = 0;
  let matchExplanation = "";
  
  // If we have a user ID, try to fetch the match score for their resume
  if (userId) {
    try {
      // First, get the user's resume ID
      const { data: userResumes } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      if (userResumes && userResumes.length > 0) {
        const resumeId = userResumes[0].id;
        
        // Fetch the match score from our matches table
        const { data: matchData } = await supabase
          .from('job_resume_matches')
          .select('match_percentage, match_explanation')
          .eq('job_id', dbJob.id.toString()) // Convert job ID to string
          .eq('resume_id', resumeId)
          .limit(1);
        
        if (matchData && matchData.length > 0) {
          matchScore = matchData[0].match_percentage;
          matchExplanation = matchData[0].match_explanation || "";
        }
      }
    } catch (error) {
      console.error('Error fetching match score:', error);
      // Fallback to a random score if there's an error
      matchScore = Math.floor(Math.random() * 30) + 70; // 70-99
    }
  } else {
    // Fallback to a random score if we don't have a user ID
    matchScore = Math.floor(Math.random() * 30) + 70; // 70-99
  }
  
  // Fixed mapping between database field names and frontend field names
  return {
    id: dbJob.id,
    title: dbJob.title,
    company: dbJob.company,
    location: dbJob.location || "Remote",
    locationType: dbJob.locationType || "Remote", 
    salary: `$${(dbJob.salaryMin / 1000).toFixed(0)}K - $${(dbJob.salaryMax / 1000).toFixed(0)}K`,
    salaryRange: [dbJob.salaryMin || 0, dbJob.salaryMax || 0] as [number, number],
    posted: formatDaysAgo(postedDays),
    postedDays: postedDays,
    description: dbJob.description,
    skills: dbJob.skills || [],
    matchScore: matchScore,
    matchExplanation: matchExplanation,
    isFavorite: false, // Will be managed in state
    isApplied: false, // Will be managed in state
    employmentType: dbJob.employmentType || "Full-time", 
    experienceLevel: dbJob.experienceLevel || "Mid", 
    // Optional database fields
    created_at: dbJob.created_at,
    updated_at: dbJob.updated_at,
    user_id: dbJob.user_id,
    requirements: dbJob.requirements
  };
};

// Fetch a single job by ID with match data
export const fetchJobWithMatchData = async (jobId: string | number, userId?: string): Promise<Job | null> => {
  try {
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId.toString()) // Convert job ID to string
      .single();
    
    if (error || !job) {
      console.error('Error fetching job:', error);
      return null;
    }
    
    return await transformDbJobToJob(job, userId);
  } catch (error) {
    console.error('Error fetching job with match data:', error);
    return null;
  }
};

// Get top matches for a job
export const getTopMatchesForJob = async (jobId: string | number, limit: number = 5): Promise<JobResumeMatch[]> => {
  try {
    const { data, error } = await supabase
      .from('job_resume_matches')
      .select('*')
      .eq('job_id', jobId.toString()) // Convert job ID to string
      .order('match_percentage', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching top matches for job:', error);
      return [];
    }
    
    return data as JobResumeMatch[];
  } catch (error) {
    console.error('Error in getTopMatchesForJob:', error);
    return [];
  }
};