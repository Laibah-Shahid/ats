
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Job } from "@/types/job";
import { JobCard } from "./JobCard";

interface JobListProps {
  jobs: Job[];
  selectedJobId?: number | string | null;
  onSelectJob: (job: Job) => void;
  onFavorite: (id: number | string) => void;
  onApply: (id: number | string) => void;
  onResetFilters: () => void;
}

export const JobList = ({ 
  jobs, 
  selectedJobId, 
  onSelectJob, 
  onFavorite, 
  onApply,
  onResetFilters
}: JobListProps) => {
  if (jobs.length === 0) {
    return (
      <Card className="bg-jobaura-blue-light border-jobaura-blue p-6 text-center">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-jobaura-blue/50 flex items-center justify-center">
            <SearchIcon size={24} className="text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">No jobs found</h3>
        <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
        <Button onClick={onResetFilters}>Reset Filters</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isSelected={selectedJobId === job.id}
          onSelect={onSelectJob}
          onFavorite={onFavorite}
          onApply={onApply}
        />
      ))}
    </div>
  );
};
