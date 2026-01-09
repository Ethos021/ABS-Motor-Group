import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Enquiry } from "@/api/entities";
import { SendEmail } from "@/api/integrations";
import { CheckCircle, Send, Calculator, Car } from "lucide-react";

export default function VehicleEnquiryForm({ vehicle }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    message: '',
    hasTradein: null,
    tradeInYear: '',
    tradeInMake: '',
    wantsFinance: null,
    wantsTestDrive: null
  });

  const [financeCalculator, setFinanceCalculator] = useState({
    deposit: Math.min(vehicle.price * 0.1 || 5000, vehicle.price * 0.5),
    term: 60,
    interestRate: 5.99
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // New state for mobile detection

  // Effect to check and update mobile status
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Call once on mount
    window.addEventListener('resize', checkMobile); // Add listener for resize
    return () => window.removeEventListener('resize', checkMobile); // Clean up on unmount
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateFinancePayments = () => {
    const principal = vehicle.price - financeCalculator.deposit;
    const monthlyRate = financeCalculator.interestRate / 100 / 12;
    // Prevent division by zero or invalid calculations if principal is negative or other issues
    if (principal <= 0 || monthlyRate === 0) {
      return { monthly: 0, weekly: 0 };
    }
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, financeCalculator.term)) / (Math.pow(1 + monthlyRate, financeCalculator.term) - 1);
    const weeklyPayment = (monthlyPayment * 12) / 52;
    
    return {
      monthly: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      weekly: isNaN(weeklyPayment) ? 0 : weeklyPayment
    };
  };

  const payments = calculateFinancePayments();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const leadData = {
        ...formData,
        hasTradein: formData.hasTradein === 'yes', // Convert to boolean
        wantsFinance: formData.wantsFinance === 'yes', // Convert to boolean
        wantsTestDrive: formData.wantsTestDrive === 'yes', // Convert to boolean
        vehicleId: vehicle.id,
        vehicleDetails: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        vehiclePrice: vehicle.price,
        financeEstimate: formData.wantsFinance === 'yes' ? `$${payments.weekly.toFixed(0)}/week` : null, // Simplified as per outline
        utmSource: urlParams.get('utm_source') || 'direct',
        utmMedium: urlParams.get('utm_medium') || 'website',
        utmCampaign: urlParams.get('utm_campaign') || 'vdp',
        referrer: document.referrer || 'direct',
        pageUrl: window.location.href,
        timestamp: new Date().toISOString(),
      };

      await Enquiry.create(leadData);

      // Nicely formatted HTML email
      const emailContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #d50000; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Vehicle Enquiry</h2>
          <p>You have a new enquiry for the <strong>${leadData.vehicleDetails}</strong>.</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

          <h3 style="color: #333;">Vehicle Details</h3>
          <p><strong>Vehicle:</strong> ${leadData.vehicleDetails}</p>
          <p><strong>Stock ID:</strong> ${vehicle.id}</p>
          <p><strong>Price:</strong> $${vehicle.price?.toLocaleString()}</p>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

          <h3 style="color: #333;">Customer Details</h3>
          <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
          <p><strong>Mobile:</strong> ${formData.mobile || 'Not provided'}</p>
          <p><strong>Email:</strong> ${formData.email || 'Not provided'}</p>
          <p><strong>Message:</strong> ${formData.message || 'None provided'}</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

          <h3 style="color: #333;">Enquiry Details</h3>
          <p><strong>Trade-in:</strong> ${formData.hasTradein === 'yes' ? `Yes (${formData.tradeInYear} ${formData.tradeInMake})` : 'No'}</p>
          <p><strong>Finance Required:</strong> ${formData.wantsFinance === 'yes' ? `Yes (Est: ${leadData.financeEstimate})` : 'No'}</p>
          <p><strong>Test Drive Booking:</strong> ${formData.wantsTestDrive === 'yes' ? 'Yes' : 'No'}</p>
          
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          
          <h3 style="color: #333;">Lead Source</h3>
          <p style="font-size: 12px; color: #777;">
            <strong>Source:</strong> ${leadData.utmSource}<br>
            <strong>Medium:</strong> ${leadData.utmMedium}<br>
            <strong>Campaign:</strong> ${leadData.utmCampaign}<br>
            <strong>Referrer:</strong> ${leadData.referrer}<br>
            <strong>Page:</strong> ${leadData.pageUrl}
          </p>
        </div>
      `;

      await SendEmail({
        to: 'giulianoc@scrmmedia.com.au',
        subject: `🚗 New Enquiry: ${leadData.vehicleDetails}`,
        body: emailContent
      });

      if (window.gtag) {
        window.gtag('event', 'form_submit', {
          event_category: 'Vehicle Enquiry',
          event_label: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          value: vehicle.price,
          custom_parameters: {
            trade_in: formData.hasTradein,
            finance: formData.wantsFinance,
            test_drive: formData.wantsTestDrive
          }
        });
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error sending your enquiry. Please call us directly at (04) 1933 0301');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-4 md:p-6 text-center"> {/* Adjusted padding for responsive */}
          <div className="w-12 h-12 md:w-16 md:h-16 gradient-red rounded-full flex items-center justify-center mx-auto mb-4"> {/* Adjusted size for responsive */}
            <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-zinc-50" /> {/* Adjusted size for responsive */}
          </div>
          <h3 className="text-lg md:text-xl font-bold text-zinc-50 mb-2">Enquiry Received!</h3> {/* Adjusted text size for responsive */}
          <p className="text-sm md:text-base text-zinc-400 mb-4"> {/* Adjusted text size for responsive */}
            Thanks for your interest in this {vehicle.year} {vehicle.make} {vehicle.model}. 
            We'll contact you within the hour during business hours.
          </p>
          <Badge className="gradient-red text-zinc-50 mb-4 text-sm"> {/* Added text-sm for consistency */}
            Reference: AP-{Math.random().toString(36).substr(2, 6).toUpperCase()}
          </Badge>
          <div className="text-sm text-zinc-500">
            <p>Need immediate assistance?</p>
            <p className="font-medium text-red-500">(04) 1933 0301</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800" id="enquiry-form">
      <CardHeader className="p-4 md:p-6"> {/* Adjusted padding for responsive */}
        <CardTitle className="text-zinc-50 text-lg md:text-xl">Enquire Now</CardTitle> {/* Adjusted text size for responsive */}
        <p className="text-sm text-zinc-400">Get more info, arrange inspection, or book test drive</p>
      </CardHeader>
      <CardContent className="p-4 md:p-6"> {/* Adjusted padding for responsive */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Conditional rendering based on isMobile */}
          {isMobile ? (
            <>
              {/* Simplified Mobile Form */}
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">First Name <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Last Name <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    required
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Mobile <span className="text-red-500">*</span></label>
                <Input
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Message</label>
                <Textarea
                  placeholder="Your message or questions..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-50 h-20"
                />
              </div>

              {/* Quick Options for Mobile */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant={formData.wantsTestDrive === 'yes' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('wantsTestDrive', formData.wantsTestDrive === 'yes' ? 'no' : 'yes')} // Toggle functionality
                    className={formData.wantsTestDrive === 'yes' ? 'gradient-red text-zinc-50' : 'bg-transparent border-zinc-700 text-zinc-300'}
                  >
                    📅 Test Drive
                  </Button>
                  <Button
                    type="button"
                    variant={formData.wantsFinance === 'yes' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('wantsFinance', formData.wantsFinance === 'yes' ? 'no' : 'yes')} // Toggle functionality
                    className={formData.wantsFinance === 'yes' ? 'gradient-red text-zinc-50' : 'bg-transparent border-zinc-700 text-zinc-300'}
                  >
                    💰 Finance
                  </Button>
                  <Button
                    type="button"
                    variant={formData.hasTradein === 'yes' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('hasTradein', formData.hasTradein === 'yes' ? 'no' : 'yes')} // Toggle functionality
                    className={formData.hasTradein === 'yes' ? 'gradient-red text-zinc-50' : 'bg-transparent border-zinc-700 text-zinc-300'}
                  >
                    🔄 Trade-in
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Full Desktop Form (original content) */}
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">First Name <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">Last Name <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    required
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Mobile</label>
                <Input
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-50"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-300 mb-2 block">Message</label>
                <Textarea
                  placeholder="Your message or questions..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="bg-zinc-800 border-zinc-700 text-zinc-50 h-20"
                />
              </div>

              {/* Trade-in Question */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-300">Do you have a vehicle to trade in?</p>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={formData.hasTradein === 'yes' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('hasTradein', 'yes')}
                    className={formData.hasTradein === 'yes' ? 'gradient-red text-zinc-50' : 'bg-transparent border-zinc-700 text-zinc-300'}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={formData.hasTradein === 'no' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('hasTradein', 'no')}
                    className={formData.hasTradein === 'no' ? 'gradient-red text-zinc-50' : 'bg-transparent border-zinc-700 text-zinc-300'}
                  >
                    No
                  </Button>
                </div>
                {formData.hasTradein === 'no' && (
                  <p className="text-xs text-zinc-500">I don't have a vehicle to trade in</p>
                )}
              </div>

              {/* Trade-in Details */}
              {formData.hasTradein === 'yes' && (
                <div className="bg-zinc-800 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Car className="w-4 h-4 text-red-500" />
                    <p className="text-sm font-medium text-zinc-300">Trade-in Vehicle Details</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select onValueChange={(value) => handleInputChange('tradeInYear', value)}>
                      <SelectTrigger className="bg-zinc-700 border-zinc-600">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({length: 25}, (_, i) => 2024 - i).map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Make"
                      value={formData.tradeInMake}
                      onChange={(e) => handleInputChange('tradeInMake', e.target.value)}
                      className="bg-zinc-700 border-zinc-600 text-zinc-50"
                    />
                  </div>
                </div>
              )}

              {/* Finance Question */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-300">Do you want to finance this vehicle?</p>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={formData.wantsFinance === 'yes' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('wantsFinance', 'yes')}
                    className={formData.wantsFinance === 'yes' ? 'gradient-red text-zinc-50' : 'bg-transparent border-zinc-700 text-zinc-300'}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={formData.wantsFinance === 'no' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('wantsFinance', 'no')}
                    className={formData.wantsFinance === 'no' ? 'gradient-red text-zinc-50' : 'bg-transparent border-zinc-700 text-zinc-300'}
                  >
                    No
                  </Button>
                </div>
                {formData.wantsFinance === 'yes' && (
                  <p className="text-xs text-zinc-500">Finance this vehicle</p>
                )}
                {formData.wantsFinance === 'no' && (
                  <p className="text-xs text-zinc-500">I don't require finance</p>
                )}
              </div>

              {/* Finance Calculator */}
              {formData.wantsFinance === 'yes' && (
                <div className="bg-zinc-800 rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calculator className="w-4 h-4 text-red-500" />
                    <p className="text-sm font-medium text-zinc-300">Finance Calculator</p>
                  </div>
                  
                  <div>
                    <label className="text-xs text-zinc-400 mb-2 block">
                      Deposit: ${financeCalculator.deposit.toLocaleString()}
                    </label>
                    <Slider
                      value={[financeCalculator.deposit]}
                      onValueChange={([value]) => setFinanceCalculator({...financeCalculator, deposit: value})}
                      max={vehicle.price * 0.5}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 mb-2 block">
                      Term: {financeCalculator.term} months
                    </label>
                    <Slider
                      value={[financeCalculator.term]}
                      onValueChange={([value]) => setFinanceCalculator({...financeCalculator, term: value})}
                      max={84}
                      min={12}
                      step={6}
                      className="w-full"
                    />
                  </div>

                  <div className="bg-zinc-700 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="text-xs text-zinc-400">Weekly</p>
                        <p className="text-lg font-bold text-red-500">
                          ${payments.weekly.toFixed(0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-400">Monthly</p>
                        <p className="text-lg font-bold text-red-500">
                          ${payments.monthly.toFixed(0)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 text-center mt-2">
                      *Estimate at {financeCalculator.interestRate}% p.a. Subject to approval.
                    </p>
                  </div>
                </div>
              )}

              {/* Test Drive Question */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-300">Do you want to book a test drive?</p>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={formData.wantsTestDrive === 'yes' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('wantsTestDrive', 'yes')}
                    className={formData.wantsTestDrive === 'yes' ? 'gradient-red text-zinc-50' : 'bg-transparent border-zinc-700 text-zinc-300'}
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={formData.wantsTestDrive === 'no' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('wantsTestDrive', 'no')}
                    className={formData.wantsTestDrive === 'no' ? 'gradient-red text-zinc-50' : 'bg-transparent border-zinc-700 text-zinc-300'}
                  >
                    No
                  </Button>
                </div>
                {formData.wantsTestDrive === 'yes' && (
                  <p className="text-xs text-zinc-500">Book it in</p>
                )}
                {formData.wantsTestDrive === 'no' && (
                  <p className="text-xs text-zinc-500">Not right now</p>
                )}
              </div>
            </>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full gradient-red text-zinc-50 hover:opacity-90 font-semibold py-3" // Added py-3 for better mobile touch target
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-zinc-50 mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {loading ? 'Sending...' : 'Submit Enquiry'}
          </Button>

          <p className="text-xs text-zinc-500">
            By submitting, you agree to be contacted about this vehicle. We respect your privacy.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}