import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  TrendingUp
} from "lucide-react";

const investmentPlans = [
  {
    id: "starter",
    name: "Starter Plan",
    minAmount: 200,
    maxAmount: 999,
    roi: "2,500%",
    duration: "10 days",
    description: "Perfect for beginners",
    popular: false,
    expectedReturn: 5000,
    features: ["Basic Analysis", "Email Support", "Weekly Reports", "Risk Management", "Basic Tools"]
  },
  {
    id: "basic",
    name: "Basic Plan", 
    minAmount: 1000,
    maxAmount: 4999,
    roi: "2,500%",
    duration: "10 days",
    description: "Most popular choice",
    popular: true,
    expectedReturn: 25000,
    features: ["Advanced Analysis", "Priority Support", "Daily Reports", "Risk Management", "Pro Tools", "Market Insights"]
  },
  {
    id: "premium",
    name: "Premium Plan",
    minAmount: 5000,
    maxAmount: 9999,
    roi: "2,500%",
    duration: "10 days", 
    description: "For serious investors",
    popular: false,
    expectedReturn: 62500,
    features: ["Expert Analysis", "VIP Support", "Real-time Reports", "Advanced Risk Management", "Premium Tools", "Personal Manager"]
  },
  {
    id: "vip", 
    name: "VIP Plan",
    minAmount: 10000,
    maxAmount: 24999,
    roi: "2,500%",
    duration: "10 days",
    description: "Exclusive benefits",
    popular: false,
    expectedReturn: 125000,
    features: ["Premium Analysis", "24/7 Support", "Live Reports", "Expert Risk Management", "All Tools", "Dedicated Manager", "Custom Strategies"]
  },
  {
    id: "elite",
    name: "Elite Plan",
    minAmount: 25000,
    maxAmount: 100000,
    roi: "2,500%",
    duration: "10 days",
    description: "Ultimate package",
    popular: false,
    expectedReturn: 250000,
    features: ["White Glove Service", "Custom Strategies", "1-on-1 Coaching", "Market Insights", "All Premium Benefits"]
  }
];

interface InvestmentPlansCarouselProps {
  allowPayments?: boolean;
  redirectToLogin?: boolean;
}

export default function InvestmentPlansCarousel({ 
  allowPayments = false, 
  redirectToLogin = true 
}: InvestmentPlansCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const plansPerView = 3;
  const maxSlides = Math.max(0, investmentPlans.length - plansPerView);

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlides));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(Math.min(index, maxSlides));
  };

  const handleInvestNow = (plan: any) => {
    if (!allowPayments || redirectToLogin) {
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
          action: "invest"
        }
      });
      return;
    }

    // Legacy investment handler (disabled for frontpage)
    toast({
      title: "Redirecting",
      description: "Please use your dashboard to make investments",
    });
    navigate("/dashboard");
  };

  return (
    <section id="investment-plans" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Investment Plans
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your investment goals and start earning immediately
          </p>
          {redirectToLogin && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 flex items-center justify-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Login to your dashboard to start investing with your account balance</span>
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-12 h-12 p-0"
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-12 h-12 p-0"
            onClick={nextSlide}
            disabled={currentSlide >= maxSlides}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Carousel Container - NO SLIDE TRANSITIONS */}
          <div className="investment-plans-carousel overflow-hidden mx-16">
            <div className="investment-plans-track flex gap-8">
              {investmentPlans.slice(currentSlide, currentSlide + plansPerView).map((plan, index) => (
                <div key={plan.id} className="flex-none w-full max-w-sm">
                  <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full ${plan.popular ? 'ring-2 ring-forex-500 shadow-2xl' : 'shadow-lg'}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-forex-500 to-blue-500 text-white px-4 py-1">
                          🔥 Most Popular
                        </Badge>
                      </div>
                    )}

                    <div className={`h-2 bg-gradient-to-r ${plan.popular ? 'from-forex-500 to-blue-500' : 'from-gray-300 to-gray-400'}`}></div>

                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.popular ? 'from-forex-500 to-blue-500' : 'from-gray-400 to-gray-500'} flex items-center justify-center`}>
                        <DollarSign className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                      <div className="text-4xl font-bold text-forex-600 mb-2">{plan.roi}</div>
                      <p className="text-gray-600">{plan.description}</p>
                      <div className="mt-4 p-3 bg-forex-50 rounded-lg">
                        <div className="text-sm text-gray-600">Investment Range</div>
                        <div className="text-lg font-semibold">${plan.minAmount} - ${plan.maxAmount.toLocaleString()}</div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Minimum Investment:</span>
                          <span className="font-semibold">${plan.minAmount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Expected Return:</span>
                          <span className="font-semibold text-success-600">${plan.expectedReturn.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-semibold">{plan.duration}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Features:</div>
                        <div className="space-y-1">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-success-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleInvestNow(plan)}
                        className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-forex-500 to-blue-500 hover:from-forex-600 hover:to-blue-600 shadow-lg hover:shadow-xl'
                            : 'bg-gray-700 hover:bg-gray-800'
                        }`}
                      >
                        {redirectToLogin ? (
                          <>
                            Login to Invest
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          "Invest Now"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxSlides + 1 }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-forex-600' : 'bg-gray-300'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS to ensure no slide transitions */}
      <style jsx>{`
        .investment-plans-carousel {
          /* Ensure no transitions leak to other components */
          isolation: isolate;
        }
        
        .investment-plans-track {
          /* Explicit grid layout instead of transform animations */
          display: flex;
          width: 100%;
        }
        
        .investment-plans-track > div {
          flex: 0 0 calc(33.333% - 21.333px); /* 3 items with gap */
          max-width: none;
        }
        
        @media (max-width: 1024px) {
          .investment-plans-track > div {
            flex: 0 0 calc(50% - 16px); /* 2 items on tablet */
          }
        }
        
        @media (max-width: 640px) {
          .investment-plans-track > div {
            flex: 0 0 100%; /* 1 item on mobile */
          }
        }
      `}</style>
    </section>
  );
}
