
import { MapPinIcon, BriefcaseIcon, Clock, CheckIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Job } from "@/types/job";

interface JobCardProps {
  job: Job;
  isSelected?: boolean;
  onSelect: (job: Job) => void;
  onFavorite: (id: number | string) => void;
  onApply: (id: number | string) => void;
  isRecruiterView?: boolean; // New prop to identify when card is used in recruiter view
}

export const JobCard = ({ 
  job, 
  isSelected, 
  onSelect, 
  onFavorite, 
  onApply,
  isRecruiterView = false // Default to false for backward compatibility
}: JobCardProps) => {
  return (
    <Card 
      className={`bg-jobaura-blue-light border-jobaura-blue hover:border-primary/40 transition-colors cursor-pointer ${
        isSelected ? 'border-primary' : ''
      }`}
      onClick={() => onSelect(job)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg mb-1">{job.title}</h3>
                <p className="text-gray-400 mb-2">{job.company}</p>
              </div>
              {/* Only show favorite star button if not in recruiter view */}
              {!isRecruiterView && (
                <div className="flex gap-2">
                  <button
                    className={`text-gray-400 hover:text-yellow-400 ${job.isFavorite ? 'text-yellow-400' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onFavorite(job.id);
                    }}
                  >
                    <StarIcon size={18} fill={job.isFavorite ? "currentColor" : "none"} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <div className="flex items-center text-sm text-gray-400">
                <MapPinIcon size={14} className="mr-1" />
                <span>{job.location} ({job.locationType})</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <BriefcaseIcon size={14} className="mr-1" />
                <span>{job.employmentType}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Clock size={14} className="mr-1" />
                <span>{job.posted}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.skills.map((skill, index) => (
                <span 
                  key={`${job.id}-${index}`} 
                  className="text-xs px-2 py-0.5 bg-jobaura-blue/70 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="text-gray-400">Salary: </span>
                <span>{job.salary}</span>
                <span className="text-xs text-gray-400 ml-1">• {job.experienceLevel} level</span>
              </div>
              
              {/* Only show match score and apply button if not in recruiter view */}
              {!isRecruiterView ? (
                <div className="flex items-center">
                  
                  
                  {job.isApplied ? (
                    <span className="text-xs bg-green-500/20 text-green-400 flex items-center px-2 py-1 rounded-full">
                      <CheckIcon size={12} className="mr-1" />
                      Applied
                    </span>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApply(job.id);
                      }}
                    >
                      Apply
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};