
import { supabase } from "@/integrations/supabase/client";

export const setupRecruiter = async () => {
  const RECRUITER_EMAIL = "laibah@gmail.com";
  const RECRUITER_PASSWORD = "Ld098!@#";

  try {
    console.log("Setting up recruiter account");
    
    // First check if profile already exists to avoid rate limit errors
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', 'a1db2933-6942-4ba5-9a4c-d6a8a86b4f07') // Hardcoded ID from logs
      .single();
      
    // If profile exists and is already a recruiter, we're done
    if (existingProfile?.role === 'recruiter') {
      console.log("Recruiter account already set up");
      return;
    }

    // If no profile or not a recruiter, attempt to sign up
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: RECRUITER_EMAIL,
        password: RECRUITER_PASSWORD,
      });

      if (signUpError && signUpError.message !== "User already registered") {
        console.error("Error creating recruiter:", signUpError);
        
        // If rate limited, try to use existing account
        if (signUpError.message === "Request rate limit reached") {
          console.log("Rate limited, trying to use existing account");
        } else {
          return;
        }
      }
    } catch (error) {
      console.log("Sign up error, continuing to sign in:", error);
    }

    // Try to sign in to get the user ID
    console.log("Attempting to sign in as recruiter to get user ID");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: RECRUITER_EMAIL,
      password: RECRUITER_PASSWORD,
    });
    
    if (signInError) {
      console.error("Error signing in as recruiter:", signInError);
      return;
    }
    
    const userId = signInData?.user?.id;
    if (!userId) {
      console.error("Could not determine recruiter user ID");
      return;
    }

    // Update the profile to set role as recruiter
    console.log("Updating recruiter role for user ID:", userId);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'recruiter' })
      .eq('id', userId);

    if (updateError) {
      console.error("Error updating recruiter role:", updateError);
      return;
    }

    // Sign out after setup to prevent conflicts with user's session
    await supabase.auth.signOut();
    console.log("Recruiter account setup completed successfully");
  } catch (error) {
    console.error("Error in recruiter setup:", error);
  }
};
