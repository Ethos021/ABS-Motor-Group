import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calculator, DollarSign } from "lucide-react";

export default function VehicleFinanceCalculator({ vehicle }) {
  const [calculatorData, setCalculatorData] = useState({
    vehiclePrice: vehicle.price || 50000,
    deposit: Math.min(vehicle.price * 0.2 || 10000, vehicle.price * 0.5),
    term: 60,
    interestRate: 5.99
  });

  const calculatePayments = () => {
    const principal = calculatorData.vehiclePrice - calculatorData.deposit;
    const monthlyRate = calculatorData.interestRate / 100 / 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, calculatorData.term)) / (Math.pow(1 + monthlyRate, calculatorData.term) - 1);
    const weeklyPayment = (monthlyPayment * 12) / 52;
    
    return {
      monthly: monthlyPayment,
      weekly: weeklyPayment,
      total: monthlyPayment * calculatorData.term
    };
  };

  const payments = calculatePayments();

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-50 flex items-center">
          <Calculator className="w-5 h-5 mr-2 text-red-500" />
          Finance Calculator
        </CardTitle>
        <p className="text-sm text-zinc-400">Estimate your repayments</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vehicle Price */}
        <div>
          <label className="text-sm font-medium text-zinc-300 mb-2 block">
            Vehicle Price: ${calculatorData.vehiclePrice.toLocaleString()}
          </label>
          <Slider
            value={[calculatorData.vehiclePrice]}
            onValueChange={([value]) => setCalculatorData({...calculatorData, vehiclePrice: value})}
            max={Math.max(vehicle.price * 1.1, 100000)}
            min={Math.min(vehicle.price * 0.9, 10000)}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Deposit */}
        <div>
          <label className="text-sm font-medium text-zinc-300 mb-2 block">
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
          <label className="text-sm font-medium text-zinc-300 mb-2 block">
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
          <label className="text-sm font-medium text-zinc-300 mb-2 block">
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
        <div className="bg-zinc-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-zinc-300 mb-3">Estimated Repayments</h4>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center">
              <p className="text-xs text-zinc-400">Weekly</p>
              <p className="text-lg font-bold text-red-500">
                ${payments.weekly.toFixed(0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-zinc-400">Monthly</p>
              <p className="text-lg font-bold text-red-500">
                ${payments.monthly.toFixed(0)}
              </p>
            </div>
          </div>

          <div className="text-center pt-3 border-t border-zinc-700">
            <p className="text-xs text-zinc-400">Total Amount</p>
            <p className="text-sm font-semibold text-zinc-50">
              ${(payments.total + calculatorData.deposit).toFixed(0)}
            </p>
          </div>
        </div>

        <Button className="w-full gradient-red text-zinc-50 hover:opacity-90">
          <DollarSign className="w-4 h-4 mr-2" />
          Apply for Finance
        </Button>

        <p className="text-xs text-zinc-500">
          *Estimates only. Rates from 5.99% comparison rate. Subject to approval and lending criteria.
        </p>
      </CardContent>
    </Card>
  );
}