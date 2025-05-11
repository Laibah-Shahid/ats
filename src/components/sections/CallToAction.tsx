
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-jobaura-purple/20 to-transparent"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Hiring Process?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of companies using JobAura to find their perfect candidates.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg">Get Started Today</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Browse Jobs</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
