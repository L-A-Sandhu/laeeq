import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/publications", label: "Publications" },
    { href: "/#about", label: "About" },
    { href: "/#research", label: "Research" },
    { href: "/#packages", label: "Packages" },
    { href: "/#contact", label: "Contact" },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.substring(2);
      if (location !== "/") {
        window.location.href = href;
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-xl font-semibold text-gray-900 cursor-pointer">
                Laeeq Aslam
              </h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href.startsWith("/#") ? "/" : item.href}
                  onClick={() => handleNavClick(item.href)}
                  className={`nav-link px-3 py-2 text-sm font-medium transition-colors ${
                    (location === "/" && item.href === "/") ||
                    (location === "/publications" && item.href === "/publications")
                      ? "text-blue-600 active"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href.startsWith("/#") ? "/" : item.href}
                onClick={() => handleNavClick(item.href)}
                className={`block px-3 py-2 text-base font-medium transition-colors ${
                  (location === "/" && item.href === "/") ||
                  (location === "/publications" && item.href === "/publications")
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
