import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Enquiry, Booking, Staff, CalendarBlock, Vehicle } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Car, Gauge, Fuel, Cog, Palette, Users, Calendar, Shield, Phone, MessageCircle, X,
  CheckCircle, FileText, Star, Send // Added Send icon
} from "lucide-react";

import VehicleImageGallery from "../components/vehicle/VehicleImageGallery";
import VehicleEnquiryForm from "../components/vehicle/VehicleEnquiryForm";
import VehicleFinanceCalculator from "../components/vehicle/VehicleFinanceCalculator";
import StickyVehicleCTA from "../components/vehicle/StickyVehicleCTA";
import VehicleCard from "../components/shared/VehicleCard";

export default function VehicleDetail() {
  const [vehicle, setVehicle] = useState(null);
  const [relatedVehicles, setRelatedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showMobileEnquiry, setShowMobileEnquiry] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const id = sessionStorage.getItem('selectedVehicleId');

    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    let isMounted = true;

    const fetchVehicle = async () => {
      setLoading(true);
      setNotFound(false);

      try {
        const allVehicles = await Vehicle.list();
        
        if (!isMounted) return;
        
        const vehicleData = allVehicles.find(v => v.id === id);
        
        if (vehicleData) {
          setVehicle(vehicleData);
          const related = allVehicles.filter(v => v.make === vehicleData.make && v.id !== vehicleData.id).slice(0, 3);
          setRelatedVehicles(related);
          setNotFound(false);
        } else {
          setVehicle(null);
          setNotFound(true);
        }
      } catch (error) {
        console.error("Failed to fetch vehicle:", error);
        if (isMounted) {
          setVehicle(null);
          setNotFound(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVehicle();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [location]);

  const calculateStandardWeeklyPayment = (price) => {
    if (!price) return null;
    const principal = price * 0.90; // 10% deposit
    const monthlyRate = 0.0599 / 12; // 5.99% annual rate
    const termInMonths = 60; // 5 years

    if (principal <= 0) return 0;

    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) / (Math.pow(1 + monthlyRate, termInMonths) - 1);
    const weeklyPayment = (monthlyPayment * 12) / 52;

    return weeklyPayment.toFixed(0);
  };

  const handleQuickEnquiry = () => {
    setShowMobileEnquiry(true);
  };

  const handleCall = () => {
    window.open('tel:+61419330301', '_self');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.price?.toLocaleString()}). Can you tell me more?`);
    window.open(`https://wa.me/61419330301?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (notFound || !vehicle) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-50 mb-4">Vehicle Not Found</h1>
          <p className="text-zinc-400 mb-6">This vehicle may have been sold or is no longer available.</p>
          <Link to={createPageUrl("Browse")}>
            <Button className="gradient-red text-zinc-50">Browse Other Vehicles</Button>
          </Link>
        </div>
      </div>
    );
  }

  const specItems = [
    { icon: Gauge, label: "Kilometers", value: `${vehicle.kilometers?.toLocaleString()} km` },
    { icon: Calendar, label: "Year", value: vehicle.year },
    { icon: Fuel, label: "Fuel Type", value: vehicle.fuel_type },
    { icon: Cog, label: "Transmission", value: vehicle.transmission },
    { icon: Car, label: "Body Type", value: vehicle.body_type },
    { icon: Shield, label: "Drivetrain", value: vehicle.drivetrain },
    { icon: Palette, label: "Exterior", value: vehicle.exterior_color },
    { icon: Users, label: "Previous Owners", value: vehicle.owners || 'Contact Us' },
  ];

  const weeklyPayment = calculateStandardWeeklyPayment(vehicle.price);

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Structured Data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Vehicle",
          "name": `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          "brand": vehicle.make,
          "model": vehicle.model,
          "vehicleModelDate": vehicle.year,
          "mileageFromOdometer": vehicle.kilometers,
          "fuelType": vehicle.fuel_type,
          "vehicleTransmission": vehicle.transmission,
          "bodyType": vehicle.body_type,
          "color": vehicle.exterior_color,
          "offers": {
            "@type": "Offer",
            "price": vehicle.price,
            "priceCurrency": "AUD",
            "availability": "https://schema.org/InStock"
          }
        })}
      </script>

      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 pt-6">
        <nav className="text-sm text-zinc-400 mb-6">
          <Link to={createPageUrl("Home")} className="hover:text-red-500 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to={createPageUrl("Browse")} className="hover:text-red-500 transition-colors">Browse</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-50">{vehicle.year} {vehicle.make} {vehicle.model}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 pb-24"> {/* Changed pb-12 to pb-24 for mobile sticky bar */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              {/* Vehicle Title & Key Info */}
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-zinc-50 mb-2"> {/* Changed h1 text size */}
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300">
                    Stock: {vehicle.id?.substring(0, 8).toUpperCase()}
                  </Badge>
                  {vehicle.vin && (
                    <Badge variant="outline" className="bg-zinc-800 border-zinc-700 text-zinc-300">
                      VIN: {vehicle.vin.substring(0, 8)}***
                    </Badge>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {vehicle.badges?.map((badge, index) => (
                    <Badge key={index} className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Image Gallery */}
              <VehicleImageGallery vehicle={vehicle} />

              {/* Mobile-First Price & Action Bar */}
              <div className="bg-zinc-900 rounded-xl p-4 lg:p-6"> {/* Adjusted padding */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4"> {/* Adjusted flex for mobile */}
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Drive Away Price</p>
                    <p className="text-3xl md:text-4xl font-bold text-zinc-50"> {/* Adjusted price text size */}
                      ${vehicle.price?.toLocaleString()}
                    </p>
                  </div>
                  {weeklyPayment && (
                    <div className="text-left sm:text-right mt-2 sm:mt-0"> {/* Adjusted margin for mobile */}
                      <p className="text-sm text-zinc-400">Finance from</p>
                      <p className="text-xl md:text-2xl font-bold text-red-500"> {/* Adjusted weekly payment text size */}
                        ${weeklyPayment}/week*
                      </p>
                    </div>
                  )}
                </div>

                {/* Mobile Action Buttons - visible on mobile, hidden on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:hidden">
                  <Button
                    onClick={handleCall}
                    className="gradient-red text-zinc-50 hover:opacity-90 font-semibold"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    className="bg-green-600 hover:bg-green-700 text-zinc-50 font-semibold"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    onClick={handleQuickEnquiry}
                    variant="outline"
                    className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-semibold"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enquire
                  </Button>
                </div>

                <p className="text-xs text-zinc-500 mt-3">*Finance based on a 5-year term, 10% deposit, and 5.99% p.a. comparison rate. Subject to approval.</p>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specItems.slice(0, 4).map((spec, index) => {
                  const Icon = spec.icon;
                  return (
                    <div key={index} className="bg-zinc-800 rounded-lg p-3 md:p-4 text-center"> {/* Adjusted padding */}
                      <Icon className="w-4 h-4 md:w-5 md:h-5 text-red-500 mx-auto mb-2" /> {/* Adjusted icon size */}
                      <p className="text-xs text-zinc-400 mb-1">{spec.label}</p>
                      <p className="text-sm font-semibold text-zinc-50">{spec.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-4 bg-zinc-900 p-1 rounded-lg">
                <TabsTrigger value="overview" className="data-[state=active]:bg-red-500 data-[state=active]:text-zinc-50">Overview</TabsTrigger>
                <TabsTrigger value="specs" className="data-[state=active]:bg-red-500 data-[state=active]:text-zinc-50">Specifications</TabsTrigger>
                <TabsTrigger value="features" className="data-[state=active]:bg-red-500 data-[state=active]:text-zinc-50">Features</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-red-500 data-[state=active]:text-zinc-50">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-50">Vehicle Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-zinc-400 leading-relaxed mb-4">
                      {vehicle.description || `This ${vehicle.year} ${vehicle.make} ${vehicle.model} represents exceptional value in the prestige vehicle market.`}
                    </p>
                    {vehicle.engine && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-zinc-50 mb-2">Engine</h4>
                        <p className="text-zinc-400">{vehicle.engine}</p>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-zinc-50 mb-2">Exterior Color</h4>
                        <p className="text-zinc-400">{vehicle.exterior_color || 'Contact for details'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-50 mb-2">Interior</h4>
                        <p className="text-zinc-400">{vehicle.interior_color || 'Contact for details'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specs" className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-50">Technical Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {specItems.map((spec, index) => {
                        const Icon = spec.icon;
                        return (
                          <div key={index} className="flex items-center space-x-3">
                            <Icon className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-zinc-400">{spec.label}</p>
                              <p className="font-semibold text-zinc-50">{spec.value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-50">Features & Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {vehicle.features && vehicle.features.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-3">
                        {vehicle.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-zinc-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-zinc-400">Contact us for a complete features list for this vehicle.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle className="text-zinc-50">Vehicle History & Ownership</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {vehicle.owners && (
                      <div>
                        <h4 className="font-semibold text-zinc-50 mb-2">Previous Owners</h4>
                        <p className="text-zinc-400">{vehicle.owners} previous owner{vehicle.owners !== 1 ? 's' : ''}</p>
                      </div>
                    )}
                    {vehicle.service_history && (
                      <div>
                        <h4 className="font-semibold text-zinc-50 mb-2">Service History</h4>
                        <p className="text-zinc-400">{vehicle.service_history}</p>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-zinc-50 mb-2">Registration</h4>
                      <p className="text-zinc-400">{vehicle.registration || 'Contact for registration details'}</p>
                    </div>
                    <Separator className="bg-zinc-700" />
                    <div className="bg-zinc-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-5 h-5 text-red-500" />
                        <h4 className="font-semibold text-zinc-50">Inspection Report</h4>
                      </div>
                      <p className="text-zinc-400 text-sm mb-3">Full independent inspection report available upon request.</p>
                      <Button variant="outline" size="sm" className="bg-transparent border-zinc-600 text-zinc-300 hover:bg-zinc-700">
                        Request Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Dealer's Comments */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-zinc-50 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-red-500" />
                        Dealer's Comments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-invert prose-p:text-zinc-400 text-zinc-400 leading-relaxed">
                        <p>
                          {vehicle.dealer_comments || "This vehicle has been meticulously inspected by our certified technicians and has passed our rigorous 120-point safety and quality check. It comes with a full service history, two sets of keys, and a clear title guarantee. As a VACC accredited dealer, we pride ourselves on transparency and quality. Enquire today for a personalized walkaround video or to book a test drive at our Bayside showroom."}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Related Vehicles */}
            {relatedVehicles.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-zinc-50">Similar Vehicles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedVehicles.map((relatedVehicle) => (
                    <VehicleCard key={relatedVehicle.id} vehicle={relatedVehicle} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Enquiry & Finance (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-4 space-y-6"> {/* Hidden on mobile */}
            <VehicleEnquiryForm vehicle={vehicle} />

            {/* Finance Calculator */}
            <VehicleFinanceCalculator vehicle={vehicle} />

            {/* Quick Actions */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6 space-y-3">
                <Button
                  onClick={handleCall}
                  className="w-full gradient-red text-zinc-50 hover:opacity-90"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call (04) 1933 0301
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-zinc-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Us
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Test Drive
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Enquiry Modal */}
      {showMobileEnquiry && (
        <div className="fixed inset-0 z-50 lg:hidden"> {/* Only visible on mobile */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileEnquiry(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-zinc-50">Quick Enquiry</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileEnquiry(false)}
                className="text-zinc-400"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <VehicleEnquiryForm vehicle={vehicle} />
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 p-4">
        <div className="flex space-x-3">
          <Button
            onClick={handleCall}
            className="flex-1 gradient-red text-zinc-50 hover:opacity-90 font-semibold py-3"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button
            onClick={handleWhatsApp}
            className="flex-1 bg-green-600 hover:bg-green-700 text-zinc-50 font-semibold py-3"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          <Button
            onClick={handleQuickEnquiry}
            variant="outline"
            className="flex-1 bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-semibold py-3"
          >
            <Send className="w-4 h-4 mr-2" />
            Enquire
          </Button>
        </div>
      </div>

      {/* Sticky CTA Bar (Desktop Only) */}
      <StickyVehicleCTA vehicle={vehicle} className="hidden lg:block" /> {/* Hidden on mobile */}
    </div>
  );
}