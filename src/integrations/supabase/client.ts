// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gbqjopccxdgayopxxukz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicWpvcGNjeGRnYXlvcHh4dWt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNjQ4NzUsImV4cCI6MjA2MDY0MDg3NX0.rreF339rMbLC6HDqyFvbcJLM4wWSVmtzRHwIO7ERI5c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);