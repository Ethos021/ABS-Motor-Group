import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calculator, CreditCard, FileText, Users, CheckCircle, DollarSign } from "lucide-react";

export default function Finance() {
  const [calculatorData, setCalculatorData] = useState({
    vehiclePrice: 50000,
    deposit: 10000,
    term: 60,
    interestRate: 5.99
  });

  const calculatePayments = () => {
    const principal = calculatorData.vehiclePrice - calculatorData.deposit;
    const monthlyRate = calculatorData.interestRate / 100 / 12;
    // Check for division by zero or invalid input
    if (monthlyRate === 0 || calculatorData.term === 0) {
      return { monthly: 0, weekly: 0, total: 0 };
    }
    
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, calculatorData.term)) / (Math.pow(1 + monthlyRate, calculatorData.term) - 1);
    const weeklyPayment = (monthlyPayment * 12) / 52;
    
    return {
      monthly: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      weekly: isNaN(weeklyPayment) ? 0 : weeklyPayment,
      total: isNaN(monthlyPayment * calculatorData.term) ? 0 : monthlyPayment * calculatorData.term
    };
  };

  const payments = calculatePayments();

  const benefits = [
    {
      icon: CreditCard,
      title: "Competitive Rates",
      description: "From 5.99% comparison rate for approved customers"
    },
    {
      icon: FileText,
      title: "Quick Approval",
      description: "Pre-qualification in minutes, full approval within 24 hours"
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Dedicated finance specialists to guide you through the process"
    },
    {
      icon: CheckCircle,
      title: "Flexible Terms",
      description: "Tailored solutions from 12-84 months to suit your budget"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Tailored <span className="text-red-500">Finance Solutions</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            Competitive rates, flexible terms, and expert guidance to help you acquire your dream prestige vehicle
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Finance Calculator */}
          <div>
            <Card className="bg-zinc-900 border-zinc-800 luxury-shadow">
              <CardHeader>
                <CardTitle className="text-2xl text-zinc-50 flex items-center">
                  <Calculator className="w-6 h-6 mr-3 text-red-500" />
                  Finance Calculator
                </CardTitle>
                <p className="text-zinc-400">
                  Estimate your weekly and monthly payments
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Vehicle Price */}
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-3 block">
                    Vehicle Price: ${calculatorData.vehiclePrice.toLocaleString()}
                  </label>
                  <Slider
                    value={[calculatorData.vehiclePrice]}
                    onValueChange={([value]) => setCalculatorData({...calculatorData, vehiclePrice: value})}
                    max={200000}
                    min={10000}
                    step={1000}
                    className="w-full"
                  />
                </div>

                {/* Deposit */}
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-3 block">
                    Deposit: ${calculatorData.deposit.toLocaleString()}
                  </label>
                  <Slider
                    value={[calculatorData.deposit]}
                    onValueChange={([value]) => setCalculatorData({...calculatorData, deposit: value})}
                    max={calculatorData.vehiclePrice * 0.5}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                </div>

                {/* Loan Term */}
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-3 block">
                    Loan Term: {calculatorData.term} months
                  </label>
                  <Slider
                    value={[calculatorData.term]}
                    onValueChange={([value]) => setCalculatorData({...calculatorData, term: value})}
                    max={84}
                    min={12}
                    step={6}
                    className="w-full"
                  />
                </div>

                {/* Interest Rate */}
                <div>
                  <label className="text-sm font-medium text-zinc-300 mb-3 block">
                    Interest Rate: {calculatorData.interestRate}% p.a.
                  </label>
                  <Slider
                    value={[calculatorData.interestRate]}
                    onValueChange={([value]) => setCalculatorData({...calculatorData, interestRate: value})}
                    max={15}
                    min={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Results */}
                <div className="bg-zinc-800 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-zinc-50 mb-4">Estimated Payments</h4>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-zinc-400 text-sm">Weekly</p>
                      <p className="text-2xl font-bold text-red-500">
                        ${payments.weekly.toFixed(0)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-zinc-400 text-sm">Monthly</p>
                      <p className="text-2xl font-bold text-red-500">
                        ${payments.monthly.toFixed(0)}
                      </p>
                    </div>
                  </div>

                  <div className="text-center pt-4 border-t border-zinc-700">
                    <p className="text-zinc-400 text-sm">Total Amount Payable</p>
                    <p className="text-xl font-semibold text-zinc-50">
                      ${(payments.total + calculatorData.deposit).toFixed(0)}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-zinc-500">
                  *Estimates only. Actual rates and terms subject to credit approval. 
                  Comparison rate calculated on a secured loan of $30,000 over 5 years.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Finance Information */}
          <div className="space-y-8">
            {/* Benefits */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-2xl text-zinc-50">Why Choose Our Finance?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-10 h-10 gradient-red rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-zinc-50" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-zinc-50 mb-1">{benefit.title}</h4>
                          <p className="text-zinc-400 text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Pre-qualification Form */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-2xl text-zinc-50">Quick Pre-Qualification</CardTitle>
                <p className="text-zinc-400">
                  Check your eligibility in under 2 minutes
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="First Name"
                      className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    />
                    <Input
                      placeholder="Last Name"
                      className="bg-zinc-800 border-zinc-700 text-zinc-50"
                    />
                  </div>
                  
                  <Input
                    placeholder="Email Address"
                    type="email"
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />
                  
                  <Input
                    placeholder="Annual Income"
                    type="number"
                    className="bg-zinc-800 border-zinc-700 text-zinc-50"
                  />

                  <Button className="w-full gradient-red text-zinc-50 hover:opacity-90 font-semibold">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Check Pre-Qualification
                  </Button>

                  <p className="text-xs text-zinc-500">
                    Soft credit check only - no impact on your credit score
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h4 className="font-semibold text-zinc-50 mb-3">Need Help?</h4>
                <p className="text-zinc-400 mb-4">
                  Speak with one of our finance specialists for personalized assistance.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                    Call (03) 9555 0123
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}