
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  const userLogoUrl = "https://cdn.prod.website-files.com/68aefaa8e956052ea849f3a1/68b129e1e4c32f155e2e861d_logo%20edited.svg";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <style>{`
        :root {
          --primary-dark: #0a0a0a;
          --secondary-dark: #1a1a1a;
          --accent-red: #d50000;
          --text-primary: #fafafa;
          --text-secondary: #a1a1a1;
          --border-subtle: #2a2a2a;
        }
        
        body {
          background-color: var(--primary-dark);
          color: var(--text-primary);
        }
        
        .gradient-red {
          background: linear-gradient(135deg, var(--accent-red), #e53935);
        }
        
        .luxury-shadow {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
        }
        
        .glass-effect {
          backdrop-filter: blur(16px);
          background: rgba(26, 26, 26, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
              <div className="w-[90px] h-[90px] rounded-full flex items-center justify-center">
                <img src={userLogoUrl} alt="A.B.S Motor Group Logo" className="w-full h-full object-contain" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to={createPageUrl("Home")} 
                className={`text-sm font-medium transition-colors hover:text-red-500 ${
                  isActive("Home") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                Home
              </Link>
              <Link 
                to={createPageUrl("Browse")} 
                className={`text-sm font-medium transition-colors hover:text-red-500 ${
                  isActive("Browse") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                Browse Stock
              </Link>
              <Link 
                to={createPageUrl("Sell")} 
                className={`text-sm font-medium transition-colors hover:text-red-500 ${
                  isActive("Sell") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                Sell Your Car
              </Link>
              <Link 
                to={createPageUrl("Finance")} 
                className={`text-sm font-medium transition-colors hover:text-red-500 ${
                  isActive("Finance") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                Finance
              </Link>
              <Link 
                to={createPageUrl("About")} 
                className={`text-sm font-medium transition-colors hover:text-red-500 ${
                  isActive("About") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                About
              </Link>
              <Link 
                to={createPageUrl("Contact")} 
                className={`text-sm font-medium transition-colors hover:text-red-500 ${
                  isActive("Contact") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Quick Contact */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                asChild
              >
                <a href="tel:+61394840084">
                  <Phone className="w-4 h-4 mr-2" />
                  03 9484 0084
                </a>
              </Button>
              <Button size="sm" className="gradient-red text-zinc-50 hover:opacity-90" asChild>
                <Link to={createPageUrl("Contact")}>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Us
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              className="md:hidden" 
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                <div className="w-full h-0.5 bg-zinc-300"></div>
                <div className="w-full h-0.5 bg-zinc-300"></div>
                <div className="w-full h-0.5 bg-zinc-300"></div>
              </div>
            </Button>
          </nav>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-zinc-900">
            <nav className="container mx-auto px-6 py-4 space-y-3">
              <Link 
                to={createPageUrl("Home")} 
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive("Home") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                Home
              </Link>
              <Link 
                to={createPageUrl("Browse")} 
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive("Browse") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                Browse Stock
              </Link>
              <Link 
                to={createPageUrl("Sell")} 
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive("Sell") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                Sell Your Car
              </Link>
              <Link 
                to={createPageUrl("Finance")} 
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive("Finance") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                Finance
              </Link>
              <Link 
                to={createPageUrl("About")} 
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive("About") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                About
              </Link>
              <Link 
                to={createPageUrl("Contact")} 
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive("Contact") ? "text-red-500" : "text-zinc-300"
                }`}
              >
                Contact
              </Link>
              <div className="pt-3 border-t border-zinc-800">
                <Button 
                  size="sm" 
                  className="w-full gradient-red text-zinc-50"
                  asChild
                >
                  <a href="tel:+61394840084">
                    <Phone className="w-4 h-4 mr-2" />
                    03 9484 0084
                  </a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center">
                  <img src={userLogoUrl} alt="A.B.S Motor Group Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-50">A.B.S Motor Group</h3>
                </div>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              At ABS Motor Group, we make buying a car clear, honest, 
              and uncomplicated, offering carefully selected vehicles, 
              transparent advice, and a professional, pressure-free experience 
              from start to finish.
              </p>
              <div className="space-y-2">
                <a 
                  href="https://maps.app.goo.gl/uM1Xd5VUEJHa5S9X6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>17 Louis St, Airport West VIC 3042, Australia</span>
                </a>
                <div className="flex items-center space-x-2 text-sm text-zinc-400">
                  <Clock className="w-4 h-4" />
                  <span>Mon-Fri: 9:00am - 5:00pm</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-zinc-50 font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to={createPageUrl("Browse")} className="text-zinc-400 hover:text-red-500 transition-colors">Browse Stock</Link></li>
                <li><Link to={createPageUrl("Sell")} className="text-zinc-400 hover:text-red-500 transition-colors">Sell Your Car</Link></li>
                <li><Link to={createPageUrl("Finance")} className="text-zinc-400 hover:text-red-500 transition-colors">Finance</Link></li>
                <li><Link to={createPageUrl("About")} className="text-zinc-400 hover:text-red-500 transition-colors">About</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-zinc-50 font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-red-500" />
                  <a href="tel:+61394840084" className="text-zinc-400 hover:text-red-500 transition-colors">03 9484 0084</a>
                </li>
                <li className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-red-500" />
                  <a href="https://wa.me/61419330301" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-red-500 transition-colors">WhatsApp</a>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <div className="text-zinc-400">
                    <p>Mon-Fri: 8:30am-5:30pm</p>
                    <p>Sat-Sun: Closed</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-zinc-500">
              Copyright © 2025 A.B.S. Motor Group
            </p>
            <div className="flex space-x-6 text-xs text-zinc-500">
              <span>Privacy Policy</span>
              <span>Terms</span>
              <span>Sitemap</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Concierge Widget */}
      {/* <div className="fixed bottom-6 right-6 z-50">
        <Link to={createPageUrl("Contact")}>
          <Button className="gradient-red text-zinc-50 w-14 h-14 rounded-full luxury-shadow hover:opacity-90 transition-all">
            <MessageCircle className="w-6 h-6" />
          </Button>
        </Link>
      </div> */}
    </div>
  );
}
