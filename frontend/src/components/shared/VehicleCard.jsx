import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { Car, Fuel, Gauge, Calendar, Phone, MessageCircle } from "lucide-react";

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    sessionStorage.setItem('selectedVehicleId', vehicle.id);
    navigate(createPageUrl('VehicleDetail'));
  };

  const handleCall = () => {
    window.open('tel:+61419330301', '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} priced at $${vehicle.price?.toLocaleString()}. Can you provide more information?`);
    window.open(`https://wa.me/61419330301?text=${message}`, '_blank');
  };

  const calculateStandardWeeklyPayment = (price) => {
    if (!price) return null;
    const principal = price * 0.90; // 10% deposit
    const monthlyRate = 0.0599 / 12; // 5.99% annual rate
    const termInMonths = 60; // 5 years

    if (principal <= 0) return 0;
    
    // Monthly payment formula for an amortizing loan
    // M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / (Math.pow(1 + monthlyRate, termInMonths) - 1);
    const weeklyPayment = (monthlyPayment * 12) / 52;
    
    return weeklyPayment.toFixed(0);
  };
  
  const weeklyPayment = calculateStandardWeeklyPayment(vehicle.price);

  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden luxury-shadow group hover:scale-[1.02] transition-all duration-300">
      {/* Vehicle Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={vehicle.images?.[0] || "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop"}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Price Badge */}
        <div className="absolute top-4 left-4">
          <Badge className="gradient-red text-zinc-50 text-lg font-bold px-3 py-1">
            ${vehicle.price?.toLocaleString()}
          </Badge>
        </div>
        
        {/* Status Badges */}
        <div className="absolute top-4 right-4 space-y-2">
          {vehicle.badges?.slice(0, 2).map((badge, index) => (
            <Badge key={index} variant="secondary" className="bg-zinc-800/90 text-zinc-300 block">
              {badge}
            </Badge>
          ))}
        </div>

        {/* Finance Overlay */}
        {weeklyPayment && (
          <div className="absolute bottom-4 left-4">
            <Badge variant="outline" className="bg-zinc-800/90 border-zinc-600 text-zinc-300">
              From ${weeklyPayment}/week
            </Badge>
          </div>
        )}
      </div>

      {/* Vehicle Details */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-zinc-50 mb-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-zinc-400 text-sm line-clamp-2">
            {vehicle.description || `${vehicle.engine || vehicle.fuel_type}`}
          </p>
        </div>

        {/* Key Specs */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="flex items-center space-x-2 text-zinc-400">
            <Gauge className="w-4 h-4" />
            <span>{vehicle.kilometers?.toLocaleString()} km</span>
          </div>
          <div className="flex items-center space-x-2 text-zinc-400">
            <Fuel className="w-4 h-4" />
            <span>{vehicle.fuel_type}</span>
          </div>
          <div className="flex items-center space-x-2 text-zinc-400">
            <Car className="w-4 h-4" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center space-x-2 text-zinc-400">
            <Calendar className="w-4 h-4" />
            <span>{vehicle.body_type}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleViewDetails}
            className="w-full gradient-red text-zinc-50 hover:opacity-90 font-semibold"
          >
            View Details
          </Button>
          <div className="flex space-x-2">
            <Button 
              onClick={handleCall}
              variant="outline" 
              size="sm" 
              className="flex-1 bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-800"
            >
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
            <Button 
              onClick={handleWhatsApp}
              variant="outline" 
              size="sm" 
              className="flex-1 bg-transparent border-zinc-700 text-zinc-400 hover:bg-zinc-800"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}