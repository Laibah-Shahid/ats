
import { StarIcon, MapPinIcon, BriefcaseIcon, Clock, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Job } from "@/types/job";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface JobDetailsProps {
  job?: Job;
  onFavorite: (id: number | string) => void;
  onApply: (id: number | string) => void;
}

export const JobDetails = ({ job, onFavorite, onApply }: JobDetailsProps) => {
  if (!job) {
    return (
      <Card className="bg-jobaura-blue-light border-jobaura-blue p-6 text-center">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-jobaura-blue/50 flex items-center justify-center">
            <BriefcaseIcon size={24} className="text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">Job Details</h3>
        <p className="text-gray-400">Select a job to view details</p>
      </Card>
    );
  }

  return (
    <Card className="bg-jobaura-blue-light border-jobaura-blue">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <p className="text-gray-400 mt-1">{job.company}</p>
          </div>
          <button
            className={`text-gray-400 hover:text-yellow-400 ${job.isFavorite ? 'text-yellow-400' : ''}`}
            onClick={() => onFavorite(job.id)}
          >
            <StarIcon size={20} fill={job.isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3 text-sm text-gray-400">
          <div className="flex items-center">
            <MapPinIcon size={16} className="mr-1.5" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <BriefcaseIcon size={16} className="mr-1.5" />
            <span>{job.employmentType}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1.5" />
            <span>Posted {job.posted}</span>
          </div>
        </div>
        
        <div>
          <Tooltip>
            
            <TooltipContent className="max-w-sm p-4">
              <p className="text-sm">{job.matchExplanation || "No match explanation available."}</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="mb-2">
            <span className="text-sm font-medium">Salary: </span>
            <span className="text-sm">{job.salary}</span>
          </div>
          
          <div className="mb-2">
            <span className="text-sm font-medium">Experience Level: </span>
            <span className="text-sm">{job.experienceLevel}</span>
          </div>
        </div>

        <Separator />
        
        <div>
          <h3 className="font-medium mb-2">Job Description</h3>
          <p className="text-sm text-gray-300 mb-4">
            {job.description}
          </p>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((skill, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-jobaura-blue/70 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {job.isApplied ? (
          <div className="w-full">
            <div className="bg-green-500/20 text-green-400 flex items-center justify-center py-2 px-4 rounded-md mb-2">
              <CheckIcon size={16} className="mr-2" />
              <span>You've already applied</span>
            </div>
          </div>
        ) : (
          <Button className="w-full" onClick={() => onApply(job.id)}>
            Apply Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};