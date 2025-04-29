
import { Link } from "react-router-dom";
import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-jobaura-black border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">JA</span>
              </div>
              <span className="text-xl font-bold gradient-text">JobAura</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              AI-powered applicant tracking system that matches the right talent with the right opportunities.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://twitter.com" className="text-gray-400 hover:text-primary transition-colors">
                <TwitterLogoIcon className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-primary transition-colors">
                <LinkedInLogoIcon className="w-5 h-5" />
              </a>
              <a href="https://github.com" className="text-gray-400 hover:text-primary transition-colors">
                <GitHubLogoIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><a href="/#features" className="text-gray-400 hover:text-white text-sm">Features</a></li>
              <li><a href="/#how-it-works" className="text-gray-400 hover:text-white text-sm">How it works</a></li>
              <li><a href="/#pricing" className="text-gray-400 hover:text-white text-sm">Pricing</a></li>
              <li><Link to="/jobs" className="text-gray-400 hover:text-white text-sm">Job Board</Link></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">For</h3>
            <ul className="space-y-3">
              <li><a href="/#for-recruiters" className="text-gray-400 hover:text-white text-sm">Recruiters</a></li>
              <li><a href="/#for-job-seekers" className="text-gray-400 hover:text-white text-sm">Job Seekers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Enterprises</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Partners</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} JobAura. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
