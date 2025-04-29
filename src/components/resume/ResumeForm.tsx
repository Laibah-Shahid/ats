
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  fullName: string;
  email: string;
  skills: string;
  experience: string;
  education: string;
}

export const ResumeForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    skills: "",
    experience: "",
    education: ""
  });
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload your resume.",
        variant: "destructive"
      });
      return;
    }

    setUploadStatus("uploading");
    
    try {
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      console.log("Attempting to save resume with data:", {
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        skills: skillsArray,
        experience: formData.experience,
        education: formData.education
      });

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          skills: skillsArray,
          experience: formData.experience,
          education: formData.education
        });

      if (error) {
        console.error('Error details:', error);
        throw error;
      }

      console.log('Resume successfully uploaded:', data);
      setUploadStatus("success");
      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been added to our database.",
      });

      setFormData({
        fullName: "",
        email: "",
        skills: "",
        experience: "",
        education: ""
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error uploading resume:', error);
      setUploadStatus("error");
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-jobaura-blue-light border-jobaura-blue">
      <CardHeader>
        <CardTitle>Upload Resume Details</CardTitle>
        <CardDescription>Fill in your resume information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="bg-jobaura-blue/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-jobaura-blue/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input
              id="skills"
              name="skills"
              placeholder="e.g., JavaScript, React, Node.js"
              value={formData.skills}
              onChange={handleInputChange}
              className="bg-jobaura-blue/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              name="experience"
              placeholder="Describe your work experience..."
              className="min-h-[100px] bg-jobaura-blue/50"
              value={formData.experience}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              name="education"
              placeholder="Enter your educational background..."
              className="min-h-[100px] bg-jobaura-blue/50"
              value={formData.education}
              onChange={handleInputChange}
            />
          </div>
          
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Formatting Tip</AlertTitle>
            <AlertDescription className="text-xs text-gray-300">
              For best matching results, be specific with your skills and provide detailed experience information.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          disabled={!formData.fullName || !formData.email || !formData.skills || uploadStatus === "uploading"} 
          onClick={handleUpload}
          className="w-full sm:w-auto"
        >
          {uploadStatus === "uploading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : "Upload Resume"}
        </Button>
      </CardFooter>
    </Card>
  );
};
