
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create a Supabase client with the admin key
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Gemini API key from secrets
const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";

// Delay helper function to add pauses between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 2000; // 2 seconds

// Enhanced function to call Gemini API with retry logic
async function callGeminiAPI(prompt: string, resumeId: string): Promise<{ matchPercentage: number, explanation: string } | null> {
  let retries = 0;
  let retryDelay = INITIAL_RETRY_DELAY;

  while (retries <= MAX_RETRIES) {
    try {
      console.log(`Attempting Gemini API call for resume ${resumeId} (Attempt ${retries + 1}/${MAX_RETRIES + 1})`);
      
      const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        const statusCode = response.status;
        const errorData = await response.text();
        console.error(`Gemini API error: ${statusCode} ${response.statusText}`);
        console.error(`Gemini API response: ${errorData}`);
        
        // Check if we hit rate limits (429)
        if (statusCode === 429) {
          if (retries < MAX_RETRIES) {
            console.log(`Rate limit hit. Retrying in ${retryDelay/1000} seconds...`);
            await delay(retryDelay);
            retries++;
            retryDelay *= 2; // Exponential backoff
            continue;
          }
          throw new Error("API rate limit exceeded. Maximum retries reached.");
        }
        
        throw new Error(`Error from Gemini API: ${statusCode}`);
      }

      const geminiResponse = await response.json();
      const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      
      // Extract just the JSON part if there's any extra text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { matchPercentage: 0, explanation: "Failed to parse response" };
      
      return {
        matchPercentage: analysis.matchPercentage || 0,
        explanation: analysis.explanation || "No explanation provided"
      };
    } catch (error) {
      // If we've reached max retries, or it's not a retryable error
      if (retries >= MAX_RETRIES || !error.message.includes("rate limit")) {
        console.error(`Final error for resume ${resumeId} after ${retries + 1} attempts:`, error);
        return null;
      }
      
      console.log(`Error occurred, retrying in ${retryDelay/1000} seconds: ${error.message}`);
      await delay(retryDelay);
      retries++;
      retryDelay *= 2; // Exponential backoff
    }
  }

  return null;
}

// Fallback matching function using keyword comparison when API fails
function performFallbackMatching(job: any, resume: any): { matchPercentage: number, explanation: string } {
  try {
    // Extract job skills array or convert to array if it's a string
    const jobSkills = Array.isArray(job.skills) ? job.skills : 
      (typeof job.skills === 'string' ? job.skills.split(',').map(s => s.trim().toLowerCase()) : []);
    
    // Extract resume skills array or convert to array if it's a string
    const resumeSkills = Array.isArray(resume.skills) ? resume.skills : 
      (typeof resume.skills === 'string' ? resume.skills.split(',').map(s => s.trim().toLowerCase()) : []);
    
    // Count matching skills
    let matchCount = 0;
    const matchedSkills: string[] = [];
    
    jobSkills.forEach(jobSkill => {
      const jobSkillLower = typeof jobSkill === 'string' ? jobSkill.toLowerCase() : '';
      
      resumeSkills.forEach(resumeSkill => {
        const resumeSkillLower = typeof resumeSkill === 'string' ? resumeSkill.toLowerCase() : '';
        
        if (resumeSkillLower && jobSkillLower && 
            (resumeSkillLower.includes(jobSkillLower) || jobSkillLower.includes(resumeSkillLower))) {
          matchCount++;
          matchedSkills.push(typeof resumeSkill === 'string' ? resumeSkill : 'unknown skill');
        }
      });
    });
    
    // Calculate match percentage
    const totalSkills = Math.max(jobSkills.length, 1);
    const matchPercentage = Math.min(Math.round((matchCount / totalSkills) * 100), 100);
    
    // Generate explanation
    const explanation = `This is an automated match using AI service. 
      Based on keyword matching, found ${matchCount} skill matches out of ${totalSkills} required skills. 
      Matched skills: ${matchedSkills.join(', ') || 'None'}.`;
    
    return {
      matchPercentage,
      explanation
    };
  } catch (error) {
    console.error('Error in fallback matching:', error);
    return {
      matchPercentage: 0,
      explanation: "Error occurred during fallback matching."
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { jobId } = await req.json();

    if (!jobId) {
      return new Response(
        JSON.stringify({ error: "Job ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch the job posting details
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      console.error('Error fetching job:', jobError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch job details" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch all resumes
    const { data: resumes, error: resumesError } = await supabase
      .from('resumes')
      .select('*');

    if (resumesError) {
      console.error('Error fetching resumes:', resumesError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch resumes" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If no resumes found
    if (!resumes || resumes.length === 0) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if we have existing matches in the database
    const { data: existingMatches, error: matchesError } = await supabase
      .from('job_resume_matches')
      .select('*')
      .eq('job_id', jobId);
    
    if (matchesError) {
      console.error('Error fetching existing matches:', matchesError);
      // Continue processing even if we can't fetch existing matches
    }

    // Create a map of existing matches for quick lookup
    const matchesMap = new Map();
    if (existingMatches) {
      existingMatches.forEach(match => {
        matchesMap.set(match.resume_id, match);
      });
    }

    // Format job requirements and resume for comparison once
    const jobDescription = `
      Job Title: ${job.title || 'Not specified'}
      Description: ${job.description || 'Not specified'}
      Requirements: ${job.requirements || 'Not specified'}
      Skills Required: ${Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || 'Not specified'}
    `;

    // Enhanced prompt for Gemini to provide more accurate matching
    const basePrompt = `
      You are an expert AI recruiter assistant comparing a job posting with a candidate's resume.
      Based on the skills, experience, and requirements, provide a percentage match score (0-100) with a detailed explanation.
      
      Consider these factors in your evaluation:
      1. Exact skill matches: Direct matches between resume skills and job requirements
      2. Related skills: Skills that are not exact matches but related to the job requirements
      3. Experience level: Whether the candidate's experience aligns with the job
      4. Education: How relevant the candidate's education is for the position
      5. Overall suitability: An overall assessment of how well the candidate fits
      
      JOB POSTING:
      ${jobDescription}
      
      Please respond with ONLY a JSON object in this format:
      {
        "matchPercentage": 75,
        "explanation": "Detailed explanation of the match score with specific points that match or don't match"
      }
    `;

    // Process each resume SEQUENTIALLY instead of in parallel
    const matchResults = [];
    
    for (const resume of resumes) {
      console.log(`Processing resume ${resume.id} for job ${jobId}`);
      
      // Check if we already have a recent match for this resume (extended from 24 to 48 hours for more aggressive caching)
      const existingMatch = matchesMap.get(resume.id);
      
      if (existingMatch) {
        const matchDate = new Date(existingMatch.updated_at);
        const now = new Date();
        const hoursSinceLastMatch = (now.getTime() - matchDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceLastMatch < 48) {
          console.log(`Using existing match for resume ${resume.id} (${hoursSinceLastMatch.toFixed(1)} hours old)`);
          matchResults.push({
            ...resume,
            matchPercentage: existingMatch.match_percentage,
            matchExplanation: existingMatch.match_explanation
          });
          continue;
        }
      }

      // Format resume content for the prompt
      const resumeContent = `
        RESUME:
        Full Name: ${resume.full_name || 'Not specified'}
        Email: ${resume.email || 'Not specified'}
        Skills: ${Array.isArray(resume.skills) ? resume.skills.join(', ') : resume.skills || 'Not specified'}
        Experience: ${resume.experience || 'Not specified'}
        Education: ${resume.education || 'Not specified'}
      `;

      // Complete prompt for this specific resume
      const prompt = `${basePrompt}\n${resumeContent}`;

      try {
        // First try the Gemini API with retries
        const analysis = await callGeminiAPI(prompt, resume.id);
        
        let matchData;
        
        if (analysis) {
          // We got a valid response from Gemini API
          matchData = {
            job_id: jobId,
            resume_id: resume.id,
            match_percentage: analysis.matchPercentage,
            match_explanation: analysis.explanation,
            updated_at: new Date().toISOString()
          };
        } else {
          // If the API call failed after all retries, use the fallback matching algorithm
          console.log(`Using fallback matching for resume ${resume.id} after API failure`);
          const fallbackResult = performFallbackMatching(job, resume);
          
          matchData = {
            job_id: jobId,
            resume_id: resume.id,
            match_percentage: fallbackResult.matchPercentage,
            match_explanation: fallbackResult.explanation,
            updated_at: new Date().toISOString()
          };
        }

        // Store the match result in the database
        if (existingMatch) {
          const { error: updateError } = await supabase
            .from('job_resume_matches')
            .update(matchData)
            .eq('id', existingMatch.id);
            
          if (updateError) {
            console.error('Error updating match result:', updateError);
          }
        } else {
          const { error: insertError } = await supabase
            .from('job_resume_matches')
            .insert([matchData]);
            
          if (insertError) {
            console.error('Error inserting match result:', insertError);
          }
        }

        // Add to results
        matchResults.push({
          ...resume,
          matchPercentage: matchData.match_percentage,
          matchExplanation: matchData.match_explanation
        });
        
        // Add a delay between API calls to avoid rate limiting
        await delay(1500); // 1.5 second delay between each API call
      } catch (error) {
        console.error(`Error processing resume ${resume.id}:`, error);
        
        // Return the resume with a detailed error message
        const errorMessage = error.message || "Unknown error occurred";
        matchResults.push({
          ...resume,
          matchPercentage: 0,
          matchExplanation: `Error analyzing resume: ${errorMessage}`
        });
        
        // Still add a delay before the next resume
        await delay(1000);
      }
    }

    // Sort results by match percentage (highest first)
    const sortedResults = matchResults.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return new Response(
      JSON.stringify({ results: sortedResults }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in match-resume function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});