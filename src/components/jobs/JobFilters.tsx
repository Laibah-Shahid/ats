
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface JobFiltersProps {
  filters: {
    searchTerm: string;
    salaryRange: [number, number];
    locationTypes: Record<string, boolean>;
    experienceLevels: Record<string, boolean>;
    employmentTypes: Record<string, boolean>;
    datePosted: string | null;
  };
  onFiltersChange: (key: string, value: any) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const JobFilters = ({ 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  onResetFilters 
}: JobFiltersProps) => {
  const formatSalary = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  return (
    <Card className="bg-jobaura-blue-light border-jobaura-blue mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            Reset All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Salary Range */}
          <div>
            <Label className="mb-2 block">Salary Range</Label>
            <div className="mb-2">
              <Slider 
                value={[filters.salaryRange[0], filters.salaryRange[1]]} 
                min={50000} 
                max={200000}
                step={5000}
                onValueChange={(value) => onFiltersChange('salaryRange', value)}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatSalary(filters.salaryRange[0])}</span>
              <span>{formatSalary(filters.salaryRange[1])}</span>
            </div>
          </div>
          
          {/* Location Type */}
          <div>
            <Label className="mb-2 block">Location Type</Label>
            <div className="space-y-2">
              {["Remote", "Hybrid", "Onsite"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`location-${type}`} 
                    checked={filters.locationTypes[type]}
                    onCheckedChange={(checked) => 
                      onFiltersChange('locationTypes', {
                        ...filters.locationTypes,
                        [type]: !!checked
                      })
                    }
                  />
                  <label 
                    htmlFor={`location-${type}`}
                    className="text-sm cursor-pointer"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Experience Level */}
          <div>
            <Label className="mb-2 block">Experience Level</Label>
            <div className="space-y-2">
              {["Entry", "Mid", "Senior", "Lead"].map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`exp-${level}`} 
                    checked={filters.experienceLevels[level]}
                    onCheckedChange={(checked) => 
                      onFiltersChange('experienceLevels', {
                        ...filters.experienceLevels,
                        [level]: !!checked
                      })
                    }
                  />
                  <label 
                    htmlFor={`exp-${level}`}
                    className="text-sm cursor-pointer"
                  >
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Employment Type & Date Posted */}
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Employment Type</Label>
              <div className="space-y-2">
                {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`emp-${type}`} 
                      checked={filters.employmentTypes[type]}
                      onCheckedChange={(checked) => 
                        onFiltersChange('employmentTypes', {
                          ...filters.employmentTypes,
                          [type]: !!checked
                        })
                      }
                    />
                    <label 
                      htmlFor={`emp-${type}`}
                      className="text-sm cursor-pointer"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Date Posted</Label>
              <Select 
                value={filters.datePosted || ""} 
                onValueChange={(value) => onFiltersChange('datePosted', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any time</SelectItem>
                  <SelectItem value="today">Past 24 hours</SelectItem>
                  <SelectItem value="week">Past week</SelectItem>
                  <SelectItem value="month">Past month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onApplyFilters} className="w-full sm:w-auto">
          Apply Filters
        </Button>
      </CardFooter>
    </Card>
  );
};
