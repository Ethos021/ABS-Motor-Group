import React from "react";
import { Shield, Car, HandCoins, Truck, FileText, Landmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const services = [
    {
      icon: Car,
      title: "Hand-Picked Vehicles",
      description: "A huge array of hand-picked vehicles ready to be viewed on-site with new stock arriving daily."
    },
    {
      icon: HandCoins,
      title: "Trade-In Appraisals",
      description: "We trade-in all makes and models with competitive trade-in appraisals on the spot."
    },
    {
      icon: Truck,
      title: "Australia-Wide Delivery",
      description: "Efficient door-to-door delivery for our interstate customers."
    },
    {
      icon: Shield,
      title: "Extended Warranties",
      description: "Peace of mind with a range of extended warranty options."
    },
    {
      icon: Landmark,
      title: "Multiple Finance Options",
      description: "Access to a vast choice of lenders to find the best finance solution for you."
    },
    {
      icon: FileText,
      title: "Sell Direct To Us",
      description: "Sell your vehicle directly to us with an easy and fast turnaround time."
    }
  ];
  
  const userLogoUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d3e32641e7d562fa3996cf/c9b06a35a_8.jpg";

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=1920&h=800&fit=crop"
            alt="Luxury Car Showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 to-zinc-900/60" />
        </div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-zinc-50 mb-6">
              About {" "}
              <span className="text-red-500">
                A.B.S Motor Group
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed">
              The home of prestige, luxury vehicles.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-zinc-900">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-zinc-50 mb-6">Our Dealership</h2>
              <div className="space-y-6 text-zinc-400 leading-relaxed">
                <p>ABS Motor Group is built around one simple belief, that buying a car should be clear, honest, and uncomplicated.</p>
                <p>We are a dealership group that values quality over volume and long-term relationships over short-term sales. From your first enquiry through to handover, our focus is on providing clear information, considered advice, and a professional experience at every step.</p>
                <p>Our vehicle range is carefully selected and presented to a high standard, both online and in person. Each car is inspected, accurately represented, and supported by a team that understands what matters most to buyers: value, condition, and confidence in their choice.</p>
                <p>At ABS Motor Group, we aim to make the process feel effortless. No unnecessary pressure, no mixed messages, just a straightforward approach and the right vehicle for your needs. </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558284344-9c95ad9e678a?w=800&h=600&fit=crop"
                alt="Cobra car in showroom"
                className="rounded-2xl luxury-shadow"
              />
              <div className="absolute -bottom-8 -left-8 bg-zinc-800 rounded-xl p-4 flex items-center space-x-4 border border-zinc-700">
                  <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center p-1">
                      <img src="https://images.squarespace-cdn.com/content/v1/5e718e24c539f905c3d25f29/1585292728987-9VBC1Y92TO4Y09C6I4D9/VACC-logo.png" alt="VACC Logo" className="object-contain" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-50">VACC Accredited</p>
                    <p className="text-zinc-400 text-sm">LMCT 12986</p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-6">
              Our Services
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              A range of services to compliment the purchase of your next vehicle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-colors group">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 gradient-red rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <Icon className="w-8 h-8 text-zinc-50" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-50 mb-4 text-center">{service.title}</h3>
                    <p className="text-zinc-400 leading-relaxed text-center">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}