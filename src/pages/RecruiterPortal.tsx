
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import JobPostForm from "@/components/recruiter/JobPostForm";
import { FilePlus, Users, BarChart3, BriefcaseIcon } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const RecruiterPortal = () => {
  const [showJobForm, setShowJobForm] = useState(false);
  const { user, isRecruiter } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure user is a recruiter
    if (user && !isRecruiter) {
      console.log("Redirecting non-recruiter from recruiter portal to dashboard");
      navigate('/dashboard');
    }
  }, [user, isRecruiter, navigate]);

  return (
    <DashboardLayout userType="recruiter">
      <div className="container mx-auto p-6">
        <PageHeader
          title="Recruiter Dashboard"
          description="Manage job postings, candidates, and analytics"
        >
          <Button onClick={() => setShowJobForm(!showJobForm)}>
            <FilePlus className="mr-2 h-4 w-4" />
            {showJobForm ? "Hide Form" : "Post New Job"}
          </Button>
        </PageHeader>

        {!showJobForm && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Job Postings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +2 since last month
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <BriefcaseIcon className="h-4 w-4 mr-2" />
                    View Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Candidates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +10 since last month
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    View Candidates
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  +2% since last month
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showJobForm && (
          <div className="mt-8">
            <JobPostForm />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecruiterPortal;
