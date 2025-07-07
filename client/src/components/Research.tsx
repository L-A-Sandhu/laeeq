import { Wind, Cpu, Eye, Lock, Zap, Radio, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Research() {
  const researchAreas = [
    {
      icon: Wind,
      title: "Wind Speed Prediction",
      description: "Physics-informed neural networks for accurate wind speed forecasting using spatio-temporal data.",
      color: "bg-blue-600",
    },
    {
      icon: Cpu,
      title: "Edge AI Optimization",
      description: "Hardware-centric optimization of neural networks for memory-constrained edge devices.",
      color: "bg-blue-600",
    },
    {
      icon: Eye,
      title: "Computer Vision",
      description: "Advanced image processing and facial expression recognition systems.",
      color: "bg-blue-600",
    },
    {
      icon: Lock,
      title: "Image Steganography",
      description: "Novel approaches to secure data hiding in digital images with enhanced security.",
      color: "bg-blue-600",
    },
    {
      icon: Zap,
      title: "Energy Systems",
      description: "Battery state-of-health estimation and energy system optimization using AI.",
      color: "bg-blue-600",
    },
    {
      icon: Radio,
      title: "Signal Processing",
      description: "Direction of arrival estimation and sensor array processing for wireless communications.",
      color: "bg-blue-600",
    },
  ];

  return (
    <section id="research" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Research Areas</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Exploring cutting-edge AI technologies for sustainable and efficient solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {researchAreas.map((area, index) => (
            <Card key={index} className="research-card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-8">
                <div className={`w-12 h-12 ${area.color} rounded-lg flex items-center justify-center mb-6`}>
                  <area.icon className="text-white h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{area.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {area.description}
                </p>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-800 p-0">
                  Explore Research
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
