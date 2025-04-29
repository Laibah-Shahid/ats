
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const UploadTips = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-jobaura-blue-light border-jobaura-blue">
        <CardHeader>
          <CardTitle>Tips for Success</CardTitle>
          <CardDescription>Make your resume stand out</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2">
            <div className="mt-0.5">
              <InfoIcon size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Highlight your skills</p>
              <p className="text-xs text-gray-400">
                Make sure to clearly list your technical and soft skills.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="mt-0.5">
              <InfoIcon size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Use keywords</p>
              <p className="text-xs text-gray-400">
                Include industry-specific keywords that match job descriptions.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="mt-0.5">
              <InfoIcon size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Quantify achievements</p>
              <p className="text-xs text-gray-400">
                Use numbers to demonstrate your impact and results.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="mt-0.5">
              <InfoIcon size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Format for readability</p>
              <p className="text-xs text-gray-400">
                Use clear sections, bullet points, and consistent formatting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-primary/10 border-primary text-foreground">
        <InfoIcon className="h-4 w-4 text-primary" />
        <AlertTitle>Resume Visibility</AlertTitle>
        <AlertDescription className="text-xs text-gray-300">
          Your resume will only be visible to companies that you apply to or approve. You can manage visibility settings in your profile.
        </AlertDescription>
      </Alert>
    </div>
  );
};
