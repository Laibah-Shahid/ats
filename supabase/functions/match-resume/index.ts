
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

    // Process each resume with Gemini API
    const matchPromises = resumes.map(async (resume) => {
      // Format job requirements and resume for comparison
      const jobDescription = `
        Job Title: ${job.title || 'Not specified'}
        Description: ${job.description || 'Not specified'}
        Requirements: ${job.requirements || 'Not specified'}
        Skills Required: ${Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || 'Not specified'}
      `;

      const resumeContent = `
        Full Name: ${resume.full_name || 'Not specified'}
        Email: ${resume.email || 'Not specified'}
        Skills: ${Array.isArray(resume.skills) ? resume.skills.join(', ') : resume.skills || 'Not specified'}
        Experience: ${resume.experience || 'Not specified'}
        Education: ${resume.education || 'Not specified'}
      `;

      // Construct prompt for Gemini
      const prompt = `
        You are an AI recruiter assistant comparing a job posting with a candidate's resume.
        Based on the skills, experience, and requirements, provide a percentage match score (0-100) with a brief explanation.
        
        JOB POSTING:
        ${jobDescription}
        
        RESUME:
        ${resumeContent}
        
        Please respond with ONLY a JSON object in this format:
        {
          "matchPercentage": 75,
          "explanation": "Concise explanation of the match score"
        }
      `;

      try {
        // Call Gemini API to analyze the match
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
                  {
                    text: prompt
                  }
                ]
              }
            ]
          })
        });

        if (!response.ok) {
          console.error(`Gemini API error: ${response.status} ${response.statusText}`);
          const errorData = await response.text();
          console.error(`Gemini API response: ${errorData}`);
          throw new Error(`Gemini API error: ${response.status}`);
        }

        const geminiResponse = await response.json();
        
        // Extract the text from Gemini's response
        const responseText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        
        // Parse the JSON from the response
        let analysis;
        try {
          // Extract just the JSON part if there's any extra text
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { matchPercentage: 0, explanation: "Failed to parse response" };
        } catch (parseError) {
          console.error('Error parsing Gemini response:', parseError);
          analysis = { matchPercentage: 0, explanation: "Failed to parse response" };
        }

        // Return the resume with match details
        return {
          ...resume,
          matchPercentage: analysis.matchPercentage || 0,
          matchExplanation: analysis.explanation || "No explanation provided"
        };
      } catch (error) {
        console.error(`Error analyzing resume ${resume.id}:`, error);
        // Return the resume with a default score if analysis fails
        return {
          ...resume,
          matchPercentage: 0,
          matchExplanation: "Error analyzing resume"
        };
      }
    });

    // Wait for all analyses to complete
    const matchResults = await Promise.all(matchPromises);

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
