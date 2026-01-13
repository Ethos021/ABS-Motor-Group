import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Search, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Vehicle } from "@/api/entities";

const heroImages = [
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d3e32641e7d562fa3996cf/f5c9dcd71_DSC01083.jpg",
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d3e32641e7d562fa3996cf/27a855d4d_DSC02396.jpg",
  "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68d3e32641e7d562fa3996cf/ee7f57bf5_DSC02406.jpg"
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    make: "",
    priceRange: [0, 500000],
    yearRange: [2015, 2024],
    kmRange: [0, 300000]
  });
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [showYearRange, setShowYearRange] = useState(false);
  const [showKmRange, setShowKmRange] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const data = await Vehicle.list();
    setVehicles(data);
  };

  const uniqueMakes = [...new Set(vehicles.map(v => v.make).filter(Boolean))].sort();
  
  // Generate year list from 2000 to current year
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i);
  
  // Generate KM ranges
  const kmRanges = [
    { label: "Under 50,000 km", value: [0, 50000] },
    { label: "50,000 - 100,000 km", value: [50000, 100000] },
    { label: "100,000 - 150,000 km", value: [100000, 150000] },
    { label: "150,000 - 200,000 km", value: [150000, 200000] },
    { label: "Above 200,000 km", value: [200000, 300000] }
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchFilters.make) params.append('make', searchFilters.make);
    
    // Get actual min/max prices from vehicles if available
    const prices = vehicles.map(v => v.price).filter(Boolean);
    const dataMinPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const dataMaxPrice = prices.length > 0 ? Math.max(...prices) : 500000;
    
    if (searchFilters.priceRange[0] !== dataMinPrice || searchFilters.priceRange[1] !== dataMaxPrice) {
      params.append('priceMin', searchFilters.priceRange[0].toString());
      params.append('priceMax', searchFilters.priceRange[1].toString());
    }
    if (searchFilters.yearRange[0] !== 2015 || searchFilters.yearRange[1] !== 2024) {
      params.append('yearMin', searchFilters.yearRange[0].toString());
      params.append('yearMax', searchFilters.yearRange[1].toString());
    }
    if (searchFilters.kmRange[0] !== 0 || searchFilters.kmRange[1] !== 300000) {
      params.append('kmMin', searchFilters.kmRange[0].toString());
      params.append('kmMax', searchFilters.kmRange[1].toString());
    }
    navigate(createPageUrl('Browse') + (params.toString() ? '?' + params.toString() : ''));
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Images with Ken Burns Effect */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={heroImages[currentImage]}
              alt="Luxury Vehicle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/90 via-zinc-900/70 to-zinc-900/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-500 text-sm font-medium tracking-wider">OPEN MON-FRI</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-6xl md:text-8xl font-bold text-zinc-50 mb-6 leading-[0.95] tracking-tight"
            >
              Welcome to{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                A.B.S Motor Group
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-zinc-300 mb-12 leading-relaxed max-w-2xl"
            >
              Expect the extraordinary with prestige vehicles, unmatched service, and tailored finance solutions built for you.
            </motion.p>

            {/* Quick Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="glass-effect rounded-2xl p-6 mb-8 max-w-4xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Make/Model */}
                <Select value={searchFilters.make} onValueChange={(value) => setSearchFilters({...searchFilters, make: value})}>
                  <SelectTrigger className={`bg-zinc-900/50 border-zinc-700/50 h-14 ${searchFilters.make ? 'text-zinc-300' : '[&>span]:text-zinc-400'}`}>
                    <SelectValue placeholder="Make / Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>All Makes</SelectItem>
                    {uniqueMakes.map(make => (
                      <SelectItem key={make} value={make}>{make}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Price */}
                <Popover open={showPriceRange} onOpenChange={setShowPriceRange}>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center justify-between bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors h-14">
                      <span className={`text-sm ${searchFilters.priceRange[0] !== 0 || searchFilters.priceRange[1] !== 500000 ? 'text-zinc-300' : 'text-zinc-400'}`}>
                        {searchFilters.priceRange[0] !== 0 || searchFilters.priceRange[1] !== 500000 
                          ? `$${searchFilters.priceRange[0].toLocaleString()} - $${searchFilters.priceRange[1].toLocaleString()}`
                          : "Price"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-4 bg-zinc-800 border-zinc-700" align="start">
                    <div className="mb-4">
                      <label className="text-xs font-medium text-zinc-400 mb-2 block">Range</label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          placeholder="Min Price"
                          value={minPriceInput || searchFilters.priceRange[0]}
                          onChange={(e) => setMinPriceInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const value = parseInt(minPriceInput) || 0;
                              const newMax = value > searchFilters.priceRange[1] ? value + 50000 : searchFilters.priceRange[1];
                              setSearchFilters({...searchFilters, priceRange: [value, newMax]});
                              setMaxPriceInput("");
                            }
                          }}
                          onBlur={() => {
                            const value = parseInt(minPriceInput) || 0;
                            const newMax = value > searchFilters.priceRange[1] ? value + 50000 : searchFilters.priceRange[1];
                            setSearchFilters({...searchFilters, priceRange: [value, newMax]});
                            setMaxPriceInput("");
                          }}
                          className="bg-zinc-900 border-zinc-600 text-zinc-50 text-sm"
                        />
                        <span className="text-zinc-500">-</span>
                        <Input
                          type="number"
                          placeholder="Max Price"
                          value={maxPriceInput || searchFilters.priceRange[1]}
                          onChange={(e) => setMaxPriceInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const value = parseInt(maxPriceInput) || 500000;
                              const newMin = value < searchFilters.priceRange[0] ? Math.max(0, value - 50000) : searchFilters.priceRange[0];
                              setSearchFilters({...searchFilters, priceRange: [newMin, value]});
                              setMinPriceInput("");
                            }
                          }}
                          onBlur={() => {
                            const value = parseInt(maxPriceInput) || 500000;
                            const newMin = value < searchFilters.priceRange[0] ? Math.max(0, value - 50000) : searchFilters.priceRange[0];
                            setSearchFilters({...searchFilters, priceRange: [newMin, value]});
                            setMinPriceInput("");
                          }}
                          className="bg-zinc-900 border-zinc-600 text-zinc-50 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-400 mb-2 block">Suggestions</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchFilters({...searchFilters, priceRange: [0, 150000]});
                            setMinPriceInput("");
                            setMaxPriceInput("");
                            setShowPriceRange(false);
                          }}
                          className="bg-zinc-900 border-zinc-600 text-zinc-300 hover:bg-zinc-700 text-xs"
                        >
                          Under $150,000
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchFilters({...searchFilters, priceRange: [150000, 300000]});
                            setMinPriceInput("");
                            setMaxPriceInput("");
                            setShowPriceRange(false);
                          }}
                          className="bg-zinc-900 border-zinc-600 text-zinc-300 hover:bg-zinc-700 text-xs"
                        >
                          $150,000 - $300,000
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchFilters({...searchFilters, priceRange: [300000, 550000]});
                            setMinPriceInput("");
                            setMaxPriceInput("");
                            setShowPriceRange(false);
                          }}
                          className="bg-zinc-900 border-zinc-600 text-zinc-300 hover:bg-zinc-700 text-xs"
                        >
                          $300,000 - $550,000
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSearchFilters({...searchFilters, priceRange: [550000, 999999999]});
                            setMinPriceInput("");
                            setMaxPriceInput("");
                            setShowPriceRange(false);
                          }}
                          className="bg-zinc-900 border-zinc-600 text-zinc-300 hover:bg-zinc-700 text-xs"
                        >
                          Above $550,000
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Year */}
                <Popover open={showYearRange} onOpenChange={setShowYearRange}>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center justify-between bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors h-14">
                      <span className={`text-sm ${searchFilters.yearRange[0] !== 2015 || searchFilters.yearRange[1] !== 2024 ? 'text-zinc-300' : 'text-zinc-400'}`}>
                        {searchFilters.yearRange[0] !== 2015 || searchFilters.yearRange[1] !== 2024
                          ? (searchFilters.yearRange[0] === searchFilters.yearRange[1] ? searchFilters.yearRange[0] : `${searchFilters.yearRange[0]} - ${searchFilters.yearRange[1]}`)
                          : "Year"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-4 bg-zinc-800 border-zinc-700" align="start">
                    <div className="max-h-[300px] overflow-y-auto">
                      <div className="space-y-1">
                        {yearsList.map((year) => (
                          <button
                            key={year}
                            onClick={() => {
                              setSearchFilters({...searchFilters, yearRange: [year, year]});
                              setShowYearRange(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                              searchFilters.yearRange[0] === year && searchFilters.yearRange[1] === year
                                ? 'bg-red-500/20 text-red-400'
                                : 'text-zinc-300 hover:bg-zinc-700'
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Kilometers */}
                <Popover open={showKmRange} onOpenChange={setShowKmRange}>
                  <PopoverTrigger asChild>
                    <button className="w-full flex items-center justify-between bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors h-14">
                      <span className={`text-sm ${searchFilters.kmRange[0] !== 0 || searchFilters.kmRange[1] !== 300000 ? 'text-zinc-300' : 'text-zinc-400'}`}>
                        {searchFilters.kmRange[0] !== 0 || searchFilters.kmRange[1] !== 300000
                          ? `${searchFilters.kmRange[0].toLocaleString()} - ${searchFilters.kmRange[1].toLocaleString()} km`
                          : "Kilometers"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-4 bg-zinc-800 border-zinc-700" align="start">
                    <div className="space-y-1">
                      {kmRanges.map((range, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchFilters({...searchFilters, kmRange: range.value});
                            setShowKmRange(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            searchFilters.kmRange[0] === range.value[0] && searchFilters.kmRange[1] === range.value[1]
                              ? 'bg-red-500/20 text-red-400'
                              : 'text-zinc-300 hover:bg-zinc-700'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Button onClick={handleSearch} className="w-full h-14 gradient-red text-white font-semibold hover:opacity-90 transition-all group">
                  <Search className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Search Vehicles
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentImage 
                  ? 'w-12 bg-red-500' 
                  : 'w-8 bg-zinc-600 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}