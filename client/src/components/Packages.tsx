import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Packages() {
  const packages = [
    {
      name: "Keras Swin UNet",
      description: "Advanced U-Net implementation with Swin Transformer architecture for medical image segmentation tasks. Combines the power of Vision Transformers with U-Net for superior segmentation performance.",
      image: "/images/keras-swin-unet.svg",
      link: "https://github.com/L-A-Sandhu/keras-swin-unet",
      tags: ["Python", "Keras", "Medical Imaging", "Vision Transformers"]
    },
    {
      name: "Time Mesh",
      description: "Temporal mesh networks for advanced time series forecasting and temporal pattern analysis. Revolutionary approach to capturing long-range dependencies in time series data.",
      image: "/images/time-mesh.svg",
      link: "https://github.com/L-A-Sandhu/TimeMesh",
      tags: ["PyTorch", "Time Series", "Forecasting", "Deep Learning"]
    },
    {
      name: "Physics Informed AI",
      description: "Physics-informed neural networks incorporating physical laws into deep learning models for scientific computing. Ensures physically consistent predictions while leveraging data-driven learning.",
      image: "/images/physics-informed-ai.svg",
      link: "https://github.com/L-A-Sandhu/Physics-Informed-Vectors-For-Wind-Speed-Prediction",
      tags: ["TensorFlow", "Physics", "Scientific ML", "PINNs"]
    },
    {
      name: "Edge AI Optimizer",
      description: "Comprehensive toolkit for optimizing AI models for edge devices and memory-constrained environments. Reduces model size while maintaining accuracy for real-time deployment.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      link: "https://github.com/L-A-Sandhu/edge-ai-optimizer",
      tags: ["Edge AI", "Optimization", "Model Compression", "Hardware Acceleration"]
    },
    {
      name: "Wind Predictor",
      description: "State-of-the-art wind speed prediction system using physics-informed neural networks for renewable energy applications. Achieves superior accuracy in short-term wind forecasting.",
      image: "https://images.unsplash.com/photo-1533628635777-112b2239b1c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      link: "https://github.com/L-A-Sandhu/wind-predictor",
      tags: ["Forecasting", "Energy", "Renewable", "Weather"]
    },
    {
      name: "CV Tools",
      description: "Computer vision toolkit featuring advanced image processing and facial expression recognition capabilities. Includes state-of-the-art face detection and emotion recognition algorithms.",
      image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      link: "https://github.com/L-A-Sandhu/cv-tools",
      tags: ["OpenCV", "Computer Vision", "Face Recognition", "Image Processing"]
    },
  ];

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Packages</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Open-source packages and tools for machine learning and AI research.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <Card key={index} className="package-card academic-card overflow-hidden">
              <div className="relative">
                <img 
                  src={pkg.image} 
                  alt={pkg.name}
                  className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => window.open(pkg.image, '_blank')}
                />
              </div>
              <CardContent className="package-card-content p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                  <a
                    href={pkg.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {pkg.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {pkg.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
