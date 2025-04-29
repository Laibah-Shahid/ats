
export interface Job {
  id: number | string;
  title: string;
  company: string;
  location: string;
  locationType: "Remote" | "Onsite" | "Hybrid";
  salary: string;
  salaryRange: [number, number];
  posted: string;
  postedDays: number;
  description: string;
  skills: string[];
  matchScore: number;
  isFavorite: boolean;
  isApplied: boolean;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead";
  
  // Optional fields for database compatibility
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  requirements?: string;
}
