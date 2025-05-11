
import { Resume } from "@/types/resume";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatMatchExplanation, getMatchColor } from "@/utils/formatMatchExplanation";
import { Info, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { CustomProgress } from "@/components/ui/CustomProgress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ResumeTableProps {
  resumes: Resume[];
  getMatchBadgeColor: (percentage?: number) => string;
}

export const ResumeTable = ({ resumes, getMatchBadgeColor }: ResumeTableProps) => {
  const [expandedCells, setExpandedCells] = useState<Record<string, boolean>>({});

  // Truncate text with ellipsis and add "See more" button if needed
  const renderTruncatedCell = (text: string, id: string, cellId: string, maxLength: number = 100) => {
    const cellKey = `${id}-${cellId}`;
    const isExpanded = expandedCells[cellKey] || false;
    
    if (!text || text.length <= maxLength) return text;
    
    return (
      <div className="relative">
        <div className={isExpanded ? "" : "line-clamp-2"}>
          {text}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-5 text-xs font-normal text-muted-foreground flex items-center mt-1"
          onClick={() => setExpandedCells({...expandedCells, [cellKey]: !isExpanded})}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" /> Show more
            </>
          )}
        </Button>
      </div>
    );
  };

  // Render match score with better error handling
  const renderMatchScore = (resume: Resume) => {
    if (resume.matchPercentage === undefined) {
      return (
        <span className="text-xs text-muted-foreground">Not analyzed</span>
      );
    }

    // If there was an error analyzing the resume
    if (resume.matchPercentage === 0 && resume.matchExplanation?.includes("Error analyzing")) {
      return (
        <Alert variant="destructive" className="py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            API rate limit exceeded. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CustomProgress 
            value={resume.matchPercentage} 
            className="h-2 w-full" 
            indicatorClassName={getMatchColor(resume.matchPercentage)}
          />
          <span className="text-xs font-medium w-9">{resume.matchPercentage}%</span>
        </div>
        
        {resume.matchExplanation && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                <Info className="h-3 w-3" /> View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Match Analysis</DialogTitle>
                <DialogDescription>
                  Score: <Badge className={getMatchBadgeColor(resume.matchPercentage)}>{resume.matchPercentage}%</Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {(() => {
                  const { overview, sections } = formatMatchExplanation(resume.matchExplanation);
                  return (
                    <>
                      <p className="text-sm font-medium">{overview}</p>
                      {sections.map((section, index) => (
                        <div key={index} className="space-y-2">
                          <h4 className="text-sm font-semibold">{section.title}</h4>
                          <p className="text-sm text-muted-foreground">{section.content}</p>
                        </div>
                      ))}
                    </>
                  );
                })()}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Education</TableHead>
            <TableHead>Date Submitted</TableHead>
            <TableHead className="min-w-[220px]">Match Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.length > 0 ? (
            resumes.map((resume) => (
              <TableRow key={resume.id} className="h-[80px]">
                <TableCell className="font-medium">{resume.full_name}</TableCell>
                <TableCell>{resume.email}</TableCell>
                <TableCell>
                  {renderTruncatedCell(
                    Array.isArray(resume.skills) ? resume.skills.join(", ") : '',
                    resume.id,
                    "skills"
                  )}
                </TableCell>
                <TableCell>
                  {renderTruncatedCell(resume.experience || "", resume.id, "experience")}
                </TableCell>
                <TableCell>
                  {renderTruncatedCell(resume.education || "", resume.id, "education")}
                </TableCell>
                <TableCell>
                  {new Date(resume.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {renderMatchScore(resume)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No resumes found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};