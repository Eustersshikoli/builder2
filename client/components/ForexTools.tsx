import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Target,
  ArrowUp,
  ArrowDown,
  Zap,
  Award,
  Clock,
  BarChart3,
} from "lucide-react";

export default function ForexTools() {
  const navigate = useNavigate();

  // Pips Calculator State
  const [pipCalculator, setPipCalculator] = useState({
    accountCurrency: "USD",
    tradePair: "EUR/USD",
    tradeSize: "1",
    pipValue: 0,
  });

  // Investment Calculator State
  const [investmentCalculator, setInvestmentCalculator] = useState({
    initialAmount: "",
    plan: "",
    roi: 0,
    duration: "",
    expectedReturn: 0,
    dailyReturn: 0,
  });

  // Forex pairs with their pip values
  const forexPairs = {
    "EUR/USD": 10,
    "GBP/USD": 10,
    "AUD/USD": 10,
    "USD/CAD": 7.5,
    "USD/CHF": 10,
    "USD/JPY": 0.09,
    "EUR/GBP": 12.5,
    "EUR/JPY": 0.09,
    "GBP/JPY": 0.09,
  };

  // Investment plans
  const investmentPlans = [
    {
      id: "starter",
      name: "Starter Plan",
      roi: 1000,
      duration: "24-32 hours",
      minAmount: 200,
      maxAmount: 2000,
    },
    {
      id: "professional",
      name: "Professional Plan",
      roi: 1200,
      duration: "24-32 hours",
      minAmount: 2000,
      maxAmount: 10000,
    },
    {
      id: "premium",
      name: "Premium Plan",
      roi: 1500,
      duration: "24-32 hours",
      minAmount: 10000,
      maxAmount: 50000,
    },
  ];

  const calculatePips = () => {
    const size = parseFloat(pipCalculator.tradeSize);
    const basePipValue =
      forexPairs[pipCalculator.tradePair as keyof typeof forexPairs] || 10;
    const calculatedPipValue = size * basePipValue;
    setPipCalculator((prev) => ({ ...prev, pipValue: calculatedPipValue }));
  };

  const calculateInvestment = () => {
    const amount = parseFloat(investmentCalculator.initialAmount);
    const selectedPlan = investmentPlans.find(
      (p) => p.id === investmentCalculator.plan,
    );

    if (amount && selectedPlan) {
      const roiPercent = selectedPlan.roi / 100;
      const expectedReturn = amount * roiPercent;
      const durationInHours = 28; // Average of 24-32 hours
      const dailyReturn = (expectedReturn / durationInHours) * 24;

      setInvestmentCalculator((prev) => ({
        ...prev,
        roi: selectedPlan.roi,
        duration: selectedPlan.duration,
        expectedReturn,
        dailyReturn,
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-forex-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Professional Forex Tools
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Access our suite of professional trading tools designed to help you
          make informed investment decisions.
        </p>
      </div>

      <Tabs defaultValue="pips" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pips" className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>Pips Calculator</span>
          </TabsTrigger>
          <TabsTrigger
            value="investment"
            className="flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Investment Calculator</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pips" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5 text-forex-600" />
                  <span>Pips Value Calculator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountCurrency">Account Currency</Label>
                  <Select
                    value={pipCalculator.accountCurrency}
                    onValueChange={(value) =>
                      setPipCalculator((prev) => ({
                        ...prev,
                        accountCurrency: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tradePair">Currency Pair</Label>
                  <Select
                    value={pipCalculator.tradePair}
                    onValueChange={(value) =>
                      setPipCalculator((prev) => ({
                        ...prev,
                        tradePair: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(forexPairs).map((pair) => (
                        <SelectItem key={pair} value={pair}>
                          {pair}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tradeSize">Trade Size (Lots)</Label>
                  <Input
                    id="tradeSize"
                    type="number"
                    step="0.01"
                    value={pipCalculator.tradeSize}
                    onChange={(e) =>
                      setPipCalculator((prev) => ({
                        ...prev,
                        tradeSize: e.target.value,
                      }))
                    }
                    placeholder="1.00"
                  />
                </div>

                <Button onClick={calculatePips} className="w-full">
                  Calculate Pip Value
                </Button>

                {pipCalculator.pipValue > 0 && (
                  <Card className="bg-gradient-to-r from-forex-50 to-blue-50 border-forex-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Pip Value</p>
                        <p className="text-2xl font-bold text-forex-600">
                          ${pipCalculator.pipValue.toFixed(2)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Trading Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <ArrowUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Daily Signals</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">8-12</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Win Rate</span>
                    </div>
                    <p className="text-xl font-bold text-blue-600">87.3%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <Award className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Avg ROI</span>
                    </div>
                    <p className="text-xl font-bold text-purple-600">12.5%</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">Timeframe</span>
                    </div>
                    <p className="text-xl font-bold text-orange-600">24-32h</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">
                    Current Market Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">EUR/USD</span>
                      <Badge variant="outline" className="text-green-600">
                        Bullish
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">GBP/USD</span>
                      <Badge variant="outline" className="text-red-600">
                        Bearish
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">USD/JPY</span>
                      <Badge variant="outline" className="text-blue-600">
                        Neutral
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investment" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-forex-600" />
                  <span>Investment Calculator</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="investmentAmount">
                    Investment Amount ($)
                  </Label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    min="200"
                    max="50000"
                    value={investmentCalculator.initialAmount}
                    onChange={(e) =>
                      setInvestmentCalculator((prev) => ({
                        ...prev,
                        initialAmount: e.target.value,
                      }))
                    }
                    placeholder="200 - 50,000"
                  />
                  <p className="text-xs text-gray-500">
                    Minimum: $200, Maximum: $50,000
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investmentPlan">Investment Plan</Label>
                  <Select
                    value={investmentCalculator.plan}
                    onValueChange={(value) =>
                      setInvestmentCalculator((prev) => ({
                        ...prev,
                        plan: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} ({plan.roi / 100}X ROI)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateInvestment} className="w-full">
                  Calculate Returns
                </Button>

                {investmentCalculator.expectedReturn > 0 && (
                  <div className="space-y-3">
                    <Card className="bg-gradient-to-r from-green-50 to-forex-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Initial Investment:
                            </span>
                            <span className="font-bold">
                              $
                              {parseFloat(
                                investmentCalculator.initialAmount,
                              ).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">ROI:</span>
                            <span className="font-bold text-green-600">
                              {(investmentCalculator.roi / 100).toFixed(1)}X
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">
                              Duration:
                            </span>
                            <span className="font-bold">
                              {investmentCalculator.duration}
                            </span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">
                                Expected Return:
                              </span>
                              <span className="text-xl font-bold text-green-600">
                                $
                                {investmentCalculator.expectedReturn.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span>Investment Plans Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {investmentPlans.map((plan, index) => (
                  <Card
                    key={plan.id}
                    className={`border-2 ${index === 1 ? "border-forex-300 bg-forex-50" : "border-gray-200"}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800">{plan.name}</h4>
                        {index === 1 && (
                          <Badge className="bg-forex-600">Most Popular</Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROI:</span>
                          <span className="font-semibold text-green-600">
                            {(plan.roi / 100).toFixed(1)}X
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-semibold">{plan.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Min Amount:</span>
                          <span className="font-semibold">
                            ${plan.minAmount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Amount:</span>
                          <span className="font-semibold">
                            ${plan.maxAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="bg-gradient-to-r from-forex-600 to-blue-600 p-4 rounded-lg text-white text-center">
                  <h4 className="font-bold mb-2">Ready to Start?</h4>
                  <p className="text-sm opacity-90 mb-3">
                    Join thousands of successful investors who trust our proven
                    strategies.
                  </p>
                  <Button
                    className="bg-white text-forex-600 hover:bg-gray-100 w-full"
                    onClick={() => navigate("/investment-plans")}
                  >
                    View All Investment Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
