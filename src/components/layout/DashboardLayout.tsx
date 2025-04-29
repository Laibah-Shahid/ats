
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  BriefcaseIcon, 
  FileTextIcon, 
  HomeIcon, 
  LogOut, 
  Menu, 
  SettingsIcon, 
  Upload, 
  UserIcon, 
  Users 
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
  userType?: "candidate" | "recruiter" | "admin";
}

const DashboardLayout = ({ children, userType = "candidate" }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const candidateLinks = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    { name: "Upload Resume", path: "/upload-resume", icon: Upload },
    { name: "Job Listings", path: "/jobs", icon: BriefcaseIcon },
    { name: "Profile", path: "/profile", icon: UserIcon },
  ];

  const recruiterLinks = [
    { name: "Dashboard", path: "/dashboard", icon: HomeIcon },
    { name: "Resume List", path: "/resumes", icon: FileTextIcon },
    { name: "Job Listings", path: "/jobs", icon: BriefcaseIcon },
    { name: "Recruiter Portal", path: "/recruiter", icon: Users },
    { name: "Analytics", path: "/insights", icon: BarChart3 },
    { name: "Profile", path: "/profile", icon: UserIcon },
  ];

  const links = userType === "recruiter" || userType === "admin" ? recruiterLinks : candidateLinks;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed z-40 top-0 left-0 h-screen w-64 bg-jobaura-blue-light border-r border-border transform transition-transform duration-200 ease-in-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-base">JA</span>
              </div>
              <span className="text-lg font-bold gradient-text">JobAura</span>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm rounded-md transition-colors",
                      location.pathname === link.path
                        ? "bg-jobaura-purple/10 text-primary font-medium"
                        : "text-gray-400 hover:text-white hover:bg-jobaura-blue/50"
                    )}
                  >
                    <link.icon size={18} className="mr-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-border">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/settings"
                  className="flex items-center px-3 py-2.5 text-sm text-gray-400 rounded-md hover:text-white hover:bg-jobaura-blue/50 transition-colors"
                >
                  <SettingsIcon size={18} className="mr-3" />
                  Settings
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="flex items-center px-3 py-2.5 text-sm text-gray-400 rounded-md hover:text-white hover:bg-jobaura-blue/50 transition-colors"
                >
                  <LogOut size={18} className="mr-3" />
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between p-4 bg-jobaura-black/80 backdrop-blur-md border-b border-border">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-base">JA</span>
            </div>
            <span className="text-lg font-bold gradient-text">JobAura</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu size={20} />
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-jobaura-black/50 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
