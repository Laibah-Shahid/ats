
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from "@/providers/AuthProvider";

// Define props interface for JobPostForm
interface JobPostFormProps {
  onJobPosted: () => void;
}

const JobPostForm = ({ onJobPosted }: JobPostFormProps) => {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState<"Remote" | "Onsite" | "Hybrid">("Remote");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [skills, setSkills] = useState("");
  const [employmentType, setEmploymentType] = useState<"Full-time" | "Part-time" | "Contract" | "Internship">("Full-time");
  const [experienceLevel, setExperienceLevel] = useState<"Entry" | "Mid" | "Senior" | "Lead">("Entry");
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate input
    if (!title || !company || !description || !requirements || !skills || !salaryMin || !salaryMax) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const salaryMinNum = parseInt(salaryMin, 10);
    const salaryMaxNum = parseInt(salaryMax, 10);

    if (isNaN(salaryMinNum) || isNaN(salaryMaxNum)) {
      toast({
        title: "Invalid salary",
        description: "Please enter valid numbers for salary.",
        variant: "destructive",
      });
      return;
    }

    const skillsArray = skills.split(",").map((skill) => skill.trim());

    try {
      if (!user) {
        throw new Error("You must be logged in to post a job");
      }

      const { error } = await supabase
        .from('jobs')
        .insert({
          id: uuidv4(),
          title,
          company,
          location,
          locationType,
          salaryMin: salaryMinNum,
          salaryMax: salaryMaxNum,
          description,
          requirements,
          skills: skillsArray,
          employmentType,
          experienceLevel,
          user_id: user.id,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Job posted!",
        description: "Your job has been successfully posted.",
      });

      // Call the onJobPosted callback to refresh the job list
      onJobPosted();

      // Reset form fields
      setTitle("");
      setCompany("");
      setLocation("");
      setLocationType("Remote");
      setSalaryMin("");
      setSalaryMax("");
      setDescription("");
      setRequirements("");
      setSkills("");
      setEmploymentType("Full-time");
      setExperienceLevel("Entry");
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast({
        title: "Error posting job",
        description: error.message || "Failed to post job. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Post a New Job</h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="locationType">Location Type</Label>
            <Select value={locationType} onValueChange={(value) => setLocationType(value as "Remote" | "Onsite" | "Hybrid")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="Onsite">Onsite</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="salaryMin">Salary Min</Label>
              <Input
                type="number"
                id="salaryMin"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="salaryMax">Salary Max</Label>
              <Input
                type="number"
                id="salaryMax"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="employmentType">Employment Type</Label>
            <Select value={employmentType} onValueChange={(value) => setEmploymentType(value as "Full-time" | "Part-time" | "Contract" | "Internship")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select value={experienceLevel} onValueChange={(value) => setExperienceLevel(value as "Entry" | "Mid" | "Senior" | "Lead")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entry">Entry</SelectItem>
                <SelectItem value="Mid">Mid</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              type="text"
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Post Job</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostForm;