
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

interface ResumeTableProps {
  resumes: Resume[];
  getMatchBadgeColor: (percentage?: number) => string;
}

export const ResumeTable = ({ resumes, getMatchBadgeColor }: ResumeTableProps) => {
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
            <TableHead>Match Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.length > 0 ? (
            resumes.map((resume) => (
              <TableRow key={resume.id}>
                <TableCell className="font-medium">{resume.full_name}</TableCell>
                <TableCell>{resume.email}</TableCell>
                <TableCell>{Array.isArray(resume.skills) ? resume.skills.join(", ") : ''}</TableCell>
                <TableCell>{resume.experience}</TableCell>
                <TableCell>{resume.education}</TableCell>
                <TableCell>
                  {new Date(resume.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {resume.matchPercentage !== undefined ? (
                    <div className="flex flex-col gap-1">
                      <Badge className={getMatchBadgeColor(resume.matchPercentage)}>
                        {resume.matchPercentage}%
                      </Badge>
                      {resume.matchExplanation && (
                        <span className="text-xs text-muted-foreground max-w-[200px] truncate" title={resume.matchExplanation}>
                          {resume.matchExplanation}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Not analyzed</span>
                  )}
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
