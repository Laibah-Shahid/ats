
import { PageHeader } from "@/components/ui/page-header";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/resume/FileUpload";
import { ResumeForm } from "@/components/resume/ResumeForm";
import { UploadTips } from "@/components/resume/UploadTips";

const UploadResume = () => {
  return (
    <DashboardLayout>
      <PageHeader
        title="Upload Resume"
        description="Upload your resume to find matching job opportunities."
      />

      <Tabs defaultValue="paste-text" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="upload-file">Upload File</TabsTrigger>
          <TabsTrigger value="paste-text">Enter Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload-file">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <FileUpload />
            </div>
            <UploadTips />
          </div>
        </TabsContent>
        
        <TabsContent value="paste-text">
          <ResumeForm />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default UploadResume;
