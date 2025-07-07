import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import type { Citation } from "@shared/schema";

export default function About() {
  const { data: citationData } = useQuery<Citation>({
    queryKey: ["/api/citations"],
  });

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">About Me</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A passionate researcher and engineer dedicated to advancing AI technology for sustainable solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Professional Summary</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Machine Learning Engineer with 10+ years of experience in AI research, deep learning, and real-time deployment across academia, industry, and research. Specializing in sustainable AI systems, Edge AI, and Computer Vision.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              I have optimized models that improved efficiency by 30% and reduced inference time by 20%. Proven expertise in algorithm optimization, cloud-based model deployment, and hardware acceleration.
            </p>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Research Impact</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {citationData?.totalCitations || 27}
                    </div>
                    <div className="text-sm text-gray-600">Total Citations</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">11</div>
                    <div className="text-sm text-gray-600">Publications</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Education & Experience</h3>
            <div className="space-y-6">
              <Card className="border-l-4 border-blue-600 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">PhD in Control Science & Machine Learning</h4>
                  <p className="text-blue-600 font-medium mb-1">Central South University, China</p>
                  <p className="text-gray-600 text-sm mb-3">2020 – Present</p>
                  <p className="text-gray-600 text-sm">Research focus: Sustainable AI systems, Edge AI, and Computer Vision</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">MS in Electronic Engineering</h4>
                  <p className="text-gray-700 font-medium mb-1">International Islamic University, Pakistan</p>
                  <p className="text-gray-600 text-sm mb-3">2015 – 2017 (Gold Medalist)</p>
                  <p className="text-gray-600 text-sm">Outstanding academic performance in electronic engineering</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">AI/ML Consultant</h4>
                  <p className="text-gray-700 font-medium mb-1">Bond and Built Pvt Ltd</p>
                  <p className="text-gray-600 text-sm mb-3">July 2024 – March 2025</p>
                  <p className="text-gray-600 text-sm">Strategic AI consulting and implementation</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-gray-300 hover:border-blue-500 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Machine Learning Engineer</h4>
                  <p className="text-gray-700 font-medium mb-1">DLISION, Pakistan</p>
                  <p className="text-gray-600 text-sm mb-3">May 2021 – Sept 2022</p>
                  <p className="text-gray-600 text-sm">Full-stack ML development and deployment</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
