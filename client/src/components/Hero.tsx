import { Download, Github, Linkedin, GraduationCap, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="pt-16 academic-gradient min-h-[80vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              ML Engineer & 
              <span className="text-blue-600"> AI Researcher</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              Expert in Edge AI, Computer Vision, and sustainable AI systems with 27 citations and 11 publications.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button 
                onClick={scrollToContact}
                className="btn-primary"
              >
                Get in Touch
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 transition-colors duration-200"
                onClick={() => window.open("/resume.pdf", "_blank")}
              >
                <Download className="mr-2 h-4 w-4" />
                Download CV
              </Button>
            </div>
            <div className="mt-6 flex space-x-6">
              <a
                href="https://github.com/L-A-Sandhu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                title="GitHub Profile"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/laeeq-aslam/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                title="LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://scholar.google.com/citations?user=oGVYJ5wAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                title="Google Scholar"
              >
                <GraduationCap className="h-5 w-5" />
              </a>
              <a
                href="mailto:204608004@csu.edu.cn"
                className="text-gray-400 hover:text-blue-600 transition-colors duration-200"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="profile-img-container">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800" 
                alt="Laeeq Aslam" 
                className="profile-img"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
