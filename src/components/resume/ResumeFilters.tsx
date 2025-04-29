
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Job } from "@/types/job";
import { Loader2 } from "lucide-react";

interface ResumeFiltersProps {
  jobs: Job[];
  selectedJobId: string;
  searchTerm: string;
  matchingLoading: boolean;
  onSearchChange: (value: string) => void;
  onJobSelect: (value: string) => void;
  onMatchResumes: () => void;
}

export const ResumeFilters = ({
  jobs,
  selectedJobId,
  searchTerm,
  matchingLoading,
  onSearchChange,
  onJobSelect,
  onMatchResumes,
}: ResumeFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, skills, or experience..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Select
          value={selectedJobId}
          onValueChange={onJobSelect}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select a job posting" />
          </SelectTrigger>
          <SelectContent>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={String(job.id)}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={onMatchResumes} 
          disabled={!selectedJobId || matchingLoading}
        >
          {matchingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Match Resumes
        </Button>
      </div>
    </div>
  );
};
