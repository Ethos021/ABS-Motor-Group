import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Filter, X, Grid, List, ChevronDown } from "lucide-react";
import VehicleCard from "../components/shared/VehicleCard";

export default function Browse() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter state
  const [filters, setFilters] = useState({
    make: "",
    bodyType: "",
    fuelType: "",
    transmission: "",
    priceRange: [0, 500000],
    yearRange: [2015, 2024],
    kmRange: [0, 300000],
    year: "" // Single year filter from home page
  });
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [showYearRange, setShowYearRange] = useState(false);
  const [showKmRange, setShowKmRange] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);



  const applyFilters = useCallback(() => {
    let filtered = vehicles;

    // Search term
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Make filter
    if (filters.make) {
      filtered = filtered.filter(vehicle => vehicle.make === filters.make);
    }

    // Body type filter
    if (filters.bodyType) {
      filtered = filtered.filter(vehicle => vehicle.body_type === filters.bodyType);
    }

    // Fuel type filter
    if (filters.fuelType) {
      filtered = filtered.filter(vehicle => vehicle.fuel_type === filters.fuelType);
    }

    // Transmission filter
    if (filters.transmission) {
      filtered = filtered.filter(vehicle => vehicle.transmission === filters.transmission);
    }

    // Price range filter
    filtered = filtered.filter(vehicle => 
      vehicle.price >= filters.priceRange[0] && vehicle.price <= filters.priceRange[1]
    );

    // Year filter - single year takes precedence over range
    if (filters.year) {
      filtered = filtered.filter(vehicle => vehicle.year === parseInt(filters.year));
    } else {
      // Year range filter
      filtered = filtered.filter(vehicle => 
        vehicle.year >= filters.yearRange[0] && vehicle.year <= filters.yearRange[1]
      );
    }

    // Kilometers range filter
    filtered = filtered.filter(vehicle => 
      (vehicle.odometer || vehicle.kilometers || 0) >= filters.kmRange[0] && 
      (vehicle.odometer || vehicle.kilometers || 0) <= filters.kmRange[1]
    );

    // Sorting
    if (sortBy === "newest") {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => a.year - b.year);
    } else if (sortBy === "price_low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "km_low") {
      filtered.sort((a, b) => (a.odometer || a.kilometers || 0) - (b.odometer || b.kilometers || 0));
    } else if (sortBy === "km_high") {
      filtered.sort((a, b) => (b.odometer || b.kilometers || 0) - (a.odometer || a.kilometers || 0));
    }

    setFilteredVehicles(filtered);
  }, [vehicles, filters, searchTerm, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadVehicles = async () => {
    try {
      // Fetch vehicles from database
      const data = await base44.entities.Vehicle.list();
      setVehicles(data);
      
      // Apply URL filters first
      const urlParams = new URLSearchParams(window.location.search);
      const make = urlParams.get('make');
      const priceMin = urlParams.get('priceMin');
      const priceMax = urlParams.get('priceMax');
      const yearMin = urlParams.get('yearMin');
      const yearMax = urlParams.get('yearMax');
      const kmMin = urlParams.get('kmMin');
      const kmMax = urlParams.get('kmMax');
      
      // Only apply URL filters if they exist, otherwise keep defaults
      const hasUrlFilters = make || priceMin || priceMax || yearMin || yearMax || kmMin || kmMax;
      
      if (hasUrlFilters) {
        setFilters(prev => ({
          ...prev,
          make: make || prev.make,
          priceRange: [
            priceMin ? parseInt(priceMin) : prev.priceRange[0],
            priceMax ? parseInt(priceMax) : prev.priceRange[1]
          ],
          yearRange: [
            yearMin ? parseInt(yearMin) : prev.yearRange[0],
            yearMax ? parseInt(yearMax) : prev.yearRange[1]
          ],
          kmRange: [
            kmMin ? parseInt(kmMin) : prev.kmRange[0],
            kmMax ? parseInt(kmMax) : prev.kmRange[1]
          ]
        }));
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading vehicles:", error);
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      make: "",
      bodyType: "",
      fuelType: "",
      transmission: "",
      priceRange: [0, 500000],
      yearRange: [2015, 2024],
      kmRange: [0, 300000],
      year: ""
    });
    setSearchTerm("");
    setSortBy("newest");
  };

  const uniqueMakes = [...new Set(vehicles.map(v => v.make).filter(Boolean))];
  const uniqueBodyTypes = [...new Set(vehicles.map(v => v.body_type).filter(Boolean))];
  const uniqueFuelTypes = [...new Set(vehicles.map(v => v.fuel_type).filter(Boolean))];
  const uniqueTransmissions = [...new Set(vehicles.map(v => v.transmission).filter(Boolean))];
  
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

  return (
    <div className="min-h-screen bg-zinc-950 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Browse Our <span className="text-red-500">Collection</span>
          </h1>
          <p className="text-xl text-zinc-400">
            {filteredVehicles.length} curated vehicles available
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <Input
              placeholder="Search make, model, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-50 placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Main Filters */}
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Make/Model */}
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">Make/Model</label>
              <Select value={filters.make} onValueChange={(value) => setFilters({...filters, make: value})}>
                <SelectTrigger className={`bg-zinc-800 border-zinc-700 h-[42px] ${filters.make ? 'text-zinc-300' : '[&>span]:text-zinc-400'}`}>
                  <SelectValue placeholder="All Makes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Makes</SelectItem>
                  {uniqueMakes.map(make => (
                    <SelectItem key={make} value={make}>{make}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">Price</label>
              <Popover open={showPriceRange} onOpenChange={setShowPriceRange}>
                <PopoverTrigger asChild>
                  <button className="w-full flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-left hover:bg-zinc-750 transition-colors">
                    <span className={`text-sm ${filters.priceRange[0] === 0 && filters.priceRange[1] === 500000 ? 'text-zinc-400' : 'text-zinc-300'}`}>
                      {filters.priceRange[0] === 0 && filters.priceRange[1] === 500000 ? "All" : `$${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`}
                    </span>
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-4 bg-zinc-800 border-zinc-700" align="start">
                  {/* Range Inputs */}
                  <div className="mb-4">
                    <label className="text-xs font-medium text-zinc-400 mb-2 block">Range</label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        placeholder="Min Price"
                        value={minPriceInput || filters.priceRange[0]}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const value = parseInt(minPriceInput) || 0;
                            const newMax = value > filters.priceRange[1] ? value + 50000 : filters.priceRange[1];
                            setFilters({...filters, priceRange: [value, newMax]});
                            setMaxPriceInput("");
                          }
                        }}
                        onBlur={() => {
                          const value = parseInt(minPriceInput) || 0;
                          const newMax = value > filters.priceRange[1] ? value + 50000 : filters.priceRange[1];
                          setFilters({...filters, priceRange: [value, newMax]});
                          setMaxPriceInput("");
                        }}
                        className="bg-zinc-900 border-zinc-600 text-zinc-50 text-sm"
                      />
                      <span className="text-zinc-500">-</span>
                      <Input
                        type="number"
                        placeholder="Max Price"
                        value={maxPriceInput || filters.priceRange[1]}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const value = parseInt(maxPriceInput) || 500000;
                            const newMin = value < filters.priceRange[0] ? Math.max(0, value - 50000) : filters.priceRange[0];
                            setFilters({...filters, priceRange: [newMin, value]});
                            setMinPriceInput("");
                          }
                        }}
                        onBlur={() => {
                          const value = parseInt(maxPriceInput) || 500000;
                          const newMin = value < filters.priceRange[0] ? Math.max(0, value - 50000) : filters.priceRange[0];
                          setFilters({...filters, priceRange: [newMin, value]});
                          setMinPriceInput("");
                        }}
                        className="bg-zinc-900 border-zinc-600 text-zinc-50 text-sm"
                      />
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div>
                    <label className="text-xs font-medium text-zinc-400 mb-2 block">Suggestions</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFilters({...filters, priceRange: [0, 150000]});
                          setMinPriceInput("0");
                          setMaxPriceInput("150000");
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
                          setFilters({...filters, priceRange: [150000, 300000]});
                          setMinPriceInput("150000");
                          setMaxPriceInput("300000");
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
                          setFilters({...filters, priceRange: [300000, 550000]});
                          setMinPriceInput("300000");
                          setMaxPriceInput("550000");
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
                          setFilters({...filters, priceRange: [550000, 999999999]});
                          setMinPriceInput("550000");
                          setMaxPriceInput("999999999");
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
            </div>

            {/* Year */}
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">Year</label>
              <Popover open={showYearRange} onOpenChange={setShowYearRange}>
                <PopoverTrigger asChild>
                  <button className="w-full flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-left hover:bg-zinc-750 transition-colors">
                    <span className={`text-sm ${filters.yearRange[0] === 2015 && filters.yearRange[1] === 2024 ? 'text-zinc-400' : 'text-zinc-300'}`}>
                      {filters.yearRange[0] === 2015 && filters.yearRange[1] === 2024 
                        ? "All" 
                        : (filters.yearRange[0] === filters.yearRange[1] ? filters.yearRange[0] : `${filters.yearRange[0]} - ${filters.yearRange[1]}`)}
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
                            setFilters({...filters, yearRange: [year, year]});
                            setShowYearRange(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            filters.yearRange[0] === year && filters.yearRange[1] === year
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
            </div>

            {/* Kilometers */}
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">Kilometers</label>
              <Popover open={showKmRange} onOpenChange={setShowKmRange}>
                <PopoverTrigger asChild>
                  <button className="w-full flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-left hover:bg-zinc-750 transition-colors">
                    <span className={`text-sm ${filters.kmRange[0] === 0 && filters.kmRange[1] === 300000 ? 'text-zinc-400' : 'text-zinc-300'}`}>
                      {filters.kmRange[0] === 0 && filters.kmRange[1] === 300000 ? "All" : `${filters.kmRange[0].toLocaleString()} - ${filters.kmRange[1].toLocaleString()} km`}
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
                          setFilters({...filters, kmRange: range.value});
                          setShowKmRange(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          filters.kmRange[0] === range.value[0] && filters.kmRange[1] === range.value[1]
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
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium text-zinc-300 mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 h-[42px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="km_low">KMs: Low to High</SelectItem>
                  <SelectItem value="km_high">KMs: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* More Filters Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showMoreFilters ? "Hide" : "Show"} More Filters
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-zinc-400 hover:text-zinc-200"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>

          {/* Additional Filters */}
          {showMoreFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-zinc-800">
              {/* Body Type */}
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Body Type</label>
                <Select value={filters.bodyType} onValueChange={(value) => setFilters({...filters, bodyType: value})}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Any Body Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Any Body Type</SelectItem>
                    {uniqueBodyTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Fuel Type</label>
                <Select value={filters.fuelType} onValueChange={(value) => setFilters({...filters, fuelType: value})}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Any Fuel Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Any Fuel Type</SelectItem>
                    {uniqueFuelTypes.map(fuel => (
                      <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission */}
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Transmission</label>
                <Select value={filters.transmission} onValueChange={(value) => setFilters({...filters, transmission: value})}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue placeholder="Any Transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Any Transmission</SelectItem>
                    {uniqueTransmissions.map(trans => (
                      <SelectItem key={trans} value={trans}>{trans}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-zinc-900 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-zinc-800"></div>
                <div className="p-6">
                  <div className="h-4 bg-zinc-800 rounded mb-2"></div>
                  <div className="h-3 bg-zinc-800 rounded w-2/3 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-zinc-800 rounded"></div>
                    <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredVehicles.length > 0 ? (
          <div className={`grid gap-8 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          }`}>
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-zinc-50 mb-4">No vehicles match your criteria</h3>
            <p className="text-zinc-400 mb-6">Try adjusting your filters to see more results</p>
            <Button onClick={clearFilters} className="gradient-red text-zinc-50">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}