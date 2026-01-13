import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import GoogleMap from "../components/shared/GoogleMap";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredContact: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const enquiryTypeMap = {
        "General Enquiry": "general",
        "Vehicle Interest": "vehicle_interest",
        "Test Drive": "test_drive",
        "Finance": "finance",
        "Trade-In": "trade_in",
        "Service": "general"
      };

      const preferredContactMap = {
        "Phone": "phone",
        "Email": "email",
        "WhatsApp": "whatsapp"
      };

      await base44.entities.Enquiry.create({
        firstName,
        lastName,
        mobile: formData.phone,
        email: formData.email,
        message: formData.message,
        enquiry_type: enquiryTypeMap[formData.subject] || "general",
        preferredContactMethod: preferredContactMap[formData.preferredContact] || "phone",
        pageUrl: window.location.href,
        referrer: document.referrer
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("There was an error submitting your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      description: "Call us directly",
      value: "03 9484 0084",
      action: "Call Now"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Chat with our team",
      value: "Business hours",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Send us a message",
      value: "info@absmotorgroup.com",
      action: "Send Email",
      link: "AdminEnquiries"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Our dedicated team is here to assist with enquiries, inspections, test drives, 
            and everything in between. Experience true prestige service.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Methods */}
          <div className="space-y-6">
            
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              const CardWrapper = method.link ? Link : 'div';
              const cardProps = method.link ? { to: createPageUrl(method.link) } : {};
              
              return (
                <CardWrapper key={index} {...cardProps}>
                  <Card className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-colors group cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 gradient-red rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-zinc-50" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-zinc-50">{method.title}</h4>
                          <p className="text-zinc-400 text-sm">{method.description}</p>
                          <p className="text-red-500 text-sm font-medium">{method.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardWrapper>
              );
            })}

            {/* Location Info */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-zinc-50 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-500" />
                  Visit Our Showroom
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-zinc-50 font-medium">Address</p>
                  <a 
                    href="https://maps.app.goo.gl/uM1Xd5VUEJHa5S9X6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    17 Louis St, Airport West VIC 3042, Australia
                  </a>
                  <GoogleMap address="17 Louis St, Airport West VIC 3042, Australia" height={200} />
                </div>
                <div>
                  <p className="text-zinc-50 font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-red-500" />
                    Opening Hours
                  </p>
                  <div className="text-zinc-400 space-y-1 text-sm">
                    <p>Monday - Friday: 8:30am - 5:30pm</p>
                    <p>Saturday: 9:00am - 3:00pm</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800 luxury-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-zinc-50">
                  {submitted ? "Message Sent" : "Send Us A Message"}
                </CardTitle>
                <p className="text-zinc-400">
                  {submitted 
                    ? "Thank you for contacting us. We'll be in touch within 24 hours." 
                    : "Fill out the form below and we'll get back to you within 24 hours"
                  }
                </p>
              </CardHeader>

              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 gradient-red rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-zinc-50" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-50 mb-2">Message Received</h3>
                    <p className="text-zinc-400 mb-6">
                      Reference: AP-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                    <Button 
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-zinc-50"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <Input
                          placeholder="Enter your phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-zinc-50"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-300 mb-2 block">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-zinc-50"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                          Subject
                        </label>
                        <Select onValueChange={(value) => handleInputChange("subject", value)}>
                          <SelectTrigger className="bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="Select enquiry type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General Enquiry">General Enquiry</SelectItem>
                            <SelectItem value="Vehicle Interest">Vehicle Interest</SelectItem>
                            <SelectItem value="Test Drive">Book Test Drive</SelectItem>
                            <SelectItem value="Finance">Finance Question</SelectItem>
                            <SelectItem value="Trade-In">Trade-In Valuation</SelectItem>
                            <SelectItem value="Service">Service Booking</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                          Preferred Contact Method
                        </label>
                        <Select onValueChange={(value) => handleInputChange("preferredContact", value)}>
                          <SelectTrigger className="bg-zinc-800 border-zinc-700">
                            <SelectValue placeholder="How to contact you" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Phone">Phone Call</SelectItem>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-300 mb-2 block">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        placeholder="Tell us how we can help..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-zinc-50 h-32"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full gradient-red text-zinc-50 hover:opacity-90 font-semibold py-3"
                      disabled={loading}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {loading ? "Sending..." : "Send Message"}
                    </Button>

                    <p className="text-xs text-zinc-500">
                      By submitting this form, you agree to be contacted by A.B.S Motor Group 
                      regarding your enquiry. We respect your privacy and never share your information.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}