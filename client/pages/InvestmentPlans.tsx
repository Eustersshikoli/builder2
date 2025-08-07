import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import {
  DollarSign,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Calculator,
  Target,
  Crown,
  Zap,
  Star,
} from "lucide-react";

const investmentPlans = [
  {
    id: "starter",
    name: "Starter Plan",
    minAmount: 200,
    maxAmount: 999,
    roi: "2,500%",
    duration: "10 days",
    description:
      "Perfect for beginners looking to start their forex investment journey",
    popular: false,
    expectedReturn: 5000,
    color: "blue",
    features: [
      "Basic market analysis and signals",
      "Email support during business hours",
      "Weekly performance reports",
      "Basic risk management tools",
      "Educational resources access",
      "Entry-level trading tools",
    ],
  },
  {
    id: "basic",
    name: "Basic Plan",
    minAmount: 1000,
    maxAmount: 4999,
    roi: "2,500%",
    duration: "10 days",
    description: "Most popular choice for intermediate traders",
    popular: true,
    expectedReturn: 25000,
    color: "green",
    features: [
      "Advanced market analysis with technical indicators",
      "Priority support with faster response times",
      "Daily detailed performance reports",
      "Enhanced risk management strategies",
      "Professional trading tools suite",
      "Market insights and trend analysis",
      "Portfolio optimization recommendations",
    ],
  },
  {
    id: "premium",
    name: "Premium Plan",
    minAmount: 5000,
    maxAmount: 9999,
    roi: "2,500%",
    duration: "10 days",
    description: "For serious investors who want premium features",
    popular: false,
    expectedReturn: 62500,
    color: "purple",
    features: [
      "Expert-level analysis with AI-powered insights",
      "VIP support with dedicated account manager",
      "Real-time reports and live market updates",
      "Advanced risk management with stop-loss automation",
      "Premium trading tools with custom indicators",
      "Personal account manager for strategy guidance",
      "Exclusive webinars and market briefings",
    ],
  },
  {
    id: "vip",
    name: "VIP Plan",
    minAmount: 10000,
    maxAmount: 24999,
    roi: "2,500%",
    duration: "10 days",
    description: "Exclusive benefits for high-volume investors",
    popular: false,
    expectedReturn: 125000,
    color: "gold",
    features: [
      "Premium analysis with institutional-grade research",
      "24/7 dedicated support hotline",
      "Live streaming reports with expert commentary",
      "Expert risk management with multi-layer protection",
      "Complete trading suite with all advanced tools",
      "Dedicated relationship manager available anytime",
      "Custom investment strategies tailored to your goals",
      "Priority access to new investment opportunities",
    ],
  },
  {
    id: "elite",
    name: "Elite Plan",
    minAmount: 25000,
    maxAmount: 100000,
    roi: "2,500%",
    duration: "10 days",
    description: "Ultimate package for elite investors",
    popular: false,
    expectedReturn: 250000,
    color: "platinum",
    features: [
      "White-glove service with personal investment team",
      "Custom trading strategies developed specifically for you",
      "1-on-1 coaching sessions with professional traders",
      "Exclusive market insights from institutional sources",
      "All premium benefits plus concierge services",
      "Direct line to C-level executives",
      "Custom portfolio construction and management",
    ],
  },
];

const themes = {
  default: {
    name: "Professional",
    background: "bg-gradient-to-br from-gray-50 to-blue-50",
    cardStyle: "bg-white border-gray-200",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
  },
  dark: {
    name: "Dark Mode",
    background: "bg-gradient-to-br from-gray-900 to-blue-900",
    cardStyle: "bg-gray-800 border-gray-700",
    textPrimary: "text-white",
    textSecondary: "text-gray-300",
  },
  luxury: {
    name: "Luxury Gold",
    background: "bg-gradient-to-br from-yellow-50 to-gold-100",
    cardStyle: "bg-white border-gold-200 shadow-gold-200/20",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-700",
  },
  ocean: {
    name: "Ocean Blue",
    background: "bg-gradient-to-br from-blue-50 to-cyan-100",
    cardStyle: "bg-white border-blue-200 shadow-blue-200/20",
    textPrimary: "text-gray-900",
    textSecondary: "text-blue-700",
  },
};

export default function InvestmentPlans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] =
    useState<keyof typeof themes>("default");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const theme = themes[selectedTheme];

  const handleInvestNow = (plan: any) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to your account to make investments",
      });
      navigate("/");
      return;
    }

    // Redirect to dashboard for investment
    navigate("/dashboard", {
      state: {
        selectedPlan: plan,
        action: "invest",
      },
    });
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      gold: "from-yellow-500 to-yellow-600",
      platinum: "from-gray-500 to-gray-600",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIcon = (planId: string) => {
    const icons = {
      starter: Calculator,
      basic: TrendingUp,
      premium: Target,
      vip: Crown,
      elite: Star,
    };
    return icons[planId as keyof typeof icons] || Calculator;
  };

  const filteredPlans =
    selectedCategory === "all"
      ? investmentPlans
      : investmentPlans.filter((plan) => {
          if (selectedCategory === "low") return plan.minAmount < 1000;
          if (selectedCategory === "medium")
            return plan.minAmount >= 1000 && plan.minAmount < 10000;
          if (selectedCategory === "high") return plan.minAmount >= 10000;
          return true;
        });

  return (
    <DashboardLayout>
      <div className={`min-h-screen ${theme.background} p-6`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold ${theme.textPrimary} mb-4`}>
              Investment Plans
            </h1>
            <p
              className={`text-xl ${theme.textSecondary} max-w-3xl mx-auto mb-8`}
            >
              Choose the investment plan that matches your financial goals and
              risk tolerance. All plans offer the same exceptional returns with
              varying levels of service and features.
            </p>

            {/* Theme Selector */}
            <div className="flex justify-center items-center space-x-4 mb-6">
              <span className={`text-sm ${theme.textSecondary}`}>Theme:</span>
              <Tabs
                value={selectedTheme}
                onValueChange={(value) =>
                  setSelectedTheme(value as keyof typeof themes)
                }
              >
                <TabsList className="grid grid-cols-4 w-auto">
                  {Object.entries(themes).map(([key, themeData]) => (
                    <TabsTrigger key={key} value={key} className="text-xs">
                      {themeData.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Category Filter */}
            <div className="flex justify-center items-center space-x-4">
              <span className={`text-sm ${theme.textSecondary}`}>
                Filter by Amount:
              </span>
              <Tabs
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <TabsList className="grid grid-cols-4 w-auto">
                  <TabsTrigger value="all">All Plans</TabsTrigger>
                  <TabsTrigger value="low">Under $1K</TabsTrigger>
                  <TabsTrigger value="medium">$1K - $10K</TabsTrigger>
                  <TabsTrigger value="high">$10K+</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Investment Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map((plan) => {
              const IconComponent = getIcon(plan.id);
              const colorClasses = getColorClasses(plan.color);

              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full ${theme.cardStyle} ${plan.popular ? "ring-2 ring-forex-500 shadow-2xl" : "shadow-lg"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-forex-500 to-blue-500 text-white px-4 py-1">
                        🔥 Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className={`h-2 bg-gradient-to-r ${colorClasses}`}></div>

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${colorClasses} flex items-center justify-center`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className={`text-2xl mb-2 ${theme.textPrimary}`}>
                      {plan.name}
                    </CardTitle>
                    <div className="text-4xl font-bold text-forex-600 mb-2">
                      {plan.roi}
                    </div>
                    <p className={theme.textSecondary}>{plan.description}</p>
                    <div className="mt-4 p-3 bg-forex-50 rounded-lg">
                      <div className={`text-sm ${theme.textSecondary}`}>
                        Investment Range
                      </div>
                      <div
                        className={`text-lg font-semibold ${theme.textPrimary}`}
                      >
                        ${plan.minAmount} - ${plan.maxAmount.toLocaleString()}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className={theme.textSecondary}>
                          Minimum Investment:
                        </span>
                        <span className={`font-semibold ${theme.textPrimary}`}>
                          ${plan.minAmount}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={theme.textSecondary}>
                          Expected Return:
                        </span>
                        <span className="font-semibold text-success-600">
                          ${plan.expectedReturn.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={theme.textSecondary}>Duration:</span>
                        <span className={`font-semibold ${theme.textPrimary}`}>
                          {plan.duration}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div
                        className={`text-sm font-medium ${theme.textPrimary}`}
                      >
                        Features:
                      </div>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {plan.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-start space-x-2 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 text-success-500 flex-shrink-0 mt-0.5" />
                            <span className={theme.textSecondary}>
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleInvestNow(plan)}
                      className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
                        plan.popular
                          ? "bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600 shadow-lg hover:shadow-xl"
                          : `bg-gradient-to-r ${colorClasses} hover:shadow-lg`
                      }`}
                    >
                      Invest Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Information */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className={`${theme.cardStyle} text-center p-6`}>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-2`}>
                Instant Processing
              </h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                All investments are processed instantly from your account
                balance. Start earning immediately.
              </p>
            </Card>

            <Card className={`${theme.cardStyle} text-center p-6`}>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-2`}>
                Guaranteed Returns
              </h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                All plans offer guaranteed returns based on our proven forex
                trading strategies and market analysis.
              </p>
            </Card>

            <Card className={`${theme.cardStyle} text-center p-6`}>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${theme.textPrimary} mb-2`}>
                VIP Support
              </h3>
              <p className={`text-sm ${theme.textSecondary}`}>
                Get premium support and dedicated account management based on
                your investment level.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
