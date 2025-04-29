
export interface Resume {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  skills: string[];
  experience: string;
  education: string;
  created_at: string;
  matchPercentage?: number;
  matchExplanation?: string;
}
