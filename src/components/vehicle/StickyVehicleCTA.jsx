import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Eye, Calendar } from "lucide-react";

export default function StickyVehicleCTA({ vehicle }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleCall = () => {
    window.open('tel:+61419330301', '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (Stock: ${vehicle.id?.substring(0, 8).toUpperCase()}). Can you provide more information?`);
    window.open(`https://wa.me/61419330301?text=${message}`, '_blank');
  };

  const handleEnquire = () => {
    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
      enquiryForm.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="hidden md:block">
          <h3 className="font-bold text-zinc-50">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
          <p className="text-lg font-bold text-red-500">${vehicle.price?.toLocaleString()}</p>
        </div>
        
        <div className="flex space-x-3 flex-1 md:flex-none justify-center md:justify-end">
          <Button 
            onClick={handleCall}
            className="gradient-red text-zinc-50 hover:opacity-90"
          >
            <Phone className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Call</span>
          </Button>
          <Button 
            onClick={handleWhatsApp}
            variant="outline" 
            className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">WhatsApp</span>
          </Button>
          <Button 
            onClick={handleEnquire}
            variant="outline" 
            className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <Eye className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Enquire</span>
          </Button>
          <Button 
            variant="outline" 
            className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <Calendar className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Test Drive</span>
          </Button>
        </div>
      </div>
    </div>
  );
}