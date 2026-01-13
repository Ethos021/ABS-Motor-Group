import React, { useState } from "react";
import { Enquiry, Booking, Staff, CalendarBlock, Vehicle } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, Shield, ArrowRight, CheckCircle } from "lucide-react";

export default function Sell() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    kilometers: "",
    condition: "",
    description: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    preferredContact: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.make.trim()) newErrors.make = "This field is required";
      if (!formData.model.trim()) newErrors.model = "This field is required";
      if (!formData.year.trim()) newErrors.year = "This field is required";
      if (!formData.kilometers.trim()) newErrors.kilometers = "This field is required";
    } else if (step === 2) {
      if (!formData.condition) newErrors.condition = "This field is required";
    } else if (step === 3) {
      if (!formData.contactName.trim()) newErrors.contactName = "This field is required";
      if (!formData.contactPhone.trim()) newErrors.contactPhone = "This field is required";
      if (!formData.contactEmail.trim()) newErrors.contactEmail = "This field is required";
      if (!formData.preferredContact) newErrors.preferredContact = "This field is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    try {
      const [firstName, ...lastNameParts] = formData.contactName.trim().split(' ');
      const lastName = lastNameParts.join(' ') || firstName;

      await Enquiry.create({
        enquiry_type: "sell_vehicle",
        firstName: firstName,
        lastName: lastName,
        mobile: formData.contactPhone,
        email: formData.contactEmail,
        message: `Vehicle: ${formData.year} ${formData.make} ${formData.model}\nKilometers: ${formData.kilometers}\nCondition: ${formData.condition}\n\nAdditional Details: ${formData.description}`,
        preferredContactMethod: formData.preferredContact?.toLowerCase() || "phone",
        tradeInYear: formData.year,
        tradeInMake: formData.make,
        tradeInModel: formData.model,
        tradeInOdometer: parseFloat(formData.kilometers) || 0,
        pageUrl: window.location.href,
        referrer: document.referrer || 'direct',
        status: "new"
      });

      setStep(4); // Success step
    } catch (error) {
      console.error("Error submitting sell vehicle form:", error);
      alert("There was an error submitting your vehicle. Please try again or call us directly.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Sell Your <span className="text-red-500">Prestige Vehicle</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Get a premium valuation for your European or performance vehicle with our transparent consignment process
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="text-center">
              <div className="w-12 h-12 gradient-red rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-zinc-50" />
              </div>
              <CardTitle className="text-zinc-50">Premium Valuations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-center">
                Market-leading valuations based on current market conditions and vehicle provenance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="text-center">
              <div className="w-12 h-12 gradient-red rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-zinc-50" />
              </div>
              <CardTitle className="text-zinc-50">Quick Process</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-center">
                Fast, professional evaluation and settlement within 24-48 hours of acceptance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="text-center">
              <div className="w-12 h-12 gradient-red rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-zinc-50" />
              </div>
              <CardTitle className="text-zinc-50">Trusted Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 text-center">
                Transparent process, fair dealing, and expert handling of all documentation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  step >= stepNum 
                    ? "gradient-red text-zinc-50 border-red-500" 
                    : "border-zinc-600 text-zinc-400"
                }`}>
                  {step > stepNum ? <CheckCircle className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-16 h-0.5 ${
                    step > stepNum ? "bg-red-500" : "bg-zinc-600"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-zinc-900 border-zinc-800 luxury-shadow">
          <CardHeader>
            <CardTitle className="text-2xl text-zinc-50">
              {step === 1 && "Vehicle Details"}
              {step === 2 && "Additional Information"}
              {step === 3 && "Your Contact Details"}
              {step === 4 && "Submission Complete"}
            </CardTitle>
            <p className="text-zinc-400">
              {step === 1 && "Tell us about your vehicle"}
              {step === 2 && "Help us understand your vehicle's condition"}
              {step === 3 && "How can we reach you?"}
              {step === 4 && "We'll be in touch within 24 hours"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Make <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter make (e.g., BMW, Toyota, Ford)"
                    value={formData.make}
                    onChange={(e) => handleInputChange("make", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />
                  {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Model <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter model"
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />
                  {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Year <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter year (e.g., 2020)"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />
                  {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Kilometers <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter kilometers"
                    value={formData.kilometers}
                    onChange={(e) => handleInputChange("kilometers", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />
                  {errors.kilometers && <p className="text-red-500 text-sm mt-1">{errors.kilometers}</p>}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Condition <span className="text-red-500">*</span></label>
                  <Select onValueChange={(value) => handleInputChange("condition", value)}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Very Good">Very Good</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">
                    Additional Details
                  </label>
                  <Textarea
                    placeholder="Tell us about service history, modifications, any damage, or special features..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50 h-32"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Full Name <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter your name"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />
                  {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Phone Number <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter your phone"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />
                  {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Email Address <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter your email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />
                  {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Preferred Contact Method <span className="text-red-500">*</span></label>
                  <Select onValueChange={(value) => handleInputChange("preferredContact", value)}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue placeholder="How would you like to be contacted?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Phone">Phone Call</SelectItem>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.preferredContact && <p className="text-red-500 text-sm mt-1">{errors.preferredContact}</p>}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 gradient-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-zinc-50" />
                </div>
                <h3 className="2xl font-bold text-zinc-50 mb-4">Submission Received</h3>
                <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                  Thank you for choosing A.B.S Motor Group. Our valuation team will review your vehicle details and contact you within 24 hours.
                </p>
                <Badge className="gradient-red text-zinc-50 text-lg px-4 py-2">
                  Reference: AP-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </Badge>
              </div>
            )}
          </CardContent>

          {step < 4 && (
            <div className="flex justify-between p-6 border-t border-zinc-800">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Previous
                </Button>
              )}
              
              <Button
                onClick={step === 3 ? handleSubmit : nextStep}
                className="gradient-red text-zinc-50 hover:opacity-90 ml-auto"
              >
                {step === 3 ? "Submit Application" : "Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}