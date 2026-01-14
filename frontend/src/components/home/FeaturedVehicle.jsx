import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { Eye, Phone, MessageCircle, Play } from "lucide-react";

export default function FeaturedVehicle({ vehicle }) {
  if (!vehicle) return null;

  const handleViewDetails = () => {
    window.open(createPageUrl(`VehicleDetail?id=${vehicle.id}`), '_self');
  };

  const handleCall = () => {
    window.open('tel:+61419330301', '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the featured ${vehicle.year} ${vehicle.make} ${vehicle.model}. Can you provide more information?`);
    window.open(`https://wa.me/61419330301?text=${message}`, '_blank');
  };
  
  const calculateStandardWeeklyPayment = (price) => {
    if (!price) return null;
    const principal = price * 0.90;
    const monthlyRate = 0.0599 / 12;
    const termInMonths = 60;

    if (principal <= 0) return 0;
    
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / (Math.pow(1 + monthlyRate, termInMonths) - 1);
    const weeklyPayment = (monthlyPayment * 12) / 52;
    
    return weeklyPayment.toFixed(0);
  };

  const weeklyPayment = calculateStandardWeeklyPayment(vehicle.price);

  return (
    <section className="py-12 md:py-20 bg-zinc-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <Badge className="gradient-red text-zinc-50 text-sm px-4 py-2 mb-4">
            Car of the Week
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-50 mb-4">
            Featured Selection
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            Handpicked for excellence, showcasing the finest in prestige motoring
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Vehicle Image */}
          <div className="relative group">
            <div className="aspect-[16/9] md:aspect-[4/3] rounded-2xl overflow-hidden luxury-shadow">
              <img
                src={vehicle.images?.[0] || "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop"}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Play Button Overlay - Hidden on mobile for better UX */}
            <button className="hidden md:flex absolute inset-0 items-center justify-center group">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-zinc-50 ml-1" />
              </div>
            </button>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4 md:space-y-6">
            <div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-zinc-50 mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-zinc-400 text-base md:text-lg">{vehicle.description}</p>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-zinc-800 rounded-lg p-3 md:p-4">
                <p className="text-zinc-400 text-xs md:text-sm">Kilometers</p>
                <p className="text-zinc-50 font-semibold text-sm md:text-base">{vehicle.kilometers?.toLocaleString()} km</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3 md:p-4">
                <p className="text-zinc-400 text-xs md:text-sm">Fuel Type</p>
                <p className="text-zinc-50 font-semibold text-sm md:text-base">{vehicle.fuel_type}</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3 md:p-4">
                <p className="text-zinc-400 text-xs md:text-sm">Transmission</p>
                <p className="text-zinc-50 font-semibold text-sm md:text-base">{vehicle.transmission}</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3 md:p-4">
                <p className="text-zinc-400 text-xs md:text-sm">Body Type</p>
                <p className="text-zinc-50 font-semibold text-sm md:text-base">{vehicle.body_type}</p>
              </div>
            </div>

            {/* Badges */}
            {vehicle.badges && vehicle.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {vehicle.badges.map((badge, index) => (
                  <Badge key={index} variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300 text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}

            {/* Price & Finance */}
            <div className="bg-zinc-800 rounded-xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-4 gap-2">
                <div>
                  <p className="text-zinc-400 text-xs md:text-sm">Price</p>
                  <p className="text-2xl md:text-3xl font-bold text-zinc-50">
                    ${vehicle.price?.toLocaleString()}
                  </p>
                </div>
                {weeklyPayment && (
                  <div className="text-left sm:text-right">
                    <p className="text-zinc-400 text-xs md:text-sm">From</p>
                    <p className="text-lg md:text-xl text-red-500 font-semibold">
                      ${weeklyPayment}/week
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleViewDetails}
                  className="flex-1 gradient-red text-zinc-50 hover:opacity-90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button 
                  onClick={handleCall}
                  variant="outline" 
                  className="flex-1 sm:flex-none bg-transparent border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button 
                  onClick={handleWhatsApp}
                  variant="outline" 
                  className="flex-1 sm:flex-none bg-transparent border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}