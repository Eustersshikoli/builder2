import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FrontPageLayout from "@/components/FrontPageLayout";
import { useAuth } from "@/contexts/EnhancedAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Star, 
  CheckCircle,
  Gift,
  Target,
  Rocket,
  Crown,
  Trophy,
  Sparkles,
  Timer
} from "lucide-react";

export default function Offers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInvest = (amount: number, expectedReturn: number, roi: string, plan: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to your account to access special offers",
      });
      navigate("/");
      return;
    }

    // Redirect to dashboard offers tab
    navigate("/dashboard?tab=offers", {
      state: {
        selectedOffer: {
          plan,
          amount,
          expectedReturn,
          roi,
          duration: amount === 200 ? "24 hours" : amount === 500 ? "3 days" : amount === 1000 ? "5 days" : "7 days"
        }
      }
    });
  };

  const currentOffers = [
    {
      id: "flash",
      title: "⚡ FLASH DEAL",
      subtitle: "Limited Time",
      amount: 200,
      returns: 5000,
      roi: "2,500%",
      duration: "24 Hours",
      color: "from-red-500 to-pink-500",
      badge: "🔥 HOT",
      savings: "Save $100",
      originalPrice: 300,
      features: ["Instant Activation", "24/7 Support", "Telegram Alerts", "Risk Protection"]
    },
    {
      id: "weekend",
      title: "🚀 WEEKEND SPECIAL",
      subtitle: "Most Popular",
      amount: 500,
      returns: 12500,
      roi: "2,500%",
      duration: "3 Days", 
      color: "from-purple-500 to-purple-600",
      badge: "👑 POPULAR",
      savings: "Save $200",
      originalPrice: 700,
      features: ["Priority Processing", "Dedicated Manager", "Premium Signals", "Fast Payouts"]
    },
    {
      id: "vip",
      title: "💎 VIP EXCLUSIVE",
      subtitle: "Maximum Returns",
      amount: 1000,
      returns: 25000,
      roi: "2,500%",
      duration: "5 Days",
      color: "from-gold-500 to-yellow-500",
      badge: "💎 VIP",
      savings: "Save $500",
      originalPrice: 1500,
      features: ["Personal Advisor", "Exclusive Signals", "Risk Insurance", "Instant Withdrawals"]
    },
    {
      id: "mega",
      title: "🌟 MEGA BOOST",
      subtitle: "Ultimate Package",
      amount: 2000,
      returns: 50000,
      roi: "2,500%",
      duration: "7 Days",
      color: "from-indigo-500 to-blue-500",
      badge: "🌟 ULTIMATE",
      savings: "Save $1000",
      originalPrice: 3000,
      features: ["Elite Support", "Private Signals", "Portfolio Manager", "Premium Analytics"]
    }
  ];

  const limitedTimeOffers = [
    {
      id: "black-friday",
      title: "🖤 BLACK FRIDAY",
      description: "Biggest savings of the year! Get 70% off all investment plans.",
      discount: "70% OFF",
      validUntil: "Nov 30, 2024",
      color: "from-gray-800 to-black"
    },
    {
      id: "new-year",
      title: "🎉 NEW YEAR BONUS",
      description: "Start 2024 with a bang! Double your returns on any investment.",
      discount: "DOUBLE RETURNS",
      validUntil: "Jan 31, 2024",
      color: "from-gold-500 to-yellow-400"
    }
  ];

  return (
    <FrontPageLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-gold-400/30 to-yellow-400/30 rounded-full blur-3xl animate-bounce delay-300"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-bounce delay-700"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="bg-gradient-to-r from-gold-500 to-yellow-500 text-black px-6 py-2 text-lg font-bold mb-4">
              🎁 EXCLUSIVE OFFERS
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-gold-400 via-yellow-400 to-gold-400 bg-clip-text text-transparent animate-pulse">
                MEGA DEALS
              </span>
            </h1>
            <p className="text-2xl text-purple-100 mb-8 max-w-4xl mx-auto">
              🚀 Limited time offers with incredible returns! Don't miss out on these exclusive deals.
            </p>

            {/* Countdown Timer */}
            <div className="mb-12">
              <div className="text-xl text-purple-200 mb-4">⏰ OFFERS EXPIRE IN:</div>
              <div className="flex justify-center space-x-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
                  <div className="text-4xl font-bold text-gold-400">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-sm text-purple-200">HOURS</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
                  <div className="text-4xl font-bold text-gold-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-sm text-purple-200">MINUTES</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[100px]">
                  <div className="text-4xl font-bold text-gold-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-sm text-purple-200">SECONDS</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Current Offers */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  CURRENT OFFERS
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                🎯 Choose your investment level and start earning massive returns immediately!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentOffers.map((offer, index) => (
                <Card 
                  key={offer.id} 
                  className={`relative overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-xl ${
                    index === 1 ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  {/* Offer Badge */}
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className={`bg-gradient-to-r ${offer.color} text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg transform rotate-12`}>
                      {offer.badge}
                    </div>
                  </div>

                  {/* Savings Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <Badge className="bg-red-500 text-white font-bold">
                      {offer.savings}
                    </Badge>
                  </div>

                  <div className={`h-4 bg-gradient-to-r ${offer.color}`}></div>

                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${offer.color} flex items-center justify-center shadow-lg`}>
                      {index === 0 ? <Zap className="h-8 w-8 text-white" /> :
                       index === 1 ? <Rocket className="h-8 w-8 text-white" /> :
                       index === 2 ? <Crown className="h-8 w-8 text-white" /> :
                       <Star className="h-8 w-8 text-white" />}
                    </div>
                    
                    <CardTitle className="text-lg font-black mb-2">{offer.title}</CardTitle>
                    <Badge className={`bg-gradient-to-r ${offer.color} text-white mb-4`}>
                      {offer.subtitle}
                    </Badge>
                    
                    <div className="space-y-2">
                      <div className="line-through text-gray-400 text-sm">${offer.originalPrice}</div>
                      <div className="text-3xl font-black text-gray-900">${offer.amount}</div>
                      <div className="text-sm text-gray-600">becomes</div>
                      <div className={`text-3xl font-black bg-gradient-to-r ${offer.color} bg-clip-text text-transparent`}>
                        ${offer.returns.toLocaleString()}
                      </div>
                      <div className="text-lg font-bold text-success-600">{offer.roi} ROI</div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold">{offer.duration}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {offer.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleInvest(offer.amount, offer.returns, offer.roi, offer.title)}
                      className={`w-full py-3 text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-200 bg-gradient-to-r ${offer.color} hover:opacity-90`}
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      {user ? 'GRAB DEAL' : 'LOGIN TO GRAB DEAL'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Limited Time Offers */}
        <section className="py-20 bg-gradient-to-r from-gray-900 to-indigo-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-yellow-400 bg-clip-text text-transparent">
                  LIMITED TIME SPECIALS
                </span>
              </h2>
              <p className="text-xl text-gray-300">
                🔥 Exclusive seasonal offers you won't find anywhere else!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {limitedTimeOffers.map((offer) => (
                <Card key={offer.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-8 text-center">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r ${offer.color} flex items-center justify-center`}>
                      <Gift className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{offer.title}</h3>
                    <Badge className={`bg-gradient-to-r ${offer.color} text-white text-lg px-4 py-2 mb-4`}>
                      {offer.discount}
                    </Badge>
                    <p className="text-gray-300 mb-6">{offer.description}</p>
                    <div className="flex items-center justify-center space-x-2 text-yellow-400 mb-6">
                      <Timer className="h-4 w-4" />
                      <span className="font-semibold">Valid until {offer.validUntil}</span>
                    </div>
                    <Button
                      onClick={() => handleInvest(2000, 50000, "2,500%", "Mega Deal")}
                      className="bg-white text-gray-900 hover:bg-gray-100 font-bold"
                    >
                      {user ? 'Claim Offer' : 'Login to Claim'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Payment processing is now handled in the dashboard */}
      </div>
    </FrontPageLayout>
  );
}
