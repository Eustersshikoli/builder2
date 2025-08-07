import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import FrontPageLayout from "@/components/FrontPageLayout";
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
  Clock,
  Shield,
  Award,
  MessageCircle,
} from "lucide-react";

interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  min_amount: number;
  max_amount?: number;
  roi_percentage: number;
  duration_hours: number;
  is_active: boolean;
  features?: string[];
  popular?: boolean;
  color?: string;
}

export default function InvestmentPlansStandalone() {
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const defaultPlans: InvestmentPlan[] = [
    {
      id: "starter",
      name: "Starter Plan",
      min_amount: 200,
      max_amount: 2000,
      roi_percentage: 1000,
      duration_hours: 24,
      description:
        "Perfect for beginners looking to start their forex investment journey",
      popular: false,
      color: "blue",
      is_active: true,
      features: [
        "24-32 hour investment period",
        "10X ROI guaranteed",
        "Basic market analysis",
        "Email support",
        "Risk management included",
        "Entry-level trading tools",
      ],
    },
    {
      id: "professional",
      name: "Professional Plan",
      min_amount: 2000,
      max_amount: 10000,
      roi_percentage: 1200,
      duration_hours: 28,
      description: "Most popular choice for experienced traders",
      popular: true,
      color: "green",
      is_active: true,
      features: [
        "24-32 hour investment period",
        "12X ROI guaranteed",
        "Advanced market analysis",
        "Priority support",
        "Real-time performance reports",
        "Professional trading tools",
        "Portfolio optimization",
      ],
    },
    {
      id: "premium",
      name: "Premium Plan",
      min_amount: 10000,
      max_amount: 50000,
      roi_percentage: 1500,
      duration_hours: 32,
      description: "For serious investors who want maximum returns",
      popular: false,
      color: "purple",
      is_active: true,
      features: [
        "24-32 hour investment period",
        "15X ROI guaranteed",
        "Expert-level analysis",
        "VIP support with dedicated manager",
        "Real-time performance reports",
        "Advanced risk management",
        "Exclusive trading strategies",
        "Personal account manager",
      ],
    },
  ];

  useEffect(() => {
    fetchInvestmentPlans();
  }, []);

  const fetchInvestmentPlans = async () => {
    try {
      const { data, error } = await supabase
        .from("investment_plans")
        .select("*")
        .eq("is_active", true)
        .order("min_amount", { ascending: true });

      if (error) {
        console.warn("Using default plans:", error.message);
        setPlans(defaultPlans);
      } else if (data && data.length > 0) {
        setPlans(data);
      } else {
        setPlans(defaultPlans);
      }
    } catch (error) {
      console.warn("Using default plans due to fetch error");
      setPlans(defaultPlans);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestment = (plan: InvestmentPlan) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start investing",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Redirect to dashboard with plan selection
    navigate("/dashboard?tab=plans", {
      state: {
        selectedPlan: plan,
        action: "invest",
      },
    });
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours} hours`;
    if (hours < 168) return `${hours / 24} days`;
    return `${hours / 168} weeks`;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      gold: "from-yellow-500 to-yellow-600",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <FrontPageLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-forex-50">
        {/* Hero Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-forex-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold">
                    Investment Plans
                  </h1>
                  <p className="text-sm md:text-lg text-forex-100 mt-2">
                    Choose your path to financial success
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    label: "Minimum Investment",
                    value: "$100",
                    icon: DollarSign,
                  },
                  { label: "Maximum ROI", value: "2,500%", icon: TrendingUp },
                  { label: "Fastest Return", value: "24 Hours", icon: Clock },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/10 p-4 rounded-lg backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold">
                      {stat.value}
                    </div>
                    <div className="text-sm text-forex-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                💎 Choose Your Investment Plan
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select the perfect plan that matches your investment goals and
                risk appetite. All plans include professional signals and risk
                management.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-12 bg-gray-200 rounded mb-4"></div>
                      <div className="h-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                      plan.popular
                        ? "ring-2 ring-forex-500 shadow-lg"
                        : "border-2 border-gray-100 hover:border-forex-200"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-forex-500 to-blue-500 text-white px-3 py-1 text-xs font-bold">
                        🔥 POPULAR
                      </div>
                    )}

                    <CardHeader className="text-center pb-2">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getColorClasses(plan.color || "blue")} flex items-center justify-center`}
                      >
                        {plan.id === "starter" && (
                          <Zap className="h-8 w-8 text-white" />
                        )}
                        {plan.id === "standard" && (
                          <Target className="h-8 w-8 text-white" />
                        )}
                        {plan.id === "premium" && (
                          <Award className="h-8 w-8 text-white" />
                        )}
                        {plan.id === "vip" && (
                          <Crown className="h-8 w-8 text-white" />
                        )}
                        {!["starter", "standard", "premium", "vip"].includes(
                          plan.id,
                        ) && <TrendingUp className="h-8 w-8 text-white" />}
                      </div>

                      <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </CardTitle>

                      <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {plan.roi_percentage.toLocaleString()}%
                        </div>
                        <div className="text-sm text-gray-600">
                          ROI Guaranteed
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Min Amount:</span>
                            <div className="font-bold">
                              ${plan.min_amount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <div className="font-bold">
                              {formatDuration(plan.duration_hours)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm text-center">
                        {plan.description}
                      </p>

                      {plan.features && (
                        <div className="space-y-2">
                          {plan.features.slice(0, 4).map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">
                                {feature}
                              </span>
                            </div>
                          ))}
                          {plan.features.length > 4 && (
                            <div className="text-sm text-gray-500 text-center">
                              +{plan.features.length - 4} more features
                            </div>
                          )}
                        </div>
                      )}

                      <Button
                        onClick={() => handleInvestment(plan)}
                        className={`w-full bg-gradient-to-r ${getColorClasses(plan.color || "blue")} hover:opacity-90 transition-all duration-200 text-white font-semibold py-3 min-h-[44px]`}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Start Investing
                      </Button>

                      <div className="text-center">
                        <div className="text-xs text-gray-500">
                          Expected return: $
                          {(
                            (plan.min_amount * plan.roi_percentage) /
                            100
                          ).toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Features Section */}
            <div className="mt-16">
              <div className="text-center mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  🛡️ Why Choose Our Investment Plans?
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  All our plans come with professional-grade features and
                  guarantees to ensure your investment success.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Shield,
                    title: "Guaranteed Returns",
                    description:
                      "Every investment plan comes with guaranteed ROI backed by our professional trading expertise.",
                  },
                  {
                    icon: Clock,
                    title: "Fixed Duration",
                    description:
                      "Clear investment periods with automatic payouts. No hidden terms or extended lock-in periods.",
                  },
                  {
                    icon: Award,
                    title: "Professional Management",
                    description:
                      "Your investments are managed by expert traders with proven track records and risk management.",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="text-center border-2 border-gray-100 hover:border-forex-200 transition-all duration-200"
                  >
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-forex-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <Card className="bg-gradient-to-r from-forex-50 to-blue-50 border-forex-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Ready to Start Your Investment Journey?
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                    Join thousands of successful investors who trust our
                    platform. Start with any plan and watch your money grow with
                    guaranteed returns.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {!user ? (
                      <>
                        <Button
                          onClick={() => navigate("/signup")}
                          className="bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600 text-white px-8 py-4 min-h-[44px]"
                        >
                          Create Account & Invest
                        </Button>
                        <Button
                          onClick={() => navigate("/login")}
                          variant="outline"
                          className="border-2 border-forex-600 text-forex-600 hover:bg-forex-600 hover:text-white px-8 py-4"
                        >
                          Login to Invest
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => navigate("/dashboard?tab=plans")}
                        className="bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600 text-white px-8 py-4"
                      >
                        Go to Dashboard
                      </Button>
                    )}
                  </div>
                  <div className="mt-4">
                    <a
                      href="https://t.me/forex_traders_signalss"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-forex-600 hover:text-forex-700 font-medium"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Join our free Telegram for signals</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </FrontPageLayout>
  );
}
