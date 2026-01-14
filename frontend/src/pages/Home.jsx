import React, { useState, useEffect } from "react";
import { Vehicle } from "@/api/entities";
import HeroSection from "../components/home/HeroSection";
import QuickActionCards from "../components/home/QuickActionCards";
import NewArrivals from "../components/home/NewArrivals";
import WhyAutohaus from "../components/home/WhyAutohaus";
import ShowroomLocation from "../components/home/ShowroomLocation";

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const allVehicles = await Vehicle.list("-created_date");
      setVehicles(allVehicles);
      setLoading(false);
    } catch (error) {
      console.error("Error loading vehicles:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <QuickActionCards />
      <NewArrivals vehicles={vehicles} />
      <WhyAutohaus />
      <ShowroomLocation />
    </div>
  );
}